import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LogOut, Upload, CheckCircle2, ChevronDown, View } from 'lucide-react';
import { db } from '../../lib/db';

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
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
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
      <div className="bg-gradient-to-b from-[#87c4ff] to-[#e4f2ff] rounded-[40px] shadow-2xl flex flex-col md:flex-row w-full max-w-[850px] min-h-[500px] p-2 relative z-10 border-4 border-white/20">
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
      </div>
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

  React.useEffect(() => {
    const sessionStr = sessionStorage.getItem('studentUser');
    if (sessionStr) {
      const parsedUser = JSON.parse(sessionStr);
      setUser(parsedUser);
      db.submissions.listByStudent(parsedUser.id).then(subs => setSubmissions(subs));
    }
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Scholarship Requirements</h3>
            <p className="text-sm text-gray-500">Fill up a scholarship form and upload the required documents <span className="italic">(for new students only)</span></p>
          </div>
          <button 
            onClick={() => navigate('/student/submission')}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-full font-medium text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 whitespace-nowrap w-full sm:w-auto"
          >
            Enter
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">1st Semester <span className="text-gray-500 font-normal">(2026-2027)</span></h3>
            <p className="text-sm text-gray-500">Upload the required documents <span className="italic">(for current students)</span></p>
          </div>
          <button className="px-6 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-medium text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
            Submit <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow opacity-60">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">2nd Semester <span className="text-gray-500 font-normal">(2026-2027)</span></h3>
            <p className="text-sm text-gray-500">Upload the required documents <span className="italic">(for current students)</span></p>
          </div>
          <button disabled className="px-6 py-2.5 bg-gray-100 text-gray-400 rounded-full font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed w-full sm:w-auto">
            Submit <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function StudentSubmissionForm() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    familyName: '',
    middleName: '',
    firstName: '',
    birthdate: '',
    age: '',
    sex: 'Female',
    course: ''
  });

  const [files, setFiles] = useState<{
    picture?: { name: string, data: string };
    studentId?: { name: string, data: string };
    rf?: { name: string, data: string };
    gwa?: { name: string, data: string };
  }>({});

  const handleFileChange = (key: keyof typeof files, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFiles(prev => ({
        ...prev,
        [key]: {
          name: file.name,
          data: event.target?.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/student/dashboard');
  };
  
  const [showSuccess, setShowSuccess] = useState(false);
  const handleSubmit = async () => {
    const sessionStr = sessionStorage.getItem('studentUser');
    if (!sessionStr) return;
    const user = JSON.parse(sessionStr);

    const submission = {
      id: Date.now().toString(),
      studentId: user.id,
      studentName: `${formData.firstName} ${formData.familyName}`,
      scholarshipType: 'Standard Scholarship',
      status: 'Pending' as const,
      submittedAt: new Date().toISOString(),
      files: Object.values(files).filter(f => f !== undefined) as {name: string, type: string, data: string}[]
    };

    await db.submissions.set(submission.id, submission);
    setShowSuccess(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      {showSuccess && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in zoom-in duration-300">
             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
               <CheckCircle2 className="w-8 h-8 text-white" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Requirements Submitted!</h3>
             <p className="text-sm text-gray-600 mb-4">
               Your scholarship requirements has been successfully submitted. Please wait for the approval of the Guidance Office. A notification will be sent to your registered Gmail account.
             </p>
             <p className="text-xs text-gray-400 mb-8 italic">If you do not see the email in your inbox, please check your Spam inbox. Thank you.</p>
             <button 
               onClick={() => navigate('/student/dashboard')}
               className="w-full py-3 bg-[#0f2e60] text-white rounded-xl font-medium hover:bg-[#1a4484] transition-colors"
             >
               Return to Dashboard
             </button>
           </div>
        </div>
      )}

      {/* Progress Bar Header */}
      <div className="p-6 border-b border-gray-100 flex justify-center py-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-sm", step >= 1 ? "bg-blue-600 text-white shadow-blue-500/30" : "bg-gray-100 text-gray-400")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", step >= 1 ? "text-blue-600" : "text-gray-400")}>Student Information</span>
          </div>
          
          <div className={cn("w-16 h-px mb-6", step >= 2 ? "bg-blue-600" : "bg-gray-300")}></div>
          
          <div className="flex flex-col items-center">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-sm", step >= 2 ? "bg-blue-600 text-white shadow-blue-500/30" : "bg-gray-100 text-gray-400")}>
              <Upload className="w-6 h-6" />
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", step >= 2 ? "text-blue-600" : "text-gray-400")}>Upload Files</span>
          </div>
          
          <div className={cn("w-16 h-px mb-6", step >= 3 ? "bg-blue-600" : "bg-gray-300")}></div>
          
          <div className="flex flex-col items-center">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-sm", step >= 3 ? "bg-blue-600 text-white shadow-blue-500/30" : "bg-gray-100 text-gray-400")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h10"/><path d="M9 4v16"/><path d="m3 9 3 3-3 3"/></svg>
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", step >= 3 ? "text-blue-600" : "text-gray-400")}>Review</span>
          </div>
        </div>
      </div>

      <div className="p-8 pb-24">
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8 border-b border-gray-100 pb-6">
              <h2 className="text-2xl font-serif text-gray-900 mb-2">Scholarship Record Form</h2>
              <p className="text-xs text-gray-500">Data and Personal Information will be kept with utmost confidentiality and will be protected through RA 10173 also known as Data Privacy Act of 2012</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-yellow-800 font-medium text-center">
              Please fill out all required fields accurately and completely. This form will be reviewed by the Guidance Office prior to processing.
            </div>

            <div className="bg-blue-600 text-white p-3 rounded-xl font-bold text-center uppercase tracking-wider text-sm shadow-md">
              Student Demographics
            </div>

            <div className="space-y-4">
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-sm font-bold text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Personal Information
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="md:col-span-1">
                  <label className="relative aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden block">
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange('picture', e)} />
                    {files.picture ? (
                      <img src={files.picture.data} alt="2x2" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        <span className="text-xs font-medium text-center px-2">2 x 2 Picture</span>
                      </>
                    )}
                  </label>
                </div>
                
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Family Name</label>
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. Dela Cruz" value={formData.familyName} onChange={e => setFormData({...formData, familyName: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Middle Name</label>
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. Santos" value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">First Name</label>
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. Juan" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Birthdate</label>
                    <input type="date" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={formData.birthdate} onChange={e => setFormData({...formData, birthdate: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Age</label>
                    <input type="number" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. 18" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block mb-2">Sex</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 text-sm"><input type="radio" name="sex" className="text-blue-600" checked={formData.sex === 'Male'} onChange={() => setFormData({...formData, sex: 'Male'})} /> Male</label>
                      <label className="flex items-center gap-1.5 text-sm"><input type="radio" name="sex" className="text-blue-600" checked={formData.sex === 'Female'} onChange={() => setFormData({...formData, sex: 'Female'})} /> Female</label>
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-3">
                    <label className="text-xs font-semibold text-gray-700">Course</label>
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. BSIT" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="border-b border-gray-100 pb-6">
              <h2 className="text-2xl font-serif text-gray-900 mb-2">Scholarship Documents</h2>
              <p className="text-xs text-gray-500">Data and Personal Information will be kept with utmost confidentiality and will be protected through RA 10173 also known as Data Privacy Act of 2012</p>
            </div>
            
             <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-yellow-800 font-medium">
              Upload the following required scholarship documents.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <label className="w-48 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer group mb-3 relative overflow-hidden">
                   <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleFileChange('studentId', e)} />
                   {files.studentId ? (
                     <img src={files.studentId.data} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="ID" />
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                   )}
                   <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">Change</span>
                   </div>
                </label>
                <p className="text-sm font-bold text-gray-700">Student ID</p>
              </div>
              
              <div className="flex flex-col items-center">
                <label className="w-48 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer group mb-3 relative overflow-hidden">
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleFileChange('rf', e)} />
                  {files.rf ? (
                    <img src={files.rf.data} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="RF" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  )}
                   <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">Change</span>
                   </div>
                </label>
                <p className="text-sm font-bold text-gray-700">RF</p>
                <p className="text-xs text-gray-500 italic">Registration Form</p>
              </div>
              
              <div className="flex flex-col items-center sm:col-span-2">
                <label className="w-48 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer group mb-3 relative overflow-hidden">
                   <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleFileChange('gwa', e)} />
                   {files.gwa ? (
                     <img src={files.gwa.data} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="GWA" />
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                   )}
                   <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">Change</span>
                   </div>
                </label>
                <p className="text-sm font-bold text-gray-700">GWA</p>
                <p className="text-xs text-gray-500 italic">General Weighted Average</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-1">Review Your Submission</h2>
              <p className="text-blue-100 text-sm">Please review all information before submitting.</p>
            </div>
            
            <div className="bg-blue-100 text-blue-900 p-3 rounded-xl font-bold text-center uppercase tracking-wider text-sm">
              Student Demographics
            </div>
            
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Personal Information
              </div>
              <div className="divide-y divide-gray-100 text-sm">
                <div className="grid grid-cols-3 p-3">
                  <div className="font-semibold text-gray-600">Family Name</div>
                  <div className="col-span-2 text-gray-900">{formData.familyName || '-'}</div>
                </div>
                <div className="grid grid-cols-3 p-3 bg-gray-50/50">
                  <div className="font-semibold text-gray-600">First Name</div>
                  <div className="col-span-2 text-gray-900">{formData.firstName || '-'}</div>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <div className="font-semibold text-gray-600">Course</div>
                  <div className="col-span-2 text-gray-900">{formData.course || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex justify-between">
        <button 
          onClick={handleBack}
          className="px-6 py-2.5 bg-gray-500 text-white rounded-full font-medium text-sm hover:bg-gray-600 transition-colors shadow-md"
        >
          Back
        </button>
        {step < 3 ? (
          <button 
            onClick={handleNext}
            className="px-6 py-2.5 bg-[#0f2e60] text-white rounded-full font-medium text-sm hover:bg-[#1a4484] transition-colors shadow-md shadow-blue-900/20"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-green-600 text-white rounded-full font-medium text-sm hover:bg-green-700 transition-colors shadow-md shadow-green-500/20"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
