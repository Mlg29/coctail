import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const Dashboard = () => {
    const [payments, setPayments] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');


    const samplePayments = [
        {
            id: 'CBQ_001',
            amount: 25000,
            status: 'completed',
            date: '2024-12-01T14:30:00Z',
            customer: 'John Doe',
            email: 'john@example.com',
            tickets: 1,
            event: 'Cocktail & BBQ Party'
        },
        {
            id: 'CBQ_002',
            amount: 50000,
            status: 'completed',
            date: '2024-12-01T15:45:00Z',
            customer: 'Sarah Wilson',
            email: 'sarah@example.com',
            tickets: 2,
            event: 'Cocktail & BBQ Party'
        },
        {
            id: 'CBQ_003',
            amount: 25000,
            status: 'pending',
            date: '2024-12-02T09:15:00Z',
            customer: 'Mike Johnson',
            email: 'mike@example.com',
            tickets: 1,
            event: 'Cocktail & BBQ Party'
        },
        {
            id: 'CBQ_004',
            amount: 75000,
            status: 'completed',
            date: '2024-12-02T11:20:00Z',
            customer: 'Emily Davis',
            email: 'emily@example.com',
            tickets: 3,
            event: 'Cocktail & BBQ Party'
        },
        {
            id: 'CBQ_005',
            amount: 25000,
            status: 'failed',
            date: '2024-12-02T16:50:00Z',
            customer: 'David Brown',
            email: 'david@example.com',
            tickets: 1,
            event: 'Cocktail & BBQ Party'
        },
        {
            id: 'CBQ_006',
            amount: 50000,
            status: 'completed',
            date: '2024-12-03T10:05:00Z',
            customer: 'Lisa Anderson',
            email: 'lisa@example.com',
            tickets: 2,
            event: 'Cocktail & BBQ Party'
        }
    ];

    useEffect(() => {

        const fetchPayments = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setPayments(samplePayments);
            setLoading(false);
        };

        fetchPayments();
    }, []);


    const filteredPayments = payments.filter((payment: any) => {
        const matchesFilter = filter === 'all' || payment.status === filter;
        const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });


    const stats = {
        total: payments.length,
        completed: payments.filter((p: any) => p.status === 'completed').length,
        pending: payments.filter((p: any) => p.status === 'pending').length,
        failed: payments.filter((p: any) => p.status === 'failed').length,
        totalRevenue: payments.filter((p: any) => p.status === 'completed').reduce((sum: any, p: any) => sum + p.amount, 0)
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            completed: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Completed' },
            pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
            failed: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Failed' }
        } as any;

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', label: status };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-200 rounded mb-4"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className='flex justify-between items-center'>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            Payment Dashboard
                        </h1>
                        <button
                            onClick={handleSignOut}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Sign Out
                        </button>
                    </div>
                    <p className="text-gray-600">
                        Manage and monitor all ticket payments for Cocktail & BBQ Party
                    </p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-purple-600 mt-1">
                                    {formatCurrency(stats.totalRevenue)}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        <div className="flex flex-wrap gap-2">
                            {['all', 'completed', 'pending', 'failed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === status
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full lg:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search payments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
                    </div>

                    {filteredPayments.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500 text-lg">No payments found</p>
                            <p className="text-gray-400 text-sm mt-1">
                                {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter' : 'No payments have been made yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPayments.map((payment: any) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                                                    <div className="text-sm text-gray-500">{payment.event}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{payment.customer}</div>
                                                    <div className="text-sm text-gray-500">{payment.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {formatCurrency(payment.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {payment.tickets} {payment.tickets === 1 ? 'ticket' : 'tickets'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(payment.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(payment.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>


                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Showing {filteredPayments.length} of {payments.length} payments
                        {filter !== 'all' && ` • Filtered by ${filter}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;