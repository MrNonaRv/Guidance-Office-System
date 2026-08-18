import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LogOut, Upload, CheckCircle2, ChevronDown, View, FileText } from 'lucide-react';
import { db } from '../../lib/db';
import { motion } from 'framer-motion';

import { signInWithGoogle } from '../../lib/firebase';

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
      sessionStorage.setItem('studentAuth', 'true');
      sessionStorage.setItem('studentUser', JSON.stringify(user));
      navigate('/student/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized in Firebase. Add this URL to Firebase Auth settings.');
      } else {
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
        sessionStorage.setItem('studentAuth', 'true');
        sessionStorage.setItem('studentUser', JSON.stringify(user));
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
      sessionStorage.setItem('studentAuth', 'true');
      sessionStorage.setItem('studentUser', JSON.stringify(newUser));
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/BI.png')] bg-cover bg-center p-4 font-sans relative">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md"></div>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="bg-gradient-to-b from-[#87c4ff] to-[#e4f2ff] rounded-[40px] shadow-2xl flex flex-col md:flex-row w-full max-w-[850px] min-h-[500px] p-2 relative z-10 border-4 border-white/20"
      >
        {/* Image side */}
        <div className="hidden md:block md:w-1/2 relative bg-cover bg-center rounded-[32px] overflow-hidden" style={{ backgroundImage: "url('/BI.png')" }}>
        </div>
        
        {/* Form side */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <div className="mx-auto h-16 flex items-center justify-center mb-3">
            <img src="/capsu-logo.png" alt="Logo" className="h-full object-contain drop-shadow-md" />
          </div>
          
          <h1 className="text-lg md:text-xl font-bold text-center text-[#0f2e60] mb-2 leading-tight">Web-Based Scholarship Submission<br/>Alert System</h1>
          <div className="flex justify-center mb-6">
            <span className="bg-[#489bd6] text-white px-4 py-1 rounded-full text-[11px] font-semibold shadow-sm tracking-wide">Student Portal</span>
          </div>
          
          <div className="flex bg-white/50 backdrop-blur-sm rounded-full p-1 mb-5 shadow-sm border border-white/40">
            <button 
              type="button"
              className={cn("flex-1 py-1.5 text-[13px] font-semibold rounded-full transition-all", !isLogin ? "bg-[#3984be] text-white shadow-md" : "text-[#0f2e60] hover:bg-white/50")}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Register
            </button>
            <button 
              type="button"
              className={cn("flex-1 py-1.5 text-[13px] font-semibold rounded-full transition-all", isLogin ? "bg-[#3984be] text-white shadow-md" : "text-[#0f2e60] hover:bg-white/50")}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Log In
            </button>
          </div>
          
          {error && <div className="text-red-500 text-xs text-center mb-2">{error}</div>}
          
          <form className="space-y-3" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-2">First name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required={!isLogin} placeholder="First name" className="w-full px-4 py-2.5 bg-white border border-white/50 shadow-sm rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-2">Last name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required={!isLogin} placeholder="Last name" className="w-full px-4 py-2.5 bg-white border border-white/50 shadow-sm rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="student@gmail.com" className="w-full px-4 py-2.5 bg-white border border-white/50 shadow-sm rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
            </div>
            
            <div className="relative">
              <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="********" className="w-full px-4 py-2.5 bg-white border border-white/50 shadow-sm rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
              <button type="button" className="absolute right-4 top-[26px] text-gray-400 hover:text-gray-600">
                <View className="w-4 h-4" />
              </button>
              {!isLogin ? (
                <p className="text-[10px] text-gray-500 text-right mt-1 px-2">At least 8 characters</p>
              ) : (
                <div className="text-right mt-1">
                  <a href="#" className="text-[11px] text-[#0f2e60] font-medium hover:underline px-1">Forgot Password?</a>
                </div>
              )}
            </div>
            
            <div className="pt-1">
              <button type="submit" className="w-full bg-[#0f2e60] text-white py-2.5 rounded-full font-medium hover:bg-[#1a4484] transition-colors shadow-md shadow-blue-900/20 text-sm">
                {isLogin ? 'Log In' : 'Sign up'}
              </button>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#0f2e60]/10"></div></div>
              <div className="relative flex justify-center text-[10px]"><span className="px-3 bg-transparent text-[#0f2e60]/60 uppercase font-bold">or</span></div>
            </div>
            
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full bg-[#1877f2] text-white py-2.5 rounded-full font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 text-[13px]">
              <div className="bg-white p-1 rounded-full">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </div>
              Continue with Google
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

import { logOut } from '../../lib/firebase';

export function StudentLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{email?: string} | null>(null);

  React.useEffect(() => {
    const sessionStr = sessionStorage.getItem('studentUser');
    if (sessionStr) {
      setUser(JSON.parse(sessionStr));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F7FC] font-sans">
      {/* Top Navbar */}
      <header className="bg-[#0f2e60] text-white py-3 px-6 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
            <img src="/capsu-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-yellow-400 hidden sm:block">Web-Based Scholarship Submission Alert System</h1>
            <h1 className="text-sm font-bold text-yellow-400 sm:hidden">Scholarship System</h1>
            <p className="text-[10px] text-gray-300">Student Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-sm text-blue-200 bg-white/10 px-3 py-1.5 rounded-full">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'student'}`} alt="Avatar" />
            </div>
            {user?.email || 'student@gmail.com'}
          </div>
          <button onClick={async () => {
              await logOut();
              sessionStorage.removeItem('studentAuth');
              sessionStorage.removeItem('studentUser');
              navigate('/student/login');
          }} className="text-sm text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
            <span className="hidden sm:inline">Log out</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pt-8">
        <Outlet />
      </main>
    </div>
  );
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{id: string, firstName: string, lastName: string} | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);

  React.useEffect(() => {
    const sessionStr = sessionStorage.getItem('studentUser');
    if (sessionStr) {
      const parsedUser = JSON.parse(sessionStr);
      setUser(parsedUser);
      db.submissions.listByStudent(parsedUser.id).then(subs => setSubmissions(subs));
    }
    db.forms.listAll().then(allForms => {
      setForms(allForms.filter(f => f.status === 'Active'));
    });
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-[#0f2e60] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 opacity-20 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>
        <h2 className="text-3xl font-bold relative z-10">Hello, {user ? `${user.firstName} ${user.lastName}` : 'Student'}!</h2>
      </div>

      {submissions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Recent Submissions</h3>
          <div className="space-y-3">
            {submissions.map(sub => (
              <div key={sub.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                <div>
                  <h4 className="font-semibold text-gray-800">{sub.scholarshipType}</h4>
                  <p className="text-xs text-gray-500 mt-1">Submitted on {new Date(sub.submittedAt).toLocaleDateString()}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full border",
                  sub.status === 'Approved' ? "bg-green-50 text-green-700 border-green-200"
                  : sub.status === 'Rejected' ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                )}>
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#0f2e60]">Available Scholarships</h3>
        {forms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
            No active scholarship forms available at the moment.
          </div>
        ) : (
          forms.map(form => (
            <div key={form.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{form.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{form.description}</p>
                {form.deadline && (
                  <p className="text-xs font-medium text-red-500">Deadline: {new Date(form.deadline).toLocaleDateString()}</p>
                )}
              </div>
              <button 
                onClick={() => navigate(`/student/submission?formId=${form.id}`)}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-full font-medium text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 whitespace-nowrap w-full sm:w-auto"
              >
                Apply
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


export function StudentSubmissionForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');
  const [formConfig, setFormConfig] = useState<any>(null);

  React.useEffect(() => {
    if (formId) {
      db.forms.get(formId).then(setFormConfig);
    }
  }, [formId]);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Comprehensive Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    // A. Personal Demographics
    familyName: '',
    firstName: '',
    middleName: '',
    course: 'BAEL',
    yearLevel: '1st Year',
    section: '',
    sex: 'Female',
    civilStatus: 'Single',
    
    // B. Family Background
    fatherOccupation: '',
    motherOccupation: '',
    guardianOccupation: '',
    parentsEducationalAttainment: '',
    monthlyIncome: '',
    firstGenCollege: 'No',

    // C. Living Condition
    livingWith: '',
    housingType: '',

    // D. Access to Resources
    accessPc: false,
    accessInternet: false,
    accessStudySpace: false,
    accessBooks: false,
    workingStudent: 'No',

    // E. Student Classification
    classification: '',
    
    // F. Scholarship Category
    fundingType: 'Internally-Funded',
    scholarshipCategory: ''
  });

  const [files, setFiles] = useState<Record<string, { name: string, data: string }>>({});

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFiles(prev => ({
        ...prev,
        [key]: { name: file.name, data: event.target?.result as string }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    setFormError('');
    if (step === 1) {
      if (!formData.familyName || !formData.firstName || !formData.course || !formData.section) {
        setFormError('Please fill in all required personal details.');
        return;
      }
    } else if (step === 2) {
      if (!formData.monthlyIncome || !formData.parentsEducationalAttainment) {
        setFormError('Please complete the family background section.');
        return;
      }
    } else if (step === 3) {
      if (!formData.classification) {
        setFormError('Please select your student classification.');
        return;
      }
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setFormError('');
      
      const userStr = sessionStorage.getItem('studentUser');
      if (!userStr) throw new Error("Not logged in");
      const user = JSON.parse(userStr);

      const submission = {
        id: Date.now().toString(),
        studentId: user.id,
        formId: formId || 'default',
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        data: formData,
        files: files
      };

      await db.submissions.set(submission.id, submission);
      
      navigate('/student/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2e60] focus:border-transparent transition-all";
  const labelClass = "block text-xs font-bold text-[#64748b] uppercase tracking-wide mb-2";

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header & Progress */}
        <div className="px-8 py-8 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-2xl font-bold text-[#0f2e60] mb-6">Scholarship Application Form</h1>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1864db] rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className={cn(
                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                step >= num ? "bg-[#1864db] text-white" : "bg-white text-gray-400 border-2 border-gray-200"
              )}>
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
            <span>Demographics</span>
            <span>Family</span>
            <span>Classification</span>
            <span>Attachments</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              {formError}
            </div>
          )}

          {/* STEP 1: DEMOGRAPHICS */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h2 className="text-lg font-bold text-[#0f2e60] flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">A</div>
                Personal Demographics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}>Family Name *</label>
                  <input type="text" value={formData.familyName} onChange={e => setFormData({...formData, familyName: e.target.value})} className={inputClass} placeholder="e.g. Dela Cruz" />
                </div>
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={inputClass} placeholder="e.g. Juan" />
                </div>
                <div>
                  <label className={labelClass}>Middle Name</label>
                  <input type="text" value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} className={inputClass} placeholder="e.g. Santos" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Course *</label>
                  <select value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className={inputClass}>
                    <option>BAEL</option>
                    <option>BSCS</option>
                    <option>BSFT</option>
                    <option>BSOA</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Year Level *</label>
                    <select value={formData.yearLevel} onChange={e => setFormData({...formData, yearLevel: e.target.value})} className={inputClass}>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Section *</label>
                    <input type="text" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className={inputClass} placeholder="e.g. 1A" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Sex</label>
                  <select value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})} className={inputClass}>
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Civil Status</label>
                  <select value={formData.civilStatus} onChange={e => setFormData({...formData, civilStatus: e.target.value})} className={inputClass}>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Widowed</option>
                    <option>Separated</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: FAMILY & LIVING */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              {/* Family Background */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-[#0f2e60] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">B</div>
                  Family Background
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelClass}>Father's Occupation</label>
                    <input type="text" value={formData.fatherOccupation} onChange={e => setFormData({...formData, fatherOccupation: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Mother's Occupation</label>
                    <input type="text" value={formData.motherOccupation} onChange={e => setFormData({...formData, motherOccupation: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Guardian's Occupation</label>
                    <input type="text" value={formData.guardianOccupation} onChange={e => setFormData({...formData, guardianOccupation: e.target.value})} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Highest Educational Attainment (Parents)</label>
                    <select value={formData.parentsEducationalAttainment} onChange={e => setFormData({...formData, parentsEducationalAttainment: e.target.value})} className={inputClass}>
                      <option value="">Select...</option>
                      <option>Elementary Level/Graduate</option>
                      <option>High School Level/Graduate</option>
                      <option>College Level</option>
                      <option>College Graduate</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Monthly Income Range</label>
                    <select value={formData.monthlyIncome} onChange={e => setFormData({...formData, monthlyIncome: e.target.value})} className={inputClass}>
                      <option value="">Select...</option>
                      <option>Below ₱10,000</option>
                      <option>₱10,000 - ₱20,000</option>
                      <option>₱20,001 - ₱30,000</option>
                      <option>Above ₱30,000</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className={labelClass}>Are you a first-generation college student?</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2"><input type="radio" name="firstGen" checked={formData.firstGenCollege === 'Yes'} onChange={() => setFormData({...formData, firstGenCollege: 'Yes'})} className="w-4 h-4 text-[#1864db]" /> Yes</label>
                    <label className="flex items-center gap-2"><input type="radio" name="firstGen" checked={formData.firstGenCollege === 'No'} onChange={() => setFormData({...formData, firstGenCollege: 'No'})} className="w-4 h-4 text-[#1864db]" /> No</label>
                  </div>
                </div>
              </div>

              {/* Living Condition */}
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <h2 className="text-lg font-bold text-[#0f2e60] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">C</div>
                  Living Condition
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Living With</label>
                    <select value={formData.livingWith} onChange={e => setFormData({...formData, livingWith: e.target.value})} className={inputClass}>
                      <option value="">Select...</option>
                      <option>Parents</option>
                      <option>Relatives</option>
                      <option>Boarding House / Dormitory</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Housing Type</label>
                    <select value={formData.housingType} onChange={e => setFormData({...formData, housingType: e.target.value})} className={inputClass}>
                      <option value="">Select...</option>
                      <option>Owned</option>
                      <option>Rented</option>
                      <option>Mortgaged</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: RESOURCES & CLASSIFICATION */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-[#0f2e60] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">D</div>
                  Access to Resources
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={formData.accessPc} onChange={e => setFormData({...formData, accessPc: e.target.checked})} className="w-5 h-5 text-[#1864db] rounded" />
                    <span className="text-sm font-semibold">PC / Laptop</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={formData.accessInternet} onChange={e => setFormData({...formData, accessInternet: e.target.checked})} className="w-5 h-5 text-[#1864db] rounded" />
                    <span className="text-sm font-semibold">Internet Connect</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={formData.accessStudySpace} onChange={e => setFormData({...formData, accessStudySpace: e.target.checked})} className="w-5 h-5 text-[#1864db] rounded" />
                    <span className="text-sm font-semibold">Study Space</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={formData.accessBooks} onChange={e => setFormData({...formData, accessBooks: e.target.checked})} className="w-5 h-5 text-[#1864db] rounded" />
                    <span className="text-sm font-semibold">Books</span>
                  </label>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-gray-100">
                <h2 className="text-lg font-bold text-[#0f2e60] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">E</div>
                  Student Classification
                </h2>
                
                <div>
                  <label className={labelClass}>Select Your Classification *</label>
                  <select value={formData.classification} onChange={e => setFormData({...formData, classification: e.target.value})} className={inputClass}>
                    <option value="">Select...</option>
                    <option>Indigenous People (IPs)</option>
                    <option>Solo Parent</option>
                    <option>Person With Disability (PWD)</option>
                    <option>4Ps Beneficiary</option>
                    <option>Working Student</option>
                    <option>Person Deprived of Liberty (PDL)</option>
                    <option>None of the above</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Scholarship Funding Type</label>
                    <select value={formData.fundingType} onChange={e => setFormData({...formData, fundingType: e.target.value})} className={inputClass}>
                      <option>Internally-Funded</option>
                      <option>Externally-Funded</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Target Scholarship Category</label>
                    <input type="text" value={formData.scholarshipCategory} onChange={e => setFormData({...formData, scholarshipCategory: e.target.value})} className={inputClass} placeholder="e.g. CHED, Merit, Tulong Dunong" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: ATTACHMENTS */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-lg font-bold text-[#0f2e60] flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                  <FileText className="w-4 h-4" />
                </div>
                Attachments
              </h2>
              <p className="text-sm text-gray-600 mb-6">Please upload clear copies of the following required documents.</p>
              
              <div className="grid gap-4">
                {[
                  { id: 'picture', label: '2x2 ID Picture' },
                  { id: 'grades', label: 'Certificate of Grades (COG)' },
                  { id: 'etg', label: 'Completed ETG Survey Form (PDF)' }
                ].map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-6 hover:border-[#1864db] transition-colors bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-[#0f2e60]">{item.label}</h3>
                      <p className="text-xs text-gray-500 mt-1">Accepted: PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="file" 
                        id={item.id}
                        className="hidden"
                        onChange={(e) => handleFileChange(item.id, e)}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label 
                        htmlFor={item.id}
                        className={cn(
                          "cursor-pointer px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-sm",
                          files[item.id] ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {files[item.id] ? (
                          <><CheckCircle2 className="w-4 h-4" /> {files[item.id].name}</>
                        ) : (
                          <><Upload className="w-4 h-4" /> Choose File</>
                        )}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <button 
            onClick={step === 1 ? () => navigate('/student/dashboard') : handleBack}
            className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-[#1864db] text-white rounded-full font-bold text-sm hover:bg-[#124b9f] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#0f2e60] text-white rounded-full font-bold text-sm hover:bg-[#0a2044] transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
