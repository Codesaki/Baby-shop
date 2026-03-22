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
                // Success - mark order as paid
                $payment->order->markPaid();
                $payment->update([
                    'status' => 'completed',
                    'gateway_response' => array_merge($payment->gateway_response ?? [], $data),
                ]);
            } else {
                // Failed - mark order as cancelled
                $payment->order->markCancelled();
                $payment->update([
                    'status' => 'failed',
                    'gateway_response' => array_merge($payment->gateway_response ?? [], $data),
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
                    // Mark order as paid
                    $payment->order->markPaid();
                    $payment->update(['status' => 'completed']);
                } elseif ($status['payment_status_description'] === 'Failed') {
                    // Mark order as cancelled
                    $payment->order->markCancelled();
                    $payment->update(['status' => 'failed']);
                }
                // Other statuses like Pending remain as pending
            }
        }

        // Redirect to success page or handle accordingly
        return redirect()->route('checkout.success')->with('orderId', $payment->order_id ?? null);
    }
}
