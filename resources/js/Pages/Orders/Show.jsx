import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ order }) {
    const { post, processing } = useForm();

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

    const handleCancelOrder = () => {
        if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            post(route('orders.cancel', order.id));
        }
    };

    const canCancel = ['pending', 'processing'].includes(order.status);

    return (
        <AuthenticatedLayout>
            <Head title={`Order #${order.order_number} - Baby Shop`} />

            <div className="min-h-screen bg-light-50">
                {/* Header */}
                <div className="bg-white shadow-soft-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm text-light-600">
                            <Link href={route('landing')} className="hover:text-primary-600">Home</Link>
                            <span>/</span>
                            <Link href={route('orders.index')} className="hover:text-primary-600">My Orders</Link>
                            <span>/</span>
                            <span className="text-light-900 font-medium">Order #{order.order_number}</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-light-900 mt-2">Order Details</h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Status */}
                            <div className="bg-white rounded-xl shadow-soft-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Order Status</h3>
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        <i className={`fa-solid ${getStatusIcon(order.status)} mr-2`}></i>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-light-600">Order Number:</span>
                                        <div className="font-medium">#{order.order_number}</div>
                                    </div>
                                    <div>
                                        <span className="text-light-600">Order Date:</span>
                                        <div className="font-medium">
                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-light-600">Payment Method:</span>
                                        <div className="font-medium capitalize">{order.payment_method}</div>
                                    </div>
                                    <div>
                                        <span className="text-light-600">Total Amount:</span>
                                        <div className="font-medium">${order.total_amount.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-xl shadow-soft-sm p-6">
                                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-light-50 rounded-lg">
                                            <div className="w-16 h-16 flex-shrink-0">
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
                                            <div className="flex-1">
                                                <Link
                                                    href={route('products.show', item.product.slug)}
                                                    className="font-medium text-light-900 hover:text-primary-600"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                {item.variant && (
                                                    <p className="text-sm text-light-600">{item.variant.display_name}</p>
                                                )}
                                                <p className="text-sm text-light-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                                <p className="text-sm text-light-600">${item.price.toFixed(2)} each</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping & Billing Addresses */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Shipping Address */}
                                <div className="bg-white rounded-xl shadow-soft-sm p-6">
                                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                                    <div className="text-sm text-light-600">
                                        <p className="font-medium text-light-900">{order.shipping_address.name}</p>
                                        <p>{order.shipping_address.address_line}</p>
                                        <p>{order.shipping_address.city}, {order.shipping_address.postal_code}</p>
                                        <p>{order.shipping_address.phone}</p>
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div className="bg-white rounded-xl shadow-soft-sm p-6">
                                    <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                                    <div className="text-sm text-light-600">
                                        <p className="font-medium text-light-900">{order.billing_address.name}</p>
                                        <p>{order.billing_address.address_line}</p>
                                        <p>{order.billing_address.city}, {order.billing_address.postal_code}</p>
                                        <p>{order.billing_address.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Notes */}
                            {order.notes && (
                                <div className="bg-white rounded-xl shadow-soft-sm p-6">
                                    <h3 className="text-lg font-semibold mb-4">Order Notes</h3>
                                    <p className="text-sm text-light-600">{order.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Order Summary & Actions */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-soft-sm p-6 sticky top-4">
                                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${(order.total_amount - 0).toFixed(2)}</span> {/* Assuming no shipping for now */}
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                                        <span>Total</span>
                                        <span>${order.total_amount.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                {order.payment && (
                                    <div className="mb-4 p-3 bg-light-50 rounded-lg">
                                        <h4 className="font-medium mb-2">Payment Information</h4>
                                        <div className="text-sm text-light-600">
                                            <p>Status: <span className="capitalize">{order.payment.status}</span></p>
                                            {order.payment.transaction_id && (
                                                <p>Transaction ID: {order.payment.transaction_id}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="space-y-3">
                                    {canCancel && (
                                        <button
                                            onClick={handleCancelOrder}
                                            disabled={processing}
                                            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Cancelling...' : 'Cancel Order'}
                                        </button>
                                    )}

                                    <Link
                                        href={route('orders.index')}
                                        className="w-full bg-light-100 text-light-900 py-2 px-4 rounded-lg font-medium hover:bg-light-200 transition-colors block text-center"
                                    >
                                        Back to Orders
                                    </Link>

                                    <Link
                                        href={route('landing')}
                                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors block text-center"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}