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
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
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
                                    {processing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}