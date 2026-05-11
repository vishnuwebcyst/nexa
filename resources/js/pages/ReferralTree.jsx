import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, ChevronDown, User, Network } from 'lucide-react';

const TreeItem = ({ node, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(level < 1);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="ml-4">
            <div 
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all cursor-pointer ${
                    level === 0 ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' : 'hover:bg-slate-800/50 text-slate-300'
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {hasChildren ? (
                    isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                ) : (
                    <div className="w-4" />
                )}
                <div className={`p-2 rounded-lg ${level === 0 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    <User size={14} />
                </div>
                <div>
                    <p className="font-semibold text-sm">{node.name}</p>
                    <p className="text-[10px] opacity-60 tracking-wider">@{node.username}</p>
                </div>
                {hasChildren && (
                    <span className="ml-auto bg-slate-800 text-slate-500 text-[10px] px-2 py-0.5 rounded-full border border-slate-700">
                        {node.children.length} Referrals
                    </span>
                )}
            </div>
            
            {isOpen && hasChildren && (
                <div className="mt-2 border-l border-slate-800 ml-6 space-y-2">
                    {node.children.map(child => (
                        <TreeItem key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ReferralTreePage = () => {
    const [tree, setTree] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTree();
    }, []);

    const fetchTree = async () => {
        try {
            const response = await axios.get('/api/referrals/tree');
            setTree(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-blue-500">Loading Network...</div>;

    return (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Network</h1>
                    <p className="text-slate-400">Visualize your multi-level referral structure</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <Network className="text-blue-400" size={32} />
                </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm min-h-[500px]">
                {tree ? <TreeItem node={tree} /> : <p className="text-slate-500">No network found.</p>}
            </div>
        </div>
    );
};

export default ReferralTreePage;
