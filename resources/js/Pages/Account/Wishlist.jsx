import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Wishlist({ wishlists }) {
    const removeFromWishlist = (productId) => {
        router.delete(route('wishlist.destroy', productId), {
            preserveScroll: true,
        });
    };

    const addToCart = (productId) => {
        router.post(route('wishlist.add-to-cart'), {
            product_id: productId,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally show success message
            },
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
        }).format(amount);
    };

    return (
        <MainLayout>
            <Head title="My Wishlist - Baby Shop" />

            <div className="min-h-screen bg-light-50">
                {/* Header */}
                <div className="bg-white shadow-soft-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm text-light-600">
                            <Link href={route('landing')} className="hover:text-primary-600">Home</Link>
                            <span>/</span>
                            <Link href={route('dashboard')} className="hover:text-primary-600">My Account</Link>
                            <span>/</span>
                            <span className="text-light-900 font-medium">Wishlist</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-light-900 mt-2">My Wishlist</h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {wishlists.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-soft-sm p-8 text-center">
                            <svg className="w-16 h-16 text-light-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-light-900 mb-2">Your wishlist is empty</h3>
                            <p className="text-light-600 mb-4">Start adding items you love to your wishlist</p>
                            <Link href={route('landing')} className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlists.map((wishlist) => (
                                <div key={wishlist.id} className="bg-white rounded-xl shadow-soft-sm overflow-hidden hover:shadow-soft-md transition-shadow">
                                    <Link href={route('products.show', wishlist.product.id)}>
                                        <div className="aspect-square bg-light-100 relative">
                                            {wishlist.product.images.length > 0 ? (
                                                <img
                                                    src={wishlist.product.images[0].url}
                                                    alt={wishlist.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-light-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeFromWishlist(wishlist.product.id);
                                                }}
                                                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </Link>
                                    <div className="p-4">
                                        <Link href={route('products.show', wishlist.product.id)}>
                                            <h3 className="font-semibold text-light-900 mb-1 line-clamp-2">{wishlist.product.name}</h3>
                                        </Link>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-lg font-bold text-primary-600">
                                                {formatCurrency(wishlist.product.price)}
                                            </span>
                                            <span className={`text-sm ${wishlist.product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {wishlist.product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => addToCart(wishlist.product.id)}
                                            disabled={wishlist.product.quantity === 0}
                                            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-light-300 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}