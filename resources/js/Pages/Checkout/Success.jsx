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
                                                <p className="font-medium">Ksh {(item.price * item.quantity).toFixed(2)}</p>
                                                <p className="text-sm text-light-600">Ksh {item.price.toFixed(2)} each</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="mt-8 border-t pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total Amount:</span>
                                    <span className="text-2xl font-bold text-primary-600">Ksh {order.total_amount.toFixed(2)}</span>
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

                            {/* Account Creation for Guests */}
                            {!auth.user && (
                                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Create an Account</h3>
                                    <p className="text-blue-700 mb-4">
                                        Create an account to track your orders, save your information, and enjoy faster checkout in the future.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link
                                            href={route('auth.google')}
                                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                            Continue with Google
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            Create Account with Email
                                        </Link>
                                    </div>
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