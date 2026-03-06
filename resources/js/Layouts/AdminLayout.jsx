import { Link, usePage } from '@inertiajs/react';
import React from 'react';

const AdminLayout = ({ children }) => {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen flex">
            {/* sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold">Admin</div>
                <nav className="flex-1 px-2 space-y-2">
                    <Link href={route('admin.dashboard')} className="block px-3 py-2 rounded hover:bg-gray-700">Dashboard</Link>
                    <Link href={route('admin.products.index')} className="block px-3 py-2 rounded hover:bg-gray-700">Products</Link>
                    <Link href={route('admin.categories.index')} className="block px-3 py-2 rounded hover:bg-gray-700">Categories</Link>
                    <Link href={route('admin.sub-categories.index')} className="block px-3 py-2 rounded hover:bg-gray-700">Sub-Categories</Link>
                    {/* future: users etc.*/}
                </nav>
            </aside>
            <div className="flex-1 bg-gray-100 flex flex-col">
                {/* topbar */}
                <header className="bg-white shadow p-4 flex justify-end items-center">
                    <div className="mr-4">{auth.user.name}</div>
                    <form method="POST" action={route('logout')}>
                        <button type="submit" className="text-sm text-red-600">Logout</button>
                    </form>
                </header>
                <main className="p-6 flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
