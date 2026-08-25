import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { FileEdit, FileText, ClipboardCheck, Calendar, User, Upload, CheckCircle2, ChevronDown, ChevronUp, View, Eye, EyeOff, RefreshCw, Check,
  Image as ImageIcon, AlertCircle, Edit3, X, ArrowRight, ArrowLeft, Printer, Loader2 } from 'lucide-react';
import { db } from '../../lib/db';
import { dummyBase64Pdf, dummyBase64Photo2x2, dummyBase64StudentId, dummyBase64Signature } from '../../lib/defaultData';
import { motion } from 'motion/react';
import { SignaturePad } from '../../components/SignaturePad';
import { SubmissionReviewSummary } from '../../components/SubmissionReviewSummary';
import { SubmissionSuccessModal } from '../../components/SubmissionSuccessModal';
import { DocumentPreviewModal } from '../../components/DocumentPreviewModal';

import { signInWithGoogle, signInWithEmail, signUpWithEmail, logOut, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { uploadFileToSupabase, uploadBase64ToSupabase, isSupabaseConfigured } from '../../lib/supabase';

export function StudentLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('studentAuth') === 'true') {
      navigate('/student/dashboard', { replace: true });
    }
  }, [navigate]);

  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const fbUser = await signInWithGoogle();
      
      let user = await db.users.get(fbUser.uid);
      if (!user) {
        user = await db.users.findByEmail(fbUser.email || '');
      }
      if (!user) {
        const rawName = (fbUser.displayName || '').trim();
        const parts = rawName ? rawName.split(/\s+/) : [];
        let fName = parts[0] || 'Student';
        let lName = parts.slice(1).join(' ') || '';
        if (parts.length > 2) {
          fName = parts.slice(0, -1).join(' ');
          lName = parts[parts.length - 1];
        }
        user = {
          id: fbUser.uid,
          email: fbUser.email || '',
          firstName: fName,
          lastName: lName,
          role: 'student' as const
        };
        await db.users.set(user.id, user);
      }
      localStorage.setItem('studentAuth', 'true');
      localStorage.setItem('studentUser', JSON.stringify(user));
      navigate('/student/dashboard');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized in Firebase. Add this URL to Firebase Auth settings in Firebase Console.');
      } else {
        console.error("Student login error", err);
        setError('Failed to sign in with Google. If previewing, try opening in a new tab.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const cleanEmail = email.trim();
      if (isLogin) {
        let fbUser = null;
        try {
          fbUser = await signInWithEmail(cleanEmail, password);
        } catch (authErr: any) {
          const errCode = authErr?.code || '';
          const errMsg = authErr?.message || '';
          const isInvalidCred = 
            errCode === 'auth/invalid-credential' || 
            errCode === 'auth/wrong-password' || 
            errCode === 'auth/user-not-found' ||
            errCode === 'auth/invalid-login-credentials' ||
            errMsg.includes('auth/invalid-credential');

          if (isInvalidCred) {
            // Check local / offline database first
            const localUser = await db.users.findByEmail(cleanEmail);
            if (localUser && (!localUser.password || localUser.password === password)) {
              try {
                const fbReg = await signUpWithEmail(cleanEmail, password, `${localUser.firstName} ${localUser.lastName}`);
                if (fbReg) fbUser = fbReg;
              } catch (_) {}
              localStorage.setItem('studentAuth', 'true');
              localStorage.setItem('studentUser', JSON.stringify(localUser));
              navigate('/student/dashboard');
              return;
            }

            // Demo student account fallback for instant testing
            const isDemoStudent = 
              (cleanEmail.toLowerCase() === 'student@capsu.edu' || 
               cleanEmail.toLowerCase() === 'anna.santos@capsu.edu' || 
               cleanEmail.toLowerCase() === 'santos.anna@capsu.edu') &&
              (password === 'student123' || password === 'admin123' || password === 'password123' || password === '123456');

            if (isDemoStudent) {
              const demoStudent = {
                id: 'student-seed-anna',
                email: cleanEmail,
                firstName: 'Anna Marie',
                lastName: 'Santos',
                role: 'student' as const
              };
              await db.users.set(demoStudent.id, demoStudent);
              localStorage.setItem('studentAuth', 'true');
              localStorage.setItem('studentUser', JSON.stringify(demoStudent));
              navigate('/student/dashboard');
              return;
            }

            setError('Account not found or password incorrect. If this is your first time, please click the "Register" tab above to create an account.');
            return;
          } else if (errCode === 'auth/too-many-requests') {
            setError('Access temporarily disabled due to many failed login attempts. Please wait a moment and try again.');
            return;
          } else if (errCode === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
            return;
          } else {
            const localUser = await db.users.findByEmail(cleanEmail);
            if (localUser && (!localUser.password || localUser.password === password)) {
              localStorage.setItem('studentAuth', 'true');
              localStorage.setItem('studentUser', JSON.stringify(localUser));
              navigate('/student/dashboard');
              return;
            }
            setError('Unable to log in. Please verify your credentials or click "Register" to create a new account.');
            return;
          }
        }

        if (fbUser) {
          let user = await db.users.get(fbUser.uid);
          if (!user && fbUser.email) {
            user = await db.users.findByEmail(fbUser.email);
          }
          if (!user) {
            const rawName = (fbUser.displayName || '').trim();
            const parts = rawName ? rawName.split(/\s+/) : [];
            user = {
              id: fbUser.uid,
              email: fbUser.email || cleanEmail,
              firstName: parts[0] || 'Student',
              lastName: parts.slice(1).join(' ') || '',
              role: 'student' as const
            };
            await db.users.set(user.id, user);
          }
          localStorage.setItem('studentAuth', 'true');
          localStorage.setItem('studentUser', JSON.stringify(user));
          navigate('/student/dashboard');
        }
      } else {
        // Registration Flow
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        let fbUser = null;
        try {
          fbUser = await signUpWithEmail(cleanEmail, password, fullName);
        } catch (authErr: any) {
          if (authErr?.code === 'auth/email-already-in-use') {
            setError('This email is already registered. Please switch to the "Log In" tab.');
            return;
          } else if (authErr?.code === 'auth/weak-password') {
            setError('Password is too weak. Please use at least 6 characters.');
            return;
          } else if (authErr?.code === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
            return;
          } else {
            console.warn("Firebase email signup notice:", authErr);
            const existing = await db.users.findByEmail(cleanEmail);
            if (existing) {
              setError('This email is already registered. Please log in.');
              return;
            }
          }
        }

        const userId = fbUser ? fbUser.uid : `user-${Date.now()}`;
        const newUser = {
          id: userId,
          email: cleanEmail,
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: 'student' as const
        };
        await db.users.set(newUser.id, newUser);
        localStorage.setItem('studentAuth', 'true');
        localStorage.setItem('studentUser', JSON.stringify(newUser));
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      console.error("Auth submit error:", err);
      setError(err?.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/BI.png')] bg-cover bg-center p-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative bg-[#a5d8ff] p-8 rounded-[32px] shadow-2xl w-full max-w-[380px] text-center"
      >
        <div className="mx-auto h-16 flex items-center justify-center mb-3">
          <img src="/capsu-logo.png" alt="Logo" className="h-full object-contain" />
        </div>
        <h1 className="text-lg font-bold text-[#0f2e60] mb-3 leading-snug">Web-Based Scholarship Submission<br/>Alert System</h1>
        
        <div className="inline-block bg-[#5daef5] text-white px-5 py-1 rounded-full text-[11px] font-semibold mb-6 shadow-sm tracking-wide">
          Student Portal
        </div>

        <div className="flex bg-white/40 backdrop-blur-sm rounded-full p-1 mb-5 shadow-sm border border-white/40">
          <button 
            type="button"
            className={cn("flex-1 py-1.5 text-[12px] font-bold rounded-full transition-all cursor-pointer", !isLogin ? "bg-[#3984be] text-white shadow-md" : "text-[#0f2e60] hover:bg-white/50")}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Register
          </button>
          <button 
            type="button"
            className={cn("flex-1 py-1.5 text-[12px] font-bold rounded-full transition-all cursor-pointer", isLogin ? "bg-[#3984be] text-white shadow-md" : "text-[#0f2e60] hover:bg-white/50")}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Log In
          </button>
        </div>
        
        {error && <div className="text-red-600 text-xs font-semibold text-center mb-3 bg-red-100/80 p-2 rounded-lg border border-red-200">{error}</div>}

        <button 
          type="button" 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-gray-700 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm flex items-center justify-center gap-2 border border-white/60 mb-4 cursor-pointer disabled:opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="h-px bg-[#0f2e60]/10 flex-1"></div>
          <span className="text-[10px] text-[#0f2e60]/40 font-bold uppercase tracking-wider">Or</span>
          <div className="h-px bg-[#0f2e60]/10 flex-1"></div>
        </div>
        
        <form className="space-y-3" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="flex gap-2">
              <div className="text-left flex-1">
                <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1">First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required={!isLogin} className="w-full px-4 py-2 bg-white rounded text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" />
              </div>
              <div className="text-left flex-1">
                <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1">Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required={!isLogin} className="w-full px-4 py-2 bg-white rounded text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" />
              </div>
            </div>
          )}

          <div className="text-left">
            <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2.5 bg-white rounded text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" />
          </div>

          <div className="text-left">
            <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1">Password</label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                placeholder="Enter password"
                className="w-full px-4 py-2.5 pr-11 bg-white rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 p-1.5 rounded-lg text-gray-400 hover:text-[#0f2e60] hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all flex items-center justify-center cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-[#1864db]" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>
            {isLogin ? (
              <div className="text-right mt-1">
                <a href="#" className="text-[11px] text-[#0f2e60]/70 hover:text-[#0f2e60] hover:underline px-1">Forgot Password?</a>
              </div>
            ) : (
              <p className="text-[10px] text-[#0f2e60]/50 mt-1 px-1">At least 6 characters</p>
            )}
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1864db] text-white py-2.5 rounded-full font-medium hover:bg-[#124b9f] transition-colors shadow-md shadow-blue-900/20 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Log In' : 'Create Account')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function findUserSubmission(subs: any[], u: { id?: string; email?: string; firstName?: string; lastName?: string } | null): any | null {
  if (!u || (!u.email && !u.id && !u.firstName && !u.lastName)) return null;

  const uEmail = (u.email || '').toLowerCase().trim();
  const uId = (u.id || '').trim().toLowerCase();
  const uFirst = (u.firstName || '').toLowerCase().trim();
  const uLast = (u.lastName || '').toLowerCase().trim();
  const uFullName = `${uFirst} ${uLast}`.trim();

  return subs.find(s => {
    if (!s) return false;
    const sStudentId = (s.studentId || '').toLowerCase().trim();
    const sEmail = (s.email || '').toLowerCase().trim();
    const sDataEmail = (s.data?.email || '').toLowerCase().trim();
    const sStudentName = (s.studentName || s.student || '').toLowerCase().trim();
    const sDataFirst = (s.data?.firstName || '').toLowerCase().trim();
    const sDataLast = (s.data?.familyName || '').toLowerCase().trim();

    // 1. Match by Email
    if (uEmail && (sEmail === uEmail || sDataEmail === uEmail || sStudentId === uEmail)) return true;
    
    // 2. Match by Student ID
    if (uId && (sStudentId === uId || s.id === uId)) return true;

    // 3. Match by exact Full Name or data fields
    if (uFullName && (sStudentName === uFullName || (sDataFirst === uFirst && sDataLast === uLast))) return true;

    // 4. Match if both first name and last name exist in student name
    if (uFirst && uLast && (sStudentName.includes(uFirst) && sStudentName.includes(uLast))) return true;

    return false;
  }) || null;
}

export function StudentLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{email?: string; firstName?: string; lastName?: string; id?: string} | null>(() => {
    if (typeof window === 'undefined') return null;
    const sessionStr = localStorage.getItem('studentUser');
    return sessionStr ? JSON.parse(sessionStr) : null;
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        let u = await db.users.get(fbUser.uid);
        if (!u && fbUser.email) {
          u = await db.users.findByEmail(fbUser.email);
        }
        if (u) {
          setUser(u);
          localStorage.setItem('studentUser', JSON.stringify(u));
        } else {
          const rawName = (fbUser.displayName || '').trim();
          const parts = rawName ? rawName.split(/\s+/) : [];
          const fallbackUser = {
            id: fbUser.uid,
            email: fbUser.email || '',
            firstName: parts[0] || 'Student',
            lastName: parts.slice(1).join(' ') || '',
            role: 'student' as const
          };
          setUser(fallbackUser);
          localStorage.setItem('studentUser', JSON.stringify(fallbackUser));
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans">
      {/* Top Navbar */}
      <header className="bg-[#2b64b1] text-white py-2.5 sm:py-3 px-3 sm:px-6 md:px-8 shadow-sm flex flex-wrap justify-between items-center sticky top-0 z-50 gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img src="/capsu-logo.png" alt="CAPSU Logo" className="w-7 h-7 sm:w-9 sm:h-9 object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm md:text-[16px] font-bold tracking-tight leading-tight truncate sm:whitespace-normal">
              Web-Based Scholarship Submission Alert System
            </h1>
            <p className="text-[10px] sm:text-xs font-semibold text-blue-100 leading-tight">Student Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm max-w-[170px] sm:max-w-[240px] truncate">
            <User className="w-3.5 h-3.5 shrink-0 text-white" />
            <span className="truncate">{user?.email || auth.currentUser?.email || 'student@gmail.com'}</span>
          </div>
          <button 
            onClick={async () => {
              await logOut();
              localStorage.removeItem('studentAuth');
              localStorage.removeItem('studentUser');
              navigate('/student/login');
            }} 
            className="text-[11px] sm:text-xs font-bold text-white bg-white/20 hover:bg-white/30 transition-colors px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{id?: string, firstName?: string, lastName?: string, email?: string} | null>(() => {
    if (typeof window === 'undefined') return null;
    const sessionStr = localStorage.getItem('studentUser');
    return sessionStr ? JSON.parse(sessionStr) : null;
  });
  const [openDropdown, setOpenDropdown] = useState<'1st' | '2nd' | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState<any>(null);
          
  // Hardcode available semesters for demonstration (1st is available, 2nd is not)
  const availableSemesters = ['1st'];

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        let u = await db.users.get(fbUser.uid);
        if (!u && fbUser.email) {
          u = await db.users.findByEmail(fbUser.email);
        }
        if (u) {
          setUser(u);
          localStorage.setItem('studentUser', JSON.stringify(u));
        } else {
          const rawName = (fbUser.displayName || '').trim();
          const parts = rawName ? rawName.split(/\s+/) : [];
          const fallbackUser = {
            id: fbUser.uid,
            email: fbUser.email || '',
            firstName: parts[0] || 'Student',
            lastName: parts.slice(1).join(' ') || '',
            role: 'student' as const
          };
          setUser(fallbackUser);
          localStorage.setItem('studentUser', JSON.stringify(fallbackUser));
        }
      }
    });
    return () => unsubAuth();
  }, []);

  React.useEffect(() => {
    const effectiveUser = user || (auth.currentUser ? {
      id: auth.currentUser.uid,
      email: auth.currentUser.email || '',
      firstName: auth.currentUser.displayName?.split(' ')[0] || '',
      lastName: auth.currentUser.displayName?.split(' ').slice(1).join(' ') || ''
    } : null);

    if (!effectiveUser) return;
    
    db.submissions.listAll().then(subs => {
      setExistingSubmission(findUserSubmission(subs, effectiveUser));
    });

    const unsub = db.submissions.subscribe(subs => {
      setExistingSubmission(findUserSubmission(subs, effectiveUser));
    });
    return unsub;
  }, [user]);

  const toggleDropdown = (sem: '1st' | '2nd') => {
    if (!availableSemesters.includes(sem)) return;
    setOpenDropdown(prev => prev === sem ? null : sem);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert("Only image files are accepted. Please upload an image format (e.g., PNG, JPG).");
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit. Please upload a smaller file.");
        e.target.value = '';
        return;
      }
      setFiles(prev => ({ ...prev, [key]: file }));
    }
  };

  const handleSubmit = async (sem: '1st' | '2nd') => {
    const rfKey = `${sem}_rf`;
    const gwaKey = `${sem}_gwa`;
    
    if (!files[rfKey] || !files[gwaKey]) {
      alert('Please upload both the Registration Form (RF) and General Weighted Average (GWA) documents.');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show Toast instead of alert
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    
    // Clear state
    setFiles(prev => ({ ...prev, [rfKey]: null, [gwaKey]: null }));
    setOpenDropdown(null);
    setIsSubmitting(false);
  };

  const renderFileButton = (key: string) => {
    const file = files[key];
    if (file) {
      return (
        <label className="flex items-center gap-2 border border-[#9ca3af] text-[#0c2340] bg-[#eef2ff] px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#e0e7ff] transition-colors cursor-pointer w-full sm:w-[220px] overflow-hidden shadow-xs shrink-0">
          <ImageIcon className="w-4 h-4 shrink-0 text-[#1e3a8a]" />
          <span className="truncate flex-1">{file.name}</span>
          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, key)} />
        </label>
      );
    }
    return (
      <label className="flex items-center justify-center gap-2 border border-[#9ca3af] text-[#0c2340] bg-[#f8fafc] px-4 sm:px-6 py-2 rounded-lg text-xs font-bold hover:bg-[#e2e8f0] transition-colors cursor-pointer w-full sm:w-[220px] shadow-xs shrink-0">
        <Upload className="w-4 h-4 shrink-0 text-[#1e3a8a]" />
        <span>Add File</span>
        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, key)} />
      </label>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-[900px] mx-auto mt-4 sm:mt-6 pb-32 relative px-4 sm:px-6 md:px-0">
      {/* Hello Banner */}
      <div className="bg-gradient-to-r from-[#3b82f6] to-[#1e5088] rounded-2xl md:rounded-[10px] p-5 sm:p-8 md:px-12 md:py-10 text-white shadow-md">
        <h2 className="text-xl sm:text-2xl md:text-[32px] font-bold tracking-tight">
          Hello, {user ? `${user.firstName} ${user.lastName}` : 'Anna Santos'}!
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Card 1: Scholarship Requirements */}
        <div className="bg-white rounded-2xl md:rounded-full p-5 sm:p-6 md:px-12 shadow-[0_4px_20px_rgb(0,0,0,0.06)] flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 gap-4 min-h-[100px]">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-[#0c2340] leading-snug">
              Scholarship Requirements
            </h3>
            <p className="text-gray-500 mt-1 text-xs sm:text-sm md:text-base leading-relaxed">
              Fill up a scholarship form and upload the required documents.
            </p>
          </div>
          <button 
            onClick={() => navigate('/student/submission')}
            className="w-full sm:w-auto px-6 sm:px-8 md:px-12 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm min-w-[130px] flex items-center justify-center text-xs sm:text-sm shrink-0 cursor-pointer"
          >
            {existingSubmission ? 'Edit' : 'Enter'}
          </button>
        </div>

        {/* Card 2 with Dropdown: 1st Semester */}
        <div className="bg-white rounded-2xl md:rounded-[28px] shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-200 overflow-hidden transition-all">
          <div className="p-5 sm:p-6 md:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[100px]">
            <div className="flex-1 min-w-0">
              <h3 className={cn("text-lg sm:text-xl md:text-[22px] font-bold leading-snug", availableSemesters.includes('1st') ? "text-[#0c2340]" : "text-[#6b7280]")}>
                1st Semester <span className={cn("underline underline-offset-[6px] decoration-2", availableSemesters.includes('1st') ? "text-[#0c2340]" : "text-[#9ca3af]")}>(2026-2027)</span>
              </h3>
              <p className="text-gray-500 mt-1 text-xs sm:text-sm md:text-base leading-relaxed">
                Upload the required documents <span className="italic font-medium font-serif text-gray-500">(for current students)</span>
              </p>
            </div>
            <button 
              onClick={() => toggleDropdown('1st')}
              disabled={!availableSemesters.includes('1st')}
              className={cn(
                "w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold flex items-center justify-center gap-2 border min-w-[130px] transition-colors text-xs sm:text-sm shrink-0 cursor-pointer",
                !availableSemesters.includes('1st') 
                  ? "bg-[#e2e8f0] text-[#94a3b8] border-[#cbd5e1] cursor-not-allowed" 
                  : openDropdown === '1st'
                    ? "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd]"
                    : "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd] hover:bg-[#bfdbfe]"
              )}
            >
              <span>Submit</span>
              {openDropdown === '1st' ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              )}
            </button>
          </div>
          
          {openDropdown === '1st' && (
            <div className="border-t border-gray-100 bg-[#f8fafc] p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-200">
                  <div>
                    <h4 className="font-bold text-[#0c2340] text-sm sm:text-base leading-tight">RF</h4>
                    <p className="text-gray-500 text-xs sm:text-sm">Registration Form</p>
                  </div>
                  {renderFileButton('1st_rf')}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-200">
                  <div>
                    <h4 className="font-bold text-[#0c2340] text-sm sm:text-base leading-tight">GWA</h4>
                    <p className="text-gray-500 text-xs sm:text-sm">General Weighted Average</p>
                  </div>
                  {renderFileButton('1st_gwa')}
                </div>
                
                <button 
                  onClick={() => handleSubmit('1st')}
                  disabled={isSubmitting}
                  className="w-full bg-[#2b4c8a] text-white py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#1e3a8a] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer mt-2"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Submit Documents'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card 3 with Dropdown: 2nd Semester */}
        <div className="bg-white rounded-2xl md:rounded-[28px] shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-200 overflow-hidden transition-all">
          <div className="p-5 sm:p-6 md:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[100px]">
            <div className="flex-1 min-w-0">
              <h3 className={cn("text-lg sm:text-xl md:text-[22px] font-bold leading-snug", availableSemesters.includes('2nd') ? "text-[#0c2340]" : "text-[#6b7280]")}>
                2nd Semester <span className={cn("underline underline-offset-[6px] decoration-2", availableSemesters.includes('2nd') ? "text-[#0c2340]" : "text-[#9ca3af]")}>(2026-2027)</span>
              </h3>
              <p className="text-gray-500 mt-1 text-xs sm:text-sm md:text-base leading-relaxed">
                Upload the required documents <span className="italic font-medium font-serif text-gray-500">(for current students)</span>
              </p>
            </div>
            <button 
              onClick={() => toggleDropdown('2nd')}
              disabled={!availableSemesters.includes('2nd')}
              className={cn(
                "w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold flex items-center justify-center gap-2 border min-w-[130px] transition-colors text-xs sm:text-sm shrink-0 cursor-pointer",
                !availableSemesters.includes('2nd') 
                  ? "bg-[#e2e8f0] text-[#94a3b8] border-[#cbd5e1] cursor-not-allowed" 
                  : openDropdown === '2nd'
                    ? "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd]"
                    : "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd] hover:bg-[#bfdbfe]"
              )}
            >
              <span>Submit</span>
              {openDropdown === '2nd' ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              )}
            </button>
          </div>
          
          {openDropdown === '2nd' && (
            <div className="border-t border-gray-100 bg-[#f8fafc] p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-200">
                  <div>
                    <h4 className="font-bold text-[#0c2340] text-sm sm:text-base leading-tight">RF</h4>
                    <p className="text-gray-500 text-xs sm:text-sm">Registration Form</p>
                  </div>
                  {renderFileButton('2nd_rf')}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-200">
                  <div>
                    <h4 className="font-bold text-[#0c2340] text-sm sm:text-base leading-tight">GWA</h4>
                    <p className="text-gray-500 text-xs sm:text-sm">General Weighted Average</p>
                  </div>
                  {renderFileButton('2nd_gwa')}
                </div>
                
                <button 
                  onClick={() => handleSubmit('2nd')}
                  disabled={isSubmitting}
                  className="w-full bg-[#2b4c8a] text-white py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#1e3a8a] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer mt-2"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Submit Documents'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 sm:left-10 sm:translate-x-0 bg-[#bbf7d0] border border-[#86efac] px-6 py-3.5 rounded-full shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="w-6 h-6 bg-[#16a34a] rounded-full flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-white" strokeWidth={4} />
          </div>
          <span className="text-[#166534] font-bold text-[14px]">Successfully submitted!</span>
        </div>
      )}
    </div>
  );
}

interface InputGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  id?: string;
  placeholder?: string;
  type?: string;
}

const InputGroup = ({ label, name, value, onChange, required, error, id, placeholder, type = "text" }: InputGroupProps) => (
  <div className="flex flex-col" id={id || `field-${name}`}>
    <label className="text-[11px] font-bold text-[#0f2e60] mb-1 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500 font-bold">*</span>}
    </label>
    <input 
      type={type} 
      name={name} 
      value={value || ''} 
      placeholder={placeholder}
      onChange={onChange} 
      className={`border rounded px-3 py-1.5 text-sm outline-none transition-colors ${
        error ? 'border-red-500 bg-red-50/30 focus:ring-1 focus:ring-red-500' : 'border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]'
      }`} 
    />
    {error && <span className="text-[10px] text-red-600 font-semibold mt-0.5">{error}</span>}
  </div>
);

interface SelectGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  error?: string;
  id?: string;
}

const SelectGroup = ({ label, name, value, onChange, options, required, error, id }: SelectGroupProps) => (
  <div className="flex flex-col relative" id={id || `field-${name}`}>
    <label className="text-[11px] font-bold text-[#0f2e60] mb-1 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500 font-bold">*</span>}
    </label>
    <select 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      className={`border rounded px-3 py-1.5 text-sm outline-none appearance-none bg-white transition-colors ${
        error ? 'border-red-500 bg-red-50/30 focus:ring-1 focus:ring-red-500' : 'border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]'
      }`}
    >
      <option value="" disabled>Select {label.toLowerCase()}</option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <ChevronDown className="w-4 h-4 text-[#1e3a8a] absolute right-2 bottom-2 pointer-events-none" />
    {error && <span className="text-[10px] text-red-600 font-semibold mt-0.5">{error}</span>}
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-[#1846b0] text-white text-center py-2.5 rounded-lg font-bold tracking-wider mb-6 text-sm mt-8">{title}</div>
);

export function StudentSubmissionForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationWarning, setValidationWarning] = useState<{ title: string; details: string[] } | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [successModalData, setSuccessModalData] = useState<{
    referenceNo: string;
    studentName: string;
    studentId: string;
    scholarshipType: string;
    submittedAt: string;
    filesCount: number;
    course?: string;
    yearLevel?: string;
    data: any;
  } | null>(null);
  const [previewFile, setPreviewFile] = useState<any | null>(null);

  const [formData, setFormData] = useState(() => {
    let initialUser: any = {};
    if (typeof window !== 'undefined') {
      const sessionStr = localStorage.getItem('studentUser');
      if (sessionStr) {
        try { initialUser = JSON.parse(sessionStr); } catch { /* ignore */ }
      }
    }
    return {
      // Page 1
      photo2x2: '', 
      familyName: initialUser.lastName || '', 
      middleName: '', 
      firstName: initialUser.firstName || '', 
      birthdate: '', 
      age: '', 
      sex: '', 
      yearLevel: '', 
      course: '', 
      section: '', 
      civilStatus: '', 
      contactNo: '', 
      email: initialUser.email || '', 
      permanentAddress: '', 
      fatherName: '', 
      fatherOccupation: '', 
      fatherContact: '', 
      motherName: '', 
      motherOccupation: '', 
      motherContact: '', 
      guardianName: '', 
      guardianOccupation: '', 
      guardianContact: '',
      // Page 2
      parentEduAttainment: '', 
      monthlyIncome: '', 
      firstInFamily: '', 
      livingWith: '', 
      livingWithOthers: '', 
      housingType: '', 
      housingTypeOthers: '',
      // Page 3
      accessToResources: [] as string[], 
      workingStudent: '', 
      studentClassification: [] as string[], 
      studentClassificationOthers: '',
      // Page 4
      workTypeIncome: '', 
      specialNeedsCondition: '', 
      pdlReason: '', 
      scholarshipFundType: '', 
      internalCategory: '', 
      internalCategoryOthers: '', 
      externalCategory: '', 
      externalCategoryOthers: '',
      // External specifics
      chedSubCategory: '', 
      chedCongressionalDistrict: '', 
      chedOneTown: '', 
      chedTulongDunong: '', 
      chedOthers: '', 
      meritSubCategory: '', 
      lguContact: '', 
      dswdMunicipality: '', 
      dswdContact: '', 
      dswdDesignation: '', 
      dswdOthers: '', 
      signature: ''
    };
  });

  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    let sessionUser: any = null;
    const sessionStr = localStorage.getItem('studentUser');
    if (sessionStr) {
      try { sessionUser = JSON.parse(sessionStr); } catch (e) { /* ignore */ }
    }

    const loadUserDataAndSubmission = (user: any) => {
      if (!user) return;

      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || user.firstName || '',
        familyName: prev.familyName || user.lastName || '',
        email: prev.email || user.email || ''
      }));

      const loadExisting = (existing: any) => {
        if (existing) {
          setExistingId(existing.id);
          setFormData(prev => {
            const data = existing.data || {};
            const unifiedExternal = data.externalCategory || data.chedSubCategory || data.meritSubCategory || '';
            return {
              ...prev,
              firstName: data.firstName || user.firstName || prev.firstName,
              familyName: data.familyName || user.lastName || prev.familyName,
              email: data.email || user.email || prev.email,
              ...data,
              externalCategory: unifiedExternal
            };
          });
          
          if (existing.files && Array.isArray(existing.files) && existing.files.length > 0) {
            setFiles(existing.files.map((f: any) => ({
              id: f.id || `file-${Date.now()}`,
              name: f.name,
              category: f.category,
              type: f.type,
              size: f.size || '',
              data: f.data,
              verified: f.verified || false,
              status: f.status || 'Pending',
              uploadedAt: f.uploadedAt
            })));
          }
        } else {
          setExistingId(null);
        }
      };

      db.submissions.listAll().then(subs => {
        loadExisting(findUserSubmission(subs, user));
      });

      const unsub = db.submissions.subscribe(subs => {
        loadExisting(findUserSubmission(subs, user));
      });
      return unsub;
    };

    let cleanupSub: (() => void) | undefined;
    if (sessionUser) {
      cleanupSub = loadUserDataAndSubmission(sessionUser);
    }

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        let u = await db.users.get(fbUser.uid);
        if (!u && fbUser.email) {
          u = await db.users.findByEmail(fbUser.email);
        }
        if (!u) {
          const rawName = (fbUser.displayName || '').trim();
          const parts = rawName ? rawName.split(/\s+/) : [];
          u = {
            id: fbUser.uid,
            email: fbUser.email || '',
            firstName: parts[0] || 'Student',
            lastName: parts.slice(1).join(' ') || '',
            role: 'student' as const
          };
        }
        localStorage.setItem('studentUser', JSON.stringify(u));
        if (cleanupSub) cleanupSub();
        cleanupSub = loadUserDataAndSubmission(u);
      }
    });

    return () => {
      if (cleanupSub) cleanupSub();
      unsubAuth();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Maintain existing special logic for externalCategory if needed
      if (name === 'externalCategory') {
        if (['VIC', 'Capizeño Circle', 'DOST', 'GRF'].includes(value)) {
          updated.meritSubCategory = value;
          updated.chedSubCategory = '';
        } else if (['LGU', 'DSWD'].includes(value)) {
          updated.meritSubCategory = '';
          updated.chedSubCategory = '';
        } else {
          updated.chedSubCategory = value;
          updated.meritSubCategory = '';
        }
      }
      return updated;
    });
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'externalCategory') {
        updated.externalCategory = value;
        if (['VIC', 'Capizeño Circle', 'DOST', 'GRF'].includes(value)) {
          updated.meritSubCategory = value;
          updated.chedSubCategory = '';
        } else if (['LGU', 'DSWD'].includes(value)) {
          updated.meritSubCategory = '';
          updated.chedSubCategory = '';
        } else {
          updated.chedSubCategory = value;
          updated.meritSubCategory = '';
        }
      }
      return updated;
    });
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev: any) => {
      const current = prev[field] as string[];
      if (current.includes(value)) return { ...prev, [field]: current.filter(v => v !== value) };
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setValidationWarning({
          title: 'Photo is too large',
          details: ['Please upload an image smaller than 10MB.']
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = async (event) => {
        const localData = event.target?.result as string;
        setFormData(prev => ({ ...prev, photo2x2: localData }));

        if (isSupabaseConfigured()) {
          const userStr = localStorage.getItem('studentUser');
          const uid = userStr ? (JSON.parse(userStr)?.id || 'user') : 'user';
          const ext = file.name.split('.').pop() || 'png';
          const path = `photos/${uid}_2x2_${Date.now()}.${ext}`;
          const publicUrl = await uploadFileToSupabase(file, path);
          if (publicUrl) {
            setFormData(prev => ({ ...prev, photo2x2: publicUrl }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    const missingLabels: string[] = [];

    if (!formData.familyName || !formData.familyName.trim()) {
      newErrors.familyName = 'Family Name is required';
      missingLabels.push('Family Name');
    }
    if (!formData.firstName || !formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
      missingLabels.push('First Name');
    }
    if (!formData.birthdate) {
      newErrors.birthdate = 'Birthdate is required';
      missingLabels.push('Birthdate');
    }
    if (!formData.sex) {
      newErrors.sex = 'Sex is required';
      missingLabels.push('Sex (Male / Female)');
    }
    if (!formData.yearLevel) {
      newErrors.yearLevel = 'Year Level is required';
      missingLabels.push('Year Level');
    }
    if (!formData.course) {
      newErrors.course = 'Course is required';
      missingLabels.push('Course');
    }
    if (!formData.contactNo || !formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact No. is required';
      missingLabels.push('Contact No.');
    }
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required';
      missingLabels.push('Email / Gmail');
    }
    if (!formData.permanentAddress || !formData.permanentAddress.trim()) {
      newErrors.permanentAddress = 'Permanent Address is required';
      missingLabels.push('Permanent Address');
    }
    if (!formData.signature) {
      newErrors.signature = 'Applicant Signature is required';
      missingLabels.push("Applicant's Signature (Click signature box at the bottom to sign)");
    }

    setErrors(newErrors);

    if (missingLabels.length > 0) {
      setValidationWarning({
        title: `Please complete the following ${missingLabels.length} required item${missingLabels.length > 1 ? 's' : ''}:`,
        details: missingLabels
      });

      // Scroll smoothly to the first missing element
      const firstErrorKey = Object.keys(newErrors)[0];
      const targetId = firstErrorKey === 'signature' ? 'signature-box' : `field-${firstErrorKey}`;
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    setValidationWarning(null);
    return true;
  };

  const validateStep2 = () => {
    const requiredDocs = [
      { key: 'RF', label: 'Registration Form (RF)' },
      { key: 'GWA', label: 'General Weighted Average (GWA)' },
      { key: 'ID', label: 'Student ID' }
    ];

    const missing = requiredDocs.filter(d => !files.find((f: any) => f.category === d.key));
    if (missing.length > 0) {
      setValidationWarning({
        title: `Please upload the following ${missing.length} required document${missing.length > 1 ? 's' : ''}:`,
        details: missing.map(m => m.label)
      });
      return false;
    }
    setValidationWarning(null);
    return true;
  };

  const handleEditStep = (targetStep: number, sectionTargetId?: string) => {
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (sectionTargetId) {
      setTimeout(() => {
        const elem = document.getElementById(sectionTargetId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  };

  const handlePrintOrDownloadSummary = () => {
    if (!successModalData) return;
    
    let summaryText = `CAPIZ STATE UNIVERSITY - GUIDANCE & COUNSELING OFFICE\n`;
    summaryText += `OFFICIAL SCHOLARSHIP SUBMISSION SUMMARY & RECEIPT\n`;
    summaryText += `======================================================================\n\n`;
    summaryText += `Tracking Reference Code : ${successModalData.referenceNo}\n`;
    summaryText += `Submission Timestamp   : ${new Date(successModalData.submittedAt).toLocaleString()}\n`;
    summaryText += `Evaluation Status      : Pending Guidance Verification\n\n`;
    
    summaryText += `I. APPLICANT PERSONAL DETAILS\n`;
    summaryText += `----------------------------------------------------------------------\n`;
    summaryText += `Full Name              : ${successModalData.studentName}\n`;
    summaryText += `Student ID / Email     : ${successModalData.studentId}\n`;
    summaryText += `Course & Program       : ${formData.course || 'BSCS'}\n`;
    summaryText += `Year Level & Section   : ${formData.yearLevel || '1st Year'} ${formData.section ? `(Section ${formData.section})` : ''}\n`;
    summaryText += `Date of Birth & Age    : ${formData.birthdate || 'N/A'} (${formData.age || 'N/A'} years old)\n`;
    summaryText += `Sex & Civil Status     : ${formData.sex || 'N/A'} | ${formData.civilStatus || 'Single'}\n`;
    summaryText += `Contact Number         : ${formData.contactNo || 'N/A'}\n`;
    summaryText += `Email Address          : ${formData.email || 'N/A'}\n`;
    summaryText += `Permanent Home Address : ${formData.permanentAddress || 'N/A'}\n\n`;

    summaryText += `II. FAMILY BACKGROUND\n`;
    summaryText += `----------------------------------------------------------------------\n`;
    summaryText += `Father                 : ${formData.fatherName || 'N/A'} | Occupation: ${formData.fatherOccupation || 'N/A'} | Contact: ${formData.fatherContact || 'N/A'}\n`;
    summaryText += `Mother                 : ${formData.motherName || 'N/A'} | Occupation: ${formData.motherOccupation || 'N/A'} | Contact: ${formData.motherContact || 'N/A'}\n`;
    if (formData.guardianName) {
      summaryText += `Guardian               : ${formData.guardianName} | Occupation: ${formData.guardianOccupation || 'N/A'} | Contact: ${formData.guardianContact || 'N/A'}\n`;
    }
    summaryText += `\n`;

    summaryText += `III. SOCIO-ECONOMIC STATUS\n`;
    summaryText += `----------------------------------------------------------------------\n`;
    summaryText += `Parent Highest Education: ${formData.parentEduAttainment || 'N/A'}\n`;
    summaryText += `Monthly Household Income: ${formData.monthlyIncome || 'N/A'}\n`;
    summaryText += `First-Gen College Student: ${formData.firstInFamily || 'N/A'}\n`;
    summaryText += `Living Arrangement     : ${formData.livingWith || 'N/A'}\n`;
    summaryText += `Housing Type           : ${formData.housingType || 'N/A'}\n`;
    summaryText += `Working Student        : ${formData.workingStudent || 'No'} ${formData.workTypeIncome ? `(${formData.workTypeIncome})` : ''}\n`;
    if (formData.accessToResources && formData.accessToResources.length > 0) {
      summaryText += `Access to Resources    : ${formData.accessToResources.join(', ')}\n`;
    }
    summaryText += `\n`;

    summaryText += `IV. SCHOLARSHIP PROGRAM DETAILS\n`;
    summaryText += `----------------------------------------------------------------------\n`;
    summaryText += `Fund Classification    : ${formData.scholarshipFundType || 'External'}\n`;
    summaryText += `Scholarship Program    : ${successModalData.scholarshipType}\n\n`;

    summaryText += `V. SUBMITTED DOCUMENTARY REQUIREMENTS (${files.length})\n`;
    summaryText += `----------------------------------------------------------------------\n`;
    files.forEach((f, idx) => {
      summaryText += `${idx + 1}. [${f.category || 'DOC'}] ${f.name} — ${f.size || 'Attached'}\n`;
    });

    summaryText += `\n======================================================================\n`;
    summaryText += `Certification: All information provided herein has been certified authentic by the applicant.\n`;
    summaryText += `Guidance and Counseling Office - Capiz State University\n`;

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${successModalData.studentName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Scholarship_Summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const sessionStr = localStorage.getItem('studentUser');
      const user = sessionStr ? JSON.parse(sessionStr) : null;
      const effectiveStudentId = user?.email || user?.id || auth.currentUser?.email || auth.currentUser?.uid || formData.email || `STU-${Date.now()}`;
      const effectiveStudentName = `${formData.firstName} ${formData.familyName}`.trim() || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || auth.currentUser?.displayName || 'Anonymous Student';

      let scholarshipProgram = 'General Scholarship';
      if (formData.scholarshipFundType === 'Internal') {
        scholarshipProgram = `Internally-Funded (${formData.internalCategory || 'Institutional'}${formData.internalCategoryOthers ? ` - ${formData.internalCategoryOthers}` : ''})`;
      } else if (formData.scholarshipFundType === 'External') {
        const ext = formData.externalCategory || formData.chedSubCategory || formData.meritSubCategory || 'External Scholarship';
        let detail = ext;
        if (ext === 'Congressional District' && formData.chedCongressionalDistrict) detail += ` - ${formData.chedCongressionalDistrict}`;
        else if (ext === 'One Town One Scholar' && formData.chedOneTown) detail += ` - ${formData.chedOneTown}`;
        else if (ext === 'Tulong Dunong' && formData.chedTulongDunong) detail += ` - ${formData.chedTulongDunong}`;
        else if (ext === 'Others' && formData.chedOthers) detail += ` - ${formData.chedOthers}`;
        else if (ext === 'LGU' && formData.lguContact) detail += ` (${formData.lguContact})`;
        else if (ext === 'DSWD' && formData.dswdMunicipality) detail += ` (${formData.dswdMunicipality})`;
        scholarshipProgram = `Externally-Funded (${detail})`;
      } else {
        scholarshipProgram = formData.externalCategory || formData.internalCategory || 'General Scholarship';
      }

      const submission = {
        id: existingId || `SUB-${Date.now()}`,
        studentId: effectiveStudentId,
        studentName: effectiveStudentName,
        studentAuthId: auth.currentUser?.uid || user?.id || '',
        scholarshipType: scholarshipProgram,
        status: 'Pending' as const,
        submittedAt: new Date().toISOString(),
        data: {
          ...formData,
          email: formData.email || user?.email || auth.currentUser?.email || '',
          firstName: formData.firstName || user?.firstName || '',
          familyName: formData.familyName || user?.lastName || ''
        },
        files: files.map((f: any) => ({
          name: f.name,
          type: f.type,
          size: f.size,
          category: f.category,
          data: f.data,
          uploadedAt: f.uploadedAt || new Date().toISOString(),
          status: f.status || 'Pending' as const,
        }))
      };

      const referenceNo = `CAPSU-SCH-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      
      if (existingId) {
        await db.submissions.update(existingId, submission);
      } else {
        await db.submissions.create(submission);
      }

      // Add real-time notification alert to Guidance Office
      try {
        await db.notifications.create({
          type: 'submission',
          title: existingId ? 'Scholarship Application Updated' : 'New Scholarship Application Submitted',
          description: `${effectiveStudentName} (${formData.course || 'BSCS'}) submitted requirements for ${scholarshipProgram}.`,
          studentName: effectiveStudentName,
          studentId: effectiveStudentId,
          scholarship: scholarshipProgram,
          timestamp: 'Just now',
          read: false,
          priority: 'high'
        });
      } catch (notifErr) {
        console.warn("Notification sync notice:", notifErr);
      }

      setSuccessModalData({
        referenceNo,
        studentName: effectiveStudentName,
        studentId: effectiveStudentId,
        scholarshipType: scholarshipProgram,
        submittedAt: submission.submittedAt,
        filesCount: submission.files.length,
        course: formData.course,
        yearLevel: formData.yearLevel,
        data: submission.data
      });
      setSubmittedSuccess(true);
    } catch (e) {
      console.error(e);
      setValidationWarning({
        title: 'Error saving application',
        details: ['An error occurred while saving your application. Please try again.']
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryFileUpload = async (category: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setValidationWarning({
          title: 'Invalid file format',
          details: ['Only image files are accepted. Please upload an image format (e.g., PNG, JPG).']
        });
        e.target.value = '';
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setValidationWarning({
          title: 'File is too large',
          details: ['File size exceeds 25MB limit. Please upload a smaller file.']
        });
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
        const fileId = `file-${Date.now()}`;
        const newFileObj = { 
          id: fileId, 
          name: file.name, 
          category, 
          type: file.type, 
          size: sizeStr, 
          data: dataUrl, 
          verified: false, 
          status: 'Pending', 
          uploadedAt: new Date().toISOString() 
        };
        setFiles(prev => [...prev.filter(f => f.category !== category), newFileObj]);
        setValidationWarning(null);

        if (isSupabaseConfigured()) {
          const userStr = localStorage.getItem('studentUser');
          const uid = userStr ? (JSON.parse(userStr)?.id || 'student') : 'student';
          const ext = file.name.split('.').pop() || 'bin';
          const path = `docs/${uid}/${category.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.${ext}`;
          const publicUrl = await uploadFileToSupabase(file, path);
          if (publicUrl) {
            setFiles(prev => prev.map(f => f.id === fileId ? { ...f, data: publicUrl, url: publicUrl } : f));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderFileUpload = (label: string, id: string) => {
    const existingFile = files.find((f: any) => f.category === id);
    const isMissing = validationWarning && validationWarning.details.some(d => d.toLowerCase().includes(label.toLowerCase()) || d.includes(id));

    return (
      <div className={`border-2 ${
        existingFile 
          ? 'border-green-400 bg-green-50/20' 
          : isMissing 
          ? 'border-red-400 bg-red-50/30' 
          : 'border-dashed border-gray-300 bg-white hover:bg-gray-50'
      } p-6 rounded-xl text-center relative overflow-hidden transition-all shadow-sm`}>
        <input type="file" id={id} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0" onChange={(e) => handleCategoryFileUpload(id, e)} />
        {existingFile ? (
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#16a34a]" />
            </div>
            <p className="text-[#0c2340] font-bold text-sm">{existingFile.name}</p>
            <p className="text-gray-500 text-xs">{existingFile.size}</p>
            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewFile(existingFile);
                }}
                className="text-[11px] bg-white border border-green-300 hover:bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Eye className="w-3 h-3" /> Preview
              </button>
              <span className="text-[11px] text-blue-600 font-semibold hover:underline">Replace file</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className={`w-6 h-6 ${isMissing ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <p className="text-[#0c2340] font-bold text-sm flex items-center gap-1">
              {label} <span className="text-red-500">*</span>
            </p>
            <p className={`${isMissing ? 'text-red-600 font-bold' : 'text-[#d97706] font-semibold'} text-xs mt-1`}>
              {isMissing ? 'Document Required — Click to upload' : 'Click or drag file to upload (PNG, JPG)'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Progress Stepper */}
      <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-sm py-4 sm:py-8 px-4 sm:px-12 mb-6 sm:mb-8 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto">
        
        {/* Step 1 */}
        <div className="flex flex-col items-center shrink-0 w-[100px] sm:w-[140px]">
          <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-[18px] flex items-center justify-center shadow-md mb-2 sm:mb-3 z-10 relative transition-all ${
            step === 1 ? 'bg-[#1864db] shadow-blue-500/20 scale-105' : 
            step > 1 ? 'bg-[#16a34a] shadow-green-500/20' : 'bg-gray-200'
          }`}>
            {step > 1 ? (
              <Check className="w-5 h-5 sm:w-8 sm:h-8 text-white stroke-[3.5]" />
            ) : (
              <FileEdit className={`w-5 h-5 sm:w-7 sm:h-7 ${step === 1 ? 'text-white' : 'text-gray-500'}`} />
            )}
          </div>
          <span className={`font-bold uppercase text-center transition-all ${
            step === 1 ? 'text-[10px] sm:text-[13px] text-[#1e3a8a]' : 
            step > 1 ? 'text-[9px] sm:text-[11px] text-[#16a34a]' : 'text-[9px] sm:text-[11px] text-gray-400'
          }`}>Student Information</span>
        </div>

        <div className="w-6 sm:w-16 md:w-24 h-[2px] -mt-5 sm:-mt-8 shrink-0 bg-gray-300"></div>
        
        {/* Step 2 */}
        <div className="flex flex-col items-center shrink-0 w-[100px] sm:w-[140px]">
          <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-[18px] flex items-center justify-center shadow-md mb-2 sm:mb-3 z-10 relative transition-all ${
            step === 2 ? 'bg-[#1864db] shadow-blue-500/20 scale-105' : 
            step > 2 ? 'bg-[#16a34a] shadow-green-500/20' : 'bg-gray-200'
          }`}>
            {step > 2 ? (
              <Check className="w-5 h-5 sm:w-8 sm:h-8 text-white stroke-[3.5]" />
            ) : (
              <FileText className={`w-5 h-5 sm:w-7 sm:h-7 ${step === 2 ? 'text-white' : 'text-gray-500'}`} />
            )}
          </div>
          <span className={`font-bold uppercase text-center transition-all ${
            step === 2 ? 'text-[10px] sm:text-[13px] text-[#1e3a8a]' : 
            step > 2 ? 'text-[9px] sm:text-[11px] text-[#16a34a]' : 'text-[9px] sm:text-[11px] text-gray-400'
          }`}>Upload Files</span>
        </div>

        <div className="w-6 sm:w-16 md:w-24 h-[2px] -mt-5 sm:-mt-8 shrink-0 bg-gray-300"></div>
        
        {/* Step 3 */}
        <div className="flex flex-col items-center shrink-0 w-[100px] sm:w-[140px]">
          <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-[18px] flex items-center justify-center shadow-md mb-2 sm:mb-3 z-10 relative transition-all ${
            step === 3 ? 'bg-[#1864db] shadow-blue-500/20 scale-105' : 
            step > 3 ? 'bg-[#16a34a] shadow-green-500/20' : 'bg-gray-200'
          }`}>
            {step > 3 ? (
              <Check className="w-5 h-5 sm:w-8 sm:h-8 text-white stroke-[3.5]" />
            ) : (
              <ClipboardCheck className={`w-5 h-5 sm:w-7 sm:h-7 ${step === 3 ? 'text-white' : 'text-gray-500'}`} />
            )}
          </div>
          <span className={`font-bold uppercase text-center transition-all ${
            step === 3 ? 'text-[10px] sm:text-[13px] text-[#1e3a8a]' : 
            step > 3 ? 'text-[9px] sm:text-[11px] text-[#16a34a]' : 'text-[9px] sm:text-[11px] text-gray-400'
          }`}>Review</span>
        </div>

      </div>

      {submittedSuccess && (
        <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-center shadow-lg animate-in zoom-in-95 duration-300">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-1">
            Application {existingId ? 'Updated' : 'Submitted'} Successfully!
          </h3>
          <p className="text-xs sm:text-sm text-green-700">Redirecting to your student dashboard...</p>
        </div>
      )}

      {/* Validation Warning Alert */}
      {validationWarning && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-3.5 sm:p-4 mb-6 shadow-md animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-red-900">{validationWarning.title}</h4>
              <ul className="list-disc list-inside text-[11px] sm:text-xs text-red-700 font-medium mt-1.5 space-y-0.5">
                {validationWarning.details.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => setValidationWarning(null)} 
              className="text-red-500 hover:text-red-700 font-bold text-sm p-1 rounded hover:bg-red-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border-t-[5px] border-[#eab308]">
        <div className="p-4 sm:p-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-2 sm:mb-3">Scholarship Record Form</h2>
          <p className="text-xs sm:text-[13px] font-serif text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Data and Personal Information will be kept with utmost confidentiality and will be protected through RA 10173 also known as Data Privacy Act of 2012
          </p>
        </div>
      </div>
      <div className="bg-[#fef9c3] border border-[#facc15] rounded-lg p-3 mb-6">
        <p className="text-[#a16207] text-xs sm:text-[13px] text-center leading-relaxed">
          Please fill out all required fields (<span className="text-red-600 font-bold">*</span>) accurately and completely. This form will be reviewed by the Guidance Office prior to processing.
        </p>
      </div>

      {step === 1 && (
        <>
          <SectionHeader title="STUDENT DEMOGRAPHICS" />

          {/* Personal Information */}
          <div className="border border-[#93c5fd] rounded-lg mb-6 bg-white overflow-hidden shadow-sm">
            <div className="bg-[#e0e7ff] px-4 py-2 flex items-center gap-2 border-b border-[#93c5fd]">
              <User className="w-4 h-4 text-[#1e3a8a] font-bold" />
              <h3 className="font-bold text-[#1e3a8a] text-[13px]">Personal Information</h3>
            </div>
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="w-[120px] flex-shrink-0 flex flex-col items-center">
                <label className="w-[110px] h-[110px] border-2 border-dashed border-[#1e3a8a] mb-2 flex flex-col items-center justify-center overflow-hidden bg-white cursor-pointer hover:bg-blue-50/50 transition-colors group relative rounded">
                  {formData.photo2x2 ? (
                    <img src={formData.photo2x2} alt="2x2" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-center">
                      <User className="w-8 h-8 text-gray-300 group-hover:text-[#1e3a8a] transition-colors" />
                      <span className="text-[9px] text-gray-500 group-hover:text-[#1e3a8a] mt-1 font-semibold">Upload Photo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
                <label className="text-[11px] font-bold text-[#1e3a8a] underline underline-offset-2 cursor-pointer hover:text-blue-700">
                  2 × 2 Picture
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <InputGroup 
                    label="Family Name" 
                    name="familyName" 
                    value={formData.familyName} 
                    onChange={handleChange} 
                    required 
                    error={errors.familyName} 
                  />
                  <InputGroup 
                    label="Middle Name" 
                    name="middleName" 
                    value={formData.middleName} 
                    onChange={handleChange} 
                  />
                  <InputGroup 
                    label="First Name" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    required 
                    error={errors.firstName} 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1.5fr] gap-3 sm:gap-4">
                  <div className="flex flex-col relative" id="field-birthdate">
                    <label className="text-[11px] font-bold text-[#0f2e60] mb-1 flex items-center gap-1">
                      Birthdate <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        name="birthdate" 
                        value={formData.birthdate} 
                        onChange={handleChange} 
                        className={`w-full border rounded px-3 py-1.5 text-sm outline-none pr-8 transition-colors ${
                          errors.birthdate ? 'border-red-500 bg-red-50/30 focus:ring-1 focus:ring-red-500' : 'border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]'
                        }`} 
                      />
                      <Calendar className="w-4 h-4 text-[#1e3a8a] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.birthdate && <span className="text-[10px] text-red-600 font-semibold mt-0.5">{errors.birthdate}</span>}
                  </div>
                  <InputGroup label="Age" name="age" value={formData.age} onChange={handleChange} />
                  <div className="flex flex-col" id="field-sex">
                    <label className="text-[11px] font-bold text-[#0f2e60] mb-2 flex items-center gap-1">
                      Sex <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className={`flex items-center gap-4 p-1 rounded ${errors.sex ? 'bg-red-50 border border-red-300' : ''}`}>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0f2e60] cursor-pointer">
                        <input type="radio" name="sex" value="Male" checked={formData.sex === 'Male'} onChange={() => handleRadioChange('sex', 'Male')} className="w-3.5 h-3.5" /> Male
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0f2e60] cursor-pointer">
                        <input type="radio" name="sex" value="Female" checked={formData.sex === 'Female'} onChange={() => handleRadioChange('sex', 'Female')} className="w-3.5 h-3.5" /> Female
                      </label>
                    </div>
                    {errors.sex && <span className="text-[10px] text-red-600 font-semibold mt-0.5">{errors.sex}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1.5fr] gap-3 sm:gap-4">
                  <SelectGroup 
                    label="Year Level" 
                    name="yearLevel" 
                    value={formData.yearLevel} 
                    onChange={handleChange} 
                    options={['1st Year', '2nd Year', '3rd Year', '4th Year']} 
                    required 
                    error={errors.yearLevel} 
                  />
                  <SelectGroup 
                    label="Course" 
                    name="course" 
                    value={formData.course} 
                    onChange={handleChange} 
                    options={['BSCS', 'BSOA', 'BSFT', 'BAEL']} 
                    required 
                    error={errors.course} 
                  />
                  <SelectGroup label="Section" name="section" value={formData.section} onChange={handleChange} options={['A', 'B', 'C']} />
                  <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-[#0f2e60] mb-2">Civil Status</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0f2e60] cursor-pointer">
                        <input type="radio" name="civilStatus" value="Single" checked={formData.civilStatus === 'Single'} onChange={() => handleRadioChange('civilStatus', 'Single')} className="w-3.5 h-3.5" /> Single
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0f2e60] cursor-pointer">
                        <input type="radio" name="civilStatus" value="Married" checked={formData.civilStatus === 'Married'} onChange={() => handleRadioChange('civilStatus', 'Married')} className="w-3.5 h-3.5" /> Married
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <InputGroup 
                    label="Contact No." 
                    name="contactNo" 
                    value={formData.contactNo} 
                    onChange={handleChange} 
                    required 
                    error={errors.contactNo} 
                  />
                  <InputGroup 
                    label="Email / Gmail" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    error={errors.email} 
                  />
                </div>
                <InputGroup 
                  label="Permanent Address" 
                  name="permanentAddress" 
                  value={formData.permanentAddress} 
                  onChange={handleChange} 
                  required 
                  error={errors.permanentAddress} 
                />
              </div>
            </div>
          </div>

          {/* Family Background */}
          <div className="border border-[#93c5fd] rounded-lg mb-6 bg-white overflow-hidden shadow-sm">
            <div className="bg-[#e0e7ff] px-4 py-2 flex items-center gap-2 border-b border-[#93c5fd]">
              <User className="w-4 h-4 text-[#1e3a8a] font-bold" />
              <h3 className="font-bold text-[#1e3a8a] text-[13px]">Family Background</h3>
            </div>
            <div className="p-3 sm:p-4 space-y-6">
              <div>
                <div className="inline-block bg-[#e0e7ff] border border-[#1e3a8a] text-[#1e3a8a] text-[11px] font-bold px-4 py-0.5 rounded-sm mb-3">Father Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-[2fr_1.5fr_1.5fr] gap-3 sm:gap-4">
                  <InputGroup label="Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                  <InputGroup label="Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} />
                  <InputGroup label="Contact No." name="fatherContact" value={formData.fatherContact} onChange={handleChange} />
                </div>
              </div>
              <div>
                <div className="inline-block bg-[#e0e7ff] border border-[#1e3a8a] text-[#1e3a8a] text-[11px] font-bold px-4 py-0.5 rounded-sm mb-3">Mother Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-[2fr_1.5fr_1.5fr] gap-3 sm:gap-4">
                  <InputGroup label="Name (maiden name)" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="e.g. Maria Santos Dela Cruz" />
                  <InputGroup label="Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} />
                  <InputGroup label="Contact No." name="motherContact" value={formData.motherContact} onChange={handleChange} />
                </div>
              </div>
              <div>
                <div className="inline-block bg-[#e0e7ff] border border-[#1e3a8a] text-[#1e3a8a] text-[11px] font-bold px-4 py-0.5 rounded-sm mb-3">Guardian Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-[2fr_1.5fr_1.5fr] gap-3 sm:gap-4">
                  <InputGroup label="Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
                  <InputGroup label="Occupation" name="guardianOccupation" value={formData.guardianOccupation} onChange={handleChange} />
                  <InputGroup label="Contact No." name="guardianContact" value={formData.guardianContact} onChange={handleChange} />
                </div>
              </div>
              
              {/* Parent Edu Attainment & Monthly Income */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
                <div>
                  <SelectGroup 
                    label="Highest Educational Attainment of Parent/Guardian"
                    name="parentEduAttainment"
                    value={formData.parentEduAttainment}
                    onChange={handleChange}
                    options={['Elementary Level', 'Elementary Graduate', 'High school Graduate', 'College Graduate', 'High School Level', 'College Level', 'post Graduate level/degree']}
                  />
                </div>
                <div>
                  <SelectGroup 
                    label="Family Monthly Income"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    options={['below ₱ 10,000', '₱ 10,001 - ₱ 20,000', '₱ 20,001 - ₱ 30,000', 'Above ₱ 30,000']}
                  />
                  <div className="mt-4">
                    <label className="block text-[12px] font-bold text-[#0f2e60] mb-2">Are you the first in family to attend college?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="firstInFamily" value="Yes" checked={formData.firstInFamily === 'Yes'} onChange={() => handleRadioChange('firstInFamily', 'Yes')} className="w-3.5 h-3.5" /> Yes</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="firstInFamily" value="No" checked={formData.firstInFamily === 'No'} onChange={() => handleRadioChange('firstInFamily', 'No')} className="w-3.5 h-3.5" /> No</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#93c5fd] rounded-lg mb-6 bg-white overflow-hidden shadow-sm">
            <div className="bg-[#e0e7ff] px-4 py-2 flex items-center gap-2 border-b border-[#93c5fd]">
              <User className="w-4 h-4 text-[#1e3a8a] font-bold" />
              <h3 className="font-bold text-[#1e3a8a] text-[13px]">Living Condition</h3>
            </div>
            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <SelectGroup 
                  label="With whom do you currently live?"
                  name="livingWith"
                  value={formData.livingWith}
                  onChange={handleChange}
                  options={['Parents/Guardians', 'Relatives', 'Alone', 'Boarding house', 'Others']}
                />
                {formData.livingWith === 'Others' && (
                  <input type="text" name="livingWithOthers" value={formData.livingWithOthers} onChange={handleChange} placeholder="Please specify" className="border-b border-[#1e3a8a] outline-none text-xs ml-6 mt-1 w-full max-w-[200px]" />
                )}
              </div>
              <div>
                <SelectGroup 
                  label="Type of Housing"
                  name="housingType"
                  value={formData.housingType}
                  onChange={handleChange}
                  options={['Own house', 'Rented house or apartment', 'Boarding house', 'Others']}
                />
                {formData.housingType === 'Others' && (
                  <input type="text" name="housingTypeOthers" value={formData.housingTypeOthers} onChange={handleChange} placeholder="Please specify" className="border-b border-[#1e3a8a] outline-none text-xs ml-6 mt-1 w-full max-w-[200px]" />
                )}
              </div>
            </div>
          </div>
          </div>

          <div className="border border-[#93c5fd] rounded-lg mb-6 bg-white overflow-hidden shadow-sm">
            <div className="bg-[#e0e7ff] px-4 py-2 flex items-center gap-2 border-b border-[#93c5fd]">
              <User className="w-4 h-4 text-[#1e3a8a] font-bold" />
              <h3 className="font-bold text-[#1e3a8a] text-[13px]">Access to Resources</h3>
            </div>
            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-[12px] font-bold text-[#0f2e60] mb-3">Do you have access of the following at home?</label>
                <div className="space-y-2">
                  {['Personal Computer/Laptop', 'Internet Connection', 'Study space', 'Textbooks and learning materials'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer">
                      <input type="checkbox" checked={formData.accessToResources.includes(opt)} onChange={() => handleCheckboxChange('accessToResources', opt)} className="w-3.5 h-3.5 rounded-sm text-blue-600 focus:ring-blue-500" /> {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0f2e60] mb-3">Do you work while studying?</label>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="workingStudent" value="Yes, full-time" checked={formData.workingStudent === 'Yes, full-time'} onChange={() => handleRadioChange('workingStudent', 'Yes, full-time')} className="w-3.5 h-3.5" /> Yes, full-time</label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="workingStudent" value="Yes, part-time" checked={formData.workingStudent === 'Yes, part-time'} onChange={() => handleRadioChange('workingStudent', 'Yes, part-time')} className="w-3.5 h-3.5" /> Yes, part-time</label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="workingStudent" value="No" checked={formData.workingStudent === 'No'} onChange={() => handleRadioChange('workingStudent', 'No')} className="w-3.5 h-3.5" /> No</label>
                </div>
              </div>
            </div>
            </div>
          </div>
          
          <div className="border border-[#93c5fd] rounded-lg mb-6 bg-white overflow-hidden shadow-sm">
            <div className="bg-[#e0e7ff] px-4 py-2 flex items-center gap-2 border-b border-[#93c5fd]">
              <User className="w-4 h-4 text-[#1e3a8a] font-bold" />
              <h3 className="font-bold text-[#1e3a8a] text-[13px]">Study Classification</h3>
            </div>
            <div className="p-3 sm:p-4">
              <label className="block text-[12px] font-bold text-[#0f2e60] mb-3">Which of the following classification best describe your current status? (Multiple responses)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {[
                'Indigenous Peoples (IPs)', 'Solo Parent', 'Child of a solo parent', 'Persons with disabilities (PWDs)', 'Child of Person with Disabilities (PWD)',
                'Drop out or learner who returned to school', 'Child of drop out or learner who returned to school', 'Rebel returnees', 'Child of a rebel returnees',
                'Dependent or child of OFW', 'Member of 4Ps', 'Member of Calamity or Disaster Affected Family', 'Orphan/Child in need of special protection',
                'Working Student', 'From geographically isolated & disadvantaged area (GIDA)', 'Muslim Student', 'Low income family/ Economically disadvantaged student',
                'Senior Citizen student', 'First Generation student (Parents did not complete a college degree, first in the immediate family to seek college admission)',
                'LGBTQ+ Community', 'Regular student (I do not belong to any of this group classification)'
              ].map(opt => (
                <label key={opt} className="flex items-start gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer">
                  <input type="checkbox" checked={formData.studentClassification.includes(opt)} onChange={() => handleCheckboxChange('studentClassification', opt)} className="w-3.5 h-3.5 mt-0.5 rounded-sm text-blue-600 focus:ring-blue-500 shrink-0" />
                  <span className="leading-snug">{opt}</span>
                </label>
              ))}
              <div className="col-span-1 sm:col-span-2 mt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] cursor-pointer">
                  <input type="checkbox" checked={formData.studentClassification.includes('Others')} onChange={() => handleCheckboxChange('studentClassification', 'Others')} className="w-3.5 h-3.5 rounded-sm text-blue-600 focus:ring-blue-500 shrink-0" /> others (Please specify)
                </label>
                {formData.studentClassification.includes('Others') && (
                  <input type="text" name="studentClassificationOthers" value={formData.studentClassificationOthers} onChange={handleChange} className="border-b border-[#1e3a8a] outline-none text-xs ml-6 mt-1 w-full max-w-lg" />
                )}
              </div>
            </div>
            
            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#0f2e60] mb-2">If you are working student, please indicate your type of work or source of income</label>
                <input type="text" name="workTypeIncome" value={formData.workTypeIncome} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none w-full pb-1 text-sm text-gray-700" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0f2e60] mb-2">If you are a student with special needs/Person with disability (PWD), please specify your condition or disability</label>
                <input type="text" name="specialNeedsCondition" value={formData.specialNeedsCondition} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none w-full pb-1 text-sm text-gray-700" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0f2e60] mb-2">If you are a PDL (Drop out, or learner with interrupted schooling), please state the reason why your schooling was previously interrupted.</label>
                <input type="text" name="pdlReason" value={formData.pdlReason} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none w-full pb-1 text-sm text-gray-700" />
              </div>
            </div>
          </div>
          </div>

          <SectionHeader title="SCHOLARSHIP CATEGORY" />
          
          {/* SCHOLARSHIP CATEGORY BODY */}
          <div className="bg-[#f8faff] sm:bg-[#fcfdff] p-4 sm:p-6 rounded-lg border border-[#93c5fd] shadow-sm mb-6">
            
            <div className="mb-6">
              <label className="flex items-center gap-3 font-bold text-[#1e3a8a] text-[15px] cursor-pointer">
                <input type="radio" name="scholarshipFundType" value="Internal" checked={formData.scholarshipFundType === 'Internal'} onChange={(e) => handleRadioChange('scholarshipFundType', e.target.value)} className="w-5 h-5 text-blue-600 border-gray-400 focus:ring-blue-500" /> A. Internally-Funded
              </label>
              
              {formData.scholarshipFundType === 'Internal' && (
                <div className="pl-9 pt-5 space-y-6">
                  <div>
                    <h4 className="font-bold text-[13px] text-[#0f2e60] mb-3">Entrance</h4>
                    <div className="flex flex-wrap gap-8 sm:gap-16">
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="Valedictorian" checked={formData.internalCategory === 'Valedictorian'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Valedictorian</label>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="Salutatorian" checked={formData.internalCategory === 'Salutatorian'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Salutatorian</label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-[#0f2e60] mb-3">Academic</h4>
                    <div className="flex flex-wrap gap-8 sm:gap-10">
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="Full" checked={formData.internalCategory === 'Full'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Full</label>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="Partial" checked={formData.internalCategory === 'Partial'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Partial</label>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="Regional" checked={formData.internalCategory === 'Regional'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Regional</label>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="National" checked={formData.internalCategory === 'National'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> National</label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-[#0f2e60] mb-3">Socio-cultural</h4>
                    <div className="flex flex-wrap gap-8 sm:gap-10">
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="SC-Regional" checked={formData.internalCategory === 'SC-Regional'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Regional</label>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="SC-National" checked={formData.internalCategory === 'SC-National'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> National</label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-[#0f2e60] mb-3">Institutional</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="Dependent of Faculty" checked={formData.internalCategory === 'Dependent of Faculty'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Dependent of Faculty or Staff</label>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="President - SSC" checked={formData.internalCategory === 'President - SSC'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> President – SSC</label>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="President - FLP" checked={formData.internalCategory === 'President - FLP'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> President – FLP</label>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="Editor-in-Chief" checked={formData.internalCategory === 'Editor-in-Chief'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Editor-in-Chief (Campus Publication)</label>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer"><input type="radio" name="internalCategory" value="CapSU Band / Chorale" checked={formData.internalCategory === 'CapSU Band / Chorale'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> CapSU Band / Chorale</label>
                    </div>
                    <div className="mt-4">
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer">
                        <input type="radio" name="internalCategory" value="Others" checked={formData.internalCategory === 'Others'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Others (specify)
                      </label>
                      {formData.internalCategory === 'Others' && (
                        <input type="text" name="internalCategoryOthers" value={formData.internalCategoryOthers || ''} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none text-[13px] ml-6 mt-1 w-full max-w-lg bg-transparent" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-200 mb-6" />

            <div className="mb-6">
              <label className="flex items-center gap-3 font-bold text-[#1e3a8a] text-[15px] cursor-pointer">
                <input type="radio" name="scholarshipFundType" value="External" checked={formData.scholarshipFundType === 'External'} onChange={(e) => handleRadioChange('scholarshipFundType', e.target.value)} className="w-5 h-5 text-blue-600 border-gray-400 focus:ring-blue-500" /> B. Externally-Funded
              </label>
              
              {formData.scholarshipFundType === 'External' && (
                <div className="pl-9 pt-5 space-y-6">
                  <div>
                    <h4 className="font-bold text-[13px] text-[#0f2e60] mb-3">CHED</h4>
                    <div className="flex flex-col gap-3">
                      {['ANAC - IP', 'Pag - ulikid', 'Barangay (Legal dependents of Brgy. Officials)', 'ESGP - PA', 'UniFast', 'Tertiary Education Subsidy (TES)'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer">
                          <input type="radio" name="externalCategory" value={opt} checked={formData.externalCategory === opt} onChange={(e) => handleRadioChange('externalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> {opt}
                        </label>
                      ))}
                      <div className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[#0f2e60]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="externalCategory" value="Congressional District" checked={formData.externalCategory === 'Congressional District'} onChange={(e) => handleRadioChange('externalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Congressional District (specify)
                        </label>
                        {formData.externalCategory === 'Congressional District' && (
                          <input type="text" name="chedCongressionalDistrict" value={formData.chedCongressionalDistrict || ''} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none ml-2 flex-1 max-w-[300px] text-[13px] bg-transparent" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[#0f2e60]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="externalCategory" value="One Town One Scholar" checked={formData.externalCategory === 'One Town One Scholar'} onChange={(e) => handleRadioChange('externalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> One Town One Scholar (specify)
                        </label>
                        {formData.externalCategory === 'One Town One Scholar' && (
                          <input type="text" name="chedOneTown" value={formData.chedOneTown || ''} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none ml-2 flex-1 max-w-[300px] text-[13px] bg-transparent" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[#0f2e60]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="externalCategory" value="Tulong Dunong" checked={formData.externalCategory === 'Tulong Dunong'} onChange={(e) => handleRadioChange('externalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Tulong Dunong (specify)
                        </label>
                        {formData.externalCategory === 'Tulong Dunong' && (
                          <input type="text" name="chedTulongDunong" value={formData.chedTulongDunong || ''} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none ml-2 flex-1 max-w-[300px] text-[13px] bg-transparent" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[#0f2e60]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="externalCategory" value="Others" checked={formData.externalCategory === 'Others'} onChange={(e) => handleRadioChange('externalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> Others (specify)
                        </label>
                        {formData.externalCategory === 'Others' && (
                          <input type="text" name="chedOthers" value={formData.chedOthers || ''} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none ml-2 flex-1 max-w-[300px] text-[13px] bg-transparent" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="font-bold text-[13px] text-[#0f2e60] mb-3">Merit</h4>
                    <div className="grid grid-cols-2 gap-y-3 max-w-[400px]">
                      {['VIC', 'Capizeño Circle', 'DOST', 'GRF'].map(meritOpt => (
                        <label key={meritOpt} className="flex items-center gap-2 text-[13px] font-semibold text-[#0f2e60] cursor-pointer">
                          <input type="radio" name="externalCategory" value={meritOpt} checked={formData.externalCategory === meritOpt} onChange={(e) => handleRadioChange('externalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> {meritOpt}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <label className="flex flex-col sm:flex-row sm:items-center gap-2 text-[13px] font-bold text-[#0f2e60] cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="externalCategory" value="LGU" checked={formData.externalCategory === 'LGU'} onChange={(e) => handleRadioChange('externalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> LGU: Barangay, Municipality, Province (Landline) Contact person or issuing office:
                      </div>
                      {formData.externalCategory === 'LGU' && (
                        <input type="text" name="lguContact" value={formData.lguContact || ''} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none text-[13px] w-full max-w-sm mt-1 sm:mt-0 bg-transparent" />
                      )}
                    </label>
                  </div>
                  
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-[#0f2e60] mb-2 cursor-pointer">
                      <input type="radio" name="externalCategory" value="DSWD" checked={formData.externalCategory === 'DSWD'} onChange={(e) => handleRadioChange('externalCategory', e.target.value)} className="w-4 h-4 border-gray-400 text-blue-600 focus:ring-blue-500" /> DSWD:
                    </label>
                    {formData.externalCategory === 'DSWD' && (
                      <div className="pl-6 space-y-3 mt-3 max-w-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"><span className="text-[13px] font-semibold text-[#0f2e60] w-24">Municipality:</span> <input type="text" name="dswdMunicipality" value={formData.dswdMunicipality || ''} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none flex-1 text-[13px] bg-transparent" /></div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"><span className="text-[13px] font-semibold text-[#0f2e60] w-24">Contact person:</span> <input type="text" name="dswdContact" value={formData.dswdContact || ''} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none flex-1 text-[13px] bg-transparent" /></div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"><span className="text-[13px] font-semibold text-[#0f2e60] w-24">Designation:</span> <input type="text" name="dswdDesignation" value={formData.dswdDesignation || ''} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none flex-1 text-[13px] bg-transparent" /></div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"><span className="text-[13px] font-semibold text-[#0f2e60] w-24">Others (specify):</span> <input type="text" name="dswdOthers" value={formData.dswdOthers || ''} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none flex-1 text-[13px] bg-transparent" /></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-200 mb-8 mt-12" />

            <div className="text-center pb-4" id="signature-box">
              <p className="text-[13.5px] text-gray-700 mb-8 italic">I hereby certify that the information I have provided is true and correct to the best of my knowledge.</p>
              
              <div 
                className={`mx-auto w-64 sm:w-[320px] h-24 border border-dashed rounded-[10px] mb-1 flex items-center justify-center cursor-pointer transition-all bg-white relative overflow-hidden group ${
                  errors.signature 
                    ? 'border-red-500 bg-red-50/20 ring-2 ring-red-300' 
                    : formData.signature 
                    ? 'border-green-400 bg-green-50/10' 
                    : 'border-gray-400 hover:bg-gray-50'
                }`}
                onClick={() => setShowSignaturePad(true)}
              >
                {formData.signature ? (
                  <img src={formData.signature} alt="Signature" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Edit3 className={`w-5 h-5 ${errors.signature ? 'text-red-500' : 'text-gray-400 group-hover:text-[#1e3a8a]'}`} />
                    <span className={`text-[12.5px] font-semibold ${errors.signature ? 'text-red-600' : 'text-gray-400 group-hover:text-[#1e3a8a]'}`}>
                      Click to sign (Required)
                    </span>
                  </div>
                )}
              </div>
              
              <div className="inline-block border-t-[1.5px] border-black w-64 sm:w-[320px] pt-1.5 mt-1.5 text-[15px] font-bold text-[#0f2e60]">
                Applicant's Signature <span className="text-red-600">*</span>
              </div>
              
              {errors.signature && (
                <p className="text-red-600 text-[12.5px] font-semibold mt-2">
                  {errors.signature}
                </p>
              )}

              {showSignaturePad && (
                <SignaturePad 
                  onSave={(dataUrl) => {
                    setFormData(prev => ({ ...prev, signature: dataUrl }));
                    setErrors(prev => {
                      const copy = { ...prev };
                      delete copy.signature;
                      return copy;
                    });
                    setShowSignaturePad(false);
                  }} 
                  onCancel={() => setShowSignaturePad(false)} 
                />
              )}
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => { 
                if (validateStep1()) { 
                  setStep(2); 
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                } 
              }} 
              className="w-full sm:w-auto bg-[#1e3a8a] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#152c6b] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Next</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm border border-gray-200">
          <SectionHeader title="STUDENT DOCUMENTS" />
          <p className="text-xs text-gray-500 mb-6 text-center">
            Please attach valid copies for all 3 required documents. Files up to 10MB accepted.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {renderFileUpload('Registration Form (RF)', 'RF')}
            {renderFileUpload('General Weighted Average (GWA)', 'GWA')}
          </div>
          <div className="max-w-md mx-auto">
            {renderFileUpload('Student ID', 'ID')}
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-8 sm:mt-12">
            <button 
              onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 sm:px-8 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button 
              onClick={() => { 
                if (validateStep2()) { 
                  setStep(3); 
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                } 
              }} 
              className="w-full sm:w-auto bg-[#1e3a8a] text-white px-6 sm:px-8 py-2.5 rounded-lg font-bold hover:bg-[#152c6b] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Next</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <SubmissionReviewSummary
          formData={formData}
          files={files}
          isSubmitting={isSubmitting}
          isUpdate={!!existingId}
          onSubmit={handleSubmit}
          onBack={() => {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onEditStep={handleEditStep}
          onPreviewFile={(file) => setPreviewFile(file)}
        />
      )}

      {/* Storyboard-Aligned Post-Submission Confirmation Modal */}
      {successModalData && (
        <SubmissionSuccessModal
          isOpen={submittedSuccess}
          onGoToDashboard={() => {
            setSubmittedSuccess(false);
            navigate('/student/dashboard');
          }}
        />
      )}

      {/* In-App Document Preview Modal */}
      {previewFile && (
        <DocumentPreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

    </div>
  );
}
