import React from 'react';
import { Globe, Target, Cpu, Users as UsersIcon } from 'lucide-react';

const VisionMission = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="nexa-card p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Target size={120} className="text-gold-500" />
                </div>
                <h3 className="text-3xl font-bold gold-text mb-6 uppercase italic tracking-tighter">Our Vision</h3>
                <p className="text-slate-400 leading-relaxed text-lg mb-8">
                    Our vision is to become a globally trusted digital ecosystem where individuals can grow their wealth through secure staking, smart rewards, and a powerful community-driven model. We strive to make blockchain income simple, accessible, and rewarding for everyone.
                </p>
                <div className="flex items-center gap-4 bg-gold-900/20 p-4 rounded-2xl border border-gold-800/20">
                    <div className="w-12 h-12 rounded-xl bg-gold-600 text-gold-950 flex items-center justify-center">
                        <Globe size={24} />
                    </div>
                    <span className="text-gold-400 font-bold uppercase tracking-widest text-sm">Global Ecosystem</span>
                </div>
            </div>

            <div className="nexa-card p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Cpu size={120} className="text-gold-500" />
                </div>
                <h3 className="text-3xl font-bold gold-text mb-6 uppercase italic tracking-tighter">Our Mission</h3>
                <ul className="space-y-4 text-slate-400 text-lg">
                    <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-gold-500 mt-2 shrink-0" />
                        Delivering fair and fixed staking bonuses
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-gold-500 mt-2 shrink-0" />
                        Encouraging long-term participation and growth
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-gold-500 mt-2 shrink-0" />
                        Building a strong community through club and level rewards
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-gold-500 mt-2 shrink-0" />
                        Creating sustainable income opportunities powered by blockchain technology
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default VisionMission;
