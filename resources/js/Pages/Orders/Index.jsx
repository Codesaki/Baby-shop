import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ orders }) {
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: 'fa-clock',
            processing: 'fa-cog',
            shipped: 'fa-truck',
            delivered: 'fa-check-circle',
            cancelled: 'fa-times-circle',
        };
        return icons[status] || 'fa-question-circle';
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Orders - Baby Shop" />

            <div className="min-h-screen bg-light-50">
                {/* Header */}
                <div className="bg-white shadow-soft-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm text-light-600">
                            <Link href={route('landing')} className="hover:text-primary-600">Home</Link>
                            <span>/</span>
                            <span className="text-light-900 font-medium">My Orders</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-light-900 mt-2">My Orders</h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {orders.data.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-soft-sm p-12 text-center">
                            <div className="w-16 h-16 bg-light-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fa-solid fa-shopping-bag text-2xl text-light-400"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-light-900 mb-2">No orders yet</h3>
                            <p className="text-light-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
                            <Link
                                href={route('landing')}
                                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                            >
                                Start Shopping
                                <i className="fa-solid fa-arrow-right ml-2"></i>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.data.map((order) => (
                                <div key={order.id} className="bg-white rounded-xl shadow-soft-sm p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                                            <div className="text-sm text-light-600">
                                                Order #{order.order_number}
                                            </div>
                                            <div className="text-sm text-light-600">
                                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                <i className={`fa-solid ${getStatusIcon(order.status)} mr-1`}></i>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-semibold text-light-900">
                                                ${order.total_amount.toFixed(2)}
                                            </div>
                                            <div className="text-sm text-light-600">
                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="flex items-center space-x-4 mb-4">
                                        {order.items.slice(0, 3).map((item) => (
                                            <div key={item.id} className="flex items-center space-x-3">
                                                <div className="w-12 h-12 flex-shrink-0">
                                                    {item.product.images && item.product.images.length > 0 ? (
                                                        <img
                                                            src={`/storage/${item.product.images[0].image_path}`}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-light-100 rounded flex items-center justify-center">
                                                            <i className="fa-solid fa-image text-xs text-light-400"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                                                    <p className="text-xs text-light-600">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="text-sm text-light-600">
                                                +{order.items.length - 3} more
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link
                                            href={route('orders.show', order.id)}
                                            className="flex-1 bg-primary-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to cancel this order?')) {
                                                        // Handle cancellation
                                                    }
                                                }}
                                                className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            {orders.links && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex space-x-1">
                                        {orders.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm rounded-lg ${
                                                    link.active
                                                        ? 'bg-primary-600 text-white'
                                                        : 'bg-white text-light-700 hover:bg-light-50'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}