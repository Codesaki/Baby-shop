import { Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const AdminLayout = ({ children }) => {
    const { auth } = usePage().props;
    const [expandedMenu, setExpandedMenu] = useState('catalog');

    const toggleMenu = (menu) => {
        setExpandedMenu(expandedMenu === menu ? null : menu);
    };

    const menuItem = ({ href, label, icon }) => {
        if (!href) return null;
        
        return (
            <Link href={href} className="block px-4 py-2 text-sm rounded hover:bg-gray-700 transition">
                <span className="flex items-center gap-2">
                    {icon && <span className="text-lg">{icon}</span>}
                    {label}
                </span>
            </Link>
        );
    };

    const menuSection = ({ label, children: items, icon }) => (
        <div>
            <button
                onClick={() => toggleMenu(label)}
                className="w-full text-left px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 rounded transition flex items-center justify-between"
            >
                <span className="flex items-center gap-2">
                    {icon && <span className="text-lg">{icon}</span>}
                    {label}
                </span>
                <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${expandedMenu === label ? 'rotate-180' : ''}`}
                />
            </button>
            {expandedMenu === label && (
                <div className="pl-6 space-y-1 bg-gray-900 rounded">
                    {items}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-lg overflow-y-auto">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold">Baby Shop</h1>
                    <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
                </div>

                <nav className="flex-1 px-2 py-4 space-y-3">
                    {/* Dashboard */}
                    <Link
                        href={route('admin.dashboard')}
                        className="block px-4 py-2 rounded hover:bg-gray-700 transition font-semibold text-sm"
                    >
                        📊 Dashboard
                    </Link>

                    {/* Catalog */}
                    {menuSection({
                        label: 'catalog',
                        icon: '📦',
                        children: [
                            <div key="products">{menuItem({ href: route('admin.catalog.products.index'), label: 'Products' })}</div>,
                            <div key="categories">{menuItem({ href: route('admin.catalog.categories.index'), label: 'Categories' })}</div>,
                            <div key="sub-categories">{menuItem({ href: route('admin.catalog.sub-categories.index'), label: 'Sub-Categories' })}</div>,
                        ],
                    })}

                    {/* Orders */}
                    <Link
                        href={route('admin.orders.index')}
                        className="block px-4 py-2 rounded hover:bg-gray-700 transition font-semibold text-sm"
                    >
                        🛒 Orders
                    </Link>

                    {/* Customers */}
                    <Link
                        href={route('admin.customers.index')}
                        className="block px-4 py-2 rounded hover:bg-gray-700 transition font-semibold text-sm"
                    >
                        👥 Customers
                    </Link>

                    {/* Marketing */}
                    {menuSection({
                        label: 'Marketing',
                        icon: '🎯',
                        children: [
                            <div key="coupons">{menuItem({ href: route('admin.marketing.coupons.index'), label: 'Coupons' })}</div>,
                        ],
                    })}

                    {/* Content */}
                    {menuSection({
                        label: 'Content',
                        icon: '📄',
                        children: [
                            <div key="pages">{menuItem({ href: route('admin.content.pages.index'), label: 'Pages' })}</div>,
                            <div key="reviews">{menuItem({ href: route('admin.content.reviews.index'), label: 'Reviews' })}</div>,
                            <div key="messages">{menuItem({ href: route('admin.content.contact-messages.index'), label: 'Messages' })}</div>,
                        ],
                    })}

                    {/* Analytics */}
                    {menuSection({
                        label: 'Analytics',
                        icon: '📈',
                        children: [
                            <div key="sales">{menuItem({ href: route('admin.reports.sales'), label: 'Sales Reports' })}</div>,
                            <div key="products">{menuItem({ href: route('admin.reports.products'), label: 'Product Reports' })}</div>,
                            <div key="customers">{menuItem({ href: route('admin.reports.customers'), label: 'Customer Reports' })}</div>,
                        ],
                    })}

                    {/* Media */}
                    <Link
                        href={route('admin.media.index')}
                        className="block px-4 py-2 rounded hover:bg-gray-700 transition font-semibold text-sm"
                    >
                        🖼️ Media Library
                    </Link>

                    {/* System */}
                    {menuSection({
                        label: 'System',
                        icon: '⚙️',
                        children: [
                            <div key="settings">{menuItem({ href: route('admin.system.settings.index'), label: 'Settings' })}</div>,
                            <div key="admin-users">{menuItem({ href: route('admin.system.admin-users.index'), label: 'Admin Users' })}</div>,
                            <div key="roles">{menuItem({ href: route('admin.system.roles.index'), label: 'Roles' })}</div>,
                            <div key="activity">{menuItem({ href: route('admin.activity-logs.index'), label: 'Activity Logs' })}</div>,
                        ],
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-gray-50 flex flex-col">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <div className="text-gray-600">Menu</div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{auth.user.name}</span>
                        <form method="POST" action={route('logout')}>
                            <button
                                type="submit"
                                className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
