import { LayoutGrid, FileText, Bell, Mail, BarChart2, Settings, User, LogOut, Users, TrendingUp, BookOpen, Filter, Calendar, Award, GraduationCap, ImageIcon, Plus, Pen, Trash2, Paperclip, View, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import React, { useState, useEffect} from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
/* import { Award, LayoutGrid, TrendingUp, BookOpen, FileText, Bell, Mail, BarChart2, Settings, LogOut, Filter, View, User, Paperclip, Image as ImageIcon, Pen, Trash2, Calendar, GraduationCap, Users, Plus, } from 'lucide-react'; */
import { db } from '../../lib/db';
import { motion } from 'motion/react';
import { StudentRecordModal } from '../../components/StudentRecordModal';

import { signInWithGoogle } from '../../lib/firebase';

export function GuidanceLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [adminEmailInput, setAdminEmailInput] = useState('guidancestaff@capsu.edu');
  const [adminPasswordInput, setAdminPasswordInput] = useState('admin123');

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const fbUser = await signInWithGoogle();
      
      let user = await db.users.findByEmail(fbUser.email || '');
      if (!user) {
        user = {
          id: fbUser.uid,
          email: fbUser.email || '',
          firstName: fbUser.displayName?.split(' ')[0] || 'Admin',
          lastName: fbUser.displayName?.split(' ').slice(1).join(' ') || '',
          role: 'admin' as const
        };
        await db.users.set(user.id, user);
      }
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminEmail', fbUser.email || '');
      navigate('/admin/dashboard');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized in Firebase. Add this URL to Firebase Auth settings.');
      } else {
        console.error("Admin login error", err);
        setError('Failed to sign in. If previewing, try opening in a new tab.');
      }
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
          Guidance Portal
        </div>
        
        <form className="space-y-3" onSubmit={(e) => { 
          e.preventDefault(); 
          localStorage.setItem('adminAuth', 'true');
          localStorage.setItem('adminEmail', adminEmailInput || 'guidancestaff@capsu.edu');
          navigate('/admin/dashboard'); 
        }}>
          {error && <div className="text-red-500 text-xs text-center mb-2">{error}</div>}
          <div className="text-left">
            <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1">Gmail</label>
            <input 
              type="email" 
              value={adminEmailInput} 
              onChange={(e) => setAdminEmailInput(e.target.value)} 
              className="w-full px-4 py-2.5 bg-white rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" 
            />
          </div>
          <div className="text-left">
            <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1">Password</label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                value={adminPasswordInput} 
                onChange={(e) => setAdminPasswordInput(e.target.value)} 
                placeholder="Enter password"
                className="w-full px-4 py-2.5 pr-11 bg-white rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" 
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
            <div className="text-right mt-1">
              <a href="#" className="text-[11px] text-gray-500 hover:text-[#0f2e60] hover:underline px-1">Forgot Password?</a>
            </div>
          </div>
          
          <div className="pt-1">
            <button type="submit" className="w-full bg-[#1864db] text-white py-2.5 rounded-full font-medium hover:bg-[#124b9f] transition-colors shadow-md shadow-blue-900/20 text-sm">
              Log In
            </button>
          </div>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#0f2e60]/20"></div></div>
            <div className="relative flex justify-center text-[10px]"><span className="px-3 bg-[#a5d8ff] text-[#0f2e60]/60 uppercase font-semibold">or</span></div>
          </div>
          
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full bg-[#1864db] text-white py-2.5 rounded-full font-medium hover:bg-[#124b9f] transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 text-[13px]">
            <div className="bg-white p-1 rounded-full">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </div>
            Continue with Google
          </button>
        </form>
      </motion.div>
    </div>
  );
}

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: FileText, label: 'Submissions', path: '/admin/submissions' },
  { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
  { icon: Mail, label: 'Communications', path: '/admin/communications' },
  { icon: BarChart2, label: 'Reports', path: '/admin/reports' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

import { logOut } from '../../lib/firebase';

export function GuidanceLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('adminEmail') || 'aguilos.relie@capsu.edu' : 'aguilos.relie@capsu.edu';
  });
  
  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden flex flex-col bg-[#eef3f8] font-sans">
      {/* Top Banner Navbar (Fixed) */}
      <header className="w-full bg-[#1257c7] text-white px-6 py-3.5 flex items-center justify-between shadow-md z-30 shrink-0">
        <div className="flex items-center gap-3.5">
          <img src="/capsu-logo.png" alt="CapSU Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-xl font-serif font-bold text-white tracking-wide leading-tight">
              Web-Based Scholarship Submission Alert System
            </h1>
            <p className="text-xs text-blue-100 font-medium">Guidance Portal</p>
          </div>
        </div>
      </header>

      {/* Main Content with Fixed Sidebar and Independent Content Scrolling */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Sidebar (Fixed in viewport, Log Out always visible) */}
        <aside className="w-64 bg-[#072b6b] text-white flex flex-col justify-between p-4 shrink-0 shadow-lg z-20 h-full overflow-hidden select-none">
          <div className="flex flex-col min-h-0">
            {/* User Profile */}
            <div className="flex items-center gap-3.5 px-2 py-3 mb-3 border-b border-blue-900/40 shrink-0">
              <div className="w-11 h-11 rounded-full border-2 border-white/80 flex items-center justify-center bg-transparent shrink-0">
                <User className="w-6 h-6 text-white stroke-[1.75]" />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-[15px] text-white leading-tight">Relie Aguilos</p>
                <p className="text-xs text-blue-200 truncate">{adminEmail}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5 overflow-y-auto pr-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold",
                      isActive 
                        ? "bg-[#fbc02d] text-[#0f2e60] shadow-sm font-bold" 
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-[#0f2e60]" : "text-white")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Log Out Button (Always anchored and visible at bottom) */}
          <div className="pt-3 pb-1 border-t border-blue-900/40 shrink-0">
            <button 
              onClick={async () => {
                await logOut();
                localStorage.removeItem('adminAuth');
                localStorage.removeItem('adminEmail');
                navigate('/admin/login');
              }} 
              className="flex items-center gap-3 px-4 py-3 text-white font-bold hover:bg-white/10 rounded-xl transition-all duration-200 w-full text-[15px]"
            >
              <LogOut className="w-5 h-5 stroke-[2.5]" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Outlet Canvas (Scrolls smoothly and independently) */}
        <main className="flex-1 h-full min-h-0 overflow-y-auto bg-[#eef3f8]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function GuidanceDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<any[]>(() => db.submissions.getCached());

  useEffect(() => {
    const unsub = db.submissions.subscribe(subs => {
      if (subs && subs.length > 0) {
        setSubmissions(subs);
      }
    });
    return () => unsub();
  }, []);

  const totalCount = 213 + Math.max(0, submissions.filter(s => !s.id.startsWith('sub-seed-')).length);
  const completeCount = 150 + submissions.filter(s => !s.id.startsWith('sub-seed-') && s.status === 'Complete').length;
  const incompleteCount = 63 + submissions.filter(s => !s.id.startsWith('sub-seed-') && s.status !== 'Complete').length;

  const customSubmissions = submissions
    .filter(s => !s.id.startsWith('sub-seed-'))
    .map(s => ({
      studentName: s.studentName || `${s.data?.firstName || ''} ${s.data?.familyName || ''}`.trim() || 'New Applicant',
      course: s.data?.course || s.answers?.course || 'BSCS',
      date: s.submittedAt ? new Date(s.submittedAt).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }) : 'March 11, 2026',
      status: s.status || 'Incomplete'
    }));

  const seedSubmissions = [
    { studentName: 'Anna Marie A. Santos', course: 'BAEL', date: 'March 11, 2026', status: 'Incomplete' },
    { studentName: 'Patricia Jane K. Manalo', course: 'BAEL', date: 'March 11, 2026', status: 'Incomplete' },
    { studentName: 'Damian James O. Emilio', course: 'BSFT', date: 'March 11, 2026', status: 'Incomplete' },
    { studentName: 'Paul John N. Dela Cruz', course: 'BSOA', date: 'March 11, 2026', status: 'Incomplete' },
    { studentName: 'Charlotte Alexis N. Tuvera', course: 'BSCS', date: 'March 10, 2026', status: 'Incomplete' },
    { studentName: 'Michael O. Burata', course: 'BSCS', date: 'March 10, 2026', status: 'Complete' },
    { studentName: 'Chery Joy M. Marcelino', course: 'BSCS', date: 'March 10, 2026', status: 'Complete' },
    { studentName: 'Jessica Mae E. Dela Cruz', course: 'BSCS', date: 'March 09, 2026', status: 'Complete' },
    { studentName: 'Mark Josh P. Lorenzo', course: 'BSOA', date: 'March 09, 2026', status: 'Complete' },
    { studentName: 'William George I. Diaz', course: 'BSFT', date: 'March 08, 2026', status: 'Complete' },
  ];

  const displaySubmissions = [...customSubmissions, ...seedSubmissions].slice(0, 10);

  const customNotifications = customSubmissions.slice(0, 3).map(s => ({
    studentName: s.studentName,
    action: 'submitted scholarship requirements',
    time: 'Just now'
  }));

  // Exact 6 notifications matching the reference image
  const seedNotifications = [
    { studentName: 'Anna Marie A. Santos', action: 'submitted scholarship requirements', time: 'Today, 1:03 PM' },
    { studentName: 'Patricia Jane K. Manalo', action: 'submitted scholarship requirements', time: 'Today, 10:17 AM' },
    { studentName: 'Damian James O. Emilio', action: 'submitted scholarship requirements', time: 'Today, 8:44 AM' },
    { studentName: 'Paul John N. Dela Cruz', action: 'submitted scholarship requirements f...', time: 'Today, 8:10 AM' },
    { studentName: 'Charlotte Alexis N. Tuvera', action: 'submitted scholarship requirements', time: 'Yesterday, 2:30 PM' },
    { studentName: 'Michael O. Burata', action: 'submitted scholarship requirements for.....', time: 'Yesterday, 9:01 PM' },
  ];

  const displayNotifications = [...customNotifications, ...seedNotifications].slice(0, 6);


  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Title */}
      <h1 className="text-4xl font-serif font-bold text-[#0c2340] tracking-tight">Dashboard</h1>
      
      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Blue Card */}
        <div 
          onClick={() => navigate('/admin/submissions', { state: { filterStatus: 'All status' } })}
          className="bg-gradient-to-b from-[#1c64db] to-[#12429f] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between h-52 relative cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-5xl font-bold font-serif tracking-tight">{totalCount}</div>
            <div className="text-base font-semibold text-white mt-1">Total Submissions</div>
            <div className="flex items-center gap-1.5 text-xs text-blue-100 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> + 4 this week
            </div>
          </div>
        </div>
        
        {/* Green Card */}
        <div 
          onClick={() => navigate('/admin/submissions', { state: { filterStatus: 'Complete' } })}
          className="bg-gradient-to-b from-[#3fa52a] to-[#287b1a] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between h-52 relative cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-5xl font-bold font-serif tracking-tight">{completeCount}</div>
            <div className="text-base font-semibold text-white mt-1">Complete Submissions</div>
            <div className="flex items-center gap-1.5 text-xs text-green-100 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> + 3 new today
            </div>
          </div>
        </div>
        
        {/* Yellow/Gold Card */}
        <div 
          onClick={() => navigate('/admin/submissions', { state: { filterStatus: 'Incomplete' } })}
          className="bg-gradient-to-b from-[#c88d00] to-[#e69f00] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between h-52 relative cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-5xl font-bold font-serif tracking-tight">{incompleteCount}</div>
            <div className="text-base font-semibold text-white mt-1">Incomplete Submissions</div>
            <div className="flex items-center gap-1.5 text-xs text-amber-100 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> + 4 this month
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Submissions Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
          <div className="p-5 px-6 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-base font-bold text-[#0c2340]">Recent Submissions</h2>
            <Link to="/admin/submissions" className="text-xs font-semibold text-[#1864db] hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#edf3fa] text-[#486581] text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-6 font-bold">STUDENT</th>
                  <th className="py-3 px-4 font-bold">COURSE</th>
                  <th className="py-3 px-4 font-bold">DATE</th>
                  <th className="py-3 px-6 font-bold text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displaySubmissions.map((s, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3.5 px-6 text-xs font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span>{s.studentName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-gray-800">{s.course}</td>
                    <td className="py-3.5 px-4 text-xs font-medium text-gray-600">{s.date}</td>
                    <td className="py-3.5 px-6 text-center">
                      {s.status === 'Incomplete' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
                          <span className="w-2 h-2 rounded-full bg-[#f59e0b] border border-black/40"></span>
                          Incomplete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]">
                          <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
                          Complete
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Reports & Recent Notifications */}
        <div className="lg:col-span-4 space-y-6">
          {/* Reports Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-[#0c2340]">Reports</h2>
              <Link to="/admin/reports" className="text-xs font-semibold text-[#1864db] hover:underline">View all</Link>
            </div>
            
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-xs font-bold text-gray-900 mb-2">Submissions Status Distribution</p>
                <div className="space-y-2">
                  <div className="w-full bg-[#e5e7eb] rounded-full h-3.5 overflow-hidden flex">
                    <div className="bg-[#22c55e] h-full rounded-full w-[70%]"></div>
                  </div>
                  <div className="w-full bg-[#e5e7eb] rounded-full h-3.5 overflow-hidden flex">
                    <div className="bg-[#eab308] h-full rounded-full w-[28%]"></div>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <p className="text-xs font-bold text-gray-900 mb-2">Gender Status Distribution</p>
                <div className="space-y-2">
                  <div className="w-full bg-[#e5e7eb] rounded-full h-3.5 overflow-hidden flex">
                    <div className="bg-[#0284c7] h-full rounded-full w-[58%]"></div>
                  </div>
                  <div className="w-full bg-[#e5e7eb] rounded-full h-3.5 overflow-hidden flex">
                    <div className="bg-[#ec4899] h-full rounded-full w-[42%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Notifications Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-[#0c2340]">Recent Notifcations</h2>
              <div className="flex items-center gap-1">
                <Link to="/admin/notifications" className="text-xs font-semibold text-[#1864db] hover:underline">View all</Link>
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
              </div>
            </div>
            
            <div className="space-y-2.5">
              {displayNotifications.map((n, idx) => (
                <div key={idx} className="bg-[#eef6ff] border border-[#d3e5fa] rounded-xl p-2.5 flex items-center gap-3 hover:bg-[#e4effc] transition-colors">
                  <div className="w-8 h-8 rounded-full border border-blue-400 bg-white flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-800 leading-tight">
                      <span className="font-bold">{n.studentName}</span> {n.action}
                    </p>
                    <p className="text-[10px] text-blue-700 font-semibold mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export function GuidanceSubmissions() {
  const location = useLocation();
  const [filterOpen, setFilterOpen] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>(() => db.submissions.getCached());
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(location.state?.filterStatus || 'All status');
  const [filterCourse, setFilterCourse] = useState('All courses');
  const [filterAcademicYear, setFilterAcademicYear] = useState('All academic years');
  const [coursesList, setCoursesList] = useState<any[]>(() => db.courses.getCached());
  const [academicYearsList, setAcademicYearsList] = useState<any[]>(() => db.academicYears.getCached());

  const fetchSubmissions = () => {
    db.submissions.listAll().then(subs => {
      setSubmissions(subs);
    });
  };

  useEffect(() => {
    fetchSubmissions();
    const unsubSubmissions = db.submissions.subscribe(setSubmissions);
    const unsubCourses = db.courses.subscribe(setCoursesList);
    const unsubAcademicYears = db.academicYears.subscribe(setAcademicYearsList);
    

    return () => {
      unsubSubmissions();
      unsubCourses();
      unsubAcademicYears();
    };
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const sub = await db.submissions.get(id);
    if (sub) {
      sub.status = status as any;
      await db.submissions.set(id, sub);
      fetchSubmissions();
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission(sub);
      }
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    const studentFullName = s.studentName || `${s.data?.firstName || ''} ${s.data?.familyName || ''}`.trim();
    const matchesSearch = studentFullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All status' || s.status === filterStatus;
    const subCourse = s.data?.course || s.answers?.course || (s.scholarshipType.includes('BS') || s.scholarshipType.includes('BA') ? s.scholarshipType.split(' ')[0] : '');
    const matchesCourse = filterCourse === 'All courses' || subCourse === filterCourse || s.scholarshipType.includes(filterCourse);
    const subAY = s.data?.academicYear || s.answers?.academicYear || 'A.Y. 2025-2026 - 1st Semester';
    const matchesAY = filterAcademicYear === 'All academic years' || subAY === filterAcademicYear || subAY.includes(filterAcademicYear);
    return matchesSearch && matchesStatus && matchesCourse && matchesAY;
  });
  
  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-4xl font-serif font-bold text-[#0c2340] tracking-tight">Scholarship Submissions</h1>
      
      <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-visible">
        <div className="p-6 pb-4">
          <h2 className="text-xl font-bold text-[#0f2e60] mb-4">No. of Submissions ({filteredSubmissions.length})</h2>
          <div className="flex flex-col sm:flex-row gap-4 relative">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Search by student"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#1748a0] text-white rounded-full text-sm font-medium hover:bg-[#123675] hover:scale-[1.02] transition-all duration-300 shadow-sm whitespace-nowrap w-full sm:w-auto"
              >
                <Filter className="w-4 h-4" /> Filter
              </button>
              
              {filterOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">By Status</label>
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option>All status</option>
                        <option>Complete</option>
                        <option>Incomplete</option>
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">By Course</label>
                      <select 
                        value={filterCourse}
                        onChange={(e) => setFilterCourse(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option>All courses</option>
                        {coursesList.map(c => (
                          <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">By Academic Year</label>
                      <select 
                        value={filterAcademicYear}
                        onChange={(e) => setFilterAcademicYear(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option>All academic years</option>
                        {academicYearsList.map(ay => (
                          <option key={ay.id} value={ay.label}>{ay.label} {ay.isDefault ? '(Current)' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button 
                        onClick={() => { setFilterStatus('All status'); setFilterCourse('All courses'); setFilterAcademicYear('All academic years'); setFilterOpen(false); }} 
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-[1.02]"
                      >
                        Reset
                      </button>
                      <button onClick={() => setFilterOpen(false)} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02]">Apply</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-gray-200">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#f0f2f5] text-gray-600 text-[11px] font-bold uppercase tracking-widest border-b border-gray-200">
                <th className="py-4 px-6 text-left w-1/4">Student</th>
                <th className="py-4 px-6 w-1/5">Course</th>
                <th className="py-4 px-6 w-1/5">Date</th>
                <th className="py-4 px-6 w-1/6">Status</th>
                <th className="py-4 px-6 w-1/6">Records</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">No submissions found matching your filters.</td>
                </tr>
              )}
              {filteredSubmissions.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-800 flex items-center gap-4 text-left">
                    <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    {s.studentName}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                    {/* Inferring course from scholarshipType for demo, or extracting from answers */}
                    {s.data?.course || s.answers?.course || (s.scholarshipType.includes('BS') || s.scholarshipType.includes('BA') ? s.scholarshipType.split(' ')[0] : 'N/A')}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(s.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                      s.status === 'Complete' || s.status === 'Approved'
                        ? "bg-green-100 text-green-700" 
                        : s.status === 'Incomplete' || s.status === 'Pending'
                        ? "bg-[#fff3cd] text-[#856404]"
                        : "bg-red-100 text-red-700"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", 
                        s.status === 'Complete' || s.status === 'Approved' ? "bg-green-500" 
                        : s.status === 'Incomplete' || s.status === 'Pending' ? "bg-yellow-500" 
                        : "bg-red-500"
                      )}></span>
                      {s.status === 'Pending' ? 'Incomplete' : s.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <button onClick={() => setSelectedSubmission(s)} className="text-gray-400 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-[1.1] inline-block">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      
      {selectedSubmission && (
        <StudentRecordModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onStatusChange={handleStatusChange}
          academicYearsList={academicYearsList}
        />
      )}
    </div>
  );
}

export function GuidanceSettings() {
  const [activeTab, setActiveTab] = useState<'academic-year' | 'courses' | 'sections' | 'form' | 'files'>('academic-year');
  
  // Academic Years state (Matching the reference screenshot)

  const [scholarships, setScholarships] = useState<any[]>([]);
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<any>(null);
  const [scholarshipForm, setScholarshipForm] = useState({
    name: '',
    fundingType: 'Government / CHED',
    status: 'Active' as 'Active' | 'Inactive',
    description: ''
  });

  const handleSaveScholarship = async () => {
    if (!scholarshipForm.name.trim()) {
      alert("Please enter a scholarship name.");
      return;
    }
    if (editingScholarship) {
      await db.scholarships.update(editingScholarship.id, scholarshipForm);
      setScholarships(scholarships.map(s => s.id === editingScholarship.id ? { ...s, ...scholarshipForm } : s));
    } else {
      const newScholarship = await db.scholarships.create(scholarshipForm);
      setScholarships([...scholarships, newScholarship || { id: `sch-${Date.now()}`, ...scholarshipForm }]);
    }
    setShowScholarshipModal(false);
  };

  const handleEditScholarship = (s: any) => {
    setEditingScholarship(s);
    setScholarshipForm({
      name: s.name || '',
      fundingType: s.fundingType || 'Government / CHED',
      status: s.status || 'Active',
      description: s.description || ''
    });
    setShowScholarshipModal(true);
  };

  const handleDeleteScholarship = async (id: string) => {
    if (confirm("Are you sure you want to delete this scholarship?")) {
      await db.scholarships.delete(id);
      setScholarships(scholarships.filter(s => s.id !== id));
    }
  };

  const [academicYears, setAcademicYears] = useState<any[]>([
    { id: '1', year: '2026-2027', overallStatus: 'Active', firstSemester: 'Active', secondSemester: 'Inactive' },
    { id: '2', year: '2026-2025', overallStatus: 'Inactive', firstSemester: 'Inactive', secondSemester: 'Inactive' },
    { id: '3', year: '2025-2024', overallStatus: 'Inactive', firstSemester: 'Inactive', secondSemester: 'Inactive' },
    { id: '4', year: '2024-2023', overallStatus: 'Inactive', firstSemester: 'Inactive', secondSemester: 'Inactive' },
  ]);
  const [showAcademicYearModal, setShowAcademicYearModal] = useState(false);
  const [editingAcademicYear, setEditingAcademicYear] = useState<any>(null);
  const [academicYearForm, setAcademicYearForm] = useState({
    year: '2026-2027',
    overallStatus: 'Active' as 'Active' | 'Inactive',
    firstSemester: 'Active' as 'Active' | 'Inactive',
    secondSemester: 'Inactive' as 'Active' | 'Inactive'
  });

  // Courses state (BSCS, BAEL, BSFT, BSOA)
  const [courses, setCourses] = useState<any[]>([
    { id: '1', code: 'BSCS', name: 'Bachelor of Science in Computer Science', department: 'College of Information & Communications Technology', status: 'Active' },
    { id: '2', code: 'BAEL', name: 'Bachelor of Arts in English Language', department: 'College of Arts and Sciences', status: 'Active' },
    { id: '3', code: 'BSFT', name: 'Bachelor of Science in Food Technology', department: 'College of Agriculture and Fisheries Technology', status: 'Active' },
    { id: '4', code: 'BSOA', name: 'Bachelor of Science in Office Administration', department: 'College of Business and Management', status: 'Active' },
  ]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState({
    code: '', name: '', department: '', status: 'Active' as 'Active' | 'Inactive'
  });

  // Sections state
  const [sections, setSections] = useState<any[]>([
    { id: '1', name: 'BSCS 4A', course: 'BSCS', yearLevel: '4th Year', status: 'Active' },
    { id: '2', name: 'BSCS 4B', course: 'BSCS', yearLevel: '4th Year', status: 'Active' },
    { id: '3', name: 'BAEL 3A', course: 'BAEL', yearLevel: '3rd Year', status: 'Active' },
    { id: '4', name: 'BSFT 2A', course: 'BSFT', yearLevel: '2nd Year', status: 'Active' },
    { id: '5', name: 'BSOA 1A', course: 'BSOA', yearLevel: '1st Year', status: 'Active' },
  ]);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [sectionForm, setSectionForm] = useState({
    name: '', course: 'BSCS', yearLevel: '1st Year', status: 'Active' as 'Active' | 'Inactive'
  });

  // Form Fields & Requirements state
  const [formFields, setFormFields] = useState<any[]>([
    { id: '1', title: 'Certificate of Grades (COG)', description: 'Signed official registrar grade copy with GWA', mandatory: 'Required', status: 'Active' },
    { id: '2', title: 'Certificate of Registration (COR)', description: 'Current semester enrollment document & assessment form', mandatory: 'Required', status: 'Active' },
    { id: '3', title: 'Proof of Income / Certificate of Indigency', description: 'Parental ITR or Barangay Certificate of Low Income', mandatory: 'Required', status: 'Active' },
    { id: '4', title: 'Certificate of Good Moral Character', description: 'Issued by Student Affairs Services / Guidance Office', mandatory: 'Optional', status: 'Active' },
  ]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingFormField, setEditingFormField] = useState<any>(null);
  const [formFieldForm, setFormFieldForm] = useState({
    title: '', description: '', mandatory: 'Required', status: 'Active' as 'Active' | 'Inactive'
  });

  // Files state
  const [files, setFiles] = useState<any[]>([
    { id: '1', name: 'CHED_TDP_Application_Form_2026.pdf', category: 'Scholarship Application', size: '1.4 MB', uploadDate: 'March 01, 2026' },
    { id: '2', name: 'CapSU_Scholarship_Guidelines_v2.pdf', category: 'Guidelines & Policies', size: '2.8 MB', uploadDate: 'February 15, 2026' },
    { id: '3', name: 'Certificate_of_Indigency_Template.docx', category: 'Document Template', size: '450 KB', uploadDate: 'January 20, 2026' },
  ]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileForm, setFileForm] = useState({
    name: '', category: 'Scholarship Application', size: '1.2 MB'
  });

  useEffect(() => {
    let isMounted = true;
    db.courses.listAll().then(list => {
      if (isMounted && list && list.length > 0) {
        setCourses(list);
      }
    });
    db.scholarships.listAll().then(schs => {
      if (isMounted && schs) {
        setScholarships(schs);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Academic Year Handlers
  const handleSaveAcademicYear = () => {
    if (!academicYearForm.year.trim()) {
      alert("Please specify the academic year (e.g. 2026-2027).");
      return;
    }
    if (editingAcademicYear) {
      setAcademicYears(academicYears.map(ay => ay.id === editingAcademicYear.id ? { ...ay, ...academicYearForm } : ay));
    } else {
      setAcademicYears([{ id: Date.now().toString(), ...academicYearForm }, ...academicYears]);
    }
    setShowAcademicYearModal(false);
  };

  const handleEditAcademicYear = (ay: any) => {
    setEditingAcademicYear(ay);
    setAcademicYearForm({
      year: ay.year || '2026-2027',
      overallStatus: ay.overallStatus || 'Active',
      firstSemester: ay.firstSemester || 'Active',
      secondSemester: ay.secondSemester || 'Inactive',
    });
    setShowAcademicYearModal(true);
  };

  const handleDeleteAcademicYear = (id: string) => {
    if (confirm("Are you sure you want to delete this academic year?")) {
      setAcademicYears(academicYears.filter(ay => ay.id !== id));
    }
  };

  // Course Handlers
  


  const handleSaveCourse = async () => {
    if (!courseForm.code.trim() || !courseForm.name.trim()) {
      alert("Please enter both Course Code (e.g. BSCS) and Degree Title.");
      return;
    }
    if (editingCourse) {
      await db.courses.update(editingCourse.id, courseForm);
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...courseForm } : c));
    } else {
      const newCourse = await db.courses.create(courseForm);
      setCourses([...courses, newCourse || { id: Date.now().toString(), ...courseForm }]);
    }
    setShowCourseModal(false);
  };

  const handleEditCourse = (c: any) => {
    setEditingCourse(c);
    setCourseForm({
      code: c.code,
      name: c.name,
      department: c.department || '',
      status: c.status || 'Active'
    });
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await db.courses.delete(id);
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  // Section Handlers
  const handleSaveSection = () => {
    if (!sectionForm.name.trim()) {
      alert("Please specify the section name (e.g. BSCS 4A).");
      return;
    }
    if (editingSection) {
      setSections(sections.map(s => s.id === editingSection.id ? { ...s, ...sectionForm } : s));
    } else {
      setSections([...sections, { id: Date.now().toString(), ...sectionForm }]);
    }
    setShowSectionModal(false);
  };

  const handleEditSection = (s: any) => {
    setEditingSection(s);
    setSectionForm({
      name: s.name,
      course: s.course || 'BSCS',
      yearLevel: s.yearLevel || '1st Year',
      status: s.status || 'Active'
    });
    setShowSectionModal(true);
  };

  const handleDeleteSection = (id: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  // Form Field Handlers
  const handleSaveFormField = () => {
    if (!formFieldForm.title.trim()) {
      alert("Please enter a document/field name.");
      return;
    }
    if (editingFormField) {
      setFormFields(formFields.map(f => f.id === editingFormField.id ? { ...f, ...formFieldForm } : f));
    } else {
      setFormFields([...formFields, { id: Date.now().toString(), ...formFieldForm }]);
    }
    setShowFormModal(false);
  };

  const handleEditFormField = (f: any) => {
    setEditingFormField(f);
    setFormFieldForm({
      title: f.title,
      description: f.description || '',
      mandatory: f.mandatory || 'Required',
      status: f.status || 'Active'
    });
    setShowFormModal(true);
  };

  const handleDeleteFormField = (id: string) => {
    if (confirm("Are you sure you want to delete this requirement field?")) {
      setFormFields(formFields.filter(f => f.id !== id));
    }
  };

  // File Handlers
  const handleSaveFile = () => {
    if (!fileForm.name.trim()) {
      alert("Please enter a file name.");
      return;
    }
    setFiles([{
      id: Date.now().toString(),
      name: fileForm.name,
      category: fileForm.category,
      size: fileForm.size,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
    }, ...files]);
    setShowFileModal(false);
  };

  const handleDeleteFile = (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      setFiles(files.filter(f => f.id !== id));
    }
  };

  // Global "+ Add" opener
  const handleOpenAddModal = () => {
    if (activeTab === 'academic-year') {
      setEditingAcademicYear(null);
      setAcademicYearForm({ year: '2027-2028', overallStatus: 'Active', firstSemester: 'Active', secondSemester: 'Inactive' });
      setShowAcademicYearModal(true);
    } else if (activeTab === 'scholarships') {
      setEditingScholarship(null);
      setScholarshipForm({ name: '', fundingType: 'Government / CHED', status: 'Active', description: '' });
      setShowScholarshipModal(true);
    } else if (activeTab === 'courses') {
      setEditingCourse(null);
      setCourseForm({ code: '', name: '', department: '', status: 'Active' });
      setShowCourseModal(true);
    } else if (activeTab === 'sections') {
      setEditingSection(null);
      setSectionForm({ name: '', course: 'BSCS', yearLevel: '1st Year', status: 'Active' });
      setShowSectionModal(true);
    } else if (activeTab === 'form') {
      setEditingFormField(null);
      setFormFieldForm({ title: '', description: '', mandatory: 'Required', status: 'Active' });
      setShowFormModal(true);
    } else if (activeTab === 'files') {
      setFileForm({ name: '', category: 'Scholarship Application', size: '1.5 MB' });
      setShowFileModal(true);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Title */}
      <h1 className="text-4xl font-serif font-bold text-[#0c2340] tracking-tight">Settings</h1>

      {/* Tabs Row matching the reference image */}
      <div className="flex items-center gap-8 border-b border-gray-300/80 px-2 pt-1">
        <button
          onClick={() => setActiveTab('academic-year')}
          className={cn(
            "flex items-center gap-2.5 pb-3 text-sm font-bold transition-all relative cursor-pointer",
            activeTab === 'academic-year'
              ? "text-[#1864db]"
              : "text-[#0c2340] hover:text-[#1864db]"
          )}
        >
          <Calendar className={cn("w-4 h-4", activeTab === 'academic-year' ? "text-[#1864db]" : "text-[#0c2340]")} />
          <span>Academic Year</span>
          {activeTab === 'academic-year' && (
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1864db] rounded-t-full" />
        )}
      </button>

      <button
        onClick={() => setActiveTab('scholarships')}
        className={cn(
          "flex items-center gap-2.5 pb-3 text-sm font-bold transition-all relative cursor-pointer",
          activeTab === 'scholarships'
            ? "text-[#1864db]"
            : "text-[#0c2340] hover:text-[#1864db]"
        )}
      >
        <Award className={cn("w-4 h-4", activeTab === 'scholarships' ? "text-[#1864db]" : "text-[#0c2340]")} />
        <span>Scholarships</span>
        {activeTab === 'scholarships' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1864db] rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={cn(
            "flex items-center gap-2.5 pb-3 text-sm font-bold transition-all relative cursor-pointer",
            activeTab === 'courses'
              ? "text-[#1864db]"
              : "text-[#0c2340] hover:text-[#1864db]"
          )}
        >
          <GraduationCap className={cn("w-4 h-4", activeTab === 'courses' ? "text-[#1864db]" : "text-[#0c2340]")} />
          <span>Courses</span>
          {activeTab === 'courses' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1864db] rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={cn(
            "flex items-center gap-2.5 pb-3 text-sm font-bold transition-all relative cursor-pointer",
            activeTab === 'sections'
              ? "text-[#1864db]"
              : "text-[#0c2340] hover:text-[#1864db]"
          )}
        >
          <Users className={cn("w-4 h-4", activeTab === 'sections' ? "text-[#1864db]" : "text-[#0c2340]")} />
          <span>Sections</span>
          {activeTab === 'sections' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1864db] rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('form')}
          className={cn(
            "flex items-center gap-2.5 pb-3 text-sm font-bold transition-all relative cursor-pointer",
            activeTab === 'form'
              ? "text-[#1864db]"
              : "text-[#0c2340] hover:text-[#1864db]"
          )}
        >
          <FileText className={cn("w-4 h-4", activeTab === 'form' ? "text-[#1864db]" : "text-[#0c2340]")} />
          <span>Form</span>
          {activeTab === 'form' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1864db] rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={cn(
            "flex items-center gap-2.5 pb-3 text-sm font-bold transition-all relative cursor-pointer",
            activeTab === 'files'
              ? "text-[#1864db]"
              : "text-[#0c2340] hover:text-[#1864db]"
          )}
        >
          <ImageIcon className={cn("w-4 h-4", activeTab === 'files' ? "text-[#1864db]" : "text-[#0c2340]")} />
          <span>Files</span>
          {activeTab === 'files' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1864db] rounded-t-full" />
          )}
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-hidden">
        {/* Card Top Action Bar */}
        <div className="p-5 px-6 flex justify-between items-center border-b border-gray-200/80">
          <h2 className="text-lg font-bold text-[#0c2340]">
            {activeTab === 'academic-year' && 'Academic Year'}
            {activeTab === 'scholarships' && 'Scholarships & Requirements'}
            {activeTab === 'courses' && 'Courses'}
            {activeTab === 'sections' && 'Sections'}
            {activeTab === 'form' && 'Form Requirements'}
            {activeTab === 'files' && 'Files'}
          </h2>
          <button
            onClick={handleOpenAddModal}
            className="bg-[#072b6b] hover:bg-[#051c47] text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add</span>
          </button>
        </div>

        
        {/* TAB: SCHOLARSHIPS */}
        {activeTab === 'scholarships' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 px-6 font-semibold">Scholarship Name</th>
                  <th className="p-4 px-6 font-semibold">Funding Type</th>
                  <th className="p-4 px-6 font-semibold">Requirements</th>
                  <th className="p-4 px-6 font-semibold">Status</th>
                  <th className="p-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {scholarships.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500 italic">No scholarships configured.</td></tr>
                ) : scholarships.map((item: any) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 px-6 font-semibold text-gray-900">{item.name}</td>
                    <td className="p-4 px-6 text-gray-600 text-sm">{item.fundingType}</td>
                    <td className="p-4 px-6 text-gray-600 text-sm">
                      {item.requirements?.length || 0} document(s)
                    </td>
                    <td className="p-4 px-6">
                      <span className={cn(
                        "px-2.5 py-1 text-[11px] font-bold rounded-md",
                        item.status === 'Active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 px-6 text-right">
                      <button onClick={() => handleEditScholarship(item)} className="p-2 text-gray-400 hover:text-[#1864db] transition-colors" title="Edit"><Pen className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteScholarship(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 1: ACADEMIC YEAR (Matching screenshot exactly) */}
        {activeTab === 'academic-year' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#edf3fa] text-[#486581] text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-8 font-bold text-left">ACADEMIC YEAR</th>
                  <th className="py-3 px-6 font-bold text-center">OVERALL STATUS</th>
                  <th className="py-3 px-6 font-bold text-center">1ST SEMESTER</th>
                  <th className="py-3 px-6 font-bold text-center">2ND SEMESTER</th>
                  <th className="py-3 px-8 font-bold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {academicYears.map((ay, idx) => (
                  <tr key={ay.id || idx} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-4 px-8 font-bold text-gray-900">{ay.year}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "inline-block w-28 py-1 rounded-full text-xs font-semibold text-center",
                        ay.overallStatus === 'Active'
                          ? "bg-[#bbf7d0] text-[#15803d]"
                          : "bg-[#fecaca] text-[#dc2626]"
                      )}>
                        {ay.overallStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "inline-block w-28 py-1 rounded-full text-xs font-semibold text-center",
                        ay.firstSemester === 'Active'
                          ? "bg-[#bbf7d0] text-[#15803d]"
                          : "bg-[#fecaca] text-[#dc2626]"
                      )}>
                        {ay.firstSemester}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "inline-block w-28 py-1 rounded-full text-xs font-semibold text-center",
                        ay.secondSemester === 'Active'
                          ? "bg-[#bbf7d0] text-[#15803d]"
                          : "bg-[#fecaca] text-[#dc2626]"
                      )}>
                        {ay.secondSemester}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right space-x-3">
                      <button
                        onClick={() => handleEditAcademicYear(ay)}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                        title="Edit"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAcademicYear(ay.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: COURSES */}
        {activeTab === 'courses' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#edf3fa] text-[#486581] text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-8 font-bold text-left">COURSE CODE</th>
                  <th className="py-3 px-6 font-bold text-left">DEGREE TITLE</th>
                  <th className="py-3 px-6 font-bold text-left">COLLEGE / DEPARTMENT</th>
                  <th className="py-3 px-6 font-bold text-center">STATUS</th>
                  <th className="py-3 px-8 font-bold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {courses.map((c, idx) => (
                  <tr key={c.id || idx} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-4 px-8 font-bold text-[#1864db]">{c.code}</td>
                    <td className="py-4 px-6 font-bold text-gray-900">{c.name}</td>
                    <td className="py-4 px-6 text-gray-600 text-xs">{c.department}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "inline-block w-24 py-1 rounded-full text-xs font-semibold text-center",
                        c.status === 'Active' ? "bg-[#bbf7d0] text-[#15803d]" : "bg-[#fecaca] text-[#dc2626]"
                      )}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right space-x-3">
                      <button
                        onClick={() => handleEditCourse(c)}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                        title="Edit"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: SECTIONS */}
        {activeTab === 'sections' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#edf3fa] text-[#486581] text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-8 font-bold text-left">SECTION NAME</th>
                  <th className="py-3 px-6 font-bold text-left">COURSE PROGRAM</th>
                  <th className="py-3 px-6 font-bold text-left">YEAR LEVEL</th>
                  <th className="py-3 px-6 font-bold text-center">STATUS</th>
                  <th className="py-3 px-8 font-bold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {sections.map((s, idx) => (
                  <tr key={s.id || idx} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-4 px-8 font-bold text-gray-900">{s.name}</td>
                    <td className="py-4 px-6 font-semibold text-blue-800">{s.course}</td>
                    <td className="py-4 px-6 text-gray-700 text-xs">{s.yearLevel}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "inline-block w-24 py-1 rounded-full text-xs font-semibold text-center",
                        s.status === 'Active' ? "bg-[#bbf7d0] text-[#15803d]" : "bg-[#fecaca] text-[#dc2626]"
                      )}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right space-x-3">
                      <button
                        onClick={() => handleEditSection(s)}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                        title="Edit"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(s.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: FORM REQUIREMENTS */}
        {activeTab === 'form' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#edf3fa] text-[#486581] text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-8 font-bold text-left">REQUIREMENT DOCUMENT</th>
                  <th className="py-3 px-6 font-bold text-left">DESCRIPTION</th>
                  <th className="py-3 px-6 font-bold text-center">MANDATORY</th>
                  <th className="py-3 px-6 font-bold text-center">STATUS</th>
                  <th className="py-3 px-8 font-bold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {formFields.map((f, idx) => (
                  <tr key={f.id || idx} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-4 px-8 font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>{f.title}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-xs">{f.description}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "inline-block px-3 py-1 rounded-full text-xs font-semibold text-center",
                        f.mandatory === 'Required' ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"
                      )}>
                        {f.mandatory}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "inline-block w-24 py-1 rounded-full text-xs font-semibold text-center",
                        f.status === 'Active' ? "bg-[#bbf7d0] text-[#15803d]" : "bg-[#fecaca] text-[#dc2626]"
                      )}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right space-x-3">
                      <button
                        onClick={() => handleEditFormField(f)}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                        title="Edit"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFormField(f.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: FILES */}
        {activeTab === 'files' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#edf3fa] text-[#486581] text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-8 font-bold text-left">DOCUMENT NAME</th>
                  <th className="py-3 px-6 font-bold text-left">CATEGORY</th>
                  <th className="py-3 px-6 font-bold text-center">FILE SIZE</th>
                  <th className="py-3 px-6 font-bold text-center">UPLOADED DATE</th>
                  <th className="py-3 px-8 font-bold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {files.map((file, idx) => (
                  <tr key={file.id || idx} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-4 px-8 font-bold text-gray-900 flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                      <span>{file.name}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-700 text-xs font-semibold">{file.category}</td>
                    <td className="py-4 px-6 text-center text-xs text-gray-500">{file.size}</td>
                    <td className="py-4 px-6 text-center text-xs text-gray-600">{file.uploadDate}</td>
                    <td className="py-4 px-8 text-right space-x-3">
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Scholarship */}
      {showScholarshipModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">{editingScholarship ? 'Edit Scholarship' : 'Add Scholarship'}</h3>
              <button onClick={() => setShowScholarshipModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Scholarship Name</label>
                <input 
                  type="text" 
                  value={scholarshipForm.name} 
                  onChange={e => setScholarshipForm({...scholarshipForm, name: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db] text-sm" 
                  placeholder="e.g. Tertiary Education Subsidy (TES)" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Funding Type</label>
                  <select 
                    value={scholarshipForm.fundingType} 
                    onChange={e => setScholarshipForm({...scholarshipForm, fundingType: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="Government / CHED">Government / CHED</option>
                    <option value="Institutional / Academic">Institutional / Academic</option>
                    <option value="LGU / Local Government">LGU / Local Government</option>
                    <option value="Private / Corporate">Private / Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Status</label>
                  <select 
                    value={scholarshipForm.status} 
                    onChange={e => setScholarshipForm({...scholarshipForm, status: e.target.value as any})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Description / Notes</label>
                <textarea 
                  value={scholarshipForm.description} 
                  onChange={e => setScholarshipForm({...scholarshipForm, description: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db] text-sm" 
                  placeholder="e.g. For enrolled students with passing grades and GWA requirement"
                  rows={2}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowScholarshipModal(false)} className="px-4 py-2 font-bold text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSaveScholarship} className="px-6 py-2 bg-[#072b6b] hover:bg-[#051c47] text-white rounded-full font-bold text-sm">Save Scholarship</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Academic Year */}
      {showAcademicYearModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">{editingAcademicYear ? 'Edit Academic Year' : 'Add Academic Year'}</h3>
              <button onClick={() => setShowAcademicYearModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Academic Year</label>
                <input 
                  type="text" 
                  value={academicYearForm.year} 
                  onChange={e => setAcademicYearForm({...academicYearForm, year: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db] text-sm" 
                  placeholder="e.g. 2026-2027" 
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Overall</label>
                  <select 
                    value={academicYearForm.overallStatus} 
                    onChange={e => setAcademicYearForm({...academicYearForm, overallStatus: e.target.value as any})} 
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">1st Sem</label>
                  <select 
                    value={academicYearForm.firstSemester} 
                    onChange={e => setAcademicYearForm({...academicYearForm, firstSemester: e.target.value as any})} 
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">2nd Sem</label>
                  <select 
                    value={academicYearForm.secondSemester} 
                    onChange={e => setAcademicYearForm({...academicYearForm, secondSemester: e.target.value as any})} 
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowAcademicYearModal(false)} className="px-4 py-2 font-bold text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSaveAcademicYear} className="px-6 py-2 bg-[#072b6b] hover:bg-[#051c47] text-white rounded-full font-bold text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Course */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Course Code</label>
                <input 
                  type="text" 
                  value={courseForm.code} 
                  onChange={e => setCourseForm({...courseForm, code: e.target.value.toUpperCase()})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db] text-sm" 
                  placeholder="e.g. BSCS, BAEL, BSFT, BSOA" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Degree Title</label>
                <input 
                  type="text" 
                  value={courseForm.name} 
                  onChange={e => setCourseForm({...courseForm, name: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db] text-sm" 
                  placeholder="e.g. Bachelor of Science in Computer Science" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">College / Department</label>
                <input 
                  type="text" 
                  value={courseForm.department} 
                  onChange={e => setCourseForm({...courseForm, department: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db] text-sm" 
                  placeholder="e.g. College of Information & Communications Tech" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Status</label>
                <select 
                  value={courseForm.status} 
                  onChange={e => setCourseForm({...courseForm, status: e.target.value as any})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowCourseModal(false)} className="px-4 py-2 font-bold text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSaveCourse} className="px-6 py-2 bg-[#072b6b] hover:bg-[#051c47] text-white rounded-full font-bold text-sm">Save Course</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Section */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">{editingSection ? 'Edit Section' : 'Add Section'}</h3>
              <button onClick={() => setShowSectionModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Section Name</label>
                <input 
                  type="text" 
                  value={sectionForm.name} 
                  onChange={e => setSectionForm({...sectionForm, name: e.target.value.toUpperCase()})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db] text-sm" 
                  placeholder="e.g. BSCS 4A" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Course</label>
                  <select 
                    value={sectionForm.course} 
                    onChange={e => setSectionForm({...sectionForm, course: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="BSCS">BSCS</option>
                    <option value="BAEL">BAEL</option>
                    <option value="BSFT">BSFT</option>
                    <option value="BSOA">BSOA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Year Level</label>
                  <select 
                    value={sectionForm.yearLevel} 
                    onChange={e => setSectionForm({...sectionForm, yearLevel: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Status</label>
                <select 
                  value={sectionForm.status} 
                  onChange={e => setSectionForm({...sectionForm, status: e.target.value as any})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowSectionModal(false)} className="px-4 py-2 font-bold text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSaveSection} className="px-6 py-2 bg-[#072b6b] hover:bg-[#051c47] text-white rounded-full font-bold text-sm">Save Section</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Form Requirement */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">{editingFormField ? 'Edit Requirement' : 'Add Requirement'}</h3>
              <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Document Title</label>
                <input 
                  type="text" 
                  value={formFieldForm.title} 
                  onChange={e => setFormFieldForm({...formFieldForm, title: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db] text-sm" 
                  placeholder="e.g. Certificate of Grades" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Description / Instructions</label>
                <textarea 
                  value={formFieldForm.description} 
                  onChange={e => setFormFieldForm({...formFieldForm, description: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db] text-sm" 
                  placeholder="e.g. Must be signed by the College Dean or Registrar" 
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Mandatory</label>
                  <select 
                    value={formFieldForm.mandatory} 
                    onChange={e => setFormFieldForm({...formFieldForm, mandatory: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="Required">Required</option>
                    <option value="Optional">Optional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Status</label>
                  <select 
                    value={formFieldForm.status} 
                    onChange={e => setFormFieldForm({...formFieldForm, status: e.target.value as any})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowFormModal(false)} className="px-4 py-2 font-bold text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSaveFormField} className="px-6 py-2 bg-[#072b6b] hover:bg-[#051c47] text-white rounded-full font-bold text-sm">Save Requirement</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Files */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Add Downloadable File</h3>
              <button onClick={() => setShowFileModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">File Name</label>
                <input 
                  type="text" 
                  value={fileForm.name} 
                  onChange={e => setFileForm({...fileForm, name: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db] text-sm" 
                  placeholder="e.g. TDP_Scholarship_Form.pdf" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Category</label>
                <select 
                  value={fileForm.category} 
                  onChange={e => setFileForm({...fileForm, category: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                >
                  <option value="Scholarship Application">Scholarship Application</option>
                  <option value="Guidelines & Policies">Guidelines & Policies</option>
                  <option value="Document Template">Document Template</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowFileModal(false)} className="px-4 py-2 font-bold text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSaveFile} className="px-6 py-2 bg-[#072b6b] hover:bg-[#051c47] text-white rounded-full font-bold text-sm">Add File</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export * from './reports';
export * from './notifications';
export * from './communications';
