<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id)
            ->with(['items.product', 'items.variant'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Cast decimal fields to float for JSON serialization
        $orders->getCollection()->transform(function ($order) {
            $order->total_amount = (float) $order->total_amount;
            $order->items->each(function ($item) {
                $item->price = (float) $item->price;
                $item->total = (float) $item->total;
            });
            return $order;
        });

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order)
    {
        // Ensure user can only view their own orders
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }

        $order->load([
            'items.product.images',
            'items.variant',
            'payment'
        ]);

        // Convert to array and ensure all monetary values are floats
        $orderData = $order->toArray();
        $orderData['total_amount'] = (float) $orderData['total_amount'];
        
        // Convert item amounts to float
        $orderData['items'] = collect($orderData['items'])->map(function ($item) {
            $item['price'] = (float) $item['price'];
            $item['total'] = (float) $item['total'];
            return $item;
        })->toArray();

        return Inertia::render('Orders/Show', [
            'order' => $orderData,
        ]);
    }

    public function adminIndex(Request $request)
    {
        $query = Order::with(['user', 'items.product']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by order number or customer name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(20);

        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'processing_orders' => Order::where('status', 'processing')->count(),
            'shipped_orders' => Order::where('status', 'shipped')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'cancelled_orders' => Order::where('status', 'cancelled')->count(),
            'total_revenue' => Order::where('status', '!=', 'cancelled')->sum('total_amount'),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'search']),
        ]);
    }

    public function adminShow(Order $order)
    {
        $order->load([
            'user',
            'items.product.images',
            'items.variant',
            'shippingAddress',
            'billingAddress',
            'payment'
        ]);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'notes' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($request, $order) {
            $oldStatus = $order->status;
            $order->update([
                'status' => $request->status,
            ]);

            // Log status change
            $order->statusHistory()->create([
                'old_status' => $oldStatus,
                'new_status' => $request->status,
                'notes' => $request->notes,
                'changed_by' => $request->user()->id,
            ]);

            // If order is cancelled, restore inventory
            if ($request->status === 'cancelled' && $oldStatus !== 'cancelled') {
                foreach ($order->items as $item) {
                    if ($item->variant) {
                        $item->variant->increment('stock_quantity', $item->quantity);
                    } else {
                        $item->product->increment('stock_quantity', $item->quantity);
                    }
                }
            }

            // If order was cancelled and now active, reduce inventory
            if ($oldStatus === 'cancelled' && $request->status !== 'cancelled') {
                foreach ($order->items as $item) {
                    if ($item->variant) {
                        $item->variant->decrement('stock_quantity', $item->quantity);
                    } else {
                        $item->product->decrement('stock_quantity', $item->quantity);
                    }
                }
            }
        });

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function cancel(Request $request, Order $order)
    {
        // For authenticated users, ensure they're cancelling their own orders
        // For guest orders (user_id is null), allow cancellation within the same session
        if ($order->user_id !== null && $order->user_id !== auth()->id()) {
            abort(403);
        }

        // Only allow cancellation of pending orders
        if (!in_array($order->status, ['pending', 'processing'])) {
            return response()->json(['error' => 'This order cannot be cancelled at this time.'], 422);
        }

        DB::transaction(function () use ($order) {
            $order->markCancelled();

            // Restore inventory
            foreach ($order->items as $item) {
                if ($item->variant) {
                    $item->variant->increment('stock_quantity', $item->quantity);
                } else {
                    $item->product->increment('stock_quantity', $item->quantity);
                }
            }
        });

        if ($request->expectsJson()) {
            return response()->json(['success' => 'Order cancelled successfully.'], 200);
        }

        return redirect()->back()->with('success', 'Order cancelled successfully.');
    }
}