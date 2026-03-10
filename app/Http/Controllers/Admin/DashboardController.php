<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Sales metrics
        $today = Carbon::now()->format('Y-m-d');
        $thisMonth = Carbon::now()->format('Y-m');

        $salesToday = Order::whereDate('created_at', $today)
            ->where('payment_status', 'paid')
            ->sum('total_amount');

        $salesThisMonth = Order::whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->where('payment_status', 'paid')
            ->sum('total_amount');

        $totalSalesAllTime = Order::where('payment_status', 'paid')
            ->sum('total_amount');

        // Order metrics
        $pendingOrders = Order::where('status', 'pending')->count();
        $processingOrders = Order::where('status', 'processing')->count();
        $completedOrders = Order::where('status', 'delivered')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();

        // Customer metrics
        $newCustomersToday = User::whereDate('created_at', $today)
            ->whereNull('is_admin')
            ->orWhere('is_admin', false)
            ->count();

        $totalCustomers = User::where('is_admin', false)
            ->orWhereNull('is_admin')
            ->count();

        // Average order value
        $totalOrders = Order::where('payment_status', 'paid')->count();
        $averageOrderValue = $totalOrders > 0 ? $totalSalesAllTime / $totalOrders : 0;

        // Inventory alerts
        $lowStockProducts = Product::where('track_inventory', true)
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->count();

        $outOfStockProducts = Product::where('track_inventory', true)
            ->where('stock_quantity', 0)
            ->count();

        // Sales chart data (last 30 days)
        $salesChartData = $this->getSalesChartData();

        // Recent orders
        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->user->name,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'created_at' => $order->created_at->format('M d, Y'),
                ];
            });

        // Top products
        $topProducts = Product::withCount(['reviews'])
            ->orderBy('reviews_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'stock' => $product->stock_quantity,
                    'reviews' => $product->reviews_count,
                ];
            });

        // Latest reviews
        $latestReviews = Review::with(['product', 'customer'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'product_name' => $review->product->name,
                    'customer_name' => $review->customer->name,
                    'rating' => $review->rating,
                    'status' => $review->status,
                    'created_at' => $review->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'salesToday' => $salesToday,
            'salesThisMonth' => $salesThisMonth,
            'totalSalesAllTime' => $totalSalesAllTime,
            'pendingOrders' => $pendingOrders,
            'processingOrders' => $processingOrders,
            'completedOrders' => $completedOrders,
            'cancelledOrders' => $cancelledOrders,
            'newCustomersToday' => $newCustomersToday,
            'totalCustomers' => $totalCustomers,
            'averageOrderValue' => round($averageOrderValue, 2),
            'lowStockProducts' => $lowStockProducts,
            'outOfStockProducts' => $outOfStockProducts,
            'salesChartData' => $salesChartData,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'latestReviews' => $latestReviews,
        ]);
    }

    private function getSalesChartData()
    {
        $last30Days = [];
        $labels = [];

        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $labels[] = Carbon::parse($date)->format('M d');

            $sales = Order::whereDate('created_at', $date)
                ->where('payment_status', 'paid')
                ->sum('total_amount');

            $last30Days[] = (float)$sales;
        }

        return [
            'labels' => $labels,
            'sales' => $last30Days,
        ];
    }
}
