<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MpesaService
{
    private $consumerKey;
    private $consumerSecret;
    private $shortcode;
    private $passkey;
    private $baseUrl;
    private $callbackUrl;

    public function __construct()
    {
        $this->consumerKey = config('services.mpesa.consumer_key');
        $this->consumerSecret = config('services.mpesa.consumer_secret');
        $this->shortcode = config('services.mpesa.shortcode');
        $this->passkey = config('services.mpesa.passkey');
        $this->baseUrl = config('services.mpesa.base_url', 'https://sandbox.safaricom.co.ke');
        $this->callbackUrl = config('services.mpesa.callback_url');
    }

    public function getAccessToken()
    {
        // Check if credentials are configured
        if (!$this->consumerKey || !$this->consumerSecret) {
            Log::error('MPESA credentials not configured');
            return null;
        }

        $response = Http::withBasicAuth($this->consumerKey, $this->consumerSecret)
            ->withoutVerifying() // Disable SSL verification for development/sandbox
            ->get("{$this->baseUrl}/oauth/v1/generate?grant_type=client_credentials");

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        Log::error('Failed to get MPESA access token', ['response' => $response->body()]);
        return null;
    }

    public function initiateSTKPush($phone, $amount, $accountReference, $transactionDesc = 'Payment')
    {
        // Check if all required credentials are configured
        if (!$this->consumerKey || !$this->consumerSecret || !$this->shortcode || !$this->passkey) {
            Log::error('MPESA credentials incomplete. Please configure MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, and MPESA_PASSKEY in your .env file');
            return ['error' => 'MPESA configuration incomplete. Please contact support.'];
        }

        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return ['error' => 'Failed to get access token'];
        }

        // Format phone number to 254XXXXXXXXX format
        $phone = $this->formatPhoneNumber($phone);

        $timestamp = now()->format('YmdHis');
        $password = base64_encode($this->shortcode . $this->passkey . $timestamp);

        $payload = [
            'BusinessShortCode' => (int) $this->shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline',
            'Amount' => (int) $amount,
            'PartyA' => (int) $phone,
            'PartyB' => (int) $this->shortcode,
            'PhoneNumber' => (int) $phone,
            'CallBackURL' => $this->getCallbackUrl(),
            'AccountReference' => substr($accountReference, 0, 12),
            'TransactionDesc' => substr($transactionDesc, 0, 13),
        ];

        $response = Http::withToken($accessToken)
            ->withoutVerifying() // Disable SSL verification for development/sandbox
            ->post("{$this->baseUrl}/mpesa/stkpush/v1/processrequest", $payload);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('MPESA STK Push failed', ['payload' => $payload, 'response' => $response->body()]);
        return ['error' => 'STK Push failed', 'details' => $response->body()];
    }

    public function querySTKPushStatus($checkoutRequestId)
    {
        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return ['error' => 'Failed to get access token'];
        }

        $timestamp = now()->format('YmdHis');
        $password = base64_encode($this->shortcode . $this->passkey . $timestamp);

        $payload = [
            'BusinessShortCode' => $this->shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'CheckoutRequestID' => $checkoutRequestId,
        ];

        $response = Http::withToken($accessToken)
            ->withoutVerifying() // Disable SSL verification for development/sandbox
            ->post("{$this->baseUrl}/mpesa/stkpushquery/v1/query", $payload);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('MPESA STK Query failed', ['payload' => $payload, 'response' => $response->body()]);
        return ['error' => 'Query failed', 'details' => $response->body()];
    }

    private function formatPhoneNumber($phone)
    {
        // Remove any spaces, dashes, or plus signs
        $phone = preg_replace('/[\s\-+]/', '', $phone);
        
        // If phone starts with 0, replace with 254
        if (substr($phone, 0, 1) === '0') {
            $phone = '254' . substr($phone, 1);
        }
        
        // If phone doesn't start with 254, prepend it
        if (substr($phone, 0, 3) !== '254') {
            $phone = '254' . $phone;
        }
        
        return $phone;
    }

    private function getCallbackUrl()
    {
        // Use configured callback URL if available (e.g., from ngrok tunnel)
        if ($this->callbackUrl) {
            return $this->callbackUrl;
        }

        // Otherwise, generate from route (won't work for MPESA but useful for testing)
        return route('mpesa.callback');
    }
}