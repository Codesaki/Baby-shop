import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Success({ auth, order }) {
    const Layout = MainLayout;

    return (
        <Layout>
            <Head title="Order Confirmed - Baby Shop" />

            <div className="min-h-screen bg-light-50">
                {/* Header */}
                <div className="bg-white shadow-soft-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm text-light-600">
                            <Link href={route('landing')} className="hover:text-primary-600">Home</Link>
                            <span>/</span>
                            <Link href={route('cart.index')} className="hover:text-primary-600">Cart</Link>
                            <span>/</span>
                            <Link href={route('checkout.index')} className="hover:text-primary-600">Checkout</Link>
                            <span>/</span>
                            <span className="text-light-900 font-medium">Order Confirmed</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-light-900 mt-2">Order Confirmed!</h1>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="bg-white rounded-xl shadow-soft-sm p-8">
                        {/* Success Message */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fa-solid fa-check text-2xl text-green-600"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-light-900 mb-2">Thank you for your order!</h2>
                            <p className="text-light-600">
                                Your order has been successfully placed. We'll send you an email confirmation shortly.
                            </p>
                        </div>

                        {/* Order Details */}
                        <div className="border-t pt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Order Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Order Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-light-600">Order Number:</span>
                                            <span className="font-medium">#{order.order_number}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-light-600">Order Date:</span>
                                            <span className="font-medium">
                                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-light-600">Status:</span>
                                            <span className="font-medium capitalize">{order.status}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-light-600">Payment Method:</span>
                                            <span className="font-medium capitalize">{order.payment_method}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                                    <div className="text-sm text-light-600">
                                        <p className="font-medium text-light-900">{order.shipping_address.name}</p>
                                        <p>{order.shipping_address.address_line}</p>
                                        <p>{order.shipping_address.city}, {order.shipping_address.postal_code}</p>
                                        <p>{order.shipping_address.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mt-8">
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
                                                <h4 className="font-medium">{item.product.name}</h4>
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

                            {/* Order Total */}
                            <div className="mt-8 border-t pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total Amount:</span>
                                    <span className="text-2xl font-bold text-primary-600">${order.total_amount.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Payment Instructions */}
                            {order.payment_method === 'mpesa' && order.status === 'pending' && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h4 className="font-medium text-blue-900 mb-2">Payment Instructions</h4>
                                    <p className="text-sm text-blue-800">
                                        Please complete your M-Pesa payment using the STK Push sent to your phone.
                                        Your order will be processed once payment is confirmed.
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={route('orders.show', order.id)}
                                    className="flex-1 bg-primary-600 text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                                >
                                    View Order Details
                                </Link>
                                <Link
                                    href={route('landing')}
                                    className="flex-1 bg-light-100 text-light-900 text-center py-3 px-6 rounded-lg font-medium hover:bg-light-200 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}