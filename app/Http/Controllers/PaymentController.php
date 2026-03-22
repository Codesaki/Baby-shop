<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\MpesaService;
use App\Services\PesapalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function mpesaCallback(Request $request)
    {
        $data = $request->all();
        Log::info('MPESA Callback received', $data);

        // Find payment by CheckoutRequestID
        $payment = Payment::where('transaction_reference', $data['Body']['stkCallback']['CheckoutRequestID'] ?? null)->first();

        if ($payment) {
            $resultCode = $data['Body']['stkCallback']['ResultCode'];
            if ($resultCode == 0) {
                // Success
                $payment->update([
                    'status' => 'completed',
                    'gateway_response' => array_merge($payment->gateway_response ?? [], $data),
                ]);
                $payment->order->update([
                    'status' => 'paid',
                    'payment_status' => 'paid',
                ]);
            } else {
                // Failed
                $payment->update([
                    'status' => 'failed',
                    'gateway_response' => array_merge($payment->gateway_response ?? [], $data),
                ]);
                $payment->order->update([
                    'payment_status' => 'failed',
                ]);
            }
        }

        return response()->json(['status' => 'ok']);
    }

    public function pesapalCallback(Request $request)
    {
        $orderTrackingId = $request->query('OrderTrackingId');
        $orderMerchantReference = $request->query('OrderMerchantReference');
        $orderNotificationType = $request->query('OrderNotificationType');

        Log::info('PesaPal Callback received', $request->all());

        $payment = Payment::where('transaction_reference', $orderTrackingId)->first();

        if ($payment) {
            $pesapalService = new PesapalService();
            $status = $pesapalService->getPaymentStatus($orderTrackingId);

            if (isset($status['payment_status_description'])) {
                if ($status['payment_status_description'] === 'Completed') {
                    $payment->update(['status' => 'completed']);
                    $payment->order->update([
                        'status' => 'paid',
                        'payment_status' => 'paid',
                    ]);
                } elseif ($status['payment_status_description'] === 'Failed') {
                    $payment->update(['status' => 'failed']);
                    $payment->order->update(['payment_status' => 'failed']);
                }
                // Other statuses like Pending
            }
        }

        // Redirect to success page or handle accordingly
        return redirect()->route('checkout.success')->with('orderId', $payment->order_id ?? null);
    }
}
