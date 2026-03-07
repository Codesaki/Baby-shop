import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function MainLayout({ children }) {
    const { auth, cart } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
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

    const accountHref = auth.user ? route('dashboard') : route('login');

    return (
        <div className="bg-white min-h-screen">
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

            <main>{children}</main>
        </div>
    );
}
