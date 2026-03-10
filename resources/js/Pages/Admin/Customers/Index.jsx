import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const CustomersIndex = ({ customers, filters }) => {
    const [search, setSearch] = useState(filters?.search || '');
    const { get } = useForm();

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.customers.index'), { search });
    };

    return (
        <>
            <Head title="Customers" />
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Customers</h1>

                <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Orders</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Spent</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {customers.data.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                                    <td className="px-6 py-4 text-gray-900">{customer.orders_count}</td>
                                    <td className="px-6 py-4 font-semibold">${customer.total_spent.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{customer.created_at}</td>
                                    <td className="px-6 py-4">
                                        <Link href={route('admin.customers.show', customer.id)} className="text-blue-600 hover:text-blue-700">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

CustomersIndex.layout = page => <AdminLayout children={page} />;

export default CustomersIndex;
