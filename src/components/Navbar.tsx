import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  historyCount?: number;
  onOpenHistory?: () => void;
}

export const Navbar = ({ historyCount = 0, onOpenHistory }: NavbarProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200">
            <Shield className="w-4 h-4 text-slate-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-slate-100">ScamShield AI</span>
            <span className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
              v1.0
            </span>
          </div>
        </div>

        {/* Right Section: User & Auth Controls */}
        <div className="flex items-center gap-3 text-xs">
          {/* History shortcut if handler provided */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-mono text-xs transition"
            >
              <span>Saved Scans</span>
              <span className="px-1 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400">
                {historyCount}
              </span>
            </button>
          )}

          {/* User Email Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <UserIcon className="w-2.5 h-2.5" />
            </div>
            <span className="font-mono text-xs text-slate-200 max-w-[150px] sm:max-w-[220px] truncate">
              {user?.email || 'analyst@scamshield.ai'}
            </span>
            <span className="hidden md:inline-block px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-mono text-[10px]">
              Active
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 text-xs font-medium transition cursor-pointer"
            title="Sign out of workspace"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
