import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, Wallet as WalletIcon } from 'lucide-react';
import { ethers } from 'ethers';
import axios from 'axios';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isWalletLoading, setIsWalletLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleWalletLogin = async () => {
        if (!window.ethereum) {
            alert("MetaMask not found. Please install it.");
            return;
        }

        try {
            setIsWalletLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const address = accounts[0];
            const signer = await provider.getSigner();

            // 1. Get Nonce from Backend
            const nonceResponse = await axios.post('/api/get-nonce', { wallet_address: address });
            const nonce = nonceResponse.data.nonce;

            // 2. Sign the Message
            const message = `Login to Nexa with nonce: ${nonce}`;
            const signature = await signer.signMessage(message);

            // 3. Verify on Backend
            const response = await axios.post('/api/login-with-wallet', {
                wallet_address: address,
                signature: signature
            });

            const { access_token, user } = response.data;
            window.location.href = '/dashboard'; // Force refresh to update context
        } catch (err) {
            console.error("Wallet Connection Error:", err);
            let errorMessage = 'Wallet login failed. Make sure your wallet is registered.';
            
            try {
                const errStr = String(err?.message || err);
                if (errStr.includes('MetaMask extension not found') || errStr.includes('Failed to connect to MetaMask')) {
                    errorMessage = 'MetaMask not found or connection failed. Please ensure the MetaMask extension is enabled and active.';
                } else if (err?.code === 4001 || errStr.includes('rejected')) {
                    errorMessage = 'You rejected the MetaMask connection request.';
                } else if (errStr.includes('timed out')) {
                    errorMessage = 'Connection timed out. If you are using Brave, please disable the default Brave Wallet and install MetaMask.';
                } else if (err?.response?.status === 404) {
                    errorMessage = (
                        <div className="flex flex-col gap-2 items-center">
                            <span>Wallet not registered. Please sign up first.</span>
                            <Link 
                                to={`/register?wallet=${address}`}
                                className="bg-gold-500/20 hover:bg-gold-500/40 text-gold-400 px-4 py-1.5 rounded-lg border border-gold-500/30 transition-all text-xs font-bold uppercase tracking-wider"
                            >
                                Register Now with Wallet
                            </Link>
                        </div>
                    );
                } else if (err?.response?.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } catch (e) {
                console.error("Error parsing wallet error:", e);
            }

            setError(errorMessage);
        } finally {
            setIsWalletLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gold-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center font-bold text-black text-3xl mx-auto mb-6 shadow-[0_0_30px_rgba(230,172,0,0.3)]">
                        N
                    </div>
                    <h1 className="text-4xl font-bold gold-text mb-2 uppercase tracking-tight italic">Nexa Web</h1>
                    <p className="text-gold-200/60 uppercase tracking-widest text-xs font-bold">Powering Digital Wealth</p>
                </div>

                <div className="nexa-card p-10 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto border border-gold-500/20">
                            <WalletIcon className="text-gold-500" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2 italic uppercase tracking-tight">Web3 Portal</h2>
                            <p className="text-gold-200/40 text-sm">Access your Nexa Dashboard securely via MetaMask.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button 
                        type="button"
                        onClick={handleWalletLogin}
                        disabled={isWalletLoading}
                        className="w-full gold-button py-5 rounded-xl flex items-center justify-center gap-3 relative overflow-hidden group shadow-[0_10px_30px_rgba(230,172,0,0.2)]"
                    >
                        {isWalletLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                <span>Connecting Wallet...</span>
                            </div>
                        ) : (
                            <>
                                <WalletIcon className="group-hover:scale-110 transition-transform" size={22} />
                                <span className="text-lg">Login with MetaMask</span>
                            </>
                        )}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                    </button>

                    <p className="text-center text-gold-200/60 text-sm pt-4 border-t border-gold-800/20">
                        Don't have an account? {' '}
                        <Link to="/register" className="text-gold-400 font-bold hover:text-gold-300 transition-colors uppercase text-xs tracking-widest ml-1">
                            Sign up with Wallet
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

