<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function salesReport(Request $request)
    {
        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->subMonths(3);
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now();

        $query = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_status', 'paid');

        $totalSales = $query->sum('total_amount');
        $totalOrders = $query->count();
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;

        // Daily sales
        $dailySales = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_status', 'paid')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as order_count, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Admin/Reports/Sales', [
            'report' => [
                'total_sales' => $totalSales,
                'total_orders' => $totalOrders,
                'average_order_value' => round($averageOrderValue, 2),
            ],
            'daily_sales' => $dailySales,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
        ]);
    }

    public function productReport(Request $request)
    {
        $period = $request->period ?? 'month';

        $topSellingProducts = Product::with('variants')
            ->selectRaw('products.*, COUNT(order_items.id) as sold_count, SUM(order_items.quantity) as total_quantity')
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.payment_status', 'paid');

        if ($period === 'week') {
            $topSellingProducts->where('orders.created_at', '>=', Carbon::now()->subWeek());
        } elseif ($period === 'month') {
            $topSellingProducts->where('orders.created_at', '>=', Carbon::now()->subMonth());
        }

        $topSellingProducts = $topSellingProducts->groupBy('products.id')
            ->orderBy('total_quantity', 'desc')
            ->limit(20)
            ->get();

        $lowStockProducts = Product::where('track_inventory', true)
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->orderBy('stock_quantity')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Reports/Products', [
            'top_selling' => $topSellingProducts,
            'low_stock' => $lowStockProducts,
            'period' => $period,
        ]);
    }

    public function customerReport(Request $request)
    {
        $topCustomers = User::where('is_admin', false)
            ->selectRaw('users.*, COUNT(orders.id) as order_count, SUM(orders.total_amount) as total_spent')
            ->join('orders', 'users.id', '=', 'orders.user_id')
            ->where('orders.payment_status', 'paid')
            ->groupBy('users.id')
            ->orderBy('total_spent', 'desc')
            ->limit(20)
            ->get();

        $repeatBuyers = User::where('is_admin', false)
            ->selectRaw('users.*, COUNT(orders.id) as order_count')
            ->join('orders', 'users.id', '=', 'orders.user_id')
            ->where('orders.payment_status', 'paid')
            ->having('order_count', '>', 1)
            ->groupBy('users.id')
            ->orderBy('order_count', 'desc')
            ->limit(20)
            ->get();

        return Inertia::render('Admin/Reports/Customers', [
            'top_customers' => $topCustomers,
            'repeat_buyers' => $repeatBuyers,
        ]);
    }
}
