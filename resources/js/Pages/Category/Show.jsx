import { Head, Link, usePage, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Show({ category, products }) {
    const Layout = MainLayout;

    const flash = usePage().props.flash || {};

    const addToCartQuick = (productId) => {
        router.post(route('cart.store'), { product_id: productId, quantity: 1 });
    };

    return (
        <Layout>
            <Head title={`${category.name} - Baby Shop`} />
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
                            <span className="text-light-900 font-medium">{category.name}</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-light-900 mt-2">{category.name}</h1>
                        <p className="text-light-600 mt-1">{products.total} products available</p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {products.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.data.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={route('products.show', product.slug)}
                                        className="group bg-white rounded-xl shadow-soft-sm hover:shadow-soft-lg transition-all duration-200 overflow-hidden"
                                    >
                                        {/* Product Image */}
                                        <div className="aspect-square overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={`/storage/${product.images[0].image_path}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-light-100 flex items-center justify-center">
                                                    <i className="fa-solid fa-image text-4xl text-light-400"></i>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-light-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                                                {product.name}
                                            </h3>

                                            {/* Price */}
                                            <div className="mt-2 flex items-center space-x-2">
                                                {product.discount_price ? (
                                                    <>
                                                        <span className="text-lg font-bold text-primary-600">
                                                            Ksh {(product.price - product.discount_price).toFixed(2)}
                                                        </span>
                                                        <span className="text-sm text-light-500 line-through">
                                                            Ksh {product.price}
                                                        </span>
                                                        <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                                                            Save Ksh {product.discount_price.toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-lg font-bold text-primary-600">
                                                        Ksh {product.price}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stock Status */}
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className={`text-sm px-2 py-1 rounded-full ${
                                                    product.quantity > 10
                                                        ? 'bg-green-100 text-green-700'
                                                        : product.quantity > 0
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {product.quantity > 10
                                                        ? 'In Stock'
                                                        : product.quantity > 0
                                                        ? `Only ${product.quantity} left`
                                                        : 'Out of Stock'
                                                    }
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); addToCartQuick(product.id); }}
                                                    className="px-2 py-1 bg-green-500 text-white rounded-md text-xs"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {products.last_page > 1 && (
                                <div className="mt-12 flex justify-center">
                                    <div className="flex space-x-2">
                                        {products.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    link.active
                                                        ? 'bg-primary-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-light-700 hover:bg-light-50 border border-light-200'
                                                        : 'bg-light-100 text-light-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <i className="fa-solid fa-box-open text-6xl text-light-300 mb-4"></i>
                            <h3 className="text-xl font-semibold text-light-700 mb-2">No products found</h3>
                            <p className="text-light-500 mb-6">This category doesn't have any products yet.</p>
                            <Link
                                href={route('landing')}
                                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                <i className="fa-solid fa-arrow-left mr-2"></i>
                                Back to Home
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}