import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Transactions({ payments }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
        }).format(amount);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-blue-100 text-blue-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <MainLayout>
            <Head title="Transaction History - Baby Shop" />

            <div className="min-h-screen bg-light-50">
                {/* Header */}
                <div className="bg-white shadow-soft-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm text-light-600">
                            <Link href={route('landing')} className="hover:text-primary-600">Home</Link>
                            <span>/</span>
                            <Link href={route('dashboard')} className="hover:text-primary-600">My Account</Link>
                            <span>/</span>
                            <span className="text-light-900 font-medium">Transactions</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-light-900 mt-2">Transaction History</h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {payments.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-soft-sm p-8 text-center">
                            <svg className="w-16 h-16 text-light-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <h3 className="text-lg font-semibold text-light-900 mb-2">No transactions yet</h3>
                            <p className="text-light-600 mb-4">Your payment history will appear here</p>
                            <Link href={route('landing')} className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-soft-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-light-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-light-500 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-light-500 uppercase tracking-wider">
                                                Method
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-light-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-light-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-light-500 uppercase tracking-wider">
                                                Reference
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-light-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-light-200">
                                        {payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-light-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        href={route('orders.show', payment.order.id)}
                                                        className="text-primary-600 hover:text-primary-800 font-medium"
                                                    >
                                                        {payment.order.order_number}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-light-900 capitalize">
                                                    {payment.payment_method}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-light-900">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-light-500">
                                                    {payment.transaction_reference || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-light-500">
                                                    {new Date(payment.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}