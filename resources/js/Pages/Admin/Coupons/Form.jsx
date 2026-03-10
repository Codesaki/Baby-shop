import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const CouponForm = ({ coupon }) => {
    const { data, setData, post, put, processing } = useForm({
        code: coupon?.code || '',
        discount_type: coupon?.discount_type || 'percentage',
        discount_value: coupon?.discount_value || '',
        minimum_amount: coupon?.minimum_amount || '',
        usage_limit: coupon?.usage_limit || '',
        expiry_date: coupon?.expiry_date || '',
        is_active: coupon?.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (coupon) {
            put(route('admin.marketing.coupons.update', coupon.id), data);
        } else {
            post(route('admin.marketing.coupons.store'), data);
        }
    };

    return (
        <>
            <Head title={coupon ? 'Edit Coupon' : 'Create Coupon'} />
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">{coupon ? 'Edit Coupon' : 'Create New Coupon'}</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                        <input
                            type="text"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            placeholder="e.g. SAVE10"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                            <select
                                value={data.discount_type}
                                onChange={(e) => setData('discount_type', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                            <input
                                type="number"
                                value={data.discount_value}
                                onChange={(e) => setData('discount_value', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                step="0.01"
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (Optional)</label>
                        <input
                            type="number"
                            value={data.minimum_amount}
                            onChange={(e) => setData('minimum_amount', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            step="0.01"
                            min="0"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (Optional)</label>
                            <input
                                type="number"
                                value={data.usage_limit}
                                onChange={(e) => setData('usage_limit', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                                type="datetime-local"
                                value={data.expiry_date}
                                onChange={(e) => setData('expiry_date', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50"
                        >
                            {coupon ? 'Update' : 'Create'} Coupon
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

CouponForm.layout = page => <AdminLayout children={page} />;

export default CouponForm;
