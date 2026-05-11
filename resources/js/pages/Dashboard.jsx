import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { TrendingUp, Users, Wallet, CreditCard } from 'lucide-react';
import PremiumFeed from '../components/PremiumFeed';


const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="nexa-card p-6 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl group-hover:bg-gold-500/20 transition-all" />
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-xl bg-gold-900/30 text-gold-400 border border-gold-800/30 shadow-inner shadow-gold-500/10`}>
                <Icon size={24} />
            </div>
            <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">{title}</span>
        </div>
        <h3 className="text-3xl font-bold text-white relative z-10">${value || '0'}</h3>
        <p className="mt-2 text-[10px] text-slate-400 font-bold tracking-wider relative z-10">
            <span className="text-gold-400">+12.5%</span> from last week
        </p>
    </div>
);

const SkeletonLoader = () => (
    <div className="space-y-8 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="nexa-card p-6 h-36 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-500/10 to-transparent animate-[shimmer_1.5s_infinite]" />
                    <div className="w-12 h-12 bg-gold-900/50 rounded-xl mb-4" />
                    <div className="w-24 h-6 bg-gold-900/50 rounded-md mb-2" />
                    <div className="w-16 h-4 bg-gold-900/50 rounded-md" />
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 nexa-card p-6 h-80 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-500/10 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="lg:col-span-2 nexa-card p-6 h-80 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-500/10 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="lg:col-span-1 nexa-card p-6 h-80 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-500/10 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard');
            setData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const chartOptions = {
        chart: {
            toolbar: { show: false },
            sparkline: { enabled: false },
            background: 'transparent'
        },
        colors: ['#b8860b', '#e6ac00', '#ffc41a', '#ffd24d', '#ffefb3'],
        labels: data?.income_by_type?.map(i => i.type.charAt(0).toUpperCase() + i.type.slice(1)) || [],
        theme: { mode: 'dark' },
        stroke: { width: 0 },
        legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
        dataLabels: {
            style: { colors: ['#000'] }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        name: { color: '#94a3b8' },
                        value: { color: '#fff' },
                        total: { show: true, color: '#e6ac00' }
                    }
                }
            }
        }
    };

    if (loading) return <SkeletonLoader />;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-widest italic">Dashboard Overview</h1>
                    <p className="text-xs text-gold-500 font-bold uppercase tracking-widest">Track your digital wealth</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Balance" value={data?.stats?.balance} icon={Wallet} />
                <StatCard title="Total Earnings" value={data?.stats?.total_earned} icon={TrendingUp} />
                <StatCard title="Total Referrals" value={data?.stats?.total_referrals} icon={Users} />
                <StatCard title="Active Package" value={data?.stats?.active_package} icon={CreditCard} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Income Distribution Chart */}
                <div className="lg:col-span-1 nexa-card p-6 h-fit">
                    <h3 className="text-sm font-bold mb-6 text-white uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gold-500" />
                        Income Distribution
                    </h3>
                    <Chart
                        options={chartOptions}
                        series={data?.income_by_type?.map(i => parseFloat(i.total)) || []}
                        type="donut"
                        height={350}
                    />
                </div>

                {/* Recent Transactions */}
                <div className="lg:col-span-2 nexa-card p-6 h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gold-500" />
                            Recent Transactions
                        </h3>
                        <button className="text-[10px] text-gold-500 hover:text-gold-400 font-bold uppercase tracking-widest border border-gold-800/50 px-3 py-1 rounded-full bg-gold-900/20">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gold-600 text-[10px] font-bold uppercase tracking-widest border-b border-gold-900/50">
                                    <th className="pb-4">Description</th>
                                    <th className="pb-4">Type</th>
                                    <th className="pb-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {data?.recent_transactions?.map((tx) => (
                                    <tr key={tx.id} className="border-b border-gold-900/20 hover:bg-gold-900/10 transition-colors group">
                                        <td className="py-4">
                                            <p className="text-slate-300 font-medium">{tx.description}</p>
                                            <p className="text-[10px] text-slate-500 mt-1">{new Date(tx.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${tx.type === 'credit' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className={`py-4 font-bold text-right ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type === 'credit' ? '+' : '-'}${tx.amount}
                                        </td>
                                    </tr>
                                ))}
                                {(!data?.recent_transactions || data.recent_transactions.length === 0) && (
                                    <tr>
                                        <td colSpan="3" className="py-8 text-center text-slate-500 italic text-xs">No transactions yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Premium Feed */}
                <div className="lg:col-span-1">
                    <PremiumFeed />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

