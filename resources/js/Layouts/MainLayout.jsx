import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function MainLayout({ children }) {
    const { auth, cart, flash } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setIsAtTop(currentY === 0);
            setIsScrolled(currentY > 0);

            if (currentY <= 0) {
                setIsNavVisible(true);
            } else if (currentY > lastScrollY) {
                // scrolling down
                setIsNavVisible(false);
            } else {
                // scrolling up
                setIsNavVisible(true);
            }

            setLastScrollY(currentY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navLinks = [
        { name: 'Baby Care', slug: 'baby-care' },
        { name: 'Clothing', slug: 'clothing' },
        { name: 'Feeding', slug: 'feeding' },
        { name: 'Mommy', slug: 'mommy' },
        { name: 'Playtime', slug: 'playtime' },
        { name: 'Travel', slug: 'travel' },
        { name: 'Warmth', slug: 'warmth' },
    ];

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchTerm.trim();
        if (!query) return;

        router.get(
            route('products.search'),
            { q: query },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const accountHref = auth.user ? route('dashboard') : route('login');

    return (
        <div className="bg-white min-h-screen">
            <header className="sticky top-0 z-50">
                {/* Socials Strip - Hidden on Mobile; only at top */}
                {isAtTop && (
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
                )}

                {/* Main Header */}
                <nav
                    className={`transition-all duration-300 transform ${isNavVisible ? 'translate-y-0' : '-translate-y-full'} ${
                        isScrolled ? 'bg-primary-700/95 shadow-soft-lg backdrop-blur-xs' : 'bg-white/80 backdrop-blur-xs border-b border-light-100'
                    }`}
                >
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        {/* Top Row - Logo, Search (desktop), Actions */}
                        <div className="flex items-center justify-between gap-4">
                            {/* Logo */}
                            <Link href={route('landing')} className="flex-shrink-0">
                                <div className="font-architects text-3xl text-primary-500 leading-none">
                                    Blimey
                                    <div className="text-xs font-sans text-primary-500 -mt-1">Baby Shop</div>
                                </div>
                            </Link>

                            {/* Search - desktop only, centered between logo and actions */}
                            <div className="hidden md:flex flex-1 justify-center">
                                <div className="w-full max-w-full sm:max-w-xl lg:max-w-3xl">
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex items-center bg-white/95 border border-light-200 rounded-full shadow-soft overflow-hidden focus-within:ring-2 focus-within:ring-primary-400"
                                    >
                                        <input
                                            aria-label="Search"
                                            type="search"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by product name, category, or use words like 'warm blanket'..."
                                            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
                                        />
                                        <button
                                            type="submit"
                                            className="px-5 py-3 bg-primary-500 text-white rounded-r-full hover:bg-primary-600 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <i className="fa-solid fa-search"></i>
                                            <span className="hidden sm:inline">Search</span>
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Actions (Account/Cart/Hamburger) */}
                            <div className="flex items-center gap-4">
                                <Link href={accountHref} className="hidden md:flex items-center gap-2 text-light-900 hover:text-primary-600 transition-colors">
                                    <i className="fa-solid fa-user"></i>
                                    <span className="text-sm hidden lg:inline">{auth.user ? 'Account' : 'Login'}</span>
                                </Link>
                                <Link href={route('cart.index')} className="flex items-center gap-2 text-light-900 hover:text-primary-600 transition-colors relative">
                                    <i className="fa-solid fa-shopping-cart"></i>
                                    <span className="text-sm hidden lg:inline">Cart</span>
                                    {cart && cart.count > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {cart.count}
                                        </span>
                                    )}
                                </Link>

                                {/* Mobile menu toggle */}
                                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-light-900 hover:text-primary-600 transition-colors" aria-label="Toggle menu">
                                    <i className="fa-solid fa-bars"></i>
                                </button>
                            </div>
                        </div>

                        {/* Search - mobile only, full width below top row */}
                        <div className="mt-3 flex justify-center md:hidden">
                            <div className="w-full px-4">
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="flex items-center bg-white/95 border border-light-200 rounded-full shadow-soft overflow-hidden focus-within:ring-2 focus-within:ring-primary-400"
                                >
                                    <input
                                        aria-label="Search"
                                        type="search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search products..."
                                        className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
                                    />
                                    <button
                                        type="submit"
                                        className="px-5 py-3 bg-primary-500 text-white rounded-r-full hover:bg-primary-600 transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                        <i className="fa-solid fa-search"></i>
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Spacer between search and nav links */}
                        <div className="mt-4 md:mt-6" />

                        {/* Navigation Links - Desktop */}
                        <div className="hidden md:flex justify-center gap-8 mt-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={route('collections.show', link.slug)}
                                    className={`font-medium text-sm pb-1 border-b-2 transition-colors ${
                                        isScrolled
                                            ? 'text-light-50 hover:text-secondary-100 border-transparent hover:border-secondary-200'
                                            : 'text-primary-700 hover:text-primary-800 border-transparent hover:border-primary-300'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu */}
                        {isMobileMenuOpen && (
                            <div className="md:hidden mt-4 pb-4 border-t border-light-200">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={route('collections.show', link.slug)}
                                        className="block py-3 text-light-900 hover:text-primary-600 transition-colors font-medium"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {flash?.cart_success?.product_name && (
                <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3 z-40 shadow-sm">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-emerald-900 text-sm md:text-base">
                            <span className="font-semibold">{flash.cart_success.product_name}</span> added to cart.
                        </p>
                        <Link
                            href={route('cart.index')}
                            className="inline-flex items-center justify-center shrink-0 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-soft"
                        >
                            Go to cart
                            <i className="fa-solid fa-arrow-right ml-2 text-xs" aria-hidden />
                        </Link>
                    </div>
                </div>
            )}

            <main>{children}</main>

            {/* Shared Footer */}
            <footer id="contact" className="bg-light-200 py-16 border-t border-light-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <i className="fa-solid fa-baby text-3xl"></i>
                                <div className="font-architects text-xl text-blue-600 leading-none">
                                    Blimey
                                    <div className="text-xs font-sans text-blue-600 -mt-1">Baby Shop</div>
                                </div>
                            </div>
                            <p className="text-sm text-light-700">Your trusted partner in providing the best products for your little ones.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-light-900 mb-4">Shop</h4>
                            <ul className="space-y-2 text-sm text-light-700">
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Clothing</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Toys</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Feeding</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Nursery</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-light-900 mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-light-700">
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">FAQ</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Shipping</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Returns</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-light-900 mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-light-700">
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Cookies</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Accessibility</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-light-300 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-light-700">© 2026 Blimey Baby Shop. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <a href="#" className="text-light-700 hover:text-primary-500 transition-colors">Facebook</a>
                            <a href="#" className="text-light-700 hover:text-primary-500 transition-colors">Instagram</a>
                            <a href="#" className="text-light-700 hover:text-primary-500 transition-colors">TikTok</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
