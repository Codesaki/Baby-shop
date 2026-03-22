import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Results({ query, products }) {
    const Layout = MainLayout;

    const handleRefine = (term) => {
        router.get(
            route('products.search'),
            { q: term },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <Layout>
            <Head title={`Search: ${query} - Baby Shop`} />

            <div className="min-h-screen bg-light-50">
                {/* Header */}
                <div className="bg-white shadow-soft-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm text-light-600">
                            <Link href={route('landing')} className="hover:text-primary-600">
                                Home
                            </Link>
                            <span>/</span>
                            <span className="text-light-900 font-medium">Search</span>
                        </nav>
                        <h1 className="text-2xl md:text-3xl font-bold text-light-900 mt-2">
                            Results for &quot;{query}&quot;
                        </h1>
                        <p className="text-light-600 mt-1">
                            {products.total} {products.total === 1 ? 'product' : 'products'} found
                        </p>

                        {/* Quick refine suggestions */}
                        <div className="mt-4 flex flex-wrap gap-2 text-xs md:text-sm">
                            <span className="text-light-500 mr-1">Try:</span>
                            {['newborn', 'clothing', 'toys', 'warm blanket', 'stroller'].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => handleRefine(suggestion)}
                                    className="px-3 py-1 rounded-full border border-light-200 bg-white text-light-700 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {products.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.data.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={route('products.show', product.slug)}
                                        className="group bg-white rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-200 overflow-hidden"
                                    >
                                        {/* Image */}
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

                                        {/* Info */}
                                        <div className="p-4">
                                            <p className="text-xs text-light-500 mb-1">
                                                {product.category?.name}
                                                {product.sub_category?.name ? ` · ${product.sub_category.name}` : ''}
                                            </p>
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
                                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                                            Save Ksh {product.discount_price.toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-lg font-bold text-primary-600">Ksh {product.price}</span>
                                                )}
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
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={index}
                                                href={link.url || '#'}
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
                        <div className="text-center py-16 max-w-2xl mx-auto">
                            <i className="fa-solid fa-magnifying-glass text-5xl text-light-300 mb-4"></i>
                            <h3 className="text-xl font-semibold text-light-800 mb-2">We couldn&apos;t find any matches</h3>
                            <p className="text-light-600 mb-4">
                                Try using simpler words, searching by product type (e.g. &quot;baby blanket&quot;), or checking spelling.
                            </p>
                            <ul className="text-left text-sm text-light-600 space-y-1 inline-block">
                                <li>• Use everyday words like &quot;bottle&quot;, &quot;onesie&quot;, &quot;warm blanket&quot;</li>
                                <li>• Search by category terms like &quot;clothing&quot;, &quot;toys&quot;, &quot;feeding&quot;</li>
                                <li>• Avoid very long sentences – 2–4 words usually work best</li>
                            </ul>
                            <div className="mt-6">
                                <Link
                                    href={route('landing')}
                                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    <i className="fa-solid fa-arrow-left mr-2" />
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

