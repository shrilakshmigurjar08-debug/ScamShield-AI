import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already authenticated, redirect immediately to dashboard
  if (isAuthenticated) {
    const destination = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        await login(email, password);
        const destination = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';
        navigate(destination, { replace: true });
      } else {
        await register(email, password);
        setSuccessMsg('Account created successfully. Redirecting to workspace...');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 600);
      }
    } catch (err) {
      setErrorMsg((err as Error).message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('analyst@scamshield.ai');
    setPassword('password123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-slate-800 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 mb-1">
            <Shield className="w-5 h-5 text-slate-100" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">ScamShield AI</h1>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
              v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Sign in to access unified fraud intelligence and threat heuristics
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-md border border-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-1.5 text-center rounded transition-colors ${
                mode === 'signin'
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-1.5 text-center rounded transition-colors ${
                mode === 'signup'
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3 rounded-md bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="p-3 rounded-md bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <div className="leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@scamshield.ai"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-slate-600 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 block">
                  Security Password
                </label>
                {mode === 'signin' && (
                  <span className="text-[11px] text-slate-500 hover:text-slate-400 cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-slate-600 transition"
                />
              </div>
              {mode === 'signup' && (
                <p className="text-[11px] text-slate-500 font-mono">
                  Minimum 6 characters required.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full py-2.5 bg-slate-100 text-slate-950 hover:bg-slate-200 active:bg-slate-300 font-medium text-xs sm:text-sm rounded-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Create SecOps Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill for Presentation */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono text-[11px]">Demo evaluation:</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-mono transition"
            >
              Fill Demo Analyst Creds
            </button>
          </div>
        </div>

        {/* Footer Subtext */}
        <div className="text-center text-[11px] font-mono text-slate-500">
          SOC2 Type II Compliant • Standard AES-256 Auth Encryption
        </div>
      </div>
    </div>
  );
};
