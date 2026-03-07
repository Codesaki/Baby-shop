import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';

const Landing = ({ featuredProducts, newArrivals, popularProducts, categories }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const addToCartQuick = (productId) => {
        router.post(route('cart.store'), { product_id: productId, quantity: 1 });
    };

    const navigate = (slug) => {
        router.visit(route('products.show', slug));
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Baby Care', href: '#' },
        { name: 'Clothing', href: '#' },
        { name: 'Feeding', href: '#' },
        { name: 'Mommy', href: '#' },
        { name: 'Playtime', href: '#' },
        { name: 'Travel', href: '#' },
        { name: 'Warmth', href: '#' },
    ];

    const socials = [
        { name: 'TikTok', href: 'https://tiktok.com' },
        { name: 'Facebook', href: 'https://facebook.com' },
        { name: 'Instagram', href: 'https://instagram.com' },
        { name: 'YouTube', href: 'https://youtube.com' },
    ];

    const features = [
        {
            id: 1,
            title: 'Premium Quality',
            description: 'All our products are carefully selected for safety and quality',
            iconClass: 'fa-solid fa-star',
        },
        {
            id: 2,
            title: 'Eco-Friendly',
            description: 'Sustainable and environmentally conscious products',
            iconClass: 'fa-solid fa-leaf',
        },
        {
            id: 3,
            title: 'Fast Delivery',
            description: 'Quick shipping to your doorstep within 2-3 business days',
            iconClass: 'fa-solid fa-truck',
        },
        {
            id: 4,
            title: 'Expert Support',
            description: 'Our team is here to help with personalized recommendations',
            iconClass: 'fa-solid fa-headset',
        },
    ];

    // Mobile-first content data
    // featured products and new arrivals come from props
    const featuredProductsData = featuredProducts || [];
    const newArrivalsData = newArrivals || [];

    const instagramImages = [
        'https://images.unsplash.com/photo-1516685018646-549b5b3c3f0d?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1505059945225-50b9b35f3f8d?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1529516543401-5f3c6a0f2b6a?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=800&fit=crop',
    ];

    const [openFooterSections, setOpenFooterSections] = useState({ Shop: false, Support: false, About: false, Contact: false });

    const toggleFooterSection = (key) => {
        setOpenFooterSections((s) => ({ ...s, [key]: !s[key] }));
    };

    return (
        <>
            <Head title="Welcome to Blimey Baby Shop" />

            <MainLayout>
                {/* Mobile-first Hero */}
                <section id="hero" className="min-h-[60vh] flex flex-col">
                    <div className="h-[55vh] w-full overflow-hidden rounded-b-2xl">
                        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=800&fit=crop" alt="Mom and baby" className="w-full h-full object-cover" />
                    </div>
                    <div className="px-5 py-5 bg-white">
                        <h1 className="text-2xl font-bold mb-2">Everything for Your Little One</h1>
                        <p className="text-sm text-light-700 mb-4">Curated essentials for newborns and parents. Fast shipping & safe materials.</p>
                        {/* responsive layout: vertical on mobile, horizontal at md+ */}
                        <div className="space-y-3 md:flex md:space-y-0 md:justify-center md:space-x-4">
                            <button className="w-full md:w-1/3 px-4 py-3 bg-primary-500 text-white rounded-lg font-semibold">Shop Newborn Essentials</button>
                            <button className="w-full md:w-1/3 px-4 py-3 bg-light-200 text-light-900 rounded-lg">Browse Categories</button>
                        </div>
                    </div>
                </section>

                {/* Quick Category Scroller */}
                <section className="py-4 px-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:justify-center">
                        {navLinks.map((link) => (
                            <button key={link.name} className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white border border-light-200 rounded-full shadow-sm">
                                <i className="fa-solid fa-circle-dot text-primary-500"></i>
                                <span className="text-sm font-medium">{link.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Category Grid (2 columns) */}
                <section className="px-4 pb-6">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories && categories.length > 0 ? categories.map((category) => (
                            <Link key={category.id} href={route('categories.show', category.slug)} className="block rounded-xl overflow-hidden shadow-soft-lg hover:shadow-soft-xl transition-shadow">
                                <div className="h-44 bg-gradient-to-br from-primary-100 to-primary-200 w-full flex items-center justify-center">
                                    <div className="text-center">
                                        <i className="fa-solid fa-tag text-4xl text-primary-600 mb-2"></i>
                                        <div className="text-primary-800 font-semibold">{category.products_count} products</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-white">
                                    <h3 className="font-semibold text-center">{category.name}</h3>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full text-center py-8 text-light-700">No categories available</div>
                        )}
                    </div>
                </section>

                {/* Featured Products - Horizontal Scroll */}
                <section className="px-4 pb-6">
                    <h3 className="text-lg font-bold mb-3 px-1">Popular Right Now</h3>
                    <div className="flex gap-4 overflow-x-auto pb-3 px-1">
                        {featuredProductsData.length > 0 ? (
                            featuredProductsData.map((p) => (
                                <div key={p.id} onClick={() => navigate(p.slug)} className="cursor-pointer block min-w-[60%] sm:min-w-[40%] lg:min-w-[20%] bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-44 bg-gray-100">
                                        <img src={p.images && p.images.length ? `/storage/${p.images[0].image_path}` : ''} alt={p.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-medium text-sm line-clamp-2">{p.name}</h4>
                                        <p className="text-sm text-light-700 line-clamp-2">{p.short_description}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="font-bold text-primary-600">
                                                {p.discount_price && p.discount_price < p.price ? (
                                                    <>
                                                        <span className="text-red-600">${p.discount_price}</span>
                                                        <span className="text-gray-500 line-through text-sm ml-2">${p.price}</span>
                                                    </>
                                                ) : (
                                                    <span>${p.price || 'Price TBD'}</span>
                                                )}
                                            </span>
                                            <div className="flex gap-2">
                                                <Link href={route('products.show', p.slug)} className="px-3 py-1 bg-primary-500 text-white rounded-md text-sm">View</Link>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCartQuick(p.id); }}
                                                    className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center py-8 text-light-700">No featured products available yet</div>
                        )}
                    </div>
                </section>

                {/* Trust Strip */}
                <section className="px-4 pb-6">
                    <div className="bg-[#fff7ed] rounded-lg p-4 space-y-3 md:space-y-0 md:flex md:justify-center md:gap-6">
                        <div className="flex items-start gap-3">
                            <i className="fa-solid fa-shield-halved text-primary-500 mt-1"></i>
                            <div>
                                <div className="font-semibold">Safe for babies</div>
                                <div className="text-sm text-light-700">Carefully tested, non-toxic materials</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <i className="fa-solid fa-truck-fast text-primary-500 mt-1"></i>
                            <div>
                                <div className="font-semibold">Fast delivery</div>
                                <div className="text-sm text-light-700">Quick shipping options available</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <i className="fa-solid fa-award text-primary-500 mt-1"></i>
                            <div>
                                <div className="font-semibold">Quality products</div>
                                <div className="text-sm text-light-700">Trusted brands and curated selection</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* New Arrivals (horizontal) */}
                <section className="px-4 pb-6">
                    <h3 className="text-lg font-bold mb-3 px-1">New Arrivals</h3>
                    <div className="flex gap-4 overflow-x-auto pb-3 px-1">
                        {newArrivalsData.length > 0 ? (
                            newArrivals.map((p) => (
                                <div key={p.id} onClick={() => navigate(p.slug)} className="block min-w-[60%] sm:min-w-[40%] lg:min-w-[20%] bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="h-44 bg-gray-100">
                                        <img src={p.images && p.images.length ? `/storage/${p.images[0].image_path}` : ''} alt={p.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-medium text-sm line-clamp-2">{p.name}</h4>
                                        <p className="text-sm text-light-700 line-clamp-1">{p.short_description}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="font-bold text-primary-600">
                                                {p.discount_price && p.discount_price < p.price ? (
                                                    <>
                                                        <span className="text-red-600">${p.discount_price}</span>
                                                        <span className="text-gray-500 line-through text-sm ml-2">${p.price}</span>
                                                    </>
                                                ) : (
                                                    <span>${p.price || 'Price TBD'}</span>
                                                )}
                                            </span>
                                            <div className="flex gap-2">
                                                <Link href={route('products.show', p.slug)} className="px-3 py-1 bg-primary-500 text-white rounded-md text-sm">View</Link>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCartQuick(p.id); }}
                                                    className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center py-8 text-light-700">No products available</div>
                        )}
                    </div>
                </section>

                {/* Mom Section */}
                <section className="px-4 pb-6">
                    <div className="rounded-lg overflow-hidden bg-white shadow-sm">
                        <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=600&fit=crop" alt="Care for mom" className="w-full h-44 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-bold">Care for Mom Too</h3>
                            <p className="text-sm text-light-700 my-2">Comfortable essentials and self-care items for new mothers.</p>
                            <button className="w-full lg:w-auto lg:max-w-[20%] px-4 py-3 bg-primary-500 text-white rounded-lg">Shop Mommy Essentials</button>
                        </div>
                    </div>
                </section>

                {/* Bundles / Deals (vertical cards) */}
                <section className="px-4 pb-6">
                    <h3 className="text-lg font-bold mb-3">Bundles & Deals</h3>
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex">
                            <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop" alt="bundle" className="w-1/3 object-cover" />
                            <div className="p-3 flex-1">
                                <div className="font-semibold">Newborn Starter Pack</div>
                                <div className="text-sm text-light-700">$79</div>
                                <button className="mt-3 px-3 py-2 bg-primary-500 text-white rounded-md">Get Bundle</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Email Signup */}
                <section className="px-4 pb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-bold mb-2">Join our mailing list</h4>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Your email" className="flex-1 border border-light-200 rounded-md px-3 py-2" />
                            <button className="px-4 py-2 bg-primary-500 text-white rounded-md">Subscribe</button>
                        </div>
                    </div>
                </section>

                {/* Instagram Grid */}
                <section className="px-4 pb-6">
                    <h3 className="text-lg font-bold mb-3">From Instagram</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {instagramImages.slice(0,6).map((src, i) => (
                            <a key={i} href="#" className="block overflow-hidden rounded-md">
                                <img src={src} alt={`insta-${i}`} className="w-full h-32 object-cover" />
                            </a>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Shop?
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Join thousands of happy parents who trust Blimey for quality and reliability.
                        </p>
                        <button className="px-10 py-4 bg-white text-primary-600 font-bold rounded-lg hover:bg-light-50 transition-all shadow-soft-lg hover:shadow-soft-xl transform hover:scale-105">
                            Explore Collections
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer id="contact" className="bg-light-200 py-16 border-t border-light-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            {/* Brand */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                                <i className="fa-solid fa-baby text-3xl"></i>
                                    <div className="font-architects text-xl text-blue-600 leading-none">
                                        Blimey
                                        <div className="text-xs font-sans text-blue-600 -mt-1">
                                            Baby Shop
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-light-700">
                                    Your trusted partner in providing the best products for your little ones.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="font-bold text-light-900 mb-4">
                                    Shop
                                </h4>
                                <ul className="space-y-2 text-sm text-light-700">
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">Clothing</a></li>
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">Toys</a></li>
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">Feeding</a></li>
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">Nursery</a></li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h4 className="font-bold text-light-900 mb-4">
                                    Support
                                </h4>
                                <ul className="space-y-2 text-sm text-light-700">
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">Contact Us</a></li>
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">FAQ</a></li>
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">Shipping</a></li>
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">Returns</a></li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h4 className="font-bold text-light-900 mb-4">
                                    Legal
                                </h4>
                                <ul className="space-y-2 text-sm text-light-700">
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">Privacy</a></li>
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">Terms</a></li>
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">Cookies</a></li>
                                    <li><a href="#" className="hover:text-primary-500 transition-colors">Accessibility</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="border-t border-light-300 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-light-700">
                                © 2026 Blimey Baby Shop. All rights reserved.
                            </p>
                            <div className="flex gap-4 mt-4 md:mt-0">
                                <a href="#" className="text-light-700 hover:text-primary-500 transition-colors">
                                    Facebook
                                </a>
                                <a href="#" className="text-light-700 hover:text-primary-500 transition-colors">
                                    Instagram
                                </a>
                                <a href="#" className="text-light-700 hover:text-primary-500 transition-colors">
                                    TikTok
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </MainLayout>
        </>
    );
};

export default Landing;

