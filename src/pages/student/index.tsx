import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { FileEdit, FileText, ClipboardCheck, Calendar, User, Upload, CheckCircle2, ChevronDown, ChevronUp, View, Eye, EyeOff, RefreshCw, Check,
  Image as ImageIcon, AlertCircle, Edit3, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { db, ensureStudentSubmission } from '../../lib/db';
import { dummyBase64Pdf, dummyBase64Photo2x2, dummyBase64StudentId, dummyBase64Signature } from '../../lib/defaultData';
import { motion } from 'motion/react';
import { SignaturePad } from '../../components/SignaturePad';

import { signInWithGoogle, logOut } from '../../lib/firebase';

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
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const fbUser = await signInWithGoogle();
      
      let user = await db.users.findByEmail(fbUser.email || '');
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
      await ensureStudentSubmission(user);
      navigate('/student/dashboard');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized in Firebase. Add this URL to Firebase Auth settings.');
      } else {
        console.error("Student login error", err);
        setError('Failed to sign in. If previewing, try opening in a new tab.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const user = await db.users.findByEmail(email);
      if (user && user.password === password) {
        localStorage.setItem('studentAuth', 'true');
        localStorage.setItem('studentUser', JSON.stringify(user));
        await ensureStudentSubmission(user);
        navigate('/student/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } else {
      const existing = await db.users.findByEmail(email);
      if (existing) {
        setError('Email already exists');
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        firstName,
        lastName,
        role: 'student' as const
      };
      await db.users.set(newUser.id, newUser);
      localStorage.setItem('studentAuth', 'true');
      localStorage.setItem('studentUser', JSON.stringify(newUser));
      await ensureStudentSubmission(newUser);
      navigate('/student/dashboard');
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
            className={cn("flex-1 py-1.5 text-[12px] font-bold rounded-full transition-all", !isLogin ? "bg-[#3984be] text-white shadow-md" : "text-[#0f2e60] hover:bg-white/50")}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
          <button 
            type="button"
            className={cn("flex-1 py-1.5 text-[12px] font-bold rounded-full transition-all", isLogin ? "bg-[#3984be] text-white shadow-md" : "text-[#0f2e60] hover:bg-white/50")}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Log In
          </button>
        </div>
        
        {error && <div className="text-red-500 text-xs text-center mb-2">{error}</div>}

        <button 
          type="button" 
          onClick={handleGoogleLogin}
          className="w-full bg-white text-gray-700 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm flex items-center justify-center gap-2 border border-white/60 mb-4"
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
              <p className="text-[10px] text-[#0f2e60]/50 mt-1 px-1">At least 8 characters</p>
            )}
          </div>
          
          <div className="pt-2">
            <button type="submit" className="w-full bg-[#1864db] text-white py-2.5 rounded-full font-medium hover:bg-[#124b9f] transition-colors shadow-md shadow-blue-900/20 text-sm">
              {isLogin ? 'Log In' : 'Create Account'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function StudentLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{email?: string; firstName?: string; lastName?: string; id?: string} | null>(null);

  React.useEffect(() => {
    const sessionStr = localStorage.getItem('studentUser');
    if (sessionStr) {
      const u = JSON.parse(sessionStr);
      setUser(u);
      ensureStudentSubmission(u);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans">
      {/* Top Navbar */}
      <header className="bg-[#2b64b1] text-white py-3 px-8 shadow-sm flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <img src="/capsu-logo.png" alt="CAPSU Logo" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h1 className="text-[17px] font-bold tracking-tight">Web-Based Scholarship Submission Alert System</h1>
            <p className="text-[13px] font-semibold text-blue-100">Student Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="flex items-center gap-2 text-xs font-bold text-white bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-full shadow-sm">
            <User className="w-4 h-4 text-white" />
            {user?.email || 'student@gmail.com'}
          </div>
          <button onClick={async () => {
              await logOut();
              localStorage.removeItem('studentAuth');
              localStorage.removeItem('studentUser');
              navigate('/student/login');
          }} className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 transition-colors px-6 py-2 rounded-full shadow-sm flex items-center gap-2">
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
  const [user, setUser] = useState<{id: string, firstName: string, lastName: string, email?: string} | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'1st' | '2nd' | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState<any>(null);
          
  // Hardcode available semesters for demonstration (1st is available, 2nd is not)
  const availableSemesters = ['1st'];

  React.useEffect(() => {
    const sessionStr = localStorage.getItem('studentUser');
    if (sessionStr) {
      const u = JSON.parse(sessionStr);
      setUser(u);

      // Proactively ensure scholarship submission is created for this student account
      ensureStudentSubmission(u).then((sub) => {
        if (sub) setExistingSubmission(sub);
      });

      const unsub = db.submissions.subscribe(subs => {
        const uEmail = (u.email || '').toLowerCase();
        const uId = u.id;
        const uName = `${u.firstName || ''} ${u.lastName || ''}`.trim().toLowerCase();

        const existing = subs.find(s => 
          (uEmail && s.studentId && s.studentId.toLowerCase() === uEmail) || 
          (uId && s.studentId === uId) ||
          (uEmail && s.data?.email && s.data.email.toLowerCase() === uEmail) ||
          (uName && s.studentName && s.studentName.toLowerCase() === uName)
        );
        if (existing) {
          setExistingSubmission(existing);
        }
      });
      return unsub;
    }
  }, []);

  const toggleDropdown = (sem: '1st' | '2nd') => {
    if (!availableSemesters.includes(sem)) return;
    setOpenDropdown(prev => prev === sem ? null : sem);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
        <label className="flex items-center gap-2 border border-[#9ca3af] text-[#0c2340] bg-[#eef2ff] px-4 py-2 rounded-md text-[11px] font-semibold hover:bg-[#e0e7ff] transition-colors cursor-pointer w-[220px] overflow-hidden shadow-sm">
          <ImageIcon className="w-3.5 h-3.5 shrink-0 text-[#1e3a8a]" />
          <span className="truncate">{file.name}</span>
          <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, key)} />
        </label>
      );
    }
    return (
      <label className="flex items-center justify-center gap-2 border border-[#9ca3af] text-[#0c2340] bg-[#f8fafc] px-6 py-2 rounded-md text-[11px] font-bold hover:bg-[#e2e8f0] transition-colors cursor-pointer w-[220px] shadow-sm">
        <Upload className="w-3.5 h-3.5 shrink-0" /> Add File
        <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, key)} />
      </label>
    );
  };

  return (
    <div className="space-y-10 max-w-[900px] mx-auto mt-6 pb-32 relative">
      <div className="bg-gradient-to-r from-[#3b82f6] to-[#1e5088] rounded-[10px] px-12 py-10 text-white shadow-md mx-6 md:mx-0">
        <h2 className="text-[32px] font-bold tracking-tight">Hello, {user ? `${user.firstName} ${user.lastName}` : 'Anna Santos'}!</h2>
      </div>

      <div className="space-y-6 px-6 md:px-0">
        {/* Card 1 */}
        <div className="bg-white rounded-full p-5 px-12 shadow-[0_6px_25px_rgb(0,0,0,0.08)] flex justify-between items-center border border-gray-200 gap-6 h-[110px]">
          <div>
            <h3 className="text-[22px] font-bold text-[#0c2340]">Scholarship Requirements</h3>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              {existingSubmission ? 'Modify your scholarship form and documents' : 'Fill up a scholarship form and upload the required documents'} <span className="italic font-medium font-serif text-gray-500">(for new students only)</span>
            </p>
          </div>
          <button 
            onClick={() => navigate('/student/submission')}
            className="px-12 py-3.5 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm w-auto min-w-[140px]"
          >
            {existingSubmission ? 'Edit Application' : 'Enter'}
          </button>
        </div>

        {/* Card 2 with Dropdown */}
        <div className={cn("relative", openDropdown === '1st' ? "z-50" : "z-10")}>
          <div className="bg-white rounded-full p-5 px-12 shadow-[0_6px_25px_rgb(0,0,0,0.08)] flex justify-between items-center border border-gray-200 gap-6 h-[110px] relative z-20">
            <div>
              <h3 className={cn("text-[22px] font-bold", availableSemesters.includes('1st') ? "text-[#0c2340]" : "text-[#6b7280]")}>
                1st Semester <span className={cn("underline underline-offset-[6px] decoration-2", availableSemesters.includes('1st') ? "text-[#0c2340]" : "text-[#9ca3af]")}>(2026-2027)</span>
              </h3>
              <p className="text-gray-500 mt-1 text-sm md:text-base">Upload the required documents <span className="italic font-medium font-serif text-gray-500">(for current students)</span></p>
            </div>
            <button 
              onClick={() => toggleDropdown('1st')}
              disabled={!availableSemesters.includes('1st')}
              className={cn(
                "px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 border w-auto min-w-[140px] transition-colors",
                !availableSemesters.includes('1st') 
                  ? "bg-[#e2e8f0] text-[#94a3b8] border-[#cbd5e1] cursor-not-allowed" 
                  : openDropdown === '1st'
                    ? "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd]"
                    : "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd] hover:bg-[#bfdbfe]"
              )}
            >
              Submit
              {openDropdown === '1st' ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {openDropdown === '1st' && (
            <div className="absolute top-[90px] right-4 w-full max-w-[650px] bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.15)] border border-gray-300 p-8 pt-10 z-10 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h4 className="font-bold text-[#0c2340] text-[18px] leading-tight">RF</h4>
                  <p className="text-[#0c2340] text-[15px]">Registration Form</p>
                </div>
                {renderFileButton('1st_rf')}
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-bold text-[#0c2340] text-[18px] leading-tight">GWA</h4>
                  <p className="text-[#0c2340] text-[15px]">General Weighted Average</p>
                </div>
                {renderFileButton('1st_gwa')}
              </div>
              
              <button 
                onClick={() => handleSubmit('1st')}
                disabled={isSubmitting}
                className="w-full bg-[#2b4c8a] text-white py-3.5 rounded-lg font-bold text-[15px] hover:bg-[#1e3a8a] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Submit'}
              </button>
            </div>
          )}
        </div>

        {/* Card 3 with Dropdown */}
        <div className={cn("relative", openDropdown === '2nd' ? "z-50" : "z-10")}>
          <div className="bg-white rounded-full p-5 px-12 shadow-[0_6px_25px_rgb(0,0,0,0.08)] flex justify-between items-center border border-gray-200 gap-6 h-[110px] relative z-20">
            <div>
              <h3 className={cn("text-[22px] font-bold", availableSemesters.includes('2nd') ? "text-[#0c2340]" : "text-[#6b7280]")}>
                2nd Semester <span className={cn("underline underline-offset-[6px] decoration-2", availableSemesters.includes('2nd') ? "text-[#0c2340]" : "text-[#9ca3af]")}>(2026-2027)</span>
              </h3>
              <p className="text-gray-500 mt-1 text-sm md:text-base">Upload the required documents <span className="italic font-medium font-serif text-gray-500">(for current students)</span></p>
            </div>
            <button 
              onClick={() => toggleDropdown('2nd')}
              disabled={!availableSemesters.includes('2nd')}
              className={cn(
                "px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 border w-auto min-w-[140px] transition-colors",
                !availableSemesters.includes('2nd') 
                  ? "bg-[#e2e8f0] text-[#94a3b8] border-[#cbd5e1] cursor-not-allowed" 
                  : openDropdown === '2nd'
                    ? "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd]"
                    : "bg-[#dbeafe] text-[#1e3a8a] border-[#93c5fd] hover:bg-[#bfdbfe]"
              )}
            >
              Submit
              {openDropdown === '2nd' ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {openDropdown === '2nd' && (
            <div className="absolute top-[90px] right-4 w-full max-w-[650px] bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.15)] border border-gray-300 p-8 pt-10 z-10 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h4 className="font-bold text-[#0c2340] text-[18px] leading-tight">RF</h4>
                  <p className="text-[#0c2340] text-[15px]">Registration Form</p>
                </div>
                {renderFileButton('2nd_rf')}
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-bold text-[#0c2340] text-[18px] leading-tight">GWA</h4>
                  <p className="text-[#0c2340] text-[15px]">General Weighted Average</p>
                </div>
                {renderFileButton('2nd_gwa')}
              </div>
              
              <button 
                onClick={() => handleSubmit('2nd')}
                disabled={isSubmitting}
                className="w-full bg-[#2b4c8a] text-white py-3.5 rounded-lg font-bold text-[15px] hover:bg-[#1e3a8a] transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Submit'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-10 bg-[#bbf7d0] border border-[#86efac] px-6 py-3.5 rounded-full shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
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

export function StudentSubmissionForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [files, setFiles] = useState<any[]>([
    { id: 'f-rf-default', name: 'Registration_Form_RF.pdf', category: 'RF', type: 'application/pdf', size: '850 KB', data: dummyBase64Pdf, verified: false, status: 'Pending' },
    { id: 'f-gwa-default', name: 'GWA_Grade_Slip.pdf', category: 'GWA', type: 'application/pdf', size: '1.2 MB', data: dummyBase64Pdf, verified: false, status: 'Pending' },
    { id: 'f-id-default', name: 'Student_ID_Card.png', category: 'ID', type: 'image/png', size: '450 KB', data: dummyBase64StudentId, verified: false, status: 'Pending' }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationWarning, setValidationWarning] = useState<{ title: string; details: string[] } | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Page 1
    photo2x2: dummyBase64Photo2x2, familyName: '', middleName: '', firstName: '', birthdate: '2005-01-15', age: '21', sex: 'Male', yearLevel: '1st Year', course: 'BSCS', section: 'A', civilStatus: 'Single', contactNo: '09123456789', email: '', permanentAddress: 'Capiz, Philippines', fatherName: '', fatherOccupation: '', fatherContact: '', motherName: '', motherOccupation: '', motherContact: '', guardianName: '', guardianOccupation: '', guardianContact: '',
    // Page 2
    parentEduAttainment: 'High school Graduate', monthlyIncome: 'below Php10,000', firstInFamily: 'Yes', livingWith: 'Parents/Guardians', livingWithOthers: '', housingType: 'Own house', housingTypeOthers: '',
    // Page 3
    accessToResources: ['Study space', 'Textbooks and learning materials'] as string[], workingStudent: 'No', studentClassification: ['Low income family/ Economically disadvantaged student'] as string[], studentClassificationOthers: '',
    // Page 4
    workTypeIncome: '', specialNeedsCondition: '', pdlReason: '', scholarshipFundType: 'External', internalCategory: '', internalCategoryOthers: '', externalCategory: 'CHED Tulong Dunong Program (TDP)', externalCategoryOthers: '',
    // External specifics
    chedSubCategory: 'Tulong Dunong Program (TDP)', chedCongressionalDistrict: '', chedOneTown: '', chedTulongDunong: '', chedOthers: '', meritSubCategory: '', lguContact: '', dswdMunicipality: '', dswdContact: '', dswdDesignation: '', dswdOthers: '', signature: dummyBase64Signature
  });

  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem('studentUser');
    if (sessionStr) {
      const user = JSON.parse(sessionStr);
      const uEmail = (user.email || '').toLowerCase();
      const uId = user.id;
      const uName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();

      // Pre-fill initial student info if not already set
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        familyName: user.lastName || prev.familyName,
        email: user.email || prev.email
      }));

      // Ensure the starter submission exists in database
      ensureStudentSubmission(user).then((sub) => {
        if (sub) {
          setExistingId(sub.id);
          setFormData(prev => ({
            ...prev,
            firstName: user.firstName || prev.firstName,
            familyName: user.lastName || prev.familyName,
            email: user.email || prev.email,
            ...(sub.data || {})
          }));
          if (sub.files && Array.isArray(sub.files) && sub.files.length > 0) {
            setFiles(sub.files.map(f => ({
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
        }
      });

      const unsub = db.submissions.subscribe(subs => {
        const existing = subs.find(s => 
          (uEmail && s.studentId && s.studentId.toLowerCase() === uEmail) ||
          (uId && s.studentId === uId) ||
          (uEmail && s.data?.email && s.data.email.toLowerCase() === uEmail) ||
          (uName && s.studentName && s.studentName.toLowerCase() === uName)
        );
        if (existing) {
          setExistingId(existing.id);
          setFormData(prev => ({
            ...prev,
            firstName: user.firstName || prev.firstName,
            familyName: user.lastName || prev.familyName,
            email: user.email || prev.email,
            ...(existing.data || {})
          }));
          
          if (existing.files && Array.isArray(existing.files) && existing.files.length > 0) {
            setFiles(existing.files.map(f => ({
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
        }
      });
      return unsub;
    }
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setValidationWarning({
          title: 'Photo is too large',
          details: ['Please upload an image smaller than 5MB.']
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, photo2x2: event.target?.result as string }));
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submission = {
        id: existingId || `SUB-${Date.now()}`,
        studentId: formData.email || `STU-${Date.now()}`,
        studentName: `${formData.firstName} ${formData.familyName}`.trim() || 'Anonymous Student',
        scholarshipType: formData.internalCategory || formData.chedSubCategory || formData.meritSubCategory || formData.externalCategory || 'General Scholarship',
        status: 'Pending' as const,
        submittedAt: new Date().toISOString(),
        data: formData,
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
      
      if (existingId) {
        await db.submissions.update(existingId, submission);
      } else {
        await db.submissions.create(submission);
      }
      setSubmittedSuccess(true);
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
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

  const handleCategoryFileUpload = (category: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setValidationWarning({
          title: 'File is too large',
          details: ['File size exceeds 10MB limit. Please upload a smaller file.']
        });
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
        const newFileObj = { id: `file-${Date.now()}`, name: file.name, category, type: file.type, size: sizeStr, data: dataUrl, verified: false, status: 'Pending', uploadedAt: new Date().toISOString() };
        setFiles(prev => [...prev.filter(f => f.category !== category), newFileObj]);
        setValidationWarning(null);
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
        <input type="file" id={id} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleCategoryFileUpload(id, e)} />
        {existingFile ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#16a34a]" />
            </div>
            <p className="text-[#0c2340] font-bold text-sm">{existingFile.name}</p>
            <p className="text-gray-500 text-xs">{existingFile.size}</p>
            <span className="text-[11px] text-blue-600 font-semibold hover:underline mt-1">Click to replace file</span>
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
              {isMissing ? 'Document Required — Click to upload' : 'Click or drag file to upload (PDF, PNG, JPG)'}
            </p>
          </div>
        )}
      </div>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="bg-[#1846b0] text-white text-center py-2.5 rounded-lg font-bold tracking-wider mb-6 text-sm mt-8">{title}</div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Progress Stepper */}
      <div className="bg-white rounded-[2rem] shadow-sm py-8 px-12 mb-8 flex items-center justify-center gap-2">
        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 rounded-[18px] flex items-center justify-center shadow-md mb-3 z-10 relative ${step >= 1 ? 'bg-[#1864db] shadow-blue-500/20' : 'bg-gray-200'}`}>
            <FileEdit className={`w-7 h-7 ${step >= 1 ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <span className={`text-[11px] font-bold uppercase ${step >= 1 ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>Student Information</span>
        </div>
        <div className={`w-24 h-[2px] -mt-8 ${step >= 2 ? 'bg-[#1864db]' : 'bg-gray-300'}`}></div>
        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 rounded-[18px] flex items-center justify-center shadow-md mb-3 z-10 relative ${step >= 2 ? 'bg-[#1864db] shadow-blue-500/20' : 'bg-gray-200'}`}>
            <FileText className={`w-7 h-7 ${step >= 2 ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <span className={`text-[11px] font-bold uppercase ${step >= 2 ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>Upload Files</span>
        </div>
        <div className={`w-24 h-[2px] -mt-8 ${step >= 3 ? 'bg-[#1864db]' : 'bg-gray-300'}`}></div>
        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 rounded-[18px] flex items-center justify-center shadow-md mb-3 z-10 relative ${step >= 3 ? 'bg-[#1864db] shadow-blue-500/20' : 'bg-gray-200'}`}>
            <ClipboardCheck className={`w-7 h-7 ${step >= 3 ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <span className={`text-[11px] font-bold uppercase ${step >= 3 ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>Review</span>
        </div>
      </div>

      {submittedSuccess && (
        <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-8 text-center shadow-lg animate-in zoom-in-95 duration-300">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-1">
            Application {existingId ? 'Updated' : 'Submitted'} Successfully!
          </h3>
          <p className="text-sm text-green-700">Redirecting to your student dashboard...</p>
        </div>
      )}

      {/* Validation Warning Alert */}
      {validationWarning && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 mb-6 shadow-md animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-red-900">{validationWarning.title}</h4>
              <ul className="list-disc list-inside text-xs text-red-700 font-medium mt-1.5 space-y-0.5">
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
        <div className="p-6 text-center">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-3">Scholarship Record Form</h2>
          <p className="text-[13px] font-serif text-gray-700 max-w-2xl mx-auto">
            Data and Personal Information will be kept with utmost confidentiality and will be protected through RA 10173 also known as Data Privacy Act of 2012
          </p>
        </div>
      </div>
      <div className="bg-[#fef9c3] border border-[#facc15] rounded-lg p-3 mb-6">
        <p className="text-[#a16207] text-[13px] text-center">
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
              <h3 className="font-bold text-[#1e3a8a] text-[13px]">A. Personal Information</h3>
            </div>
            <div className="p-4 flex gap-6">
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
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-3 gap-4">
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
                <div className="grid grid-cols-[1.5fr_1fr_1.5fr] gap-4">
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
                <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr] gap-4">
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
                <div className="grid grid-cols-2 gap-4">
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
              <h3 className="font-bold text-[#1e3a8a] text-[13px]">B. Family Background</h3>
            </div>
            <div className="p-4 space-y-6">
              <div><div className="inline-block bg-[#e0e7ff] border border-[#1e3a8a] text-[#1e3a8a] text-[11px] font-bold px-4 py-0.5 rounded-sm mb-3">Father Information</div>
                <div className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4"><InputGroup label="Name" name="fatherName" value={formData.fatherName} onChange={handleChange} /><InputGroup label="Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} /><InputGroup label="Contact No." name="fatherContact" value={formData.fatherContact} onChange={handleChange} /></div></div>
              <div><div className="inline-block bg-[#e0e7ff] border border-[#1e3a8a] text-[#1e3a8a] text-[11px] font-bold px-4 py-0.5 rounded-sm mb-3">Mother Information</div>
                <div className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4"><InputGroup label="Name" name="motherName" value={formData.motherName} onChange={handleChange} /><InputGroup label="Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} /><InputGroup label="Contact No." name="motherContact" value={formData.motherContact} onChange={handleChange} /></div></div>
              <div><div className="inline-block bg-[#e0e7ff] border border-[#1e3a8a] text-[#1e3a8a] text-[11px] font-bold px-4 py-0.5 rounded-sm mb-3">Guardian Information</div>
                <div className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4"><InputGroup label="Name" name="guardianName" value={formData.guardianName} onChange={handleChange} /><InputGroup label="Occupation" name="guardianOccupation" value={formData.guardianOccupation} onChange={handleChange} /><InputGroup label="Contact No." name="guardianContact" value={formData.guardianContact} onChange={handleChange} /></div></div>
            </div>
          </div>
          
          <SectionHeader title="SOCIO-ECONOMIC STATUS" />
          
          {/* Parent Edu Attainment & Monthly Income */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg border border-[#93c5fd] shadow-sm">
              <label className="block text-[12px] font-bold text-[#0f2e60] mb-3">Highest Educational Attainment of your Parent/Guardian?</label>
              <div className="space-y-2">
                {['Elementary Level', 'Elementary Graduate', 'High school Graduate', 'College Graduate', 'High School Level', 'College Level', 'post Graduate level/degree'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]">
                    <input type="radio" name="parentEduAttainment" value={opt} checked={formData.parentEduAttainment === opt} onChange={(e) => handleRadioChange('parentEduAttainment', e.target.value)} className="w-3.5 h-3.5" /> {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#93c5fd] shadow-sm">
              <label className="block text-[12px] font-bold text-[#0f2e60] mb-3">What is your family's approximate monthly income?</label>
              <div className="space-y-2">
                {['below ₱ 10,000', '₱ 10,001 - ₱ 20,000', '₱ 20,001 - ₱ 30,000', 'Above ₱ 30,000'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]">
                    <input type="radio" name="monthlyIncome" value={opt} checked={formData.monthlyIncome === opt} onChange={(e) => handleRadioChange('monthlyIncome', e.target.value)} className="w-3.5 h-3.5" /> {opt}
                  </label>
                ))}
              </div>
              <div className="mt-6">
                <label className="block text-[12px] font-bold text-[#0f2e60] mb-3">Are you the first in the family to attend College?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="firstInFamily" value="Yes" checked={formData.firstInFamily === 'Yes'} onChange={() => handleRadioChange('firstInFamily', 'Yes')} className="w-3.5 h-3.5" /> Yes</label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="firstInFamily" value="No" checked={formData.firstInFamily === 'No'} onChange={() => handleRadioChange('firstInFamily', 'No')} className="w-3.5 h-3.5" /> No</label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#93c5fd] shadow-sm mb-6">
            <h3 className="font-bold text-[#1e3a8a] text-[13px] mb-4">C. Living Condition</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-[#0f2e60] mb-3">With whom do you currently live?</label>
                <div className="space-y-2">
                  {['Parents/Guardians', 'Relatives', 'Alone', 'Boarding house'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]">
                      <input type="radio" name="livingWith" value={opt} checked={formData.livingWith === opt} onChange={(e) => handleRadioChange('livingWith', e.target.value)} className="w-3.5 h-3.5" /> {opt}
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]">
                    <input type="radio" name="livingWith" value="Others" checked={formData.livingWith === 'Others'} onChange={(e) => handleRadioChange('livingWith', e.target.value)} className="w-3.5 h-3.5" /> others (please specify)
                  </label>
                  {formData.livingWith === 'Others' && (
                    <input type="text" name="livingWithOthers" value={formData.livingWithOthers} onChange={handleChange} className="border-b border-[#1e3a8a] outline-none text-xs ml-6 mt-1 w-full max-w-[200px]" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0f2e60] mb-3">Type of Housing</label>
                <div className="space-y-2">
                  {['Own house', 'Rented house or apartment', 'Boarding house'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]">
                      <input type="radio" name="housingType" value={opt} checked={formData.housingType === opt} onChange={(e) => handleRadioChange('housingType', e.target.value)} className="w-3.5 h-3.5" /> {opt}
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]">
                    <input type="radio" name="housingType" value="Others" checked={formData.housingType === 'Others'} onChange={(e) => handleRadioChange('housingType', e.target.value)} className="w-3.5 h-3.5" /> others (please specify)
                  </label>
                  {formData.housingType === 'Others' && (
                    <input type="text" name="housingTypeOthers" value={formData.housingTypeOthers} onChange={handleChange} className="border-b border-[#1e3a8a] outline-none text-xs ml-6 mt-1 w-full max-w-[200px]" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#93c5fd] shadow-sm mb-6">
            <h3 className="font-bold text-[#1e3a8a] text-[13px] mb-4">D. Access to Resources</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-[#0f2e60] mb-3">Do you have access of the following at home?</label>
                <div className="space-y-2">
                  {['Personal Computer/Laptop', 'Internet Connection', 'Study space', 'Textbooks and learning materials'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]">
                      <input type="checkbox" checked={formData.accessToResources.includes(opt)} onChange={() => handleCheckboxChange('accessToResources', opt)} className="w-3.5 h-3.5 rounded-sm text-blue-600 focus:ring-blue-500" /> {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0f2e60] mb-3">Do you work while studying?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="workingStudent" value="Yes, full-time" checked={formData.workingStudent === 'Yes, full-time'} onChange={() => handleRadioChange('workingStudent', 'Yes, full-time')} className="w-3.5 h-3.5" /> Yes, full-time</label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="workingStudent" value="Yes, part-time" checked={formData.workingStudent === 'Yes, part-time'} onChange={() => handleRadioChange('workingStudent', 'Yes, part-time')} className="w-3.5 h-3.5" /> Yes, part-time</label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="workingStudent" value="No" checked={formData.workingStudent === 'No'} onChange={() => handleRadioChange('workingStudent', 'No')} className="w-3.5 h-3.5" /> No</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-[#93c5fd] shadow-sm mb-6">
            <h3 className="font-bold text-[#1e3a8a] text-[13px] mb-4">E. Student Classification</h3>
            <label className="block text-[12px] font-bold text-[#0f2e60] mb-3">Which of the following classification best describe your current status? (Multiple responses)</label>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {[
                'Indigenous Peoples (IPs)', 'Solo Parent', 'Child of a solo parent', 'Persons with disabilities (PWDs)', 'Child of Person with Disabilities (PWD)',
                'Drop out or learner who returned to school', 'Child of drop out or learner who returned to school', 'Rebel returnees', 'Child of a rebel returnees',
                'Dependent or child of OFW', 'Member of 4Ps', 'Member of Calamity or Disaster Affected Family', 'Orphan/Child in need of special protection',
                'Working Student', 'From geographically isolated & disadvantaged area (GIDA)', 'Muslim Student', 'Low income family/ Economically disadvantaged student',
                'Senior Citizen student', 'First Generation student (Parents did not complete a college degree, first in the immediate family to seek college admission)',
                'LGBTQ+ Community', 'Regular student (I do not belong to any of this group classification)'
              ].map(opt => (
                <label key={opt} className="flex items-start gap-2 text-xs font-semibold text-[#0f2e60]">
                  <input type="checkbox" checked={formData.studentClassification.includes(opt)} onChange={() => handleCheckboxChange('studentClassification', opt)} className="w-3.5 h-3.5 mt-0.5 rounded-sm text-blue-600 focus:ring-blue-500" />
                  <span className="leading-snug">{opt}</span>
                </label>
              ))}
              <div className="col-span-2 mt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]">
                  <input type="checkbox" checked={formData.studentClassification.includes('Others')} onChange={() => handleCheckboxChange('studentClassification', 'Others')} className="w-3.5 h-3.5 rounded-sm text-blue-600 focus:ring-blue-500" /> others (Please specify)
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

          <SectionHeader title="SCHOLARSHIP CATEGORY" />
          
          <div className="bg-white p-6 rounded-lg border border-[#93c5fd] shadow-sm mb-6">
            
            <div className="mb-8">
              <label className="flex items-center gap-2 font-bold text-[#1e3a8a] text-[14px] mb-4">
                <input type="radio" name="scholarshipFundType" value="Internal" checked={formData.scholarshipFundType === 'Internal'} onChange={(e) => handleRadioChange('scholarshipFundType', e.target.value)} className="w-4 h-4" /> A. Internally-Funded
              </label>
              
              {formData.scholarshipFundType === 'Internal' && (
                <div className="pl-6 space-y-6">
                  <div>
                    <h4 className="font-bold text-[12px] text-[#0f2e60] mb-2">Entrance</h4>
                    <div className="flex gap-8">
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="Valedictorian" checked={formData.internalCategory === 'Valedictorian'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> Valedictorian</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="Salutatorian" checked={formData.internalCategory === 'Salutatorian'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> Salutatorian</label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[12px] text-[#0f2e60] mb-2">Academic</h4>
                    <div className="flex gap-8">
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="Full" checked={formData.internalCategory === 'Full'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> Full</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="Partial" checked={formData.internalCategory === 'Partial'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> Partial</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="Regional" checked={formData.internalCategory === 'Regional'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> Regional</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="National" checked={formData.internalCategory === 'National'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> National</label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[12px] text-[#0f2e60] mb-2">Socio-cultural</h4>
                    <div className="flex gap-8">
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="SC-Regional" checked={formData.internalCategory === 'SC-Regional'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> Regional</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="SC-National" checked={formData.internalCategory === 'SC-National'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> National</label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[12px] text-[#0f2e60] mb-2">Institutional</h4>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-8">
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="Dependent of Faculty" checked={formData.internalCategory === 'Dependent of Faculty'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> Dependent of Faculty or Staff</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="President - SSC" checked={formData.internalCategory === 'President - SSC'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> President – SSC</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="President - FLP" checked={formData.internalCategory === 'President - FLP'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> President – FLP</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="Editor-in-Chief" checked={formData.internalCategory === 'Editor-in-Chief'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> Editor-in-Chief (Campus Publication)</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="internalCategory" value="CapSU Band / Chorale" checked={formData.internalCategory === 'CapSU Band / Chorale'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> CapSU Band / Chorale</label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]">
                      <input type="radio" name="internalCategory" value="Others" checked={formData.internalCategory === 'Others'} onChange={(e) => handleRadioChange('internalCategory', e.target.value)} /> Others (specify)
                    </label>
                    {formData.internalCategory === 'Others' && (
                      <input type="text" name="internalCategoryOthers" value={formData.internalCategoryOthers} onChange={handleChange} className="border-b border-[#1e3a8a] outline-none text-xs ml-6 mt-1 w-full max-w-lg" />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-center gap-2 font-bold text-[#1e3a8a] text-[14px] mb-4">
                <input type="radio" name="scholarshipFundType" value="External" checked={formData.scholarshipFundType === 'External'} onChange={(e) => handleRadioChange('scholarshipFundType', e.target.value)} className="w-4 h-4" /> B. Externally-Funded
              </label>
              
              {formData.scholarshipFundType === 'External' && (
                <div className="pl-6 space-y-6">
                  <div>
                    <h4 className="font-bold text-[12px] text-[#0f2e60] mb-2">CHED</h4>
                    <div className="flex flex-col gap-2">
                      {['ANAC – IP', 'Pag – ulikid', 'Barangay (Legal dependents of Brgy. Officials)', 'ESGP – PA', 'UniFast', 'Tertiary Education Subsidy (TES)'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="chedSubCategory" value={opt} checked={formData.chedSubCategory === opt} onChange={(e) => handleRadioChange('chedSubCategory', e.target.value)} /> {opt}</label>
                      ))}
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] mt-1">
                        <input type="radio" name="chedSubCategory" value="Congressional District" checked={formData.chedSubCategory === 'Congressional District'} onChange={(e) => handleRadioChange('chedSubCategory', e.target.value)} /> Congressional District (specify)
                        {formData.chedSubCategory === 'Congressional District' && <input type="text" name="chedCongressionalDistrict" value={formData.chedCongressionalDistrict} onChange={handleChange} className="border-b border-[#1e3a8a] outline-none ml-2 flex-1 max-w-[300px]" />}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] mt-1">
                        <input type="radio" name="chedSubCategory" value="One Town One Scholar" checked={formData.chedSubCategory === 'One Town One Scholar'} onChange={(e) => handleRadioChange('chedSubCategory', e.target.value)} /> One Town One Scholar (specify)
                        {formData.chedSubCategory === 'One Town One Scholar' && <input type="text" name="chedOneTown" value={formData.chedOneTown} onChange={handleChange} className="border-b border-[#1e3a8a] outline-none ml-2 flex-1 max-w-[300px]" />}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] mt-1">
                        <input type="radio" name="chedSubCategory" value="Tulong Dunong" checked={formData.chedSubCategory === 'Tulong Dunong'} onChange={(e) => handleRadioChange('chedSubCategory', e.target.value)} /> Tulong Dunong (specify)
                        {formData.chedSubCategory === 'Tulong Dunong' && <input type="text" name="chedTulongDunong" value={formData.chedTulongDunong} onChange={handleChange} className="border-b border-[#1e3a8a] outline-none ml-2 flex-1 max-w-[300px]" />}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60] mt-1">
                        <input type="radio" name="chedSubCategory" value="Others" checked={formData.chedSubCategory === 'Others'} onChange={(e) => handleRadioChange('chedSubCategory', e.target.value)} /> Others (specify)
                        {formData.chedSubCategory === 'Others' && <input type="text" name="chedOthers" value={formData.chedOthers} onChange={handleChange} className="border-b border-[#1e3a8a] outline-none ml-2 flex-1 max-w-[300px]" />}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[12px] text-[#0f2e60] mb-2">Merit</h4>
                    <div className="grid grid-cols-2 gap-y-2 max-w-[400px]">
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="meritSubCategory" value="VIC" checked={formData.meritSubCategory === 'VIC'} onChange={(e) => handleRadioChange('meritSubCategory', e.target.value)} /> VIC</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="meritSubCategory" value="Capizeño Circle" checked={formData.meritSubCategory === 'Capizeño Circle'} onChange={(e) => handleRadioChange('meritSubCategory', e.target.value)} /> Capizeño Circle</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="meritSubCategory" value="DOST" checked={formData.meritSubCategory === 'DOST'} onChange={(e) => handleRadioChange('meritSubCategory', e.target.value)} /> DOST</label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#0f2e60]"><input type="radio" name="meritSubCategory" value="GRF" checked={formData.meritSubCategory === 'GRF'} onChange={(e) => handleRadioChange('meritSubCategory', e.target.value)} /> GRF</label>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[12px] font-bold text-[#0f2e60] mb-2">
                      <input type="radio" name="externalCategory" value="LGU" checked={formData.externalCategory === 'LGU'} onChange={(e) => handleRadioChange('externalCategory', e.target.value)} /> LGU: Barangay, Municipality, Province (Landline) Contact person or issuing office:
                    </label>
                    {formData.externalCategory === 'LGU' && (
                      <input type="text" name="lguContact" value={formData.lguContact} onChange={handleChange} className="border-b border-[#1e3a8a] outline-none text-xs ml-6 w-full max-w-lg" />
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[12px] font-bold text-[#0f2e60] mb-2">
                      <input type="radio" name="externalCategory" value="DSWD" checked={formData.externalCategory === 'DSWD'} onChange={(e) => handleRadioChange('externalCategory', e.target.value)} /> DSWD:
                    </label>
                    {formData.externalCategory === 'DSWD' && (
                      <div className="pl-6 space-y-3 mt-3 max-w-lg">
                        <div className="flex items-center gap-3"><span className="text-xs font-semibold text-gray-700 w-24">Municipality:</span> <input type="text" name="dswdMunicipality" value={formData.dswdMunicipality} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none flex-1 text-sm" /></div>
                        <div className="flex items-center gap-3"><span className="text-xs font-semibold text-gray-700 w-24">Contact person:</span> <input type="text" name="dswdContact" value={formData.dswdContact} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none flex-1 text-sm" /></div>
                        <div className="flex items-center gap-3"><span className="text-xs font-semibold text-gray-700 w-24">Designation:</span> <input type="text" name="dswdDesignation" value={formData.dswdDesignation} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none flex-1 text-sm" /></div>
                        <div className="flex items-center gap-3"><span className="text-xs font-semibold text-gray-700 w-24">Others (specify):</span> <input type="text" name="dswdOthers" value={formData.dswdOthers} onChange={handleChange} className="border-b border-gray-400 focus:border-[#1e3a8a] outline-none flex-1 text-sm" /></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200 text-center" id="signature-box">
              <p className="text-[13px] text-gray-700 mb-6 italic">I hereby certify that the information I have provided is true and correct to the best of my knowledge.</p>
              
              <div 
                className={`mx-auto w-64 h-24 border-2 rounded-xl mb-2 flex items-center justify-center cursor-pointer transition-all bg-white relative overflow-hidden group ${
                  errors.signature 
                    ? 'border-red-500 bg-red-50/20 ring-2 ring-red-300' 
                    : formData.signature 
                    ? 'border-green-400 bg-green-50/10' 
                    : 'border-dashed border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setShowSignaturePad(true)}
              >
                {formData.signature ? (
                  <img src={formData.signature} alt="Signature" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Edit3 className={`w-5 h-5 ${errors.signature ? 'text-red-500' : 'text-gray-400 group-hover:text-[#1e3a8a]'}`} />
                    <span className={`text-xs font-semibold ${errors.signature ? 'text-red-600' : 'text-gray-400 group-hover:text-[#1e3a8a]'}`}>
                      Click to sign (Required)
                    </span>
                  </div>
                )}
              </div>
              <div className="inline-block border-t-2 border-black w-64 pt-2 text-sm font-bold text-[#0f2e60]">
                Applicant's Signature <span className="text-red-500">*</span>
              </div>
              {errors.signature && (
                <p className="text-red-600 text-xs font-semibold mt-1">
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
              className="bg-[#1e3a8a] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#152c6b] transition-colors shadow-sm flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <SectionHeader title="STUDENT DOCUMENTS" />
          <p className="text-xs text-gray-500 mb-6 text-center">
            Please attach valid copies for all 3 required documents. Files up to 10MB accepted.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {renderFileUpload('Registration Form (RF)', 'RF')}
            {renderFileUpload('General Weighted Average (GWA)', 'GWA')}
          </div>
          <div className="max-w-md mx-auto">
            {renderFileUpload('Student ID', 'ID')}
          </div>
          
          <div className="flex justify-between mt-12">
            <button 
              onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="border border-gray-300 text-gray-700 px-8 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
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
              className="bg-[#1e3a8a] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#152c6b] transition-colors shadow-sm flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{existingId ? 'Ready to Update' : 'Ready to Submit'}</h2>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">All required information and documents have been verified. You can now {existingId ? 'update' : 'submit'} your application.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="border border-gray-300 text-gray-700 px-8 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (existingId ? 'Updating...' : 'Submitting...') : <><Check className="w-5 h-5" /> {existingId ? 'Update Application' : 'Submit Application'}</>}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
