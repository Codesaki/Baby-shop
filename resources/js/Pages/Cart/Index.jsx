import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';

export default function Index({ auth, cart, items }) {
    const Layout = MainLayout;
    const flash = usePage().props.flash || {};

    const [quantities, setQuantities] = useState(
        items.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
    );

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setQuantities(prev => ({ ...prev, [itemId]: newQuantity }));

        // Update on server
        router.patch(route('cart.update', itemId), { quantity: newQuantity }, {
            onError: (error) => {
                console.error('Error updating quantity:', error);
                // Revert on error
                setQuantities(prev => ({ ...prev, [itemId]: items.find(i => i.id === itemId).quantity }));
            }
        });
    };

    const removeItem = (itemId) => {
        router.delete(route('cart.destroy', itemId));
    };

    const clearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            router.delete(route('cart.clear'));
        }
    };

    const total = items.reduce((sum, item) => sum + (item.price * quantities[item.id]), 0);

    return (
        <Layout>
            <Head title="Shopping Cart - Baby Shop" />
            {flash.success && (
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="bg-green-100 text-green-800 p-3 rounded-lg border border-green-200">
                        {flash.success}
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-light-50">
                {/* Header */}
                <div className="bg-white shadow-soft-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm text-light-600">
                            <Link href={route('landing')} className="hover:text-primary-600">Home</Link>
                            <span>/</span>
                            <span className="text-light-900 font-medium">Shopping Cart</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-light-900 mt-2">Shopping Cart</h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {items.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-white rounded-xl shadow-soft-sm p-6">
                                        <div className="flex space-x-4">
                                            {/* Product Image */}
                                            <div className="w-24 h-24 flex-shrink-0">
                                                {item.product.images && item.product.images.length > 0 ? (
                                                    <img
                                                        src={`/storage/${item.product.images[0].image_path}`}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-light-100 rounded-lg flex items-center justify-center">
                                                        <i className="fa-solid fa-image text-2xl text-light-400"></i>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <Link
                                                    href={route('products.show', item.product.slug)}
                                                    className="text-lg font-semibold text-light-900 hover:text-primary-600"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                {item.variant && (
                                                    <p className="text-sm text-light-600 mt-1">
                                                        {item.variant.display_name}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center space-x-3">
                                                        <label className="text-sm font-medium">Qty:</label>
                                                        <div className="flex items-center border rounded-lg">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, quantities[item.id] - 1)}
                                                                className="px-3 py-1 text-light-600 hover:text-light-900"
                                                            >
                                                                <i className="fa-solid fa-minus text-xs"></i>
                                                            </button>
                                                            <span className="px-3 py-1 text-center min-w-12">
                                                                {quantities[item.id]}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, quantities[item.id] + 1)}
                                                                className="px-3 py-1 text-light-600 hover:text-light-900"
                                                            >
                                                                <i className="fa-solid fa-plus text-xs"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-primary-600">
                                                            ${(item.price * quantities[item.id]).toFixed(2)}
                                                        </p>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-sm text-red-600 hover:text-red-700 mt-1"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-between items-center pt-4">
                                    <button
                                        onClick={clearCart}
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-soft-sm p-6 sticky top-4">
                                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between">
                                            <span>Subtotal ({items.length} items)</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span className="text-green-600">Free</span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={route('checkout.index')}
                                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors mt-6 inline-block text-center"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <i className="fa-solid fa-shopping-cart text-6xl text-light-300 mb-4"></i>
                            <h3 className="text-xl font-semibold text-light-700 mb-2">Your cart is empty</h3>
                            <p className="text-light-500 mb-6">Add some products to get started!</p>
                            <Link
                                href={route('landing')}
                                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                <i className="fa-solid fa-arrow-left mr-2"></i>
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}