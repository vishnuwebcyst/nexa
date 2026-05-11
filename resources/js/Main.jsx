import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import ReferralTreePage from './pages/ReferralTree';
import Landing from './pages/Landing';
import WalletPage from './pages/Wallet';
import Pools from './pages/Pools';


const ProtectedRoute = ({ children }) => {

    const { user, loading } = useAuth();
    
    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    
    return <DashboardLayout>{children}</DashboardLayout>;
};

const Main = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/packages" element={<ProtectedRoute><Packages /></ProtectedRoute>} />
                    <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
                    <Route path="/referrals" element={<ProtectedRoute><ReferralTreePage /></ProtectedRoute>} />
                    <Route path="/pools" element={<ProtectedRoute><Pools /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><div>Transaction History Coming Soon</div></ProtectedRoute>} />

                    
                    {/* Redirects */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default Main;
