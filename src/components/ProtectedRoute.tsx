import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
        <span>Authenticating session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to /login while preserving intended target route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
