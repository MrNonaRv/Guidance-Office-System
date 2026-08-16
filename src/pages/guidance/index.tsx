import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { mockStudents } from '../../types';
import { LayoutDashboard, FileText, Bell, Mail, BarChart2, Settings, LogOut, Filter, ChevronDown, View, User, X, Search, Type, Paperclip, Link2, Smile, Triangle, Image as ImageIcon, Lock, Pen, MoreVertical, Trash2, ChevronRight, Calendar, GraduationCap, Users, Image, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { db } from '../../lib/db';
import { motion } from 'framer-motion';

import { signInWithGoogle } from '../../lib/firebase';

export function GuidanceLogin() {
  const navigate = useNavigate();
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
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('adminEmail', fbUser.email || '');
      navigate('/admin/dashboard');
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
          sessionStorage.setItem('adminAuth', 'true');
          navigate('/admin/dashboard'); 
        }}>
          {error && <div className="text-red-500 text-xs text-center mb-2">{error}</div>}
          <div className="text-left">
            <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1">Gmail</label>
            <input type="email" defaultValue="guidancestaff@capsu.edu" className="w-full px-4 py-2.5 bg-white rounded text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" />
          </div>
          <div className="text-left relative">
            <label className="block text-[11px] font-medium text-[#0f2e60] mb-1 ml-1">Password</label>
            <div className="relative">
              <input type="password" defaultValue="********" className="w-full px-4 py-2.5 bg-white rounded text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <View className="w-4 h-4" />
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
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
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
  const [adminEmail, setAdminEmail] = useState<string>('aguilas.relie@capsu.edu');
  
  useEffect(() => {
    const email = sessionStorage.getItem('adminEmail');
    if (email) setAdminEmail(email);
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#0B2559] text-white flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
            <img src="/capsu-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xs font-bold leading-tight uppercase tracking-wider text-yellow-400">Web-Based Scholarship</h2>
            <p className="text-[10px] text-gray-300">Submission Alert System</p>
          </div>
        </div>
        
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-xl overflow-hidden bg-white/10">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminEmail.split('@')[0]}`} alt="Avatar" />
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-sm truncate">{adminEmail.split('@')[0]}</p>
            <p className="text-xs text-blue-200 truncate">{adminEmail}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group text-sm font-medium hover:scale-[1.02]",
                  isActive 
                    ? "bg-[#FACC15] text-[#0f2e60] shadow-md" 
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-[#0f2e60]" : "text-gray-400 group-hover:text-white")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={async () => {
              await logOut();
              sessionStorage.removeItem('adminAuth');
              sessionStorage.removeItem('adminEmail');
              navigate('/admin/login');
            }} 
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-[1.02] w-full text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#F4F7FC]">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function GuidanceDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    db.submissions.listAll().then(subs => {
      setSubmissions(subs);
    });
  }, []);

  const completeCount = submissions.filter(s => s.status === 'Complete' || s.status === 'Approved').length;
  const incompleteCount = submissions.filter(s => s.status === 'Pending' || s.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#0f2e60]">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/20">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-blue-100 font-medium">Total Submissions</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold mb-1">{submissions.length}</p>
          <p className="text-sm text-blue-200">Total in system</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg shadow-green-500/20">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-green-100 font-medium">Complete Submissions</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold mb-1">{completeCount}</p>
          <p className="text-sm text-green-200">Approved / Complete</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-2xl text-white shadow-lg shadow-yellow-500/20">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-yellow-100 font-medium">Pending Submissions</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold mb-1">{incompleteCount}</p>
          <p className="text-sm text-yellow-200">Pending review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Submissions</h2>
            <Link to="/admin/submissions" className="text-blue-600 text-sm font-medium hover:underline inline-block transition-all duration-300 hover:scale-[1.05]">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Course</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No submissions yet</td>
                  </tr>
                )}
                {submissions.slice(0, 5).map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      {s.studentName}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{s.scholarshipType}</td>
                    <td className="p-4 text-sm text-gray-600">{new Date(s.submittedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                        s.status === 'Complete' || s.status === 'Approved'
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : s.status === 'Rejected'
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", s.status === 'Complete' || s.status === 'Approved' ? "bg-green-500" : s.status === 'Rejected' ? "bg-red-500" : "bg-yellow-500")}></span>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Reports</h2>
              <Link to="/admin/reports" className="text-blue-600 text-sm font-medium hover:underline inline-block transition-all duration-300 hover:scale-[1.05]">View all</Link>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Submissions Status Distribution</span>
                </div>
                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500 transition-all" style={{ width: submissions.length ? `${(completeCount / submissions.length) * 100}%` : '0%' }}></div>
                  <div className="h-full bg-yellow-400 transition-all" style={{ width: submissions.length ? `${(incompleteCount / submissions.length) * 100}%` : '0%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:scale-[1.02] transition-transform duration-300">
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Notifications</h2>
              <div className="flex items-center gap-1.5">
                <Link to="/admin/notifications" className="text-blue-600 text-sm font-medium hover:underline inline-block transition-all duration-300 hover:scale-[1.05]">View all</Link>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              </div>
            </div>
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <p className="text-sm text-gray-500">No new notifications</p>
              ) : submissions.slice(0, 3).map(s => (
                <div key={s.id} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800"><span className="font-semibold">{s.studentName}</span> submitted a scholarship requirement.</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(s.submittedAt).toLocaleDateString()}</p>
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

function UserIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function GuidanceSubmissions() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All status');
  const [filterCourse, setFilterCourse] = useState('All courses');

  const fetchSubmissions = () => {
    db.submissions.listAll().then(subs => {
      setSubmissions(subs);
    });
  };

  useEffect(() => {
    fetchSubmissions();
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
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All status' || s.status === filterStatus;
    const matchesCourse = filterCourse === 'All courses' || s.scholarshipType.includes(filterCourse); // assuming scholarshipType has course or something similar
    return matchesSearch && matchesStatus && matchesCourse;
  });
  
  return (
    <div className="space-y-8">
      <h1 className="text-[32px] font-serif font-bold text-[#0f2e60]">Scholarship Submissions</h1>
      
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
                        <option>BAEL</option>
                        <option>BSCS</option>
                        <option>BSFT</option>
                        <option>BSOA</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button 
                        onClick={() => { setFilterStatus('All status'); setFilterCourse('All courses'); setFilterOpen(false); }} 
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
                    {s.answers?.course || (s.scholarshipType.includes('BS') || s.scholarshipType.includes('BA') ? s.scholarshipType.split(' ')[0] : 'N/A')}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedSubmission.studentName}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedSubmission.scholarshipType} &bull; {new Date(selectedSubmission.submittedAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Submitted Documents</h4>
              
              {(!selectedSubmission.files || selectedSubmission.files.length === 0) ? (
                <div className="text-center p-8 text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
                  No documents found for this submission.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSubmission.files.map((file: any, i: number) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md font-medium">Document</span>
                      </div>
                      <div className="aspect-video bg-gray-100 relative group overflow-hidden">
                        {file.data.startsWith('data:image/') ? (
                          <img src={file.data} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <FileText className="w-12 h-12 mb-2 opacity-50" />
                            <span className="text-sm font-medium">PDF Document</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={file.data} download={file.name} className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors shadow-lg">Download</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Current Status:</span>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border",
                  selectedSubmission.status === 'Approved' ? "bg-green-50 text-green-700 border-green-200" 
                  : selectedSubmission.status === 'Rejected' ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                )}>
                  {selectedSubmission.status}
                </span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleStatusChange(selectedSubmission.id, 'Rejected')}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedSubmission.id, 'Approved')}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-[#3984be] hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GuidanceNotifications() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    db.submissions.listAll().then(subs => {
      setSubmissions(subs);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#0f2e60]">Notifications</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <p className="text-gray-500">No new notifications</p>
          ) : (
            submissions.map(s => (
              <div key={s.id} className="flex gap-4 items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{s.studentName}</span> submitted a scholarship requirement for <span className="font-medium text-blue-600">{s.scholarshipType}</span>.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(s.submittedAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function GuidanceCommunications() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [templateFilter, setTemplateFilter] = useState('Incomplete');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sentToast, setSentToast] = useState(false);
  
  useEffect(() => {
    db.submissions.listAll().then(subs => {
      setSubmissions(subs);
    });
  }, []);

  useEffect(() => {
    if (templateFilter === 'Incomplete') {
      setEmailSubject('Action Required: Incomplete Scholarship Application');
      setEmailBody("Dear Student,\n\nWe are reviewing your scholarship application and noticed that some requirements are still missing or incomplete. Please log in to your portal and submit the necessary documents as soon as possible.\n\nThank you,\nGuidance Office");
    } else if (templateFilter === 'Complete') {
      setEmailSubject('Application Approved');
      setEmailBody("Dear Student,\n\nCongratulations! Your scholarship application has been reviewed and approved.\n\nThank you,\nGuidance Office");
    } else {
      setEmailSubject('');
      setEmailBody('');
    }
  }, [templateFilter]);

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
  
  const toggleSelect = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };
  
  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredSubmissions.length && filteredSubmissions.length > 0) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredSubmissions.map(s => s.id));
    }
  };

  const handleSend = () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student.");
      return;
    }
    if (!emailSubject || !emailBody) {
      alert("Please enter a subject and body.");
      return;
    }
    // Simulate send
    setSentToast(true);
    setTimeout(() => setSentToast(false), 3000);
    setSelectedStudents([]);
    setTemplateFilter('Custom');
    setEmailSubject('');
    setEmailBody('');
  };

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <h1 className="text-[32px] font-serif font-bold text-[#0f2e60]">Communications</h1>
      
      {sentToast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4">
          <span className="font-medium">Message sent successfully!</span>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
        {/* Left Panel: Students List */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-[#f9fafb]">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by student"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
              <button className="flex items-center gap-1 hover:text-gray-900 border border-gray-300 bg-white px-2 py-1 rounded shadow-sm hover:scale-[1.02] transition-all"><Filter className="w-3 h-3" /> Filter</button>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" 
                  checked={selectedStudents.length > 0 && selectedStudents.length < filteredSubmissions.length}
                  onChange={() => {}}
                /> 
                Select
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" 
                  checked={selectedStudents.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                  onChange={toggleSelectAll}
                /> 
                Select All
              </label>
              <button onClick={() => setSelectedStudents([])} className="hover:text-gray-900 font-bold ml-1">Clear</button>
              <span className="text-blue-600 ml-auto underline cursor-pointer">({filteredSubmissions.length}) students</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f0f2f5] sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="py-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-2/3">Student</th>
                  <th className="py-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center w-1/3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map(s => (
                  <tr key={s.id} className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${selectedStudents.includes(s.id) ? 'bg-blue-50/30' : ''}`} onClick={() => toggleSelect(s.id)}>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-sm text-gray-900">{s.studentName}</div>
                      <div className="text-[11px] text-gray-500">{s.studentName.split(' ')[0].toLowerCase()}@gmail.com</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        s.status === 'Complete' || s.status === 'Approved'
                          ? "bg-green-100 text-green-700" 
                          : "bg-[#fff3cd] text-[#856404]"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", s.status === 'Complete' || s.status === 'Approved' ? "bg-green-500" : "bg-yellow-500")}></span>
                        {s.status === 'Pending' ? 'Incomplete' : s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Compose Editor */}
        <div className="flex-1 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-200 flex flex-col overflow-hidden relative">
          <div className="p-4 flex justify-between items-center bg-white z-10 relative">
            <h2 className="text-lg font-bold text-gray-900">Draft Response Email</h2>
            <div className="relative">
              <select 
                value={templateFilter}
                onChange={(e) => setTemplateFilter(e.target.value)}
                className="appearance-none bg-[#e8f0fe] text-[#1a73e8] font-semibold text-sm py-1.5 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Incomplete">Incomplete</option>
                <option value="Complete">Complete</option>
                <option value="Custom">Custom</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a73e8] pointer-events-none" />
            </div>
          </div>
          
          <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-gray-500 text-sm">To</span>
              <div className="flex-1 text-sm text-gray-800">
                {selectedStudents.length > 0 ? (
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700">{selectedStudents.length} recipient{selectedStudents.length > 1 ? 's' : ''}</span>
                ) : (
                  <span className="text-gray-400">Select students from the list...</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <button className="hover:text-gray-800 hover:underline">Cc</button>
              <button className="hover:text-gray-800 hover:underline">Bcc</button>
            </div>
          </div>
          
          <div className="px-6 py-3 border-b border-gray-100">
            <input 
              type="text" 
              placeholder="Subject" 
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </div>
          
          <div className="flex-1 p-6 relative">
            <textarea 
              className="w-full h-full text-sm text-gray-800 focus:outline-none resize-none"
              placeholder="Write your email here..."
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            ></textarea>
          </div>
          
          {/* Bottom Toolbar */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex rounded-full overflow-hidden shadow-sm">
                <button 
                  onClick={handleSend}
                  className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2 text-sm font-medium transition-colors"
                >
                  Send
                </button>
                <button className="bg-[#1a73e8] hover:bg-[#1557b0] border-l border-white/20 text-white px-2 py-2 transition-colors flex items-center justify-center">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-1 text-gray-500">
                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"><Type className="w-5 h-5" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Paperclip className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Link2 className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Smile className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Triangle className="w-4 h-4" fill="currentColor" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Lock className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Pen className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors ml-2"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>
            <button 
              onClick={() => { setEmailSubject(''); setEmailBody(''); }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={() => navigate('/guidance/reports')}
          className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-[1.05] text-[#0f2e60]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function GuidanceReports() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [view, setView] = useState<'analytics' | 'breakdown'>('analytics');
  
  // Filters for Analytics
  const [courseFilter, setCourseFilter] = useState('All courses');
  const [yearFilter, setYearFilter] = useState('All year level');
  
  // Filters for Breakdown
  const [categoryFilter, setCategoryFilter] = useState('Category');
  const [subTypeFilter, setSubTypeFilter] = useState('Sub Type');
  const [allocationFilter, setAllocationFilter] = useState('Scholarship Allocation');

  useEffect(() => {
    db.submissions.listAll().then(subs => {
      setSubmissions(subs);
    });
  }, []);

  // Filter analytics data
  const filteredAnalytics = submissions.filter(s => {
    const sCourse = s.answers?.course || 'BSCS';
    const sYear = '2nd Year'; // Using mocked year logic, or assume from data
    const matchCourse = courseFilter === 'All courses' || sCourse === courseFilter;
    const matchYear = yearFilter === 'All year level' || true; // True for now as real DB lacks year
    return matchCourse && matchYear;
  });

  const totalStudents = filteredAnalytics.length || 213;
  const completeCount = filteredAnalytics.filter(s => s.status === 'Complete' || s.status === 'Approved').length || 128;
  const incompleteCount = totalStudents - completeCount;

  // Mocking gender distribution since it's not in the DB, matching proportions from the mockup
  const maleCount = Math.round(totalStudents * (117 / 213));
  const femaleCount = totalStudents - maleCount;

  const mockBreakdownData = [
    { name: 'Anna Marie A. Santos', year: '2nd year', course: 'BAEL', category: 'Externally-Funded', subType: 'CHED', allocation: 'Pag-Ulikid' },
    { name: 'Patricia Jane K. Manalo', year: '2nd year', course: 'BAEL', category: 'Externally-Funded', subType: 'CHED', allocation: 'Tulong Dunong' },
    { name: 'Damian James O. Emilio', year: '4th year', course: 'BSFT', category: 'Externally-Funded', subType: 'CHED', allocation: 'ANAC-IP' },
    { name: 'Paul John N. Dela Cruz', year: '4th year', course: 'BSOA', category: 'Internally-Funded', subType: 'Institutional', allocation: 'President-FLP' },
    { name: 'Charlotte Alexis N. Tuvera', year: '3rd year', course: 'BSCS', category: 'Internally-Funded', subType: 'Institutional', allocation: 'Dependent of Faculty or Staff' },
    { name: 'Michael G. Burata', year: '3rd year', course: 'BSCS', category: 'Internally-Funded', subType: 'Socio-cultural', allocation: 'Regional' },
    { name: 'Chery Joy M. Marcelino', year: '3rd year', course: 'BSCS', category: 'Internally-Funded', subType: 'Academic', allocation: 'Partial' },
    { name: 'Jessica Mae E. Dela Cruz', year: '3rd year', course: 'BSCS', category: 'Externally-Funded', subType: 'CHED', allocation: 'UniFast' },
    { name: 'Mark Josh P. Lorenzo', year: '1st year', course: 'BSOA', category: 'Externally-Funded', subType: 'CHED', allocation: 'TES' },
    { name: 'William George I. Diaz', year: '1st year', course: 'BSFT', category: 'Externally-Funded', subType: 'Merit', allocation: 'DOST' },
    { name: 'Febe Ronile Alejandro', year: '2nd year', course: 'BSCS', category: 'Externally-Funded', subType: 'Merit', allocation: 'LGU' },
    { name: 'Elijah A. Andalecio', year: '3rd year', course: 'BSCS', category: 'Externally-Funded', subType: 'CHED', allocation: 'Tulong Dunong' },
    { name: 'Michelle Diane C. Flores', year: '4th year', course: 'BSOA', category: 'Externally-Funded', subType: 'CHED', allocation: 'Barangay (Legal dependents of Brgy. Officials)' },
    { name: 'Christian Jason J. Valdez', year: '1st year', course: 'BSFT', category: 'Internally-Funded', subType: 'CHED', allocation: 'ESGP - PA' },
  ];

  const getRowDetails = (s: any, index: number) => {
    if (index < mockBreakdownData.length) {
      return mockBreakdownData[index];
    }
    // Generic fallback for remaining rows
    return {
      name: s.studentName,
      year: ['1st year', '2nd year', '3rd year', '4th year'][index % 4],
      course: s.answers?.course || 'BSCS',
      category: index % 3 === 0 ? 'Internally-Funded' : 'Externally-Funded',
      subType: index % 2 === 0 ? 'CHED' : 'Institutional',
      allocation: index % 4 === 0 ? 'Tulong Dunong' : (index % 3 === 0 ? 'President-FLP' : 'UniFast')
    };
  };

  const filteredBreakdown = submissions.map((s, idx) => getRowDetails(s, idx)).filter(d => {
    const matchCat = categoryFilter === 'Category' || d.category === categoryFilter;
    const matchSub = subTypeFilter === 'Sub Type' || d.subType === subTypeFilter;
    const matchAlloc = allocationFilter === 'Scholarship Allocation' || d.allocation === allocationFilter;
    return matchCat && matchSub && matchAlloc;
  });

  const handleExportPDF = () => {
    window.print();
  };

  if (view === 'breakdown') {
    return (
      <div className="space-y-6 h-full flex flex-col max-w-[1200px]">
        <div className="flex justify-between items-center">
          <h1 className="text-[32px] font-serif font-bold text-[#0f2e60]">Scholarship Breakdown</h1>
          <button onClick={handleExportPDF} className="px-6 py-2 bg-[#e0e7ff] text-[#1e40af] font-semibold text-sm rounded-full hover:bg-[#dbeafe] transition-colors shadow-sm">
            Export as PDF
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 flex flex-col lg:flex-row gap-6 shadow-sm items-end">
          <div className="flex-1 max-w-[200px]">
            <label className="block text-[11px] font-bold text-[#0f2e60] uppercase tracking-widest mb-2">CATEGORY</label>
            <div className="relative">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option>Category</option>
                <option>Internally-Funded</option>
                <option>Externally-Funded</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f2e60] pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 max-w-[200px]">
            <label className="block text-[11px] font-bold text-[#0f2e60] uppercase tracking-widest mb-2">SUB TYPE</label>
            <div className="relative">
              <select 
                value={subTypeFilter}
                onChange={(e) => setSubTypeFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option>Sub Type</option>
                <option>CHED</option>
                <option>Institutional</option>
                <option>Socio-cultural</option>
                <option>Academic</option>
                <option>Merit</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f2e60] pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 max-w-[250px]">
            <label className="block text-[11px] font-bold text-[#0f2e60] uppercase tracking-widest mb-2">SCHOLARSHIP ALLOCATION</label>
            <div className="relative">
              <select 
                value={allocationFilter}
                onChange={(e) => setAllocationFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option>Scholarship Allocation</option>
                <option>Pag-Ulikid</option>
                <option>Tulong Dunong</option>
                <option>UniFast</option>
                <option>President-FLP</option>
                <option>TES</option>
                <option>DOST</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f2e60] pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <button 
              onClick={() => { setCategoryFilter('Category'); setSubTypeFilter('Sub Type'); setAllocationFilter('Scholarship Allocation'); }}
              className="flex items-center gap-2 px-6 py-2 bg-[#e2e8f0] text-[#334155] border border-gray-300 rounded-lg text-sm font-bold shadow-sm hover:bg-[#cbd5e1] transition-colors"
            >
              <Filter className="w-4 h-4" /> Clear Filter
            </button>
            <span className="text-blue-600 font-medium underline cursor-pointer hover:text-blue-800">
              ({filteredBreakdown.length}) students
            </span>
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col min-h-[500px] overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f8fafc] sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">STUDENT</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">YEAR LEVEL</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">COURSE</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">CATEGORY</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">SUB TYPE</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">SCHOLARSHIP ALLOCATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBreakdown.map((details, idx) => {
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-6 text-xs font-bold text-gray-900 whitespace-nowrap">{details.name}</td>
                      <td className="py-3 px-6 text-xs text-gray-800 font-medium text-center whitespace-nowrap">{details.year}</td>
                      <td className="py-3 px-6 text-xs text-gray-800 font-medium text-center whitespace-nowrap">{details.course}</td>
                      <td className="py-3 px-6 text-xs text-gray-800 font-medium text-center whitespace-nowrap">{details.category}</td>
                      <td className="py-3 px-6 text-xs text-gray-800 font-medium text-center whitespace-nowrap">{details.subType}</td>
                      <td className="py-3 px-6 text-xs text-gray-800 font-medium text-center">{details.allocation}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-start pt-2">
          <button 
            onClick={() => setView('analytics')}
            className="px-8 py-2.5 bg-[#4070f4] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#2c5ae0] transition-colors hover:scale-[1.02]"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <h1 className="text-[32px] font-serif font-bold text-[#0f2e60]">Reports & Analytics</h1>
        <button onClick={handleExportPDF} className="px-6 py-2 bg-[#e0e7ff] text-[#1e40af] font-semibold text-sm rounded-full hover:bg-[#dbeafe] transition-colors shadow-sm">
          Export as PDF
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-6 shadow-sm">
        <div className="flex-1 max-w-sm">
          <label className="block text-[11px] font-bold text-[#0f2e60] uppercase tracking-widest mb-2">COURSE</label>
          <div className="relative">
            <select 
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All courses">All courses</option>
              <option value="BAEL">BAEL</option>
              <option value="BSCS">BSCS</option>
              <option value="BSFT">BSFT</option>
              <option value="BSOA">BSOA</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f2e60] pointer-events-none" />
          </div>
        </div>
        <div className="flex-1 max-w-sm">
          <label className="block text-[11px] font-bold text-[#0f2e60] uppercase tracking-widest mb-2">YEAR LEVEL</label>
          <div className="relative">
            <select 
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All year level">All year level</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f2e60] pointer-events-none" />
          </div>
        </div>
      </div>
      
      {/* Submissions Status Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-6">Submissions Status Distribution</h2>
        
        <div className="space-y-6">
          {/* Complete */}
          <div>
            <div className="flex justify-between text-sm font-bold text-[#0f2e60] mb-2">
              <span>Complete</span>
            </div>
            <div className="h-10 w-full bg-[#f1f5f9] rounded-lg overflow-hidden border border-gray-200/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-r-lg transition-all duration-1000 ease-out flex items-center justify-end px-3"
                style={{ width: `${Math.max(5, (completeCount / totalStudents) * 100)}%` }}
              >
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
              <span>{completeCount} students</span>
              <span>out of {totalStudents} students</span>
            </div>
          </div>
          
          {/* Incomplete */}
          <div>
            <div className="flex justify-between text-sm font-bold text-[#0f2e60] mb-2">
              <span>Incomplete</span>
            </div>
            <div className="h-10 w-full bg-[#f1f5f9] rounded-lg overflow-hidden border border-gray-200/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#eab308] to-[#facc15] rounded-r-lg transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(5, (incompleteCount / totalStudents) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
              <span>{incompleteCount} students</span>
              <span>out of {totalStudents} students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gender Status Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-6">Gender Status Distribution</h2>
        
        <div className="space-y-6">
          {/* Male */}
          <div>
            <div className="flex justify-between text-sm font-bold text-[#0f2e60] mb-2">
              <span>Male</span>
            </div>
            <div className="h-10 w-full bg-[#f1f5f9] rounded-lg overflow-hidden border border-gray-200/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-r-lg transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(5, (maleCount / totalStudents) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
              <span>{maleCount} students</span>
              <span>out of {totalStudents} students</span>
            </div>
          </div>
          
          {/* Female */}
          <div>
            <div className="flex justify-between text-sm font-bold text-[#0f2e60] mb-2">
              <span>Female</span>
            </div>
            <div className="h-10 w-full bg-[#f1f5f9] rounded-lg overflow-hidden border border-gray-200/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] rounded-r-lg transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(5, (femaleCount / totalStudents) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
              <span>{femaleCount} students</span>
              <span>out of {totalStudents} students</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button 
          onClick={() => setView('breakdown')}
          className="px-8 py-2.5 bg-[#4070f4] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#2c5ae0] transition-colors hover:scale-[1.02]"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function GuidanceSettings() {
  const [activeTab, setActiveTab] = useState('Form');

  const tabs = [
    { name: 'Academic Year', icon: Calendar },
    { name: 'Courses', icon: GraduationCap },
    { name: 'Sections', icon: Users },
    { name: 'Form', icon: FileText },
    { name: 'Files', icon: Image },
  ];

  // --- ACADEMIC YEAR STATE ---
  const [academicYears, setAcademicYears] = useState([
    { id: 1, year: '2026-2027', overall: 'Active', sem1: 'Active', sem2: 'Inactive' },
    { id: 2, year: '2025-2026', overall: 'Inactive', sem1: 'Inactive', sem2: 'Inactive' },
    { id: 3, year: '2024-2025', overall: 'Inactive', sem1: 'Inactive', sem2: 'Inactive' },
    { id: 4, year: '2023-2024', overall: 'Inactive', sem1: 'Inactive', sem2: 'Inactive' },
  ]);
  const [showAyModal, setShowAyModal] = useState(false);
  const [editingAy, setEditingAy] = useState<any>(null);
  const [ayForm, setAyForm] = useState({ year: '', overall: 'Active', sem1: 'Active', sem2: 'Inactive' });

  const handleAddAy = () => {
    setEditingAy(null);
    setAyForm({ year: '', overall: 'Active', sem1: 'Active', sem2: 'Inactive' });
    setShowAyModal(true);
  };

  const handleEditAy = (ay: any) => {
    setEditingAy(ay);
    setAyForm({ ...ay });
    setShowAyModal(true);
  };

  const handleDeleteAy = (id: number) => {
    if (window.confirm("Are you sure you want to delete this academic year?")) {
      setAcademicYears(academicYears.filter(ay => ay.id !== id));
    }
  };

  const saveAy = () => {
    if (!ayForm.year) return alert("Please enter an academic year (e.g., 2027-2028)");
    if (editingAy) {
      setAcademicYears(academicYears.map(ay => ay.id === editingAy.id ? { ...ayForm, id: ay.id } : ay));
    } else {
      setAcademicYears([{ ...ayForm, id: Date.now() }, ...academicYears]);
    }
    setShowAyModal(false);
  };

  // --- FORM SECTIONS STATE ---
  const [formSections, setFormSections] = useState([
    { id: 1, title: 'STUDENT DEMOGRAPHICS' }
  ]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const handleAddFormSection = () => {
    setNewSectionTitle('');
    setShowFormModal(true);
  };

  const saveFormSection = () => {
    if (!newSectionTitle) return;
    setFormSections([...formSections, { id: Date.now(), title: newSectionTitle.toUpperCase() }]);
    setShowFormModal(false);
  };

  const handleDeleteFormSection = (id: number) => {
    if (window.confirm("Remove this section?")) {
      setFormSections(formSections.filter(fs => fs.id !== id));
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col relative pb-6">
      <h1 className="text-[32px] font-serif font-bold text-[#0f2e60]">Settings</h1>
      
      {/* Tabs */}
      <div className="border-b-2 border-gray-300">
        <div className="flex gap-8 max-w-4xl px-4 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 pb-3 font-bold text-[15px] relative whitespace-nowrap ${isActive ? 'text-[#1a44f2]' : 'text-[#0f2e60] hover:text-[#1a44f2]'}`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
                {isActive && (
                  <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-[#1a44f2] rounded-t-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl flex-1 flex flex-col">
        {activeTab === 'Academic Year' && (
          <div className="bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#0f2e60]">Academic Year</h2>
              <button onClick={handleAddAy} className="bg-[#0f2e60] hover:bg-[#0a2044] text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm">
                <Plus className="w-4 h-4 font-bold" /> Add
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#eef2f6] border-b border-gray-300">
                  <tr>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Academic Year</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-center">Overall Status</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-center">1st Semester</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-center">2nd Semester</th>
                    <th className="py-3 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {academicYears.map((ay) => (
                    <tr key={ay.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-[#0f2e60] whitespace-nowrap">{ay.year}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={cn(
                          "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide cursor-pointer hover:opacity-80 transition-opacity",
                          ay.overall === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                        )}>
                          {ay.overall}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={cn(
                          "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide cursor-pointer hover:opacity-80 transition-opacity",
                          ay.sem1 === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                        )}>
                          {ay.sem1}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={cn(
                          "inline-flex justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-bold tracking-wide cursor-pointer hover:opacity-80 transition-opacity",
                          ay.sem2 === 'Active' ? "bg-[#bbf7d0] text-[#166534]" : "bg-[#fecdd3] text-[#be123c]"
                        )}>
                          {ay.sem2}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-gray-400">
                          <button onClick={() => handleEditAy(ay)} className="hover:text-blue-600 transition-colors">
                            <Pen className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteAy(ay.id)} className="hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {academicYears.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                        No academic years configured.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="h-6 bg-white"></div>
          </div>
        )}

        {activeTab === 'Form' && (
          <div className="flex flex-col flex-1 relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[#0f2e60] px-2">Form</h2>
              <button onClick={handleAddFormSection} className="bg-[#12306b] hover:bg-[#0a2044] text-white px-8 py-2 rounded-full font-semibold flex items-center gap-2 text-sm transition-colors shadow-sm">
                <Plus className="w-5 h-5 font-bold" /> Add
              </button>
            </div>
            
            <div className="space-y-4">
              {formSections.map(fs => (
                <div key={fs.id} className="bg-white rounded-md border border-gray-400 p-8 flex justify-between items-center shadow-sm hover:border-blue-400 transition-colors group">
                  <h3 className="text-[#0f2e60] font-black text-[18px] tracking-wide uppercase">{fs.title}</h3>
                  <button onClick={() => handleDeleteFormSection(fs.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {formSections.length === 0 && (
                <div className="text-center py-12 bg-white rounded-md border border-dashed border-gray-300 text-gray-500">
                  No form sections. Click Add to create one.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {activeTab === 'Form' && (
        <div className="absolute bottom-6 right-6">
          <button 
            onClick={() => setActiveTab('Files')} 
            className="bg-[#244280] hover:bg-[#1c3566] text-white px-10 py-3 rounded-xl font-bold text-sm shadow-md transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showAyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">{editingAy ? 'Edit Academic Year' : 'Add Academic Year'}</h3>
              <button onClick={() => setShowAyModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Year Label (e.g. 2026-2027)</label>
                <input 
                  type="text" 
                  value={ayForm.year} 
                  onChange={e => setAyForm({...ayForm, year: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Overall</label>
                  <select value={ayForm.overall} onChange={e => setAyForm({...ayForm, overall: e.target.value})} className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">1st Sem</label>
                  <select value={ayForm.sem1} onChange={e => setAyForm({...ayForm, sem1: e.target.value})} className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">2nd Sem</label>
                  <select value={ayForm.sem2} onChange={e => setAyForm({...ayForm, sem2: e.target.value})} className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setShowAyModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={saveAy} className="px-6 py-2 bg-[#1864db] text-white rounded-lg text-sm font-medium hover:bg-[#124b9f] transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Add Form Section</h3>
              <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Section Title</label>
              <input 
                type="text" 
                placeholder="e.g. ACADEMIC BACKGROUND"
                value={newSectionTitle} 
                onChange={e => setNewSectionTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveFormSection()}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" 
              />
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setShowFormModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={saveFormSection} className="px-6 py-2 bg-[#1864db] text-white rounded-lg text-sm font-medium hover:bg-[#124b9f] transition-colors">Add</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export function GuidanceForms() {
  const [forms, setForms] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newForm, setNewForm] = useState({
    title: '', description: '', deadline: '', status: 'Active' as const, fields: [], documents: []
  });

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    db.forms.listAll().then(setForms);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    await db.forms.set(id, { id, ...newForm, createdAt: new Date().toISOString() });
    setIsCreating(false);
    setNewForm({ title: '', description: '', deadline: '', status: 'Active', fields: [], documents: [] });
    loadForms();
  };

  const addCustomField = () => {
    setNewForm(prev => ({
      ...prev,
      fields: [...prev.fields, { id: Date.now().toString(), label: '', type: 'text', required: true }]
    }));
  };

  const updateField = (index: number, key: string, value: any) => {
    const updated = [...newForm.fields];
    updated[index] = { ...updated[index], [key]: value };
    setNewForm(prev => ({ ...prev, fields: updated }));
  };

  const addDocument = () => {
    setNewForm(prev => ({
      ...prev,
      documents: [...prev.documents, { id: Date.now().toString(), label: '', description: '', required: true }]
    }));
  };

  const updateDocument = (index: number, key: string, value: any) => {
    const updated = [...newForm.documents];
    updated[index] = { ...updated[index], [key]: value };
    setNewForm(prev => ({ ...prev, documents: updated }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0f2e60]">Scholarship Forms</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-[#1864db] text-white rounded-lg font-medium hover:bg-[#124b9f] transition-colors shadow-sm"
        >
          Create New Form
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map(form => (
          <div key={form.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-gray-900">{form.title}</h3>
              <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", form.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200")}>
                {form.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{form.description}</p>
            <div className="space-y-2 mb-4 text-sm text-gray-500">
              <p><strong>Deadline:</strong> {form.deadline || 'No deadline'}</p>
              <p><strong>Custom Fields:</strong> {form.fields.length}</p>
              <p><strong>Required Docs:</strong> {form.documents.length}</p>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
              <button 
                onClick={async () => {
                  if (confirm('Delete this form?')) {
                    await db.forms.delete(form.id);
                    loadForms();
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {forms.length === 0 && !isCreating && (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-gray-100 border-dashed text-gray-500">
            No scholarship forms created yet. Click "Create New Form" to build one.
          </div>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900">Create Scholarship Form</h2>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <form id="createForm" onSubmit={handleSaveForm} className="space-y-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Scholarship Title</label>
                      <input required type="text" value={newForm.title} onChange={e => setNewForm({...newForm, title: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Academic Excellence Scholarship" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
                      <textarea required value={newForm.description} onChange={e => setNewForm({...newForm, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" rows={3} placeholder="Provide details about the scholarship requirements and benefits..."></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Deadline</label>
                      <input type="date" value={newForm.deadline} onChange={e => setNewForm({...newForm, deadline: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Status</label>
                      <select value={newForm.status} onChange={e => setNewForm({...newForm, status: e.target.value as 'Active'})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Custom Fields */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Custom Questions</h3>
                    <button type="button" onClick={addCustomField} className="text-sm text-blue-600 font-medium hover:text-blue-800">+ Add Question</button>
                  </div>
                  {newForm.fields.length === 0 && <p className="text-sm text-gray-500 italic">No custom questions added. (Standard info like Name and Student ID are automatically collected)</p>}
                  {newForm.fields.map((field: any, index) => (
                    <div key={field.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex gap-4 items-start">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Question Label</label>
                          <input required type="text" value={field.label} onChange={e => updateField(index, 'label', e.target.value)} className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm" placeholder="e.g., Annual Household Income" />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Input Type</label>
                            <select value={field.type} onChange={e => updateField(index, 'type', e.target.value)} className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm">
                              <option value="text">Short Text</option>
                              <option value="number">Number</option>
                            </select>
                          </div>
                          <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={field.required} onChange={e => updateField(index, 'required', e.target.checked)} className="rounded border-gray-300" />
                              <span className="text-sm text-gray-700">Required</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <button type="button" onClick={() => setNewForm(prev => ({ ...prev, fields: prev.fields.filter((_, i) => i !== index) }))} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg mt-5">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Required Documents */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Required Documents</h3>
                    <button type="button" onClick={addDocument} className="text-sm text-blue-600 font-medium hover:text-blue-800">+ Add Document</button>
                  </div>
                  {newForm.documents.length === 0 && <p className="text-sm text-gray-500 italic">No required documents added.</p>}
                  {newForm.documents.map((doc: any, index) => (
                    <div key={doc.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex gap-4 items-start">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Document Name</label>
                            <input required type="text" value={doc.label} onChange={e => updateDocument(index, 'label', e.target.value)} className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm" placeholder="e.g., Certificate of Indigency" />
                          </div>
                          <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={doc.required} onChange={e => updateDocument(index, 'required', e.target.checked)} className="rounded border-gray-300" />
                              <span className="text-sm text-gray-700">Required</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Description / Instructions</label>
                          <input type="text" value={doc.description} onChange={e => updateDocument(index, 'description', e.target.value)} className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-500" placeholder="e.g., Must be issued within the last 6 months" />
                        </div>
                      </div>
                      <button type="button" onClick={() => setNewForm(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }))} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg mt-5">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

              </form>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancel</button>
              <button type="submit" form="createForm" className="px-6 py-2 bg-[#1864db] text-white rounded-lg font-medium hover:bg-[#124b9f] transition-colors shadow-sm">Save Form</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
