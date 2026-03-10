import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const Settings = ({ settings }) => {
    const { data, setData, patch, processing } = useForm(settings);

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.system.settings.update'));
    };

    return (
        <>
            <Head title="Settings" />
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                <input
                                    type="text"
                                    value={data.store_name || ''}
                                    onChange={(e) => setData('store_name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                                <input
                                    type="email"
                                    value={data.store_email || ''}
                                    onChange={(e) => setData('store_email', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Shipping</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <input
                                    type="text"
                                    value={data.currency || 'USD'}
                                    onChange={(e) => setData('currency', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    placeholder="USD"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                                <input
                                    type="number"
                                    value={data.tax_rate || 0}
                                    onChange={(e) => setData('tax_rate', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Fee</label>
                                <input
                                    type="number"
                                    value={data.shipping_fee || 0}
                                    onChange={(e) => setData('shipping_fee', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Over</label>
                                <input
                                    type="number"
                                    value={data.shipping_fee_free_over || 0}
                                    onChange={(e) => setData('shipping_fee_free_over', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Integration</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa API Key</label>
                                <input
                                    type="password"
                                    value={data.mpesa_api_key || ''}
                                    onChange={(e) => setData('mpesa_api_key', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Merchant Code</label>
                                <input
                                    type="text"
                                    value={data.mpesa_merchant_code || ''}
                                    onChange={(e) => setData('mpesa_merchant_code', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                        Save Settings
                    </button>
                </form>
            </div>
        </>
    );
};

Settings.layout = page => <AdminLayout children={page} />;

export default Settings;
