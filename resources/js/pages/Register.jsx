import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, AtSign, Loader2, Wallet as WalletIcon } from 'lucide-react';
import { ethers } from 'ethers';

const Register = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        referral_code: searchParams.get('ref') || '',
        wallet_address: searchParams.get('wallet') || ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isWalletLoading, setIsWalletLoading] = useState(false);
    const navigate = useNavigate();

    const [isWalletConnected, setIsWalletConnected] = useState(false);

    const handleWalletRegister = async () => {
        if (!window.ethereum) {
            alert("MetaMask not found. Please install it.");
            return;
        }

        if (!formData.name || !formData.username) {
            alert("Please fill in name and username.");
            return;
        }

        try {
            setIsLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const address = accounts[0];
            const signer = await provider.getSigner();

            // Sign a message to prove ownership of the wallet during registration
            const message = `Registering on Nexa with wallet: ${address}`;
            const signature = await signer.signMessage(message);

            const response = await axios.post('/api/register', {
                ...formData,
                wallet_address: address,
                signature: signature
            });

            localStorage.setItem('token', response.data.access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            navigate('/dashboard');
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.response?.data?.message || "Failed to register. Wallet might already be in use.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        setIsWalletLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setFormData({ ...formData, wallet_address: accounts[0] });
            setIsWalletConnected(true);
        } catch (err) {
            console.error("Wallet Connection Error:", err);
            alert('Failed to connect wallet');
        } finally {
            setIsWalletLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.wallet_address) {
            alert('Please connect your wallet first!');
            return;
        }
        handleWalletRegister();
    };

    const InputField = ({ label, icon: Icon, name, type = 'text', placeholder, readOnly = false }) => (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">{label}</label>
            <div className="relative group">
                <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 ${readOnly ? 'text-gold-500' : 'text-gold-700 group-focus-within:text-gold-400'} transition-colors`} size={18} />
                <input 
                    type={type}
                    name={name}
                    readOnly={readOnly}
                    className={`w-full ${readOnly ? 'bg-gold-500/5 border-gold-500/30 text-gold-400/70' : 'bg-[#0a0a0a]/50 border-gold-800/50 text-white focus:border-gold-500 focus:bg-gold-900/10'} border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all text-sm ${errors[name] ? 'border-red-500/50' : ''}`}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={(e) => setFormData({...formData, [name]: e.target.value})}
                    required={!readOnly && name !== 'referral_code'}
                />
            </div>
            {errors[name] && <p className="text-red-400 text-[10px] mt-1 font-bold">{errors[name][0]}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans relative overflow-hidden py-12">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gold-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-lg animate-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center font-bold text-black text-3xl mx-auto mb-6 shadow-[0_0_30px_rgba(230,172,0,0.3)]">
                        N
                    </div>
                    <h1 className="text-4xl font-bold gold-text mb-2 uppercase tracking-tight italic">Nexa Register</h1>
                    <p className="text-gold-200/60 uppercase tracking-widest text-xs font-bold">Secure Web3 Onboarding</p>
                </div>

                {!isWalletConnected ? (
                    <div className="nexa-card p-10 text-center space-y-6">
                        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto border border-gold-500/20">
                            <WalletIcon className="text-gold-500" size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
                            <p className="text-gold-200/40 text-sm">To join Nexa Web, you must first connect your Web3 wallet. This will be your primary identifier.</p>
                        </div>
                        <button 
                            onClick={handleConnectWallet}
                            disabled={isWalletLoading}
                            className="w-full gold-button py-4 rounded-xl flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            {isWalletLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <WalletIcon size={20} />
                                    <span>Connect MetaMask</span>
                                </>
                            )}
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                        </button>
                        <p className="text-gold-200/40 text-xs italic">Make sure you have MetaMask installed and active.</p>
                    </div>
                ) : (
                    <div className="nexa-card p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-500">
                        <div className="mb-6 bg-gold-500/10 border border-gold-500/20 p-3 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-black font-bold text-xs">W</div>
                                <div>
                                    <p className="text-[8px] text-gold-500 uppercase font-black tracking-tighter">Connected Wallet</p>
                                    <p className="text-xs text-gold-200 font-mono">{formData.wallet_address.substring(0, 6)}...{formData.wallet_address.substring(38)}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsWalletConnected(false)} className="text-[10px] text-gold-500 hover:underline uppercase font-bold">Change</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                            <div className="space-y-6">
                                <InputField label="Full Name" icon={User} name="name" placeholder="John Doe" />
                                <InputField label="Username" icon={AtSign} name="username" placeholder="johndoe123" />
                                <InputField label="Referral Code (Optional)" icon={AtSign} name="referral_code" placeholder="Enter sponsor code" />
                            </div>

                            <div className="mt-8">
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full gold-button py-4 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden group shadow-[0_10px_30px_rgba(230,172,0,0.15)]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                            <span>Finalizing Registration...</span>
                                        </div>
                                    ) : 'Complete Registration'}
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-gold-200/40 text-sm hover:text-gold-400 transition-colors">
                        Already have an account? <span className="text-gold-500 font-bold uppercase text-xs tracking-widest ml-1">Login here</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
