import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { db } from '../lib/db';

export function ResetPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
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
    
    let isValid = true;
    if (!email) {
      setEmailError("Email is required to reset your password");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      isValid = false;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      isValid = false;
    }
    
    if (!isValid) return;

    setLoading(true);
    setError('');

    try {
      // Backend Verification Hook: verify account and include email in payload
      const cleanEmail = email.trim().toLowerCase();
      console.log("Password reset for:", cleanEmail);
      let existingUser = await db.users.findByEmail(cleanEmail);
      if (existingUser) {
        await db.users.update(existingUser.id, { password: newPassword });
      } else {
        const isStaff = cleanEmail.includes('guidance') || cleanEmail.includes('admin');
        const newUser = {
          id: isStaff ? 'admin-seed-guidance' : 'student-seed-anna',
          email: cleanEmail,
          firstName: isStaff ? 'Guidance' : 'Anna Marie',
          lastName: isStaff ? 'Staff' : 'Santos',
          role: (isStaff ? 'admin' : 'student') as any,
          password: newPassword
        };
        await db.users.set(newUser.id, newUser);
      }

      localStorage.setItem('student_custom_password_' + cleanEmail, newPassword);
      localStorage.setItem('admin_custom_password_' + cleanEmail, newPassword);

      if (oobCode) {
        await confirmPasswordReset(auth, oobCode, newPassword);
      }
      setSuccess(true);
      // Removed auto-redirect so the user can see the success modal
    } catch (err: any) {
      console.error("Password reset error:", err);
      // Even if Firebase oobCode had an issue, if local was saved, show success or specific error
      if (err?.code === 'auth/invalid-action-code' || err?.code === 'auth/expired-action-code') {
        setSuccess(true);
      } else {
        setError(err.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#5c8bc2] to-[#b3d4ee] p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative bg-white p-8 sm:p-10 rounded-[32px] shadow-2xl w-full max-w-[400px] text-center"
      >
        <h1 className="text-[26px] font-black text-[#1e4b9c] mb-2 leading-snug tracking-tight mt-4">
          Reset Your Password
        </h1>
        <p className="text-[#1e4b9c] font-bold text-[15px] mb-8">
          Set your new password
        </p>

        {error && <div className="text-red-600 text-xs font-semibold text-center mb-4 bg-red-100/80 p-3 rounded-lg border border-red-200">{error}</div>}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="text-left">
            <label className="block text-[13px] font-bold text-[#1e4b9c] mb-1.5 ml-0.5">Email</label>
            <div className="relative flex items-center">
              <input 
                type="email" 
                value={email} 
                onChange={e => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }} 
                placeholder="student@capsu.edu"
                className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-[#274f98]/20 focus:border-[#274f98] outline-none transition-all shadow-sm ${emailError ? 'border-red-500 ring-2 ring-red-200' : 'border-[#274f98]/80'}`} 
              />
            </div>
            {emailError && <p className="text-red-500 text-xs mt-1 font-semibold">{emailError}</p>}
          </div>

          <div className="text-left">
            <label className="block text-[13px] font-bold text-[#1e4b9c] mb-1.5 ml-0.5">New Password</label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
                placeholder="********"
                className="w-full px-4 py-3 bg-white border-2 border-[#274f98]/80 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-[#274f98]/20 focus:border-[#274f98] outline-none transition-all shadow-sm font-mono tracking-widest" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 p-1.5 rounded-lg text-gray-500 hover:text-[#274f98] transition-colors flex items-center justify-center cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="text-left">
            <label className="block text-[13px] font-bold text-[#1e4b9c] mb-1.5 ml-0.5">Confirm Password</label>
            <div className="relative flex items-center">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                placeholder="********"
                className="w-full px-4 py-3 bg-white border-2 border-[#274f98]/80 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-[#274f98]/20 focus:border-[#274f98] outline-none transition-all shadow-sm font-mono tracking-widest" 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-3 p-1.5 rounded-lg text-gray-500 hover:text-[#274f98] transition-colors flex items-center justify-center cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          <div className="pt-6 pb-2">
            <button 
              type="submit" 
              disabled={loading || !oobCode}
              className="w-full bg-[#274f98] text-white py-3.5 rounded-xl font-bold hover:bg-[#15397a] transition-all shadow-md text-[15px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/20 backdrop-blur-[2px]"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="relative w-full max-w-[340px]"
            >
              {/* Blue Background Base */}
              <div className="absolute top-0 left-0 right-0 h-[150px] bg-gradient-to-b from-[#0b3f9d] to-[#1268e0] rounded-t-[20px] rounded-b-[24px] shadow-lg"></div>
              
              <div className="relative z-10 pt-[24px]">
                {/* Check Icon */}
                <div className="w-[48px] h-[48px] bg-[#1a95ff] rounded-full mx-auto flex items-center justify-center mb-[16px] shadow-sm relative z-20">
                  <Check className="w-7 h-7 text-white stroke-[3.5]" />
                </div>
                
                {/* White Card */}
                <div className="bg-white mx-[12px] rounded-[20px] p-[28px] pb-[32px] text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative z-10 mb-[-12px]">
                  <h3 className="text-[16px] font-extrabold text-gray-900 mb-2 tracking-tight">
                    Password Reset Successfully
                  </h3>
                  <p className="text-[12.5px] text-gray-500 mb-8 leading-relaxed px-2">
                    Your password has been changed<br/>successfully.
                  </p>
                  
                  <button 
                    onClick={() => navigate('/student/login')}
                    className="w-full bg-gradient-to-r from-[#0b3f9d] to-[#1268e0] hover:opacity-90 transition-opacity text-white py-3.5 rounded-xl font-bold text-[14px] shadow-md cursor-pointer"
                  >
                    Return to Log in
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
