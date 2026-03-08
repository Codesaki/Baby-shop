import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ order }) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    const [statusNotes, setStatusNotes] = useState('');

    const { patch, processing } = useForm();

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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
        }).format(amount);
    };

    const handleStatusUpdate = () => {
        patch(route('admin.orders.update-status', order.id), {
            status: selectedStatus,
            notes: statusNotes,
        }, {
            onSuccess: () => {
                setShowStatusModal(false);
                setStatusNotes('');
            }
        });
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <AdminLayout>
            <Head title={`Order #${order.order_number} - Admin`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('admin.orders.index')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
                            <p className="text-gray-600">
                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <button
                            onClick={() => setShowStatusModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Update Status
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Information */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-medium mb-4">Customer Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Name</p>
                                    <p className="text-sm text-gray-900">{order.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Email</p>
                                    <p className="text-sm text-gray-900">{order.user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-medium mb-4">Order Items</h3>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-16 h-16 flex-shrink-0">
                                            {item.product.images && item.product.images.length > 0 ? (
                                                <img
                                                    src={`/storage/${item.product.images[0].image_path}`}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                    <i className="fa-solid fa-image text-xs text-gray-400"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                                            {item.variant && (
                                                <p className="text-sm text-gray-600">{item.variant.display_name}</p>
                                            )}
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                            <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Addresses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                                    <p>{order.shipping_address.address_line}</p>
                                    <p>{order.shipping_address.city}, {order.shipping_address.postal_code}</p>
                                    <p>{order.shipping_address.phone}</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-lg font-medium mb-4">Billing Address</h3>
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium text-gray-900">{order.billing_address.name}</p>
                                    <p>{order.billing_address.address_line}</p>
                                    <p>{order.billing_address.city}, {order.billing_address.postal_code}</p>
                                    <p>{order.billing_address.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Notes */}
                        {order.notes && (
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-lg font-medium mb-4">Order Notes</h3>
                                <p className="text-sm text-gray-600">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-4">
                            <h3 className="text-lg font-medium mb-4">Order Summary</h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-sm">Subtotal</span>
                                    <span className="text-sm">{formatCurrency(order.total_amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Shipping</span>
                                    <span className="text-sm text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total_amount)}</span>
                                </div>
                            </div>

                            {/* Payment Information */}
                            {order.payment && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium mb-2">Payment Information</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>Method: <span className="capitalize">{order.payment_method}</span></p>
                                        <p>Status: <span className="capitalize">{order.payment.status}</span></p>
                                        {order.payment.transaction_id && (
                                            <p>Transaction ID: {order.payment.transaction_id}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="space-y-2">
                                <button
                                    onClick={() => setShowStatusModal(true)}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Update Status
                                </button>
                                <Link
                                    href={route('admin.orders.index')}
                                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors block text-center"
                                >
                                    Back to Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium mb-4">Update Order Status</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                <textarea
                                    value={statusNotes}
                                    onChange={(e) => setStatusNotes(e.target.value)}
                                    rows="3"
                                    placeholder="Add notes about this status change..."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={processing}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}