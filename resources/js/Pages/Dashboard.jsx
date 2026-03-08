import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <MainLayout>
            <Head title="My Account - Baby Shop" />

            <div className="min-h-screen bg-light-50">
                {/* Header */}
                <div className="bg-white shadow-soft-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm text-light-600">
                            <Link href={route('landing')} className="hover:text-primary-600">Home</Link>
                            <span>/</span>
                            <span className="text-light-900 font-medium">My Account</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-light-900 mt-2">My Account</h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Orders */}
                        <Link href={route('orders.index')} className="bg-white rounded-xl shadow-soft-sm p-6 hover:shadow-soft-md transition-shadow">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-light-900">My Orders</h3>
                                    <p className="text-sm text-light-600">View and track your orders</p>
                                </div>
                            </div>
                        </Link>

                        {/* Wishlist */}
                        <Link href={route('wishlist.index')} className="bg-white rounded-xl shadow-soft-sm p-6 hover:shadow-soft-md transition-shadow">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-light-900">Wishlist</h3>
                                    <p className="text-sm text-light-600">Your saved items</p>
                                </div>
                            </div>
                        </Link>

                        {/* Profile */}
                        <Link href={route('profile.edit')} className="bg-white rounded-xl shadow-soft-sm p-6 hover:shadow-soft-md transition-shadow">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-light-900">Profile</h3>
                                    <p className="text-sm text-light-600">Manage your account</p>
                                </div>
                            </div>
                        </Link>

                        {/* Transactions */}
                        <Link href={route('transactions.index')} className="bg-white rounded-xl shadow-soft-sm p-6 hover:shadow-soft-md transition-shadow">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-light-900">Transactions</h3>
                                    <p className="text-sm text-light-600">Payment history</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Orders */}
                    <div className="mt-8">
                        <div className="bg-white rounded-xl shadow-soft-sm p-6">
                            <h3 className="text-lg font-semibold text-light-900 mb-4">Recent Orders</h3>
                            <p className="text-sm text-light-600">No recent orders</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
