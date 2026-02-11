import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const Landing = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const categories = [
        {
            id: 1,
            name: 'Clothing',
            iconClass: 'fa-solid fa-tshirt',
            image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc338?w=500&h=500&fit=crop',
        },
        {
            id: 2,
            name: 'Toys & Games',
            iconClass: 'fa-solid fa-puzzle-piece',
            image: 'https://images.unsplash.com/photo-1565110677539-8d5b1b4a7b0a?w=500&h=500&fit=crop',
        },
        {
            id: 3,
            name: 'Feeding',
            iconClass: 'fa-solid fa-bottle-droplet',
            image: 'https://images.unsplash.com/photo-1606777553958-d7221c2c38ac?w=500&h=500&fit=crop',
        },
        {
            id: 4,
            name: 'Nursery',
            iconClass: 'fa-solid fa-bed',
            image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d049?w=500&h=500&fit=crop',
        },
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
    const featuredProducts = [
        { id: 1, name: 'Organic Cotton Onesie', price: '$24', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=800&fit=crop' },
        { id: 2, name: 'Wooden Rattle Toy', price: '$18', image: 'https://images.unsplash.com/photo-1602526433784-0b8f6c0e1a4c?w=800&h=800&fit=crop' },
        { id: 3, name: 'Silicone Bib Set', price: '$15', image: 'https://images.unsplash.com/photo-1604472917789-7d6e6c6d6b1a?w=800&h=800&fit=crop' },
    ];

    const newArrivals = [
        { id: 1, name: 'Monthly Milestone Book', price: '$12', image: 'https://images.unsplash.com/photo-1545060894-3b6f63f9b30b?w=800&h=800&fit=crop' },
        { id: 2, name: 'Mini Plush', price: '$22', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=800&fit=crop' },
    ];

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

            <div className="bg-white min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-50">
                        {/* Socials Strip - Hidden on Mobile */}
                        <div className="hidden md:block bg-light-600 text-white">
                            <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center gap-6">
                                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="TikTok">
                                    <i className="fa-brands fa-tiktok"></i>
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
                                    <i className="fa-brands fa-youtube"></i>
                                </a>
                            </div>
                        </div>

                        {/* Main Header */}
                        <nav className={`transition-all duration-300 ${isScrolled ? 'bg-accent-500 shadow-soft-lg' : 'bg-transparent'}`}>
                            <div className="max-w-7xl mx-auto px-4 py-4">
                                {/* Top Row - Logo & Actions */}
                                <div className="flex items-center justify-between">
                                    {/* Logo */}
                                    <Link href="/" className="flex-shrink-0">
                                        <div className="font-architects text-3xl text-blue-600 leading-none">
                                            Blimey
                                            <div className="text-xs font-sans text-blue-600 -mt-1">Baby Shop</div>
                                        </div>
                                    </Link>

                                    {/* Actions (Account/Cart/Hamburger) */}
                                    <div className="flex items-center gap-4">
                                        <button className="hidden md:flex items-center gap-2 text-light-900 hover:text-primary-600 transition-colors">
                                            <i className="fa-solid fa-user"></i>
                                            <span className="text-sm hidden lg:inline">Account</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-light-900 hover:text-primary-600 transition-colors">
                                            <i className="fa-solid fa-shopping-cart"></i>
                                            <span className="text-sm hidden lg:inline">Cart</span>
                                        </button>

                                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-light-900 hover:text-primary-600 transition-colors" aria-label="Toggle menu">
                                            <i className="fa-solid fa-bars"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Search (mobile-first): full width on small, centered and constrained on lg */}
                                <div className="mt-3 flex justify-center">
                                    <div className="w-full px-4 sm:px-0 max-w-full sm:max-w-xl lg:max-w-2xl">
                                        <form className="flex items-center bg-white border border-light-200 rounded-full shadow-sm overflow-hidden">
                                            <input aria-label="Search" type="text" placeholder="Search products..." className="flex-1 px-4 py-3 text-sm outline-none" />
                                            <button type="submit" className="px-4 py-3 bg-primary-500 text-white rounded-r-full hover:bg-primary-600 transition-colors">
                                                <i className="fa-solid fa-search"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* Spacer between search and nav links */}
                                <div className="mt-6" />

                                {/* Navigation Links - Desktop */}
                                <div className="hidden md:flex justify-center gap-8 mt-4">
                                    {navLinks.map((link) => (
                                        <a key={link.name} href={link.href} className="text-light-900 hover:text-primary-600 transition-colors font-medium text-sm">
                                            {link.name}
                                        </a>
                                    ))}
                                </div>

                                {/* Mobile Menu */}
                                {isMobileMenuOpen && (
                                    <div className="md:hidden mt-4 pb-4 border-t border-light-200">
                                        {navLinks.map((link) => (
                                            <a key={link.name} href={link.href} className="block py-3 text-light-900 hover:text-primary-600 transition-colors font-medium">
                                                {link.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </nav>
                </header>

                {/* Mobile-first Hero */}
                <section id="hero" className="min-h-[60vh] flex flex-col">
                    <div className="h-[55vh] w-full overflow-hidden rounded-b-2xl">
                        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=800&fit=crop" alt="Mom and baby" className="w-full h-full object-cover" />
                    </div>
                    <div className="px-5 py-5 bg-white">
                        <h1 className="text-2xl font-bold mb-2">Everything for Your Little One</h1>
                        <p className="text-sm text-light-700 mb-4">Curated essentials for newborns and parents. Fast shipping & safe materials.</p>
                        <div className="space-y-3">
                            <button className="w-full px-4 py-3 bg-primary-500 text-white rounded-lg font-semibold">Shop Newborn Essentials</button>
                            <button className="w-full px-4 py-3 bg-light-200 text-light-900 rounded-lg">Browse Categories</button>
                        </div>
                    </div>
                </section>

                {/* Quick Category Scroller */}
                <section className="py-4 px-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
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
                    <div className="grid grid-cols-2 gap-4">
                        {navLinks.map((link, idx) => (
                            <a key={link.name} href="#" className="block rounded-xl overflow-hidden shadow-soft-lg">
                                <div className="h-44 bg-gray-100 w-full">
                                    <img src={`https://source.unsplash.com/collection/190727/800x600?sig=${idx}`} alt={link.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-3 bg-white">
                                    <h3 className="font-semibold">{link.name}</h3>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Featured Products - Horizontal Scroll */}
                <section className="px-4 pb-6">
                    <h3 className="text-lg font-bold mb-3 px-1">Popular Right Now</h3>
                    <div className="flex gap-4 overflow-x-auto pb-3 px-1">
                        {featuredProducts.map((p) => (
                            <div key={p.id} className="min-w-[60%] sm:min-w-[40%] bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="h-44 bg-gray-100">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-3">
                                    <h4 className="font-medium text-sm line-clamp-2">{p.name}</h4>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="font-bold">{p.price}</span>
                                        <div className="flex items-center gap-2">
                                            <button className="px-3 py-1 bg-primary-500 text-white rounded-md">Add</button>
                                            <button className="text-light-700"><i className="fa-regular fa-heart"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trust Strip */}
                <section className="px-4 pb-6">
                    <div className="bg-[#fff7ed] rounded-lg p-4 space-y-3">
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
                        {newArrivals.map((p) => (
                            <div key={p.id} className="min-w-[60%] sm:min-w-[40%] bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="h-44 bg-gray-100">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-3">
                                    <h4 className="font-medium text-sm line-clamp-2">{p.name}</h4>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="font-bold">{p.price}</span>
                                        <button className="px-3 py-1 bg-primary-500 text-white rounded-md">Add</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mom Section */}
                <section className="px-4 pb-6">
                    <div className="rounded-lg overflow-hidden bg-white shadow-sm">
                        <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=600&fit=crop" alt="Care for mom" className="w-full h-44 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-bold">Care for Mom Too</h3>
                            <p className="text-sm text-light-700 my-2">Comfortable essentials and self-care items for new mothers.</p>
                            <button className="w-full px-4 py-3 bg-primary-500 text-white rounded-lg">Shop Mommy Essentials</button>
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
            </div>
        </>
    );
};

export default Landing;

