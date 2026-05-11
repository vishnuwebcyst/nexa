import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Target, Cpu, Users, Shield, Zap, ChevronRight, Wallet } from 'lucide-react';
import VisionMission from '../components/VisionMission';
import FounderMessage from '../components/FounderMessage';
import LoopIncomeTable from '../components/LoopIncomeTable';

const Landing = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-gold-500/30">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gold-800/20">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center font-bold text-black text-xl">
                            N
                        </div>
                        <span className="text-2xl font-bold gold-text uppercase tracking-widest">Nexa Web</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase text-gold-200/70">
                        <a href="#about" className="hover:text-gold-400 transition-colors">About</a>
                        <a href="#vision" className="hover:text-gold-400 transition-colors">Vision</a>
                        <a href="#packages" className="hover:text-gold-400 transition-colors">Packages</a>
                        <a href="#income" className="hover:text-gold-400 transition-colors">Income</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-gold-400 hover:text-gold-300">Login</Link>
                        <Link to="/register" className="gold-button px-6 py-2 rounded-full text-sm">Sign Up</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-600/20 rounded-full blur-[120px] -z-10" />
                <div className="max-w-7xl mx-auto text-center">
                    <span className="inline-block py-1 px-3 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-bold uppercase tracking-widest mb-6">
                        Powering the Future of Digital Wealth
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 uppercase tracking-tighter">
                        Welcome to <br />
                        <span className="gold-text">Nexa WEB (NW)</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Your journey with Nexa begins here, where learning, participation, and consistency open the door to long-term opportunities. Start small. Grow smart. Build your future today.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="gold-button px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2">
                            Start Your Journey <ChevronRight size={20} />
                        </Link>
                        <a href="#about" className="px-8 py-4 rounded-full text-lg font-bold border border-gold-800 text-gold-400 hover:bg-gold-900/30 transition-colors flex items-center justify-center">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* About Us */}
            <section id="about" className="py-20 px-6 bg-[#0f0a05]">
                <div className="max-w-7xl mx-auto">
                    <div className="nexa-card p-12 md:p-16">
                        <h2 className="text-4xl font-bold gold-text uppercase italic mb-8">About Us</h2>
                        <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                            <p>
                                Nexa is a future-focused digital platform designed to build an open, transparent, and growth-driven network.
                            </p>
                            <p>
                                Our system is structured to provide users with multiple earning opportunities through skill development, network expansion, and package-based rewards.
                            </p>
                            <p>
                                Nexa believes in empowering individuals by offering a scalable model where growth is directly linked to learning, participation, and leadership.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section id="vision" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 text-center">
                        <h2 className="text-4xl font-bold gold-text uppercase italic">Our Vision & Mission</h2>
                    </div>
                    <VisionMission />
                </div>
            </section>

            {/* Founder's Message */}
            <section className="py-20 px-6 bg-[#0f0a05]">
                <div className="max-w-7xl mx-auto">
                    <FounderMessage />
                </div>
            </section>

            {/* Packages */}
            <section id="packages" className="py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold gold-text uppercase italic mb-4">Staking Packages</h2>
                    <p className="text-slate-400 mb-16 max-w-2xl mx-auto">Choose your entry into the Nexa ecosystem. Upgrade your level, unlock elite rewards, and turn your vision into a powerful income stream.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 text-left">
                        {[
                            { name: 'Nexa Excess', price: 15 },
                            { name: 'Nexa Elevate', price: 45 },
                            { name: 'Nexa Apex', price: 135 },
                            { name: 'Nexa Zenith', price: 405 },
                            { name: 'Nexa Omega', price: 1215 },
                            { name: 'Nexa Legacy', price: 3645 },
                        ].map((pkg, i) => (
                            <div key={i} className="nexa-card p-6 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
                                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mb-4 shadow-lg shadow-gold-500/20 group-hover:scale-110 transition-transform">
                                    <Shield className="text-black" size={32} />
                                </div>
                                <h4 className="font-bold text-white mb-2 uppercase">{pkg.name}</h4>
                                <span className="text-2xl font-bold gold-text">${pkg.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Loop Income Table */}
            <section id="income" className="py-20 px-6 bg-[#0f0a05]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 text-center">
                        <h2 className="text-4xl font-bold gold-text uppercase italic mb-4">Nexa Loop Income</h2>
                        <p className="text-slate-400">Total Loop Income Potential: <strong className="text-gold-400">$557,023.5</strong></p>
                    </div>
                    <LoopIncomeTable />
                </div>
            </section>

            {/* Web3 Wallets */}
            <section className="py-20 px-6 border-t border-gold-900/50">
                <div className="max-w-7xl mx-auto text-center">
                    <Wallet className="mx-auto text-gold-500 mb-6" size={48} />
                    <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-4">Supported Web3 Wallets</h2>
                    <p className="text-gold-400 font-bold mb-12 uppercase tracking-widest">(BEP-20 Compatible)</p>
                    
                    <div className="flex flex-wrap justify-center gap-8 mb-12">
                        {['Token Pocket', 'SafePal', 'Trust Wallet', 'MetaMask'].map((wallet, i) => (
                            <div key={i} className="bg-gold-900/20 border border-gold-800/30 px-8 py-4 rounded-2xl text-white font-bold tracking-wider">
                                {wallet}
                            </div>
                        ))}
                    </div>
                    <p className="text-slate-400 italic">"Connect your wallet. Stay in control. Experience true Web3 freedom."</p>
                </div>
            </section>

            {/* Footer / Terms */}
            <footer className="bg-black py-12 px-6 border-t border-gold-900">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-2xl font-bold gold-text uppercase mb-6">Terms & Conditions</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li>• All deposits and withdrawals are available only in USDT (BEP-20 network).</li>
                            <li>• 24×7 withdrawal facility is available for all eligible users.</li>
                            <li>• Minimum withdrawal amount is $10 only.</li>
                            <li>• A 10% deduction will be applied on every withdrawal.</li>
                            <li>• Loop income withdrawal: 2 sponsors compulsory and next loop upgrade required.</li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center font-bold text-black text-3xl mb-4">
                            N
                        </div>
                        <h2 className="text-3xl font-bold text-white uppercase tracking-widest mb-2">Thank You</h2>
                        <p className="text-gold-500 uppercase tracking-widest font-bold text-sm">For Watching!</p>
                        <p className="text-slate-600 text-xs mt-6">WWW.Nexaweb.live</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
