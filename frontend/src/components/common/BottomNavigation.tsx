import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BottomNavigationProps {
  onAddClick?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ onAddClick }) => {
  const location = useLocation();

  return (
    <nav className="absolute bottom-0 w-full sm:max-w-md bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-6 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center w-full relative">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 min-w-[64px] group">
          <div className={`px-4 py-1 rounded-full transition-all duration-300 ${location.pathname === '/dashboard' ? 'bg-primary/10' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}`}>
            <span className={`material-symbols-outlined text-2xl transition-all duration-300 ${location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-400'}`}>
              home
            </span>
          </div>
          <span className={`text-[10px] font-semibold transition-colors duration-300 ${location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-500'}`}>
            Beranda
          </span>
        </Link>
        <Link to="/transactions" className="flex flex-col items-center gap-1 min-w-[64px] group">
          <div className={`px-4 py-1 rounded-full transition-all duration-300 ${location.pathname === '/transactions' ? 'bg-primary/10' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}`}>
            <span className={`material-symbols-outlined text-2xl transition-all duration-300 ${location.pathname === '/transactions' ? 'text-primary' : 'text-slate-400'}`}>
              receipt_long
            </span>
          </div>
          <span className={`text-[10px] font-semibold transition-colors duration-300 ${location.pathname === '/transactions' ? 'text-primary' : 'text-slate-500'}`}>
            Transaksi
          </span>
        </Link>

        {/* Floating Action Button (FAB) */}
        <div className="relative -top-6 flex flex-col items-center min-w-[64px]">
          <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md"></div>
          <button
            onClick={onAddClick}
            className="relative w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all outline outline-4 outline-white dark:outline-slate-900 z-10"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>

        <Link to="/accounts" className="flex flex-col items-center gap-1 min-w-[64px] group">
          <div className={`px-4 py-1 rounded-full transition-all duration-300 ${location.pathname === '/accounts' ? 'bg-primary/10' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}`}>
            <span className={`material-symbols-outlined text-2xl transition-all duration-300 ${location.pathname === '/accounts' ? 'text-primary' : 'text-slate-400'}`}>
              account_balance
            </span>
          </div>
          <span className={`text-[10px] font-semibold transition-colors duration-300 ${location.pathname === '/accounts' ? 'text-primary' : 'text-slate-500'}`}>
            Akun
          </span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 min-w-[64px] group">
          <div className={`px-4 py-1 rounded-full transition-all duration-300 ${location.pathname === '/profile' ? 'bg-primary/10' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}`}>
            <span className={`material-symbols-outlined text-2xl transition-all duration-300 ${location.pathname === '/profile' ? 'text-primary' : 'text-slate-400'}`}>
              person
            </span>
          </div>
          <span className={`text-[10px] font-semibold transition-colors duration-300 ${location.pathname === '/profile' ? 'text-primary' : 'text-slate-500'}`}>
            Profil
          </span>
        </Link>
      </div>
      <div className="h-4"></div>
    </nav>
  );
};

