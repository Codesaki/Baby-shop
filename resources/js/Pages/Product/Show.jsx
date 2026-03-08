import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

const Show = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);
    // quantity is managed via useForm below

    const images = product.images || [];
    const currentImage = images[selectedImage];
    const flash = usePage().props.flash || {};

    const displayPrice = product.price - (product.discount_price || 0);

    const originalPrice = product.discount_price ? product.price : null;

    const { data, setData, post, processing } = useForm({
        product_id: product.id,
        variant_id: product.default_variant_id || null,
        quantity: 1,
    });

    const handleAddToCart = (e) => {
        e.preventDefault();
        post(route('cart.store'), {
            onSuccess: () => {
                // optionally show toast notification
            }
        });
    };

    return (
        <>
            <Head title={product.name} />

            <MainLayout>
                {/* Breadcrumb */}
                {flash.success && (
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="bg-green-100 text-green-800 p-3 rounded-lg border border-green-200">
                            {flash.success}
                        </div>
                    </div>
                )}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <nav className="text-sm text-gray-600">
                            <Link href="/" className="hover:text-primary-600">Home</Link>
                            <span className="mx-2">/</span>
                            <Link href={`/categories/${product.category.slug}`} className="hover:text-primary-600">
                                {product.category.name}
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">{product.name}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
                                {currentImage ? (
                                    <img
                                        src={`/storage/${currentImage.image_path}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-200"
                                        onClick={() => setShowLightbox(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No image</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                                selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${image.image_path}`}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-primary-600">
                                    Ksh {displayPrice.toFixed(2)}
                                </span>
                                {originalPrice && (
                                    <span className="text-xl text-gray-500 line-through">
                                        Ksh {originalPrice}
                                    </span>
                                )}
                                {originalPrice && (
                                    <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded">
                                        Save Ksh {(originalPrice - displayPrice).toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                {product.quantity > 0 ? (
                                    <>
                                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                        <span className="text-green-600 font-medium">In Stock ({product.quantity} available)</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                        <span className="text-red-600 font-medium">Out of Stock</span>
                                    </>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            {product.quantity > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <label className="font-medium">Quantity:</label>
                                        <div className="flex items-center border rounded">
                                            <button
                                                type="button"
                                                onClick={() => setData('quantity', Math.max(1, data.quantity - 1))}
                                                className="px-3 py-2 hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-2 border-x">{data.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => setData('quantity', Math.min(product.quantity, data.quantity + 1))}
                                                className="px-3 py-2 hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={processing}
                                            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Adding...' : `Add to Cart - Ksh ${(displayPrice * data.quantity).toFixed(2)}`}
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Add to wishlist logic
                                                router.post(route('wishlist.store'), {
                                                    product_id: product.id,
                                                }, {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                        // Show success message
                                                    },
                                                });
                                            }}
                                            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            title="Add to Wishlist"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Short Description */}
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Overview</h3>
                                <p className="text-gray-700">{product.short_description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Long Description */}
                    <div className="mt-12 max-w-4xl">
                        <h2 className="text-2xl font-bold mb-6">Description</h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-line">{product.long_description}</p>
                        </div>
                    </div>

                    {/* Lightbox Modal */}
                    {showLightbox && (
                        <div 
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                            onClick={() => setShowLightbox(false)}
                        >
                            <div 
                                className="relative max-w-4xl max-h-[90vh] overflow-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                {currentImage && (
                                    <img
                                        src={`/storage/${currentImage.image_path}`}
                                        alt={product.name}
                                        className="w-full h-auto"
                                    />
                                )}
                                <button
                                    onClick={() => setShowLightbox(false)}
                                    className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <i className="fa-solid fa-times text-lg"></i>
                                </button>
                                
                                {/* Image Navigation in Lightbox */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
                                            }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition-colors"
                                        >
                                            <i className="fa-solid fa-chevron-left"></i>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
                                            }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition-colors"
                                        >
                                            <i className="fa-solid fa-chevron-right"></i>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </MainLayout>
        </>
    );
};

export default Show;
