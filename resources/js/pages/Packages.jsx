import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { Check, Shield, Zap, Crown, Star, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PackageCard = ({ pkg, onBuy, isProcessing, isActive }) => {
    const icons = {
        'Nexa Excess': Zap,
        'Nexa Elevate': Zap,
        'Nexa Apex': Shield,
        'Nexa Zenith': Star,
        'Nexa Omega': Crown,
        'Nexa Legacy Club': Crown,
    };
    const Icon = icons[pkg.name] || Zap;

    const features = [
        pkg.type === 'joining' 
            ? `$${pkg.partner_bonus} Partner Bonus (50%)`
            : `$${pkg.elevation_reward} Elevation Reward (25%)`,
        `$${pkg.network_reward} Network Reward`,
        `$${pkg.loop_income} Loop Income`,
        '10 Levels of Level Income',
        'Global Auto-Pool Access'
    ];

    return (
        <div className={`bg-gold-950/20 border rounded-3xl p-8 flex flex-col transition-all duration-500 group backdrop-blur-sm ${isActive ? 'border-gold-500 shadow-[0_0_30px_rgba(230,172,0,0.2)]' : 'border-gold-900/30 hover:border-gold-500/50'}`}>
            <div className="mb-6 flex justify-between items-start">
                <div className={`p-4 rounded-2xl bg-gold-500/10 text-gold-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(230,172,0,0.1)]`}>
                    <Icon size={32} />
                </div>
                {isActive ? (
                    <span className="bg-gold-500 text-gold-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
                ) : pkg.type === 'joining' && (
                    <span className="bg-gold-500/20 text-gold-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-gold-500/30">Entry</span>
                )}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold gold-text">${pkg.price}</span>
                <span className="text-gold-700/60 font-medium">/ USDT</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                        <div className="w-5 h-5 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
                            <Check size={12} />
                        </div>
                        {feature}
                    </li>
                ))}
            </ul>

            <button 
                onClick={() => !isActive && onBuy(pkg.id)}
                disabled={isProcessing || isActive}
                className={`w-full py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 ${isActive ? 'bg-slate-800 text-slate-500 cursor-default border border-slate-700' : 'gold-button'}`}
            >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : isActive ? 'Package Active' : 'Activate Now'}
            </button>
        </div>
    );
};

const Packages = () => {
    const { user } = useAuth();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBuying, setIsBuying] = useState(null);

    const activePackageId = user?.active_package?.package_id;

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await axios.get('/api/packages');
            setPackages(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (id) => {
        if (!window.ethereum) {
            alert("MetaMask not found!");
            return;
        }

        const pkg = packages.find(p => p.id === id);
        setIsBuying(id);

        try {
            const settingsResponse = await axios.get('/api/wallet/web3-settings');
            const { admin_wallet, usdt_contract } = settingsResponse.data;

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const usdtAbi = [
                "function transfer(address to, uint256 amount) public returns (bool)",
                "function decimals() public view returns (uint8)"
            ];
            const contract = new ethers.Contract(usdt_contract, usdtAbi, signer);

            const decimals = await contract.decimals();
            const amount = ethers.parseUnits(pkg.price.toString(), decimals);
            
            const tx = await contract.transfer(admin_wallet, amount);
            await tx.wait();

            await axios.post('/api/packages/purchase', { 
                package_id: id,
                tx_hash: tx.hash
            });

            alert('Package activated successfully!');
            window.location.reload();
        } catch (error) {
            console.error("Full Purchase Error:", error);
            let errorMessage = "Transaction failed or rejected.";
            if (error.code === 'INSUFFICIENT_FUNDS') errorMessage = "Insufficient USDT or BNB for gas fees.";
            else if (error.code === 'ACTION_REJECTED') errorMessage = "Transaction was rejected in MetaMask.";
            alert(errorMessage);
        } finally {
            setIsBuying(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin text-gold-500" size={48} />
            <p className="text-gold-500 font-medium animate-pulse">Loading Premium Packages...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="max-w-2xl">
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
                    Premium <span className="gold-text">Packages</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Select a package to unlock high-yield rewards. Higher tiers provide enhanced elevation multipliers and deeper global auto-pool penetration.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {packages.map(pkg => (
                    <PackageCard 
                        key={pkg.id} 
                        pkg={pkg} 
                        onBuy={handleBuy} 
                        isProcessing={isBuying === pkg.id}
                        isActive={activePackageId === pkg.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default Packages;
