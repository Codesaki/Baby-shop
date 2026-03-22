<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PesapalService
{
    private $consumerKey;
    private $consumerSecret;
    private $baseUrl;

    public function __construct()
    {
        $this->consumerKey = config('services.pesapal.consumer_key');
        $this->consumerSecret = config('services.pesapal.consumer_secret');
        $this->baseUrl = config('services.pesapal.base_url');
    }

    public function getAccessToken()
    {
        $response = Http::post("{$this->baseUrl}/api/Auth/RequestToken", [
            'consumer_key' => $this->consumerKey,
            'consumer_secret' => $this->consumerSecret,
        ]);

        if ($response->successful()) {
            return $response->json()['token'];
        }

        Log::error('Failed to get PesaPal access token', ['response' => $response->body()]);
        return null;
    }

    public function initiatePayment($orderDetails)
    {
        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return ['error' => 'Failed to get access token'];
        }

        $payload = [
            'currency' => 'KES',
            'amount' => $orderDetails['amount'],
            'description' => 'Order payment',
            'callback_url' => route('pesapal.callback'),
            'notification_id' => $orderDetails['order_id'],
            'billing_address' => [
                'email_address' => $orderDetails['email'],
                'phone_number' => $orderDetails['phone'],
                'country_code' => 'KE',
                'first_name' => $orderDetails['first_name'],
                'last_name' => $orderDetails['last_name'],
            ],
        ];

        $response = Http::withToken($accessToken)
            ->post("{$this->baseUrl}/api/Transactions/SubmitOrderRequest", $payload);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('PesaPal payment initiation failed', ['payload' => $payload, 'response' => $response->body()]);
        return ['error' => 'Payment initiation failed', 'details' => $response->body()];
    }

    public function getPaymentStatus($orderTrackingId)
    {
        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return ['error' => 'Failed to get access token'];
        }

        $response = Http::withToken($accessToken)
            ->get("{$this->baseUrl}/api/Transactions/GetTransactionStatus", [
                'orderTrackingId' => $orderTrackingId,
            ]);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('PesaPal status check failed', ['orderTrackingId' => $orderTrackingId, 'response' => $response->body()]);
        return ['error' => 'Status check failed', 'details' => $response->body()];
    }
}