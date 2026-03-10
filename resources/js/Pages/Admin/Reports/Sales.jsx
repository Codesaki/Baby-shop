import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const SalesReport = ({ report, daily_sales, start_date, end_date }) => {
    const [sd, setSd] = useState(start_date);
    const [ed, setEd] = useState(end_date);
    const { get } = useForm();

    const handleDateChange = (e) => {
        e.preventDefault();
        get(route('admin.reports.sales'), {
            start_date: sd,
            end_date: ed,
        });
    };

    return (
        <>
            <Head title="Sales Report" />
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>

                <form onSubmit={handleDateChange} className="bg-white rounded-lg shadow p-4">
                    <div className="flex gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                            <input
                                type="date"
                                value={sd}
                                onChange={(e) => setSd(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                            <input
                                type="date"
                                value={ed}
                                onChange={(e) => setEd(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded"
                            />
                        </div>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Generate Report
                        </button>
                    </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-600">Total Sales</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">${report.total_sales.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{report.total_orders}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-600">Avg Order Value</p>
                        <p className="text-3xl font-bold text-purple-600 mt-2">${report.average_order_value}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Sales</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Orders</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {daily_sales.map((day, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-2 text-gray-900">{day.date}</td>
                                        <td className="px-4 py-2 text-gray-600">{day.order_count}</td>
                                        <td className="px-4 py-2 font-semibold">${day.total.toFixed(2)}</td>
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

SalesReport.layout = page => <AdminLayout children={page} />;

export default SalesReport;
