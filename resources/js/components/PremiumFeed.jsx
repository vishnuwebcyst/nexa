import React from 'react';
import { Bell, MessageSquare, Zap, Gift, Info } from 'lucide-react';

const ActivityItem = ({ icon: Icon, title, time, description, color }) => (
    <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-800/50 transition-colors group cursor-pointer border border-transparent hover:border-slate-700/50">
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 shrink-0 h-fit`}>
            <Icon size={18} />
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{title}</h4>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{time}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
        </div>
    </div>
);

const PremiumFeed = () => {
    return (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-sm overflow-hidden h-fit sticky top-8">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap size={18} className="text-blue-400" />
                    Activity Feed
                </h3>
                <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20 font-bold uppercase">Live</span>
            </div>

            <div className="p-2 space-y-1">
                <ActivityItem
                    icon={Gift}
                    title="Reward Credited"
                    time="2m ago"
                    description="You received $16.87 Loop Income from @cryptoking's purchase."
                    color="green"
                />
                <ActivityItem
                    icon={Bell}
                    title="New Referral"
                    time="15m ago"
                    description="User @sunny_vibes joined using your link."
                    color="blue"
                />
                <ActivityItem
                    icon={Zap}
                    title="Milestone Bonus"
                    time="1h ago"
                    description="You are only 1 referral away from your next $25 bonus!"
                    color="amber"
                />
                <ActivityItem
                    icon={MessageSquare}
                    title="System Update"
                    time="3h ago"
                    description="New Nexa Legacy Club package is now live."
                    color="purple"
                />
                <ActivityItem
                    icon={Info}
                    title="Security Tip"
                    time="5h ago"
                    description="Enable 2FA to secure your Nexa Web wallet."
                    color="slate"
                />
            </div>

            <div className="p-4 bg-slate-800/30">
                <button className="w-full py-2.5 text-xs font-bold text-blue-400 hover:text-white transition-colors uppercase tracking-widest">
                    View All Activity
                </button>
            </div>
        </div>
    );
};

export default PremiumFeed;
