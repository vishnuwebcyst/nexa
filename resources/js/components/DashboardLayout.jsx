import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Wallet, 
    Users, 
    Package, 
    ArrowUpCircle, 
    Layers,
    History, 
    LogOut,
    Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link 
        to={path}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
            active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-[#0f172a] text-slate-200 font-['Outfit']">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-xl font-bold text-white">N</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Nexa Web
                    </span>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={location.pathname === '/dashboard'} />
                    <SidebarItem icon={Package} label="Packages" path="/packages" active={location.pathname === '/packages'} />
                    <SidebarItem icon={Wallet} label="My Wallet" path="/wallet" active={location.pathname === '/wallet'} />
                    <SidebarItem icon={Users} label="My Network" path="/referrals" active={location.pathname === '/referrals'} />
                    <SidebarItem icon={Layers} label="Global Pools" path="/pools" active={location.pathname === '/pools'} />
                    <SidebarItem icon={ArrowUpCircle} label="Upgrades" path="/upgrades" active={location.pathname === '/upgrades'} />
                    <SidebarItem icon={History} label="Transactions" path="/history" active={location.pathname === '/history'} />
                </nav>

                <button 
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
                    <div>
                        <h2 className="text-xl font-semibold text-white capitalize">
                            {location.pathname.replace('/', '') || 'Overview'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0f172a]"></span>
                        </button>
                        
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                <p className="text-xs text-slate-500">{user?.username}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-400">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
