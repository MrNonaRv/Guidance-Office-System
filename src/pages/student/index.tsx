import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LogOut, Upload, CheckCircle2, ChevronDown, View, FileText, Award, GraduationCap } from 'lucide-react';
import { db } from '../../lib/db';
import { motion } from 'motion/react';

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
  const [scholarships, setScholarships] = useState<any[]>([]);

  React.useEffect(() => {
    const sessionStr = sessionStorage.getItem('studentUser');
    if (sessionStr) {
      const parsedUser = JSON.parse(sessionStr);
      setUser(parsedUser);
      db.submissions.listByStudent(parsedUser.id).then(subs => setSubmissions(subs));
    }
    
    setScholarships(db.scholarships.getCached().filter((s: any) => s.status === 'Active'));
    const unsubScholarships = db.scholarships.subscribe(items => {
      setScholarships(items.filter((s: any) => s.status === 'Active'));
    });
    return () => unsubScholarships();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1864db] to-[#0f2e60] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 opacity-20 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>
        <h2 className="text-3xl font-bold relative z-10">Hello, {user ? `${user.firstName}` : 'Student'}!</h2>
        <p className="text-blue-100 mt-2 relative z-10 max-w-lg">Welcome to the Student Scholarship Portal. Here you can browse available scholarships, submit your applications, and track your progress.</p>
      </div>

      {submissions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#0f2e60] mb-4">Your Recent Applications</h3>
          <div className="space-y-3">
            {submissions.map(sub => (
              <div key={sub.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-bold text-gray-800">{sub.scholarshipType}</h4>
                  <p className="text-xs text-gray-500 mt-1">Submitted on {new Date(sub.submittedAt).toLocaleDateString()}</p>
                </div>
                <span className={cn(
                  "px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full",
                  sub.status === 'Approved' ? "bg-green-100 text-green-700"
                  : sub.status === 'Rejected' ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
                )}>
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-bold text-[#0f2e60]">Available Scholarships</h3>
        {scholarships.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm flex flex-col items-center justify-center">
            <View className="w-12 h-12 text-gray-300 mb-3" />
            <p className="font-medium text-gray-600">No active scholarships available right now.</p>
            <p className="text-sm mt-1 text-gray-400">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scholarships.map(s => (
              <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-md transition-all hover:border-[#1864db]">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">{s.type}</span>
                    {s.deadline && <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">Due {new Date(s.deadline).toLocaleDateString()}</span>}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{s.name}</h3>
                  <p className="text-sm text-gray-500 mt-2 font-medium">{s.category} Category</p>
                  {s.description && <p className="text-sm text-gray-600 mt-3 line-clamp-2">{s.description}</p>}
                </div>
                <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50">
                  <span className="text-xs font-semibold text-gray-500">{s.slots ? `${s.slots} Slots Available` : 'Open Slots'}</span>
                  <button 
                    onClick={() => navigate(`/student/submission?scholarshipId=${s.id}`)}
                    className="px-6 py-2.5 bg-[#1864db] text-white rounded-full font-bold text-sm hover:bg-[#124b9f] transition-colors shadow-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function StudentSubmissionForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scholarshipId = searchParams.get('scholarshipId');
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Comprehensive Form State matching the physical forms
  const [formData, setFormData] = useState<Record<string, any>>({
    // Academic Year
    academicYear: 'A.Y. 2025-2026 - 1st Semester',
    
    // A. Personal Demographics & Record
    familyName: '', firstName: '', middleName: '',
    course: '', yearLevel: '', section: '',
    age: '', sex: '', civilStatus: '',
    birthdate: '', contactNo: '', permanentAddress: '',
    
    // B. Family Background
    fatherName: '', fatherOccupation: '', fatherOffice: '',
    motherName: '', motherOccupation: '', motherOffice: '',
    guardianOccupation: '',
    parentsEducationalAttainment: '',
    monthlyIncome: '',
    firstGenCollege: '',

    // C. Living Condition
    livingWith: '', livingWithSpecify: '',
    housingType: '', housingTypeSpecify: '',

    // D. Access to Resources
    accessResources: [] as string[],
    workingStudent: '',

    // E. Student Classification
    classifications: [] as string[],
    classificationOthersSpecify: '',
    workingStudentTypeOfWork: '',
    pwdCondition: '',
    pdlReason: '',
    
    // F. Scholarship Category
    fundingType: 'Internally-Funded',
    scholarshipCategory: '',
    scholarshipSpecify: ''
  });

  const [files, setFiles] = useState<{name: string, data: string, type: string}[]>([]);
  const [user, setUser] = useState<any>(null);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [academicYearsList, setAcademicYearsList] = useState<any[]>([]);

  React.useEffect(() => {
    // Load courses
    db.courses.listAll().then(courses => {
      const active = courses.filter((c: any) => c.status === 'Active');
      setCoursesList(active.length > 0 ? active : courses);
    });

    // Load academic years
    db.academicYears.listAll().then(ays => {
      setAcademicYearsList(ays);
      const def = ays.find((a: any) => a.isDefault) || ays.find((a: any) => a.status === 'Active') || ays[0];
      if (def) {
        setFormData(prev => ({
          ...prev,
          academicYear: prev.academicYear || def.label
        }));
      }
    });

    const sessionStr = sessionStorage.getItem('studentUser');
    if (sessionStr) {
      const parsedUser = JSON.parse(sessionStr);
      setUser(parsedUser);
      setFormData(prev => ({
        ...prev,
        firstName: parsedUser.firstName || '',
        familyName: parsedUser.lastName || ''
      }));
    }

    if (scholarshipId) {
      // @ts-ignore
      db.scholarships.get(scholarshipId).then(s => {
        if (s) {
          setSelectedScholarship(s);
          setFormData(prev => ({
            ...prev,
            fundingType: s.type,
            scholarshipCategory: s.category + ' - ' + s.name
          }));
        }
      });
    }
  }, [scholarshipId]);

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          data: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData(prev => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setFormError('');
    try {
      const submission: any = {
        id: Date.now().toString(),
        studentId: user.id,
        studentName: formData.firstName + ' ' + formData.familyName,
        scholarshipType: formData.fundingType + ' (' + formData.scholarshipCategory + ')',
        formId: scholarshipId || 'default',
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        data: formData,
        files: files
      };
      // @ts-ignore
      await db.submissions.set(submission.id, submission);
      navigate('/student/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit application');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#0f2e60]">Scholarship Application</h2>
          <p className="text-gray-500 mt-2">Complete the form below to submit your application.</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center relative mb-12 px-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1864db] -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm",
            step >= s ? "bg-[#1864db] text-white border-2 border-white" : "bg-white text-gray-400 border-2 border-gray-200"
          )}>
            {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
              {formError}
            </div>
          )}

          {/* STEP 1: DEMOGRAPHICS */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Personal Demographics & Record</h3>
                <p className="text-sm text-gray-500">Please provide your basic information.</p>
              </div>
              
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#1864db]" />
                  <div>
                    <div className="text-xs font-bold text-[#0f2e60] uppercase tracking-wider">Application Academic Term</div>
                    <div className="text-sm font-semibold text-gray-700">Select the applicable academic year and term for this application</div>
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  <select 
                    value={formData.academicYear} 
                    onChange={e => setFormData({...formData, academicYear: e.target.value})}
                    className="w-full sm:w-auto px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm font-bold text-[#0f2e60] focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {academicYearsList.length > 0 ? (
                      academicYearsList.map(ay => (
                        <option key={ay.id} value={ay.label}>
                          {ay.label} {ay.isDefault ? '(Current Term)' : ''}
                        </option>
                      ))
                    ) : (
                      <>
                        <option>A.Y. 2025-2026 - 1st Semester</option>
                        <option>A.Y. 2025-2026 - 2nd Semester</option>
                        <option>A.Y. 2024-2025 - 2nd Semester</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Family Name</label>
                  <input type="text" value={formData.familyName} onChange={e => setFormData({...formData, familyName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">First Name</label>
                  <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Middle Name</label>
                  <input type="text" value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Course</label>
                  <select value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all">
                    <option value="">Select...</option>
                    {coursesList.length > 0 ? (
                      coursesList.map(c => (
                        <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="BSCS">BSCS - Bachelor of Science in Computer Science</option>
                        <option value="BAEL">BAEL - Bachelor of Arts in English Language</option>
                        <option value="BSFT">BSFT - Bachelor of Science in Food Technology</option>
                        <option value="BSOA">BSOA - Bachelor of Science in Office Administration</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Year Level</label>
                  <select value={formData.yearLevel} onChange={e => setFormData({...formData, yearLevel: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all">
                    <option value="">Select...</option>
                    <option>First year</option>
                    <option>Second year</option>
                    <option>Third year</option>
                    <option>Fourth year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Section</label>
                  <input type="text" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Age</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sex</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sex" checked={formData.sex === 'Male'} onChange={() => setFormData({...formData, sex: 'Male'})} className="w-4 h-4 text-[#1864db]" /> <span>Male</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sex" checked={formData.sex === 'Female'} onChange={() => setFormData({...formData, sex: 'Female'})} className="w-4 h-4 text-[#1864db]" /> <span>Female</span></label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Civil Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="civilStatus" checked={formData.civilStatus === 'Single'} onChange={() => setFormData({...formData, civilStatus: 'Single'})} className="w-4 h-4 text-[#1864db]" /> <span>Single</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="civilStatus" checked={formData.civilStatus === 'Married'} onChange={() => setFormData({...formData, civilStatus: 'Married'})} className="w-4 h-4 text-[#1864db]" /> <span>Married</span></label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Birthdate</label>
                  <input type="date" value={formData.birthdate} onChange={e => setFormData({...formData, birthdate: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Contact No.</label>
                  <input type="text" value={formData.contactNo} onChange={e => setFormData({...formData, contactNo: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Permanent Address</label>
                <textarea value={formData.permanentAddress} onChange={e => setFormData({...formData, permanentAddress: e.target.value})} rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1864db] outline-none transition-all" />
              </div>
            </div>
          )}

          {/* STEP 2: FAMILY BACKGROUND */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900">Family Background & Living Condition</h3>
              </div>

              {/* Parents Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Father's Name</label>
                    <input type="text" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Father's Occupation</label>
                    <input type="text" value={formData.fatherOccupation} onChange={e => setFormData({...formData, fatherOccupation: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Office (Father)</label>
                    <input type="text" value={formData.fatherOffice} onChange={e => setFormData({...formData, fatherOffice: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mother's Name</label>
                    <input type="text" value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mother's Occupation</label>
                    <input type="text" value={formData.motherOccupation} onChange={e => setFormData({...formData, motherOccupation: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Office (Mother)</label>
                    <input type="text" value={formData.motherOffice} onChange={e => setFormData({...formData, motherOffice: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Guardian's Occupation (If applicable)</label>
                  <input type="text" value={formData.guardianOccupation} onChange={e => setFormData({...formData, guardianOccupation: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Highest Educational Attainment of your Parent/Guardian?</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Elementary Level', 'Elementary Graduate', 'High School Level', 'High school Graduate', 'College Level', 'College Graduate', 'post Graduate level/degree'].map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input type="radio" name="edu" checked={formData.parentsEducationalAttainment === opt} onChange={() => setFormData({...formData, parentsEducationalAttainment: opt})} className="w-4 h-4 text-[#1864db]" />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">What is your family's approximate monthly income?</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['below Php10,000', 'Php10,001 - 20,000', 'Php20,001 - 30,000', 'Above 30,000'].map(opt => (
                        <label key={opt} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input type="radio" name="income" checked={formData.monthlyIncome === opt} onChange={() => setFormData({...formData, monthlyIncome: opt})} className="w-4 h-4 text-[#1864db]" />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Are you the first in the family to attend College?</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="firstGen" checked={formData.firstGenCollege === 'Yes'} onChange={() => setFormData({...formData, firstGenCollege: 'Yes'})} className="w-4 h-4 text-[#1864db]" /> <span>Yes</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="firstGen" checked={formData.firstGenCollege === 'No'} onChange={() => setFormData({...formData, firstGenCollege: 'No'})} className="w-4 h-4 text-[#1864db]" /> <span>No</span></label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">With whom do you currently live?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Parents/Guardians', 'Boarding house', 'Relatives', 'Alone'].map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input type="radio" name="live" checked={formData.livingWith === opt} onChange={() => setFormData({...formData, livingWith: opt})} className="w-4 h-4 text-[#1864db]" />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-3 p-2 col-span-2">
                      <input type="radio" name="live" checked={formData.livingWith === 'others'} onChange={() => setFormData({...formData, livingWith: 'others'})} className="w-4 h-4 text-[#1864db]" />
                      <span className="text-sm text-gray-700 whitespace-nowrap">others (specify)</span>
                      <input type="text" value={formData.livingWithSpecify} onChange={e => setFormData({...formData, livingWithSpecify: e.target.value})} className="border-b border-gray-300 focus:border-[#1864db] outline-none flex-1 bg-transparent px-2 text-sm" disabled={formData.livingWith !== 'others'} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Type of Housing</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Own house', 'Rented house or apartment', 'Boarding house'].map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input type="radio" name="housing" checked={formData.housingType === opt} onChange={() => setFormData({...formData, housingType: opt})} className="w-4 h-4 text-[#1864db]" />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-3 p-2">
                      <input type="radio" name="housing" checked={formData.housingType === 'Others'} onChange={() => setFormData({...formData, housingType: 'Others'})} className="w-4 h-4 text-[#1864db]" />
                      <span className="text-sm text-gray-700 whitespace-nowrap">Others (specify)</span>
                      <input type="text" value={formData.housingTypeSpecify} onChange={e => setFormData({...formData, housingTypeSpecify: e.target.value})} className="border-b border-gray-300 focus:border-[#1864db] outline-none flex-1 bg-transparent px-2 text-sm" disabled={formData.housingType !== 'Others'} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CLASSIFICATION */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900">Survey & Student Classification</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Do you have access of the following at home?</label>
                  <div className="space-y-2">
                    {['Personal Computer/Laptop', 'Internet Connection', 'Study space', 'Textbooks and learning materials'].map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                        <input type="checkbox" checked={formData.accessResources.includes(opt)} onChange={() => handleCheckboxChange('accessResources', opt)} className="w-4 h-4 text-[#1864db] rounded border-gray-300" />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Do you work while studying?</label>
                  <div className="flex flex-wrap gap-4">
                    {['Yes, full-time', 'Yes, part-time', 'No'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg">
                        <input type="radio" name="working" checked={formData.workingStudent === opt} onChange={() => setFormData({...formData, workingStudent: opt})} className="w-4 h-4 text-[#1864db]" /> 
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-4">Which of the following classification best describe your current status? (Multiple responses allowed)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  {[
                    'Indigenous Peoples (IPs)', 'Solo Parent', 'Child of a solo parent', 
                    'Persons with disabilities (PWDs)', 'Child of Person with Disabilities (PWD)',
                    'Drop out or learner who returned to school', 'Child of drop out or learner who returned to school',
                    'Rebel returnees', 'Child of a rebel returnees', 'Dependent or child of OFW',
                    'Member of 4Ps', 'Member of Calamity or Disaster Affected Family',
                    'Orphan/Child in need of special protection', 'Working Student',
                    'From geographically isolated & disadvantaged area (GIDA)', 'Muslim Student',
                    'Low income family/ Economically disadvantaged student', 'Senior Citizen student',
                    'First Generation student (Parents did not complete a college degree)',
                    'LGBTQ+ Community', 'Regular student (I do not belong to any of this group classification)'
                  ].map(opt => (
                    <label key={opt} className="flex items-start gap-3 p-1 cursor-pointer hover:bg-gray-50 rounded group">
                      <input type="checkbox" checked={formData.classifications.includes(opt)} onChange={() => handleCheckboxChange('classifications', opt)} className="w-4 h-4 text-[#1864db] rounded border-gray-300 mt-0.5" />
                      <span className="text-gray-700 leading-tight">{opt}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.classifications.includes('others')} onChange={() => handleCheckboxChange('classifications', 'others')} className="w-4 h-4 text-[#1864db] rounded" />
                      <span className="text-sm text-gray-700 font-medium">others (Please specify)</span>
                    </label>
                    <input type="text" value={formData.classificationOthersSpecify} onChange={e => setFormData({...formData, classificationOthersSpecify: e.target.value})} className="border-b border-gray-300 focus:border-[#1864db] outline-none flex-1 bg-transparent px-2 text-sm" disabled={!formData.classifications.includes('others')} />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">If you are working student, please indicate your type of work or source of income:</label>
                    <input type="text" value={formData.workingStudentTypeOfWork} onChange={e => setFormData({...formData, workingStudentTypeOfWork: e.target.value})} className="w-full border-b border-gray-300 focus:border-[#1864db] outline-none bg-transparent py-1 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">If you are a student with special needs/Person with disability (PWD), please specify your condition or disability:</label>
                    <input type="text" value={formData.pwdCondition} onChange={e => setFormData({...formData, pwdCondition: e.target.value})} className="w-full border-b border-gray-300 focus:border-[#1864db] outline-none bg-transparent py-1 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">If you are a PDL (Drop out, or learner with interrupted schooling), please state the reason why your schooling was previously interrupted:</label>
                    <input type="text" value={formData.pdlReason} onChange={e => setFormData({...formData, pdlReason: e.target.value})} className="w-full border-b border-gray-300 focus:border-[#1864db] outline-none bg-transparent py-1 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ATTACHMENTS */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Scholarship Category & Attachments</h3>
                <p className="text-sm text-gray-500">Confirm your scholarship category and upload requirements.</p>
              </div>
              
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-8">
                <h4 className="font-bold text-[#0f2e60] mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#1864db]" /> 
                  Selected Scholarship Target
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-blue-800 uppercase tracking-wide mb-2">Funding Type</label>
                    <select value={formData.fundingType} onChange={e => setFormData({...formData, fundingType: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:border-[#1864db] outline-none">
                      <option value="Internally-Funded">Internally-Funded</option>
                      <option value="Externally-Funded">Externally-Funded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-800 uppercase tracking-wide mb-2">Scholarship Category</label>
                    <input type="text" value={formData.scholarshipCategory} onChange={e => setFormData({...formData, scholarshipCategory: e.target.value})} placeholder="e.g. Entrance - Valedictorian" className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:border-[#1864db] outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">Required Attachments</label>
                
                {['2x2 Picture', 'Certificate of Grades (COG)'].map((docName, idx) => (
                  <div key={idx} className="border border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-[#1864db] transition-colors relative group">
                    <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-6 h-6 text-[#1864db]" />
                    </div>
                    <p className="font-bold text-gray-900">{docName}</p>
                    <p className="text-xs text-gray-500 mt-1">Click or drag file to upload</p>
                  </div>
                ))}

                {files.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Uploaded Files</h4>
                    <div className="space-y-2">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="text-sm font-medium text-gray-700">{f.name}</span>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={step === 1}
            className="px-6 py-2.5 text-gray-600 font-bold text-sm hover:bg-gray-200 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-[#1864db] text-white rounded-full font-bold text-sm hover:bg-[#124b9f] transition-all shadow-md flex items-center gap-2"
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#0f2e60] text-white rounded-full font-bold text-sm hover:bg-[#0a2044] transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}