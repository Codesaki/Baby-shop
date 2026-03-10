import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

const CustomerShow = ({ customer, orders, addresses, total_spent, total_orders }) => {
    return (
        <>
            <Head title={`Customer: ${customer.name}`} />
            <div className="space-y-6">
                <Link href={route('admin.customers.index')} className="text-blue-600 hover:text-blue-700">
                    ← Back to Customers
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Info</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Name</p>
                                <p className="text-lg font-semibold text-gray-900">{customer.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="text-gray-900">{customer.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="text-gray-900">{customer.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Member Since</p>
                                <p className="text-gray-900">{customer.created_at}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">{total_orders}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Spent</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">${total_spent.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Addresses</h2>
                        <div className="space-y-3">
                            {addresses.map((addr) => (
                                <div key={addr.id} className="p-3 bg-gray-50 rounded border">
                                    <p className="font-semibold text-sm text-gray-800">{addr.type.toUpperCase()}</p>
                                    <p className="text-xs text-gray-600 mt-1">{addr.street}</p>
                                    <p className="text-xs text-gray-600">{addr.city}, {addr.state} {addr.postal_code}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order History</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Order #</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Amount</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-4 py-2 text-blue-600 font-medium">{order.order_number}</td>
                                        <td className="px-4 py-2">${order.total_amount.toFixed(2)}</td>
                                        <td className="px-4 py-2">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-gray-600">{order.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

CustomerShow.layout = page => <AdminLayout children={page} />;

export default CustomerShow;
