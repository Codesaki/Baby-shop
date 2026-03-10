import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const CustomersReport = ({ top_customers, repeat_buyers }) => {
    return (
        <>
            <Head title="Customers Report" />
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Customers Report</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Customers */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Spending</h2>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Name</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Total Spent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {top_customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td className="px-3 py-2 text-gray-900">{customer.name}</td>
                                        <td className="px-3 py-2 font-semibold">${customer.total_spent.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Repeat Buyers */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Repeat Buyers</h2>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Name</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Orders</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {repeat_buyers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td className="px-3 py-2 text-gray-900">{customer.name}</td>
                                        <td className="px-3 py-2 font-semibold">{customer.order_count}</td>
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

CustomersReport.layout = page => <AdminLayout children={page} />;

export default CustomersReport;
