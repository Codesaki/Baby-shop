import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const CouponsIndex = ({ coupons, filters }) => {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const { get } = useForm();

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.marketing.coupons.index'), { search, status });
    };

    return (
        <>
            <Head title="Coupons" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Coupons & Discounts</h1>
                    <Link
                        href={route('admin.marketing.coupons.create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                        + New Coupon
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Search coupon code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded"
                        />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Filter
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usage</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Expires</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {coupons.data.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-900">{coupon.code}</td>
                                    <td className="px-6 py-4 text-gray-600">{coupon.discount_type === 'percentage' ? '%' : '$'}</td>
                                    <td className="px-6 py-4 font-semibold">{coupon.discount_value}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {coupon.used_count}/{coupon.usage_limit || 'Unlimited'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{coupon.expiry_date || 'Never'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={route('admin.marketing.coupons.edit', coupon.id)} className="text-blue-600 hover:text-blue-700">
                                            Edit
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

CouponsIndex.layout = page => <AdminLayout children={page} />;

export default CouponsIndex;
