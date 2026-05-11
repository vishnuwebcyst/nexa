import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, History, Loader2, AlertTriangle } from 'lucide-react';
import { ethers } from 'ethers';

const USDT_ABI = [
    "function transfer(address to, uint amount) returns (bool)",
    "function decimals() view returns (uint8)"
];

const WalletPage = () => {
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState('deposit'); // 'deposit' or 'withdraw'
    const [history, setHistory] = useState([]);
    const [web3Settings, setWeb3Settings] = useState({ admin_wallet: '', usdt_contract: '' });
    
    useEffect(() => {
        fetchHistory();
        fetchWeb3Settings();
    }, []);

    const fetchWeb3Settings = async () => {
        try {
            const res = await axios.get('/api/wallet/web3-settings');
            setWeb3Settings(res.data);
        } catch (error) {
            console.error("Failed to fetch web3 settings", error);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/api/wallet/history');
            setHistory(res.data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    const handleWeb3Deposit = async () => {
        if (!window.ethereum) return alert('Please install MetaMask');
        if (!amount || amount <= 0) return alert('Enter a valid amount');
        
        setLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            // In a real app, verify network is BSC (Chain ID 56)
            const contract = new ethers.Contract(web3Settings.usdt_contract, USDT_ABI, signer);
            
            // Parse amount to decimals (USDT on BSC is 18 decimals usually)
            const parsedAmount = ethers.parseUnits(amount.toString(), 18);
            
            const tx = await contract.transfer(web3Settings.admin_wallet, parsedAmount);
            await tx.wait(); // Wait for confirmation
            
            // Tell backend about successful deposit
            await axios.post('/api/wallet/deposit', {
                amount: amount,
                tx_hash: tx.hash
            });
            
            alert('Deposit successful!');
            setAmount('');
            fetchHistory();
        } catch (error) {
            console.error("MetaMask Error:", error);
            let errorMessage = 'Transaction failed or rejected.';
            
            try {
                const errStr = String(error?.message || error);
                if (errStr.includes('MetaMask extension not found')) {
                    errorMessage = 'MetaMask extension not found. Please install or enable MetaMask.';
                } else if (error?.code === 4001 || error?.code === 'ACTION_REJECTED' || errStr.includes('rejected')) {
                    errorMessage = 'You rejected the transaction in MetaMask.';
                }
            } catch (e) {
                console.error("Error parsing wallet error:", e);
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!amount || amount < 10) return alert('Minimum withdrawal is $10');
        
        setLoading(true);
        try {
            const res = await axios.post('/api/wallet/withdraw', {
                amount: amount,
                wallet_address: user.wallet_address
            });
            alert('Withdrawal request submitted! 10% fee applied.');
            setAmount('');
            fetchHistory();
        } catch (error) {
            alert(error.response?.data?.message || 'Withdrawal failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 uppercase italic tracking-wider">My Wallet</h1>
                    <p className="text-slate-400">Manage your BEP-20 USDT funds</p>
                </div>
                <div className="p-4 bg-gold-900/20 rounded-2xl border border-gold-800/30">
                    <WalletIcon className="text-gold-500" size={32} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Balance Card */}
                <div className="lg:col-span-1">
                    <div className="nexa-card p-8 bg-gradient-to-br from-[#1a1300] to-[#0a0a0a]">
                        <h3 className="text-gold-400 font-bold uppercase tracking-widest text-xs mb-2">Available Balance</h3>
                        <div className="text-5xl font-bold text-white mb-8">${user?.wallet?.balance || '0.00'}</div>
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setAction('deposit')}
                                className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors ${action === 'deposit' ? 'gold-button' : 'bg-gold-900/30 text-gold-500 border border-gold-800/50'}`}
                            >
                                Deposit
                            </button>
                            <button 
                                onClick={() => setAction('withdraw')}
                                className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors ${action === 'withdraw' ? 'gold-button' : 'bg-gold-900/30 text-gold-500 border border-gold-800/50'}`}
                            >
                                Withdraw
                            </button>
                        </div>
                    </div>

                    <div className="nexa-card p-8 mt-8">
                        <h3 className="text-xl font-bold text-white mb-6 uppercase italic">{action} USDT</h3>
                        
                        {action === 'withdraw' && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6 flex items-start gap-3">
                                <AlertTriangle className="text-red-400 shrink-0" size={20} />
                                <div className="text-xs text-red-300">
                                    <p className="font-bold mb-1">Withdrawal Rules:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Minimum $10</li>
                                        <li>10% deduction fee</li>
                                        <li>Requires 2 direct sponsors for loop income</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-2">Amount (USDT)</label>
                                <input 
                                    type="number" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-gold-800/30 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-gold-500 text-xl font-bold mb-4"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="p-4 bg-slate-900/50 rounded-xl border border-gold-800/20 mb-6">
                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Receiving Wallet</div>
                                <div className="text-xs text-gold-500 font-mono break-all bg-black/40 p-2 rounded-lg border border-gold-900/50">
                                    {web3Settings.admin_wallet || 'Loading...'}
                                </div>
                            </div>
                            
                            <button 
                                onClick={action === 'deposit' ? handleWeb3Deposit : handleWithdraw}
                                disabled={loading || !web3Settings.admin_wallet}
                                className="w-full gold-button py-4 rounded-xl flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (action === 'deposit' ? <ArrowDownToLine /> : <ArrowUpFromLine />)}
                                {action === 'deposit' ? 'Confirm via Web3' : 'Request Withdrawal'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* History */}
                <div className="lg:col-span-2 nexa-card p-8">
                    <h3 className="text-xl font-bold text-white mb-6 uppercase italic flex items-center gap-3">
                        <History className="text-gold-500" />
                        Transaction History
                    </h3>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gold-500 text-xs uppercase tracking-widest border-b border-gold-900/50">
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Type</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-300">
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-slate-500 italic">No transactions found</td>
                                    </tr>
                                )}
                                {history.map(tx => (
                                    <tr key={tx.id} className="border-b border-gold-900/20 hover:bg-gold-900/10">
                                        <td className="py-4">{new Date(tx.created_at).toLocaleDateString()}</td>
                                        <td className="py-4 uppercase text-xs font-bold">{tx.type} - {tx.category}</td>
                                        <td className={`py-4 font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type === 'credit' ? '+' : '-'}${tx.amount}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                                                tx.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
