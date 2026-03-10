<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('is_admin', false)
            ->orWhereNull('is_admin')
            ->withCount('orders')
            ->with('orders');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }

        // Sort
        $sort = $request->sort ?? '-created_at';
        if ($sort === '-created_at') {
            $query->orderBy('created_at', 'desc');
        } elseif ($sort === 'created_at') {
            $query->orderBy('created_at', 'asc');
        } elseif ($sort === '-orders_count') {
            $query->orderBy('orders_count', 'desc');
        }

        $customers = $query->paginate(20)->appends($request->query());

        $customers->transform(function ($customer) {
            return [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'orders_count' => $customer->orders_count,
                'total_spent' => $customer->orders->sum('total_amount'),
                'created_at' => $customer->created_at->format('M d, Y'),
            ];
        });

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function show(User $customer)
    {
        // Check it's not an admin
        if ($customer->is_admin) {
            return redirect()->back()->with('error', 'Cannot view admin users as customers.');
        }

        $customer->load('orders', 'addresses', 'reviews');

        $orders = $customer->orders->map(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->format('M d, Y'),
            ];
        });

        $addresses = $customer->addresses->map(function ($address) {
            return [
                'id' => $address->id,
                'type' => $address->type,
                'street' => $address->street,
                'city' => $address->city,
                'state' => $address->state,
                'postal_code' => $address->postal_code,
                'country' => $address->country,
                'is_default' => $address->is_default,
            ];
        });

        return Inertia::render('Admin/Customers/Show', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'created_at' => $customer->created_at->format('M d, Y'),
            ],
            'orders' => $orders,
            'addresses' => $addresses,
            'total_spent' => $customer->orders->sum('total_amount'),
            'total_orders' => $customer->orders->count(),
        ]);
    }

    public function update(Request $request, User $customer)
    {
        if ($customer->is_admin) {
            return redirect()->back()->with('error', 'Cannot edit admin users here.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $customer->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $customer->update($validated);

        return redirect()->back()->with('success', 'Customer updated successfully.');
    }
}
