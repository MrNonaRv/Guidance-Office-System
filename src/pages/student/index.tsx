import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { User,
  Upload, CheckCircle2, ChevronDown, ChevronUp, View, RefreshCw, Check,
  Image as ImageIcon} from 'lucide-react';
import { db } from '../../lib/db';
import { motion } from 'motion/react';

import { signInWithGoogle, logOut } from '../../lib/firebase';

export function StudentLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const fbUser = await signInWithGoogle();
      
      let user = await db.users.findByEmail(fbUser.email || '');
      if (!user) {
        user = {
          id: fbUser.uid,
          email: fbUser.email || '',
          firstName: fbUser.displayName?.split(' ')[0] || 'User',
          lastName: fbUser.displayName?.split(' ').slice(1).join(' ') || '',
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

          <div className="text-left relative">
            <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1">Password</label>
            <div className="relative">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2.5 bg-white rounded text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <View className="w-4 h-4" />
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
  const [user, setUser] = useState<{email?: string} | null>(null);

  React.useEffect(() => {
    const sessionStr = localStorage.getItem('studentUser');
    if (sessionStr) {
      setUser(JSON.parse(sessionStr));
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
          
  // Hardcode available semesters for demonstration (1st is available, 2nd is not)
  const availableSemesters = ['1st'];

  React.useEffect(() => {
    const sessionStr = localStorage.getItem('studentUser');
    if (sessionStr) {
      setUser(JSON.parse(sessionStr));
    }
  }, []);

  const toggleDropdown = (sem: '1st' | '2nd') => {
    if (!availableSemesters.includes(sem)) return;
    setOpenDropdown(prev => prev === sem ? null : sem);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
            <p className="text-gray-500 mt-1 text-sm md:text-base">Fill up a scholarship form and upload the required documents <span className="italic font-medium font-serif text-gray-500">(for new students only)</span></p>
          </div>
          <button 
            onClick={() => navigate('/student/submission')}
            className="px-12 py-3.5 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm w-auto min-w-[140px]"
          >
            Enter
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


export function StudentSubmissionForm() {
    const navigate = useNavigate();
  
  // const scholarshipId = searchParams.get('scholarshipId');
  // const [selectedScholarship, setSelectedScholarship] = useState<any>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    photo2x2: '',
    familyName: '',
    middleName: '',
    firstName: '',
    birthdate: '',
    age: '',
    sex: '',
    yearLevel: '',
    course: '',
    section: '',
    contactNo: '',
    email: '',
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
    highestEducationalAttainment: '',
    monthlyIncome: '',
    firstInFamilyToAttendCollege: '',
    livingCondition: '',
    livingConditionOthers: '',
    typeOfHousing: '',
    typeOfHousingOthers: '',
    
    // Page 3
    accessToResources: [] as string[],
    workingStudent: '',
    studentClassification: [] as string[],
    studentClassificationOthers: '',
    
    // Page 4
    typeOfWorkOrSourceOfIncome: '',
    specialNeedsOrDisability: '',
    pdlReason: '',
    
    scholarshipCategoryType: '', // A. Internally-Funded, B. Externally-Funded
    scholarshipCategory: '',
    scholarshipCategoryOthers: '',
    
    // Page 5
    congressionalDistrict: '',
    oneTownOneScholar: '',
    tulongDunong: '',
    lguContactPerson: '',
    dswdMunicipality: '',
    dswdContactPerson: '',
    dswdDesignation: '',
    dswdOthers: ''
  });

  

  
  const [files, setFiles] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);

  const handleCategoryFileUpload = (category: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const sizeStr = file.size > 1024 * 1024 
           ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
           : `${Math.round(file.size / 1024)} KB`;
        const newFileObj = {
          id: `file-${Date.now()}`,
          name: file.name,
          category: category,
          type: file.type,
          size: sizeStr,
          data: dataUrl,
          verified: false,
          status: 'Pending'
        };
        setFiles(prev => {
          const filtered = prev.filter(f => f.category !== category);
          return [...filtered, newFileObj];
        });
      };
      reader.readAsDataURL(file);
    }
  };

        
  
  const [step, setStep] = useState(1);
  const handleNext = () => setStep(s => Math.min(3, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));
  const handleChange = (e: any) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleRadioChange = (name: string, value: string) => setFormData(prev => ({ ...prev, [name]: value }));

  const renderFileUpload = (label: string, id: string, description?: string) => {
    const existingFile = files.find((f: any) => f.category === id);
    return (
      <div className="border border-dashed border-gray-300 p-6 rounded-lg text-center relative overflow-hidden bg-white hover:bg-gray-50 transition-colors">
        <input 
          type="file" 
          id={id}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleCategoryFileUpload(id, e)}
        />
        {existingFile ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-[#16a34a]" />
            <p className="text-[#0c2340] font-bold text-sm">{existingFile.name}</p>
            <p className="text-gray-500 text-xs">{existingFile.size}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-[#0c2340] font-bold text-sm">{label}</p>
            {description && <p className="text-gray-500 text-xs">{description}</p>}
            <p className="text-[#d97706] text-xs font-semibold mt-2">Click or drag file to upload</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* progress bar omitted for brevity or simplified */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-[#30416b] text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
             <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
             <div className="grid grid-cols-3 gap-4 mb-4">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" />
                <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" className="border p-2 rounded" />
                <input type="text" name="familyName" value={formData.familyName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" />
             </div>
             <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Course" className="border p-2 rounded" />
                <input type="text" name="yearLevel" value={formData.yearLevel} onChange={handleChange} placeholder="Year Level" className="border p-2 rounded" />
             </div>
             <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} placeholder="Contact No" className="border p-2 rounded" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
             </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
             <h2 className="text-2xl font-bold mb-6">Scholarship Type</h2>
             <div className="space-y-4">
               <label className="flex items-center gap-2">
                 <input type="radio" name="scholarshipCategory" value="DSWD" checked={formData.scholarshipCategory === 'DSWD'} onChange={() => handleRadioChange('scholarshipCategory', 'DSWD')} /> DSWD
               </label>
               {formData.scholarshipCategory === 'DSWD' && (
                 <div className="pl-6 space-y-2">
                   <input type="text" name="dswdMunicipality" value={formData.dswdMunicipality} onChange={handleChange} placeholder="Municipality" className="border p-1 text-sm w-full" />
                   <input type="text" name="dswdContactPerson" value={formData.dswdContactPerson} onChange={handleChange} placeholder="Contact Person" className="border p-1 text-sm w-full" />
                   <input type="text" name="dswdDesignation" value={formData.dswdDesignation} onChange={handleChange} placeholder="Designation" className="border p-1 text-sm w-full" />
                   <input type="text" name="dswdOthers" value={formData.dswdOthers} onChange={handleChange} placeholder="Others (specify)" className="border p-1 text-sm w-full" />
                 </div>
               )}
               <label className="flex items-center gap-2 mt-4">
                 <input type="radio" name="scholarshipCategory" value="LGU" checked={formData.scholarshipCategory === 'LGU'} onChange={() => handleRadioChange('scholarshipCategory', 'LGU')} /> LGU
               </label>
               {formData.scholarshipCategory === 'LGU' && (
                 <div className="pl-6 mt-2">
                   <input type="text" name="lguContactPerson" value={formData.lguContactPerson} onChange={handleChange} placeholder="Contact person or issuing office" className="border p-1 text-sm w-full" />
                 </div>
               )}
             </div>
          </div>
          <div className="flex justify-end mt-8">
            <button onClick={handleNext} className="bg-[#30416b] text-white w-32 py-3.5 rounded-xl font-bold hover:bg-[#1e2f5c] transition-colors shadow-md text-sm">Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Upload Documents</h2>
          <div className="grid grid-cols-2 gap-6">
            {renderFileUpload('Registration Form (RF)', 'RF')}
            {renderFileUpload('General Weighted Average (GWA)', 'GWA')}
          </div>
          <div className="flex justify-between mt-8">
            <button onClick={handlePrev} className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-bold hover:bg-gray-50 transition-colors">Back</button>
            <button onClick={handleNext} className="bg-[#30416b] text-white w-32 py-3.5 rounded-xl font-bold hover:bg-[#1e2f5c] transition-colors shadow-md text-sm">Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Review & Submit</h2>
          <p className="text-gray-600 mb-6">Review your information before submitting.</p>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4 mb-8">
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Applicant Name</p>
                  <p className="text-[#0c2340] font-medium">{formData.firstName} {formData.middleName} {formData.familyName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Course & Year</p>
                  <p className="text-[#0c2340] font-medium">{formData.course} - {formData.yearLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Contact</p>
                  <p className="text-[#0c2340] font-medium">{formData.contactNo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Email</p>
                  <p className="text-[#0c2340] font-medium">{formData.email}</p>
                </div>
             </div>
             
             <div className="mt-6 border-t border-gray-200 pt-4">
               <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Uploaded Files</p>
               <ul className="space-y-2">
                 {files.map((f: any) => (
                   <li key={f.id} className="flex items-center gap-2 text-sm text-[#0c2340]">
                     <CheckCircle2 className="w-4 h-4 text-[#16a34a]" /> {f.category}: <span className="font-medium">{f.name}</span>
                   </li>
                 ))}
                 {files.length === 0 && <li className="text-sm text-gray-400 italic">No files uploaded</li>}
               </ul>
             </div>
          </div>
          <div className="flex justify-between mt-8">
            <button 
              onClick={handlePrev}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-bold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={async () => {
                setIsSubmitting(true);
                const submissionId = `sub-${Date.now()}`;
                const newSubmission = {
                  id: submissionId,
                  studentId: (undefined as any)?.studentId || '2024-CAPSU-001',
                  studentName: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.familyName}`.trim(),
                  scholarshipType: 'Academic Scholarship',
                  status: 'Pending' as any,
                  submittedAt: new Date().toISOString(),
                  data: formData,
                  files: files
                };
            
                try {
                  await db.submissions.create(newSubmission);
                  setIsSubmitting(false);
                  setShowToast(true);
                  setTimeout(() => {
                    setShowToast(false);
                    navigate('/student/dashboard');
                  }, 4000);
                } catch (e) {
                  console.error(e);
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
              className="bg-[#16a34a] text-white px-8 py-3 rounded-md font-bold hover:bg-[#15803d] transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      )}
      {/* Toast */}
      <div className={cn(
        "fixed bottom-6 left-6 flex items-center gap-3 bg-white border border-[#22c55e] text-[#166534] px-4 py-3 rounded-lg shadow-[0_4px_12px_rgba(34,197,94,0.2)] transition-all duration-300 z-50",
        showToast ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
      )}>
        <div className="bg-[#22c55e] text-white rounded-full p-1">
          <Check className="w-4 h-4" />
        </div>
        <span className="font-medium text-sm">Successfully submitted!</span>
      </div>
    </div>
  );
}
