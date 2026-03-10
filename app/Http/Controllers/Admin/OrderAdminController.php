<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('user');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('order_number', 'like', "%{$search}%")
                ->orWhereHas('user', fn($q) => $q->where('name', 'like', "%{$search}%"));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Date range
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->appends($request->query());

        $orders->transform(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user->name,
                'customer_email' => $order->user->email,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->format('M d, Y H:i'),
            ];
        });

        // Calculate stats
        $allOrders = Order::all();
        $stats = [
            'total_orders' => $allOrders->count(),
            'pending_orders' => $allOrders->where('status', 'pending')->count(),
            'total_revenue' => $allOrders->sum('total_amount'),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'payment_status' => $request->payment_status,
            ],
        ]);
    }

    public function show(Order $order)
    {
        $order->load('user', 'items.product');

        $items = $order->items->map(function ($item) {
            return [
                'id' => $item->id,
                'product_name' => $item->product->name,
                'sku' => $item->product->sku,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->quantity * $item->unit_price,
            ];
        });

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_amount' => $order->total_amount,
                'refund_amount' => $order->refund_amount,
                'payment_method' => $order->payment_method,
                'tracking_number' => $order->tracking_number,
                'estimated_delivery' => $order->estimated_delivery,
                'notes' => $order->notes,
                'created_at' => $order->created_at->format('M d, Y H:i'),
                'updated_at' => $order->updated_at->format('M d, Y H:i'),
            ],
            'customer' => [
                'id' => $order->user->id,
                'name' => $order->user->name,
                'email' => $order->user->email,
                'phone' => $order->user->phone,
            ],
            'shipping_address' => $order->shipping_address,
            'billing_address' => $order->billing_address,
            'items' => $items,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid,processing,shipped,delivered,cancelled',
            'tracking_number' => 'nullable|string',
            'estimated_delivery' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $order->update($validated);

        $this->logActivity(auth()->user(), 'updated_order', Order::class, $order->id, [
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Order updated successfully.');
    }

    public function refund(Request $request, Order $order)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0|max:' . $order->total_amount,
        ]);

        $order->update([
            'refund_amount' => $validated['amount'],
            'payment_status' => 'refunded',
        ]);

        $this->logActivity(auth()->user(), 'refunded_order', Order::class, $order->id, [
            'refund_amount' => $validated['amount'],
        ]);

        return redirect()->back()->with('success', 'Refund processed successfully.');
    }

    private function logActivity($user, $action, $modelType, $modelId, $changes)
    {
        // Activity logging helper
        \App\Models\ActivityLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'changes' => $changes,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
