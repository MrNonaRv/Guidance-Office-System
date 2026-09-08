import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse oobCode from URL
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('oobCode');
    
    if (code) {
      setOobCode(code);
      // Verify code
      verifyPasswordResetCode(auth, code).catch((err) => {
        console.error("Invalid or expired action code.", err);
        setError("The password reset link is invalid or has expired.");
      });
    } else {
      setError("No reset code found in the URL.");
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/student/login');
      }, 3000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/BACKGROUND.png')] bg-cover bg-center p-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-[380px] text-center"
      >
        <h1 className="text-[22px] sm:text-2xl font-black text-[#1e4b9c] mb-2 leading-snug tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-[#1e4b9c] font-bold text-sm mb-6">
          Set your new password
        </p>

        {error && <div className="text-red-600 text-xs font-semibold text-center mb-4 bg-red-100/80 p-2 rounded-lg border border-red-200">{error}</div>}
        {success && <div className="text-emerald-700 text-xs font-semibold text-center mb-4 bg-emerald-100/80 p-2 rounded-lg border border-emerald-200">Password reset successfully! Redirecting to login...</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="text-left">
            <label className="block text-[11px] font-bold text-[#1e4b9c] mb-1 ml-1">New Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required 
              placeholder="********"
              className="w-full px-4 py-2.5 bg-white border border-[#1e4b9c] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#1e4b9c]/50 focus:border-[#1e4b9c] outline-none transition-all shadow-sm font-mono tracking-widest" 
            />
          </div>

          <div className="text-left">
            <label className="block text-[11px] font-bold text-[#1e4b9c] mb-1 ml-1">Confirm Password</label>
            <div className="relative flex items-center">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                placeholder="********"
                className="w-full px-4 py-2.5 pr-11 bg-white border border-[#1e4b9c] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#1e4b9c]/50 focus:border-[#1e4b9c] outline-none transition-all shadow-sm font-mono tracking-widest" 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                title={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 p-1.5 rounded-lg text-gray-400 hover:text-[#1e4b9c] hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all flex items-center justify-center cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-[#1e4b9c]" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading || !oobCode}
              className="w-full bg-[#1e4b9c] text-white py-3 rounded-2xl font-bold hover:bg-[#15397a] transition-colors shadow-sm text-[14px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
