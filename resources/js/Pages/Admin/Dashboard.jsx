import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

const Dashboard = ({
    salesToday,
    salesThisMonth,
    totalSalesAllTime,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
    newCustomersToday,
    totalCustomers,
    averageOrderValue,
    lowStockProducts,
    outOfStockProducts,
    salesChartData,
    recentOrders,
    topProducts,
    latestReviews,
}) => {
    const StatCard = ({ label, value, subtext, color = 'blue' }) => (
        <div className={`bg-white rounded-lg shadow p-6 border-l-4 border-${color}-500`}>
            <p className="text-gray-600 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
    );

    return (
        <>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
                </div>

                {/* Top Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Sales Today" value={`$${salesToday.toFixed(2)}`} color="green" />
                    <StatCard label="Sales This Month" value={`$${salesThisMonth.toFixed(2)}`} color="blue" />
                    <StatCard label="Total Orders" value={pendingOrders + processingOrders + completedOrders + cancelledOrders} color="purple" />
                    <StatCard label="Avg Order Value" value={`$${averageOrderValue}`} color="indigo" />
                </div>

                {/* Orders & Customers Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Status */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status Overview</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Pending</span>
                                <span className="font-semibold text-yellow-600">{pendingOrders}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Processing</span>
                                <span className="font-semibold text-blue-600">{processingOrders}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Completed</span>
                                <span className="font-semibold text-green-600">{completedOrders}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cancelled</span>
                                <span className="font-semibold text-red-600">{cancelledOrders}</span>
                            </div>
                        </div>
                        <Link
                            href={typeof route !== 'undefined' ? route('admin.orders.index') : '#'}
                            className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View All Orders →
                        </Link>
                    </div>

                    {/* Inventory Alerts */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Alerts</h2>
                        <div className="space-y-3">
                            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                                <p className="text-sm text-yellow-800 font-medium">Low Stock</p>
                                <p className="text-2xl font-bold text-yellow-600 mt-1">{lowStockProducts}</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded border border-red-200">
                                <p className="text-sm text-red-800 font-medium">Out of Stock</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">{outOfStockProducts}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Metrics */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Metrics</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">New Today</p>
                                <p className="text-3xl font-bold text-blue-600">{newCustomersToday}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Registered</p>
                                <p className="text-3xl font-bold text-indigo-600">{totalCustomers}</p>
                            </div>
                        </div>
                        <Link
                            href={route('admin.customers.index')}
                            className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View All Customers →
                        </Link>
                    </div>
                </div>

                {/* Recent Orders & Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 px-2 text-gray-600 font-medium">Order</th>
                                        <th className="text-left py-2 px-2 text-gray-600 font-medium">Customer</th>
                                        <th className="text-left py-2 px-2 text-gray-600 font-medium">Amount</th>
                                        <th className="text-left py-2 px-2 text-gray-600 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-2 text-blue-600 font-medium">{order.order_number}</td>
                                            <td className="py-2 px-2 text-gray-700">{order.customer_name}</td>
                                            <td className="py-2 px-2 font-semibold">${order.total_amount.toFixed(2)}</td>
                                            <td className="py-2 px-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
                        <div className="space-y-3">
                            {topProducts.map((product) => (
                                <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="text-gray-900 font-medium">{product.name}</p>
                                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">{product.reviews} reviews</p>
                                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Latest Reviews */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Reviews</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-2 text-gray-600 font-medium">Product</th>
                                    <th className="text-left py-2 px-2 text-gray-600 font-medium">Customer</th>
                                    <th className="text-left py-2 px-2 text-gray-600 font-medium">Rating</th>
                                    <th className="text-left py-2 px-2 text-gray-600 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestReviews.map((review) => (
                                    <tr key={review.id} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-2 text-gray-700">{review.product_name}</td>
                                        <td className="py-2 px-2 text-gray-700">{review.customer_name}</td>
                                        <td className="py-2 px-2">
                                            <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                                        </td>
                                        <td className="py-2 px-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                review.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

Dashboard.layout = page => <AdminLayout children={page} />;

export default Dashboard;
