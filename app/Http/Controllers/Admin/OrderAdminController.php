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
        $query = Order::with('user', 'items');

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

        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user?->name ?? 'Guest',
                'customer_email' => $order->user?->email ?? 'N/A',
                'total_amount' => (float) $order->total_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->format('M d, Y H:i'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                    ];
                })->toArray(),
                'user' => [
                    'id' => $order->user?->id,
                    'name' => $order->user?->name ?? 'Guest',
                ],
            ];
        });

        // Calculate stats - only count paid/shipped orders for revenue
        $allOrders = Order::all();
        $paidOrders = $allOrders->whereIn('status', ['paid', 'shipped']);
        
        $stats = [
            'total_orders' => $allOrders->count(),
            'pending_orders' => $allOrders->where('status', 'pending')->count(),
            'shipped_orders' => $allOrders->where('status', 'shipped')->count(),
            'total_revenue' => (float) $paidOrders->sum('total_amount'),
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
        // Mark as viewed
        if (is_null($order->viewed_at)) {
            $order->update(['viewed_at' => now()]);
        }

        $order->load('user', 'items.product', 'items.variant');

        $items = $order->items->map(function ($item) {
            return [
                'id' => $item->id,
                'product' => $item->product,
                'variant' => $item->variant,
                'quantity' => $item->quantity,
                'price' => (float) $item->price,
                'subtotal' => (float) ($item->quantity * $item->price),
            ];
        });

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_amount' => (float) $order->total_amount,
                'refund_amount' => $order->refund_amount ? (float) $order->refund_amount : null,
                'payment_method' => $order->payment_method,
                'tracking_number' => $order->tracking_number,
                'estimated_delivery' => $order->estimated_delivery,
                'notes' => $order->notes,
                'created_at' => $order->created_at->format('M d, Y H:i'),
                'updated_at' => $order->updated_at->format('M d, Y H:i'),
            ],
            'customer' => [
                'id' => $order->user?->id,
                'name' => $order->user?->name ?? 'Guest',
                'email' => $order->user?->email ?? 'N/A',
                'phone' => $order->user?->phone ?? $order->phone,
            ],
            'shipping_address' => $order->shipping_address,
            'billing_address' => $order->billing_address,
            'items' => $items,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        // Check if order is immutable (cancelled orders cannot be changed)
        if ($order->isImmutable()) {
            return redirect()->back()->withErrors(['status' => 'Cancelled orders cannot be modified.']);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,paid,shipped,delivered,cancelled',
            'tracking_number' => 'nullable|string',
            'estimated_delivery' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        // Ensure only paid orders can be marked as shipped
        if ($validated['status'] === 'shipped' && $order->status !== 'paid') {
            return redirect()->back()->withErrors(['status' => 'Only paid orders can be marked as shipped.']);
        }

        // If changing from paid to cancelled, handle revenue deduction
        if ($order->status === 'paid' && $validated['status'] === 'cancelled') {
            // The revenue will be automatically handled by the getRevenueAmount() method
            // which returns 0 for cancelled orders
        }

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
