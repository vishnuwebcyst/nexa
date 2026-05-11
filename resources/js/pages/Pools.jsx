import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Loader2, Info, Users, ArrowRight } from 'lucide-react';

const PoolCard = ({ pool }) => {
    return (
        <div className="nexa-card p-8 hover:border-gold-500/50 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-gold-500/10 text-gold-400">
                    <Layers size={32} />
                </div>
                <div className="text-right">
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Current Level</span>
                    <p className="text-3xl font-black gold-text">{pool.current_level}</p>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{pool.package_name} Pool</h3>
            
            <div className="space-y-6 mt-8">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Progress to Level {pool.next_level}</span>
                        <span className="text-gold-400 font-bold">{Math.round(pool.progress)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div 
                            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-1000 shadow-[0_0_10px_rgba(230,172,0,0.3)]"
                            style={{ width: `${pool.progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Required Total</p>
                        <p className="text-lg font-bold text-white">{pool.required_joins}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Global Total</p>
                        <p className="text-lg font-bold text-gold-400">{pool.current_joins}</p>
                    </div>
                </div>

                {pool.remaining > 0 ? (
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
                        <Users size={18} className="text-blue-400" />
                        <p className="text-sm text-slate-300">
                            Need <span className="text-blue-400 font-bold">{pool.remaining}</span> more global joins for next payout
                        </p>
                    </div>
                ) : (
                    <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-4 flex items-center gap-3">
                        <ArrowRight size={18} className="text-gold-400" />
                        <p className="text-sm text-gold-200">
                            Payout eligible! Processing next level...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Pools = () => {
    const [pools, setPools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPools();
    }, []);

    const fetchPools = async () => {
        try {
            const response = await axios.get('/api/pools');
            setPools(response.data.pools);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin text-gold-500" size={48} />
            <p className="text-gold-500 font-medium">Synchronizing Global Pools...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
                        Global <span className="gold-text">Auto-Pools</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Track your progress in the global decentralized loop. Every new purchase across the entire network pushes you closer to your next payout.
                    </p>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                        <Info size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Pool System</p>
                        <p className="text-sm text-slate-300">2-Matrix Global Structure</p>
                    </div>
                </div>
            </div>

            {pools.length === 0 ? (
                <div className="nexa-card p-12 text-center flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-700">
                        <Layers size={40} />
                    </div>
                    <div className="max-w-sm">
                        <h2 className="text-xl font-bold text-white mb-2">No Active Pools</h2>
                        <p className="text-slate-400 mb-6">You need to activate a package to enter the global auto-pools and start earning loop income.</p>
                        <a href="/packages" className="gold-button px-8 py-3 rounded-xl inline-block">View Packages</a>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pools.map(pool => (
                        <PoolCard key={pool.id} pool={pool} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Pools;
