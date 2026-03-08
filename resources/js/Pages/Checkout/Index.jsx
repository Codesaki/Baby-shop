import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';

export default function Index({ auth, cart, addresses, defaultAddress }) {
    const Layout = MainLayout;
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        shipping_address: defaultAddress ? {
            name: defaultAddress.name,
            phone: defaultAddress.phone,
            address_line: defaultAddress.address_line,
            city: defaultAddress.city,
            postal_code: defaultAddress.postal_code,
        } : {
            name: '',
            phone: '',
            address_line: '',
            city: '',
            postal_code: '',
        },
        billing_address: defaultAddress ? {
            name: defaultAddress.name,
            phone: defaultAddress.phone,
            address_line: defaultAddress.address_line,
            city: defaultAddress.city,
            postal_code: defaultAddress.postal_code,
        } : {
            name: '',
            phone: '',
            address_line: '',
            city: '',
            postal_code: '',
        },
        payment_method: 'mpesa',
        phone: defaultAddress?.phone || '',
        notes: '',
        coupon_code: '',
    });

    const [sameAsShipping, setSameAsShipping] = useState(true);

    const updateBillingAddress = () => {
        if (sameAsShipping) {
            setData('billing_address', { ...data.shipping_address });
        }
    };

    const handleShippingChange = (field, value) => {
        setData('shipping_address', { ...data.shipping_address, [field]: value });
        if (sameAsShipping) {
            setData('billing_address', { ...data.billing_address, [field]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('checkout.store'));
    };

    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    return (
        <Layout>
            <Head title="Checkout - Baby Shop" />

            <div className="min-h-screen bg-light-50">
                {/* Header */}
                <div className="bg-white shadow-soft-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm text-light-600">
                            <Link href={route('landing')} className="hover:text-primary-600">Home</Link>
                            <span>/</span>
                            <Link href={route('cart.index')} className="hover:text-primary-600">Cart</Link>
                            <span>/</span>
                            <span className="text-light-900 font-medium">Checkout</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-light-900 mt-2">Checkout</h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Account Creation for Guests */}
                            {!auth.user && (
                                <div className="bg-white rounded-xl shadow-soft-sm p-6">
                                    <h3 className="text-lg font-semibold mb-4">Create an Account (Optional)</h3>
                                    <p className="text-sm text-light-600 mb-4">
                                        Create an account to track your orders, save your information, and enjoy a faster checkout experience.
                                    </p>
                                    <div className="space-y-3">
                                        <a
                                            href={route('auth.google')}
                                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                            Continue with Google
                                        </a>
                                        <div className="text-center">
                                            <span className="text-sm text-light-500">or</span>
                                        </div>
                                        <Link
                                            href={route('register')}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-primary-700"
                                        >
                                            Create Account with Email
                                        </Link>
                                        <div className="text-center">
                                            <span className="text-sm text-light-500">Or continue as guest</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shipping Address */}
                            <div className="bg-white rounded-xl shadow-soft-sm p-6">
                                <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={data.shipping_address.name}
                                            onChange={(e) => handleShippingChange('name', e.target.value)}
                                            className="w-full border border-light-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={data.shipping_address.phone}
                                            onChange={(e) => handleShippingChange('phone', e.target.value)}
                                            className="w-full border border-light-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1">Address</label>
                                        <textarea
                                            value={data.shipping_address.address_line}
                                            onChange={(e) => handleShippingChange('address_line', e.target.value)}
                                            rows="3"
                                            className="w-full border border-light-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">City</label>
                                        <input
                                            type="text"
                                            value={data.shipping_address.city}
                                            onChange={(e) => handleShippingChange('city', e.target.value)}
                                            className="w-full border border-light-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            value={data.shipping_address.postal_code}
                                            onChange={(e) => handleShippingChange('postal_code', e.target.value)}
                                            className="w-full border border-light-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Billing Address */}
                            <div className="bg-white rounded-xl shadow-soft-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Billing Address</h3>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={sameAsShipping}
                                            onChange={(e) => {
                                                setSameAsShipping(e.target.checked);
                                                if (e.target.checked) {
                                                    updateBillingAddress();
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        Same as shipping
                                    </label>
                                </div>

                                {!sameAsShipping && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={data.billing_address.name}
                                                onChange={(e) => setData('billing_address', { ...data.billing_address, name: e.target.value })}
                                                className="w-full border border-light-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                value={data.billing_address.phone}
                                                onChange={(e) => setData('billing_address', { ...data.billing_address, phone: e.target.value })}
                                                className="w-full border border-light-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Address</label>
                                            <textarea
                                                value={data.billing_address.address_line}
                                                onChange={(e) => setData('billing_address', { ...data.billing_address, address_line: e.target.value })}
                                                rows="3"
                                                className="w-full border border-light-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">City</label>
                                            <input
                                                type="text"
                                                value={data.billing_address.city}
                                                onChange={(e) => setData('billing_address', { ...data.billing_address, city: e.target.value })}
                                                className="w-full border border-light-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Postal Code</label>
                                            <input
                                                type="text"
                                                value={data.billing_address.postal_code}
                                                onChange={(e) => setData('billing_address', { ...data.billing_address, postal_code: e.target.value })}
                                                className="w-full border border-light-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-xl shadow-soft-sm p-6">
                                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="mpesa"
                                            checked={data.payment_method === 'mpesa'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">M-Pesa</div>
                                            <div className="text-sm text-light-600">Pay with your M-Pesa mobile money</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="card"
                                            checked={data.payment_method === 'card'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">Credit/Debit Card</div>
                                            <div className="text-sm text-light-600">Pay with Visa, Mastercard, or other cards</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white rounded-xl shadow-soft-sm p-6">
                                <h3 className="text-lg font-semibold mb-4">Order Notes (Optional)</h3>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Any special instructions for delivery..."
                                    rows="3"
                                    className="w-full border border-light-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-soft-sm p-6 sticky top-4">
                                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                                {/* Cart Items */}
                                <div className="space-y-3 mb-4">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex space-x-3">
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
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.product.name}</p>
                                                {item.variant && (
                                                    <p className="text-xs text-light-600">{item.variant.display_name}</p>
                                                )}
                                                <p className="text-sm text-light-600">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-medium">
                                                Ksh {(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>Ksh {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                                        <span>Total</span>
                                        <span>Ksh {total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {errors && Object.keys(errors).length > 0 && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <ul className="text-sm text-red-600">
                                            {Object.values(errors).map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors mt-6 disabled:opacity-50"
                                >
                                    {processing ? 'Processing...' : `Place Order - Ksh ${total.toFixed(2)}`}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}