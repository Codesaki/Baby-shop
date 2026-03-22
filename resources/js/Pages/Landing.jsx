import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';

/** Funny one-liner per category slug (fallback uses name) */
const categoryPun = (slug, name) => {
    const puns = {
        'baby-care': 'Because babies shouldn’t have to adult yet.',
        clothing: 'Outfit repeat offenders welcome—laundry is tomorrow’s problem.',
        feeding: 'Bottle service: sip happens, burps optional.',
        mommy: 'Self-care isn’t selfish—it’s survival with better moisturizer.',
        playtime: 'Toys so fun, nap time might file a complaint.',
        travel: 'Stroll in style—jet lag sold separately.',
        warmth: 'Cozy level: marshmallow.',
        nursery: 'Where tiny humans and tiny furniture live in harmony.',
        toys: 'Warning: may cause giggles and dramatic plot twists.',
        safety: 'Safety first—second is still cute though.',
    };
    const key = (slug || '').toLowerCase();
    if (puns[key]) return puns[key];
    return `${name}? More like ${name}-tastic—parents get it.`;
};

const categoryTitleClass = (index) => {
    const styles = [
        'font-playfair text-3xl md:text-4xl italic text-primary-800',
        'text-2xl md:text-3xl font-black tracking-tight uppercase text-primary-700',
        'text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent',
        'font-architects text-3xl md:text-4xl text-primary-800',
        'text-2xl md:text-3xl font-serif border-b-4 border-primary-400 inline-block pb-1 text-primary-900',
    ];
    return styles[index % styles.length];
};

const ctaGradientClass = (preset) => {
    switch (preset) {
        case 'secondary-primary':
            return 'bg-gradient-to-r from-secondary-500 to-primary-600';
        case 'primary-dark':
            return 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900';
        case 'primary-secondary':
        default:
            return 'bg-gradient-to-r from-primary-500 to-secondary-500';
    }
};

function CategoryShowcaseSection({ cat, styleIndex, navigate, addToCartQuick }) {
    const pun = categoryPun(cat.slug, cat.name);
    const products = cat.products || [];

    return (
        <section className="px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                    <div>
                        <h2 className={`${categoryTitleClass(styleIndex)} mb-2`}>{cat.name}</h2>
                        <p className="text-sm md:text-base text-light-600 max-w-2xl italic">&ldquo;{pun}&rdquo;</p>
                    </div>
                    <Link
                        href={route('categories.show', cat.slug)}
                        className="text-sm font-semibold text-primary-600 hover:text-primary-800 whitespace-nowrap"
                    >
                        Shop all in {cat.name} →
                    </Link>
                </div>

                {products.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
                        {products.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => navigate(p.slug)}
                                className="cursor-pointer block min-w-[60%] sm:min-w-[40%] lg:min-w-0 lg:w-full bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-soft-lg transition-shadow"
                            >
                                <div className="h-44 md:h-52 bg-gray-100">
                                    <img
                                        src={p.images && p.images.length ? `/storage/${p.images[0].image_path}` : ''}
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-3 md:p-4">
                                    <h4 className="font-medium text-sm md:text-base line-clamp-2">{p.name}</h4>
                                    <p className="text-xs md:text-sm text-light-700 line-clamp-2 mt-1">{p.short_description}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="font-bold text-primary-600">
                                            {p.discount_price ? (
                                                <>
                                                    <span className="text-red-600">Ksh {(p.price - p.discount_price).toFixed(2)}</span>
                                                    <span className="text-gray-500 line-through text-sm ml-2">Ksh {p.price}</span>
                                                </>
                                            ) : (
                                                <span>Ksh {p.price || '—'}</span>
                                            )}
                                        </span>
                                        <div className="flex gap-2">
                                            <Link
                                                href={route('products.show', p.slug)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-3 py-1 bg-primary-500 text-white rounded-md text-sm"
                                            >
                                                View
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    addToCartQuick(p.id);
                                                }}
                                                className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-light-300 bg-light-50 py-12 text-center text-light-600">
                        No products in this category yet—check back soon.
                    </div>
                )}
            </div>
        </section>
    );
}

/** Admin-defined landing CTAs; carousel auto-advances every 30s when multiple */
function LandingCtaCarousel({ ctas }) {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (!ctas || ctas.length <= 1) return undefined;
        const timer = setInterval(() => {
            setIdx((i) => (i + 1) % ctas.length);
        }, 30000);
        return () => clearInterval(timer);
    }, [ctas]);

    if (!ctas || ctas.length === 0) {
        return (
            <section className="px-4 py-16">
                <div
                    className={`max-w-5xl mx-auto rounded-2xl min-h-[280px] md:min-h-[320px] flex flex-col items-center justify-center text-center px-6 ${ctaGradientClass('primary-secondary')}`}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to shop?</h2>
                    <p className="text-lg text-white/90 mb-8 max-w-xl">Join happy parents who trust Blimey.</p>
                    <Link
                        href={route('landing')}
                        className="px-10 py-4 bg-white text-primary-600 font-bold rounded-lg shadow-soft-lg hover:bg-light-50"
                    >
                        Explore collections
                    </Link>
                </div>
            </section>
        );
    }

    const c = ctas[idx];
    const bgStyle = c.background_image
        ? { backgroundImage: `linear-gradient(rgba(15,23,42,0.65),rgba(15,23,42,0.5)), url(${c.background_image})` }
        : {};

    return (
        <section className="px-4 py-16">
            <div
                className={`max-w-5xl mx-auto rounded-2xl min-h-[280px] md:min-h-[320px] flex flex-col items-center justify-center text-center px-6 md:px-12 relative overflow-hidden bg-cover bg-center ${!c.background_image ? ctaGradientClass(c.gradient_preset) : ''}`}
                style={bgStyle}
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">{c.headline}</h2>
                {c.tagline && <p className="text-lg md:text-xl text-white/95 font-medium mb-3 drop-shadow">{c.tagline}</p>}
                {c.body_text && <p className="text-sm md:text-base text-white/85 max-w-2xl mb-6 drop-shadow">{c.body_text}</p>}
                <a
                    href={c.button_url || '#'}
                    className="px-10 py-4 bg-white text-primary-600 font-bold rounded-lg shadow-soft-lg hover:bg-light-50 transition-transform hover:scale-[1.02]"
                >
                    {c.button_label}
                </a>
                {ctas.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {ctas.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIdx(i)}
                                className={`h-2 rounded-full transition-all ${i === idx ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

const Landing = ({ featuredProducts, newArrivals, popularProducts, categories, categoryShowcases = [], landingCtas = [] }) => {
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
        { name: 'Baby Care', slug: 'baby-care' },
        { name: 'Clothing', slug: 'clothing' },
        { name: 'Feeding', slug: 'feeding' },
        { name: 'Mommy', slug: 'mommy' },
        { name: 'Playtime', slug: 'playtime' },
        { name: 'Travel', slug: 'travel' },
        { name: 'Warmth', slug: 'warmth' },
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

    const firstThreeCategories = (categoryShowcases || []).slice(0, 3);
    const restCategories = (categoryShowcases || []).slice(3);

    return (
        <>
            <Head title="Welcome to Blimey Baby Shop" />

            <MainLayout>
                {/* Hero */}
                <section id="hero" className="min-h-[60vh] flex flex-col">
                    <div className="relative h-[65vh] w-full overflow-hidden rounded-b-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=800&fit=crop"
                            alt="Mom and baby"
                            className="w-full h-full object-cover"
                        />

                        {/* Hero content - over image on md+, stacked below on mobile */}
                        <div className="absolute inset-0 hidden md:flex items-center">
                            <div className="h-full w-1/2 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <div className="ml-8 lg:ml-16 max-w-md text-white space-y-4">
                                    <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                                        Everything for Your Little One
                                    </h1>
                                    <p className="text-sm lg:text-base text-white/90">
                                        Curated essentials for newborns and parents. Fast shipping &amp; safe materials.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button className="px-5 py-3 bg-primary-500 text-white rounded-lg font-semibold shadow-soft-lg">
                                            Shop Newborn Essentials
                                        </button>
                                        <button className="px-5 py-3 bg-white/90 text-primary-700 rounded-lg font-semibold">
                                            Browse Categories
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile hero content below image */}
                    <div className="px-5 py-5 bg-white md:hidden">
                        <h1 className="text-2xl font-bold mb-2">Everything for Your Little One</h1>
                        <p className="text-sm text-light-700 mb-4">
                            Curated essentials for newborns and parents. Fast shipping &amp; safe materials.
                        </p>
                        <div className="space-y-3">
                            <button className="w-full px-4 py-3 bg-primary-500 text-white rounded-lg font-semibold">
                                Shop Newborn Essentials
                            </button>
                            <button className="w-full px-4 py-3 bg-light-200 text-light-900 rounded-lg">Browse Categories</button>
                        </div>
                    </div>
                </section>

                {/* Quick Category Scroller */}
                <section className="py-4 px-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:justify-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={route('collections.show', link.slug)}
                                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white border border-light-200 rounded-full shadow-soft hover:border-primary-300 hover:bg-primary-50 transition-colors"
                            >
                                <i className="fa-solid fa-circle-dot text-primary-500"></i>
                                <span className="text-sm font-medium">{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Category Grid (2 columns) */}
                <section className="px-4 pb-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            {categories && categories.length > 0 ? categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={route('categories.show', category.slug)}
                                    className="block rounded-xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-shadow bg-white"
                                >
                                    <div className="h-40 md:h-48 bg-gradient-to-br from-primary-50 to-secondary-50 w-full flex items-center justify-center">
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
                    </div>
                </section>

                {/* Featured Products - Mobile horizontal, desktop grid */}
                <section className="px-4 pb-6">
                    <div className="max-w-7xl mx-auto">
                        <h3 className="text-lg font-bold mb-3 px-1">Popular Right Now</h3>
                        {featuredProductsData.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-3 px-1 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
                                {featuredProductsData.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => navigate(p.slug)}
                                        className="cursor-pointer block min-w-[60%] sm:min-w-[40%] lg:min-w-0 lg:w-full bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-soft-lg transition-shadow"
                                    >
                                        <div className="h-44 md:h-52 bg-gray-100">
                                            <img src={p.images && p.images.length ? `/storage/${p.images[0].image_path}` : ''} alt={p.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-3 md:p-4">
                                            <h4 className="font-medium text-sm md:text-base line-clamp-2">{p.name}</h4>
                                            <p className="text-xs md:text-sm text-light-700 line-clamp-2 mt-1">{p.short_description}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <span className="font-bold text-primary-600">
                                                    {p.discount_price ? (
                                                        <>
                                                            <span className="text-red-600">Ksh {(p.price - p.discount_price).toFixed(2)}</span>
                                                            <span className="text-gray-500 line-through text-sm ml-2">Ksh {p.price}</span>
                                                        </>
                                                    ) : (
                                                        <span>Ksh {p.price || 'Price TBD'}</span>
                                                    )}
                                                </span>
                                                <div className="flex gap-2">
                                                    <Link href={route('products.show', p.slug)} className="px-3 py-1 bg-primary-500 text-white rounded-md text-sm">
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            addToCartQuick(p.id);
                                                        }}
                                                        className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full text-center py-8 text-light-700">No featured products available yet</div>
                        )}
                    </div>
                </section>

                {/* Trust Strip */}
                <section className="px-4 pb-10">
                    <div className="bg-primary-50 rounded-2xl px-4 py-6 md:px-8 md:py-10 space-y-6 md:space-y-0 md:flex md:items-stretch md:justify-center md:gap-10 max-w-6xl mx-auto">
                        <div className="flex-1 flex items-start gap-3">
                            <i className="fa-solid fa-shield-halved text-primary-500 mt-1"></i>
                            <div>
                                <div className="font-semibold">Safe for babies</div>
                                <div className="text-sm text-light-700">Carefully tested, non-toxic materials</div>
                            </div>
                        </div>
                        <div className="flex-1 flex items-start gap-3">
                            <i className="fa-solid fa-truck-fast text-primary-500 mt-1"></i>
                            <div>
                                <div className="font-semibold">Fast delivery</div>
                                <div className="text-sm text-light-700">Quick shipping options available</div>
                            </div>
                        </div>
                        <div className="flex-1 flex items-start gap-3">
                            <i className="fa-solid fa-award text-primary-500 mt-1"></i>
                            <div>
                                <div className="font-semibold">Quality products</div>
                                <div className="text-sm text-light-700">Trusted brands and curated selection</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* New Arrivals (mobile horizontal, desktop grid) */}
                <section className="px-4 pb-10">
                    <div className="max-w-7xl mx-auto">
                        <h3 className="text-lg font-bold mb-3 px-1">New Arrivals</h3>
                        {newArrivalsData.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-3 px-1 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
                                {newArrivals.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => navigate(p.slug)}
                                        className="block min-w-[60%] sm:min-w-[40%] lg:min-w-0 lg:w-full bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-soft-lg transition-shadow cursor-pointer"
                                    >
                                        <div className="h-44 md:h-52 bg-gray-100">
                                            <img src={p.images && p.images.length ? `/storage/${p.images[0].image_path}` : ''} alt={p.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-3 md:p-4">
                                            <h4 className="font-medium text-sm md:text-base line-clamp-2">{p.name}</h4>
                                            <p className="text-xs md:text-sm text-light-700 line-clamp-1 mt-1">{p.short_description}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <span className="font-bold text-primary-600">
                                                    {p.discount_price ? (
                                                        <>
                                                            <span className="text-red-600">Ksh {(p.price - p.discount_price).toFixed(2)}</span>
                                                            <span className="text-gray-500 line-through text-sm ml-2">Ksh {p.price}</span>
                                                        </>
                                                    ) : (
                                                        <span>Ksh {p.price || 'Price TBD'}</span>
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
                                ))}
                            </div>
                        ) : (
                            <div className="w-full text-center py-8 text-light-700">No products available</div>
                        )}
                    </div>
                </section>

                {/* Mommy Essentials + Bundles (stacked on mobile, side-by-side on lg) */}
                <section className="px-4 pb-10">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Mom Section */}
                        <div className="rounded-2xl overflow-hidden bg-white shadow-soft-lg md:flex md:h-[320px] lg:h-[360px]">
                            <div className="md:w-1/2 h-56 md:h-full">
                                <img
                                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=800&fit=crop"
                                    alt="Care for mom"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-3">Care for Mom Too</h3>
                                <p className="text-sm md:text-base text-light-700 mb-4">
                                    Comfortable essentials, self-care items, and thoughtful gifts for new mothers.
                                </p>
                                <button className="inline-flex justify-center px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 self-start">
                                    Shop Mommy Essentials
                                </button>
                            </div>
                        </div>

                        {/* Bundles / Deals */}
                        <div className="rounded-2xl bg-white shadow-soft-lg p-5 md:p-6 lg:p-8 flex flex-col">
                            <h3 className="text-lg font-bold mb-4">Bundles & Deals</h3>
                            <div className="space-y-4 flex-1">
                                <div className="rounded-xl border border-light-100 overflow-hidden md:flex md:h-44">
                                    <div className="md:w-2/5 h-40 md:h-full">
                                        <img
                                            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop"
                                            alt="bundle"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4 md:p-5 flex-1 flex flex-col justify-center">
                                        <div className="font-semibold text-lg">Newborn Starter Pack</div>
                                        <div className="text-sm text-light-700 mt-1">Curated essentials for the first weeks at home.</div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-primary-600 font-bold text-lg">$79</span>
                                            <button className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm hover:bg-primary-600">
                                                Get Bundle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Link
                                    href={route('collections.show', 'baby-care')}
                                    className="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-800"
                                >
                                    Browse more bundles
                                    <i className="fa-solid fa-arrow-right ml-2 text-xs" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Email Signup */}
                <section className="px-4 pb-10">
                    <div className="max-w-md mx-auto bg-white rounded-xl p-5 shadow-soft">
                        <h4 className="font-bold mb-2 text-center">Join our mailing list</h4>
                        <p className="text-xs text-light-600 mb-3 text-center">
                            Be the first to know about new arrivals, offers, and parenting tips.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 border border-light-200 rounded-md px-3 py-2 text-sm"
                            />
                            <button className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </section>

                {/* Instagram Grid */}
                <section className="px-4 pb-12">
                    <div className="max-w-5xl mx-auto">
                        <h3 className="text-lg font-bold mb-4">From Instagram</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {instagramImages.slice(0, 8).map((src, i) => (
                                <a key={i} href="#" className="block overflow-hidden rounded-lg">
                                    <div className="aspect-square">
                                        <img src={src} alt={`insta-${i}`} className="w-full h-full object-cover" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Top categories by product count (max 5): first 3, then CTA, then remainder */}
                {firstThreeCategories.map((cat, i) => (
                    <CategoryShowcaseSection
                        key={cat.id}
                        cat={cat}
                        styleIndex={i}
                        navigate={navigate}
                        addToCartQuick={addToCartQuick}
                    />
                ))}

                <LandingCtaCarousel ctas={landingCtas} />

                {restCategories.map((cat, i) => (
                    <CategoryShowcaseSection
                        key={cat.id}
                        cat={cat}
                        styleIndex={i + 3}
                        navigate={navigate}
                        addToCartQuick={addToCartQuick}
                    />
                ))}

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

