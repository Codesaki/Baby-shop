import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const ProductsReport = ({ top_selling, low_stock, period }) => {
    return (
        <>
            <Head title="Products Report" />
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Products Report</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Selling */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
                        <div className="space-y-3">
                            {top_selling.map((product) => (
                                <div key={product.id} className="p-3 bg-gray-50 rounded">
                                    <p className="font-medium text-gray-900">{product.name}</p>
                                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                                    <p className="text-sm font-semibold text-blue-600 mt-1">Sold: {product.total_quantity} units</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Products</h2>
                        <div className="space-y-3">
                            {low_stock.map((product) => (
                                <div key={product.id} className="p-3 bg-red-50 rounded border border-red-200">
                                    <p className="font-medium text-gray-900">{product.name}</p>
                                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                                    <p className="text-sm font-semibold text-red-600 mt-1">Stock: {product.stock_quantity}/{product.low_stock_threshold}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

ProductsReport.layout = page => <AdminLayout children={page} />;

export default ProductsReport;
