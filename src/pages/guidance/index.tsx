import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { mockStudents } from '../../types';
import { Award, Upload, LayoutDashboard, FileText, Bell, Mail, BarChart2, Settings, LogOut, Filter, ChevronDown, View, User, X, Search, Type, Paperclip, Link2, Smile, Triangle, Image as ImageIcon, Lock, Pen, MoreVertical, Trash2, ChevronRight, Calendar, GraduationCap, Users, Image, Plus, GripVertical, Printer } from 'lucide-react';
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:p-0 print:bg-white print:block print:relative print:z-0">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl print:max-h-none print:shadow-none print:rounded-none">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 print:hidden">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedSubmission.data?.firstName} {selectedSubmission.data?.familyName}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedSubmission.data?.scholarshipCategory || 'Scholarship Application'} &bull; {new Date(selectedSubmission.submittedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors" title="Print Application">
                  <Printer className="w-5 h-5" />
                </button>
                <button onClick={() => setSelectedSubmission(null)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Print Header (Only visible when printing) */}
            <div className="hidden print:block mb-8 text-center border-b pb-4">
              <h1 className="text-2xl font-bold">OFFICIAL SCHOLARSHIP APPLICATION</h1>
              <p className="text-sm mt-1 text-gray-600">Generated by Web-Based Scholars System</p>
              <div className="mt-4 flex justify-between text-sm text-left">
                <p><strong>Applicant:</strong> {selectedSubmission.data?.familyName}, {selectedSubmission.data?.firstName} {selectedSubmission.data?.middleName}</p>
                <p><strong>Date Submitted:</strong> {new Date(selectedSubmission.submittedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between text-sm text-left">
                <p><strong>Scholarship Type:</strong> {selectedSubmission.data?.fundingType} ({selectedSubmission.data?.scholarshipCategory})</p>
                <p><strong>Status:</strong> {selectedSubmission.status}</p>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto bg-gray-50 print:bg-white print:overflow-visible">
              
              
              {/* Form Data Rendering (Screen Only) */}
              <div className="print:hidden">
              {selectedSubmission.data && (
                <div className="space-y-6 mb-8">
                  {/* Demographics */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <h4 className="text-sm font-bold text-[#0f2e60] uppercase tracking-wider mb-4">A. Personal Demographics</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                      <div><span className="text-gray-500">Course:</span> <strong className="block">{selectedSubmission.data.course}</strong></div>
                      <div><span className="text-gray-500">Year & Section:</span> <strong className="block">{selectedSubmission.data.yearLevel} - {selectedSubmission.data.section}</strong></div>
                      <div><span className="text-gray-500">Sex:</span> <strong className="block">{selectedSubmission.data.sex}</strong></div>
                      <div><span className="text-gray-500">Civil Status:</span> <strong className="block">{selectedSubmission.data.civilStatus}</strong></div>
                      <div className="col-span-2"><span className="text-gray-500">Permanent Address:</span> <strong className="block">{selectedSubmission.data.permanentAddress || 'N/A'}</strong></div>
                    </div>
                  </div>

                  {/* Family Background */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <h4 className="text-sm font-bold text-[#0f2e60] uppercase tracking-wider mb-4">B. Family Background</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                      <div><span className="text-gray-500">Father's Name:</span> <strong className="block">{selectedSubmission.data.fatherName || 'N/A'}</strong></div>
                      <div><span className="text-gray-500">Mother's Name:</span> <strong className="block">{selectedSubmission.data.motherName || 'N/A'}</strong></div>
                      <div><span className="text-gray-500">Highest Educ. Attainment:</span> <strong className="block">{selectedSubmission.data.parentsEducationalAttainment || 'N/A'}</strong></div>
                      <div><span className="text-gray-500">Monthly Income:</span> <strong className="block">{selectedSubmission.data.monthlyIncome || 'N/A'}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Attachments Section */}
              <h4 className="text-sm font-bold text-[#0f2e60] uppercase tracking-wider mb-4">Submitted Documents</h4>
              
              {(!selectedSubmission.files || Object.keys(selectedSubmission.files).length === 0) ? (
                <div className="text-center p-8 text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
                  No documents found for this submission.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedSubmission.files).map(([key, file]: [string, any]) => (
                    <div key={key} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-700 truncate">{file.name}</span>
                      </div>
                      <div className="aspect-video bg-gray-100 relative group overflow-hidden">
                        {file.data.startsWith('data:image/') ? (
                          <img src={file.data} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
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

              {/* ----------------- EXACT PRINT LAYOUT ----------------- */}
              <div className="hidden print:block text-black bg-white font-sans">
                
                {/* PAGE 1: SCHOLARSHIP RECORD FORM */}
                <div className="print-page w-[793px] h-[1122px] mx-auto pt-8 break-after-page">
                  {/* Header Box */}
                  <div className="border border-black w-full mb-6">
                    <div className="flex border-b border-black">
                      <div className="w-1/5 p-2 border-r border-black flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mb-1"></div> {/* Logo placeholder */}
                      </div>
                      <div className="w-3/5 p-2 border-r border-black flex flex-col items-center justify-center text-center">
                        <span className="text-[10px]">Document Type:</span>
                        <strong className="text-xl tracking-widest mt-1 font-serif">FORM</strong>
                        <span className="text-[8px] mt-1 font-serif">ISO 9001:2015</span>
                      </div>
                      <div className="w-1/5 font-serif">
                        <div className="border-b border-black p-1 text-[10px] flex justify-between"><span>Document Code</span><strong>GCO-F05</strong></div>
                        <div className="border-b border-black p-1 text-[10px] flex justify-between"><span>Revision No.</span><strong>00</strong></div>
                        <div className="border-b border-black p-1 text-[10px] flex justify-between"><span>Effective Date</span><strong>June 25, 2018</strong></div>
                        <div className="p-1 text-[10px] flex justify-between"><span>Page</span><strong>1 of 1</strong></div>
                      </div>
                    </div>
                    <div className="flex font-serif">
                      <div className="w-1/4 p-2 border-r border-black text-xs flex items-center">Document Title:</div>
                      <div className="w-3/4 p-2 text-center font-bold text-lg tracking-wider flex items-center justify-center">SCHOLARSHIP RECORD FORM</div>
                    </div>
                  </div>

                  {/* Top Profile block */}
                  <div className="flex gap-4 mb-6 text-sm font-serif">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-end gap-2">
                        <span className="w-12">Name:</span>
                        <span className="flex-1 border-b border-black text-center">{selectedSubmission.data.familyName}</span>
                        <span className="flex-1 border-b border-black text-center">{selectedSubmission.data.firstName}</span>
                        <span className="flex-1 border-b border-black text-center">{selectedSubmission.data.middleName}</span>
                        <span className="ml-2">Age:</span><span className="w-10 border-b border-black text-center">{selectedSubmission.data.age}</span>
                        <span className="ml-2">Sex: ( {selectedSubmission.data.sex === 'Male' ? 'x' : ' '} ) Male ( {selectedSubmission.data.sex === 'Female' ? 'x' : ' '} ) Female</span>
                      </div>
                      <div className="flex text-xs text-center text-gray-600 mb-2 mt-0">
                        <span className="w-12"></span>
                        <span className="flex-1">Family Name</span>
                        <span className="flex-1">First Name</span>
                        <span className="flex-1">Middle Name</span>
                        <span className="w-10"></span><span className="w-48"></span>
                      </div>
                      
                      <div className="flex items-end gap-2">
                        <span className="w-24">Course & Year:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.course} - {selectedSubmission.data.yearLevel}</span>
                        <span className="w-16">Birthdate:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.birthdate}</span>
                        <span className="w-20">Contact No.:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.contactNo}</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="w-36">Permanent Address:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.permanentAddress}</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="w-24">Father's Name:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.fatherName}</span>
                        <span className="w-24 pl-4">Mother's Name:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.motherName}</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="w-44">Educational Attainment:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.parentsEducationalAttainment}</span>
                        <span className="w-44 pl-4">Educational Attainment:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.parentsEducationalAttainment}</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="w-24">Occupation:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.fatherOccupation}</span>
                        <span className="w-24 pl-4">Occupation:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.motherOccupation}</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="w-16">Office:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.fatherOffice}</span>
                        <span className="w-16 pl-4">Office:</span>
                        <span className="flex-1 border-b border-black">{selectedSubmission.data.motherOffice}</span>
                      </div>
                    </div>
                    {/* 2x2 Picture Box */}
                    <div className="w-32 h-32 border border-black flex items-center justify-center text-center text-xs p-2 shrink-0 font-serif">
                      Attach<br/>2x2 Picture
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-center font-bold text-sm mb-4 font-serif">SCHOLARSHIP CATEGORY</div>
                  <div className="text-sm font-serif">
                    <strong>A. Internally-Funded</strong>
                    <div className="pl-6 mt-1">
                      <em>Entrance</em>
                      <div className="pl-6 grid grid-cols-2 mt-1 mb-2">
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Valedictorian') ? 'x' : ' '} ] Valedictorian</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Salutatorian') ? 'x' : ' '} ] Salutatorian</div>
                      </div>
                    </div>
                    <div className="pl-6 mt-1">
                      <em>Academic</em>
                      <div className="pl-6 grid grid-cols-2 mt-1 mb-2 gap-y-1">
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Full') ? 'x' : ' '} ] Full</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Partial') ? 'x' : ' '} ] Partial</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Regional') ? 'x' : ' '} ] Regional</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('National') ? 'x' : ' '} ] National</div>
                      </div>
                    </div>
                    <div className="pl-6 mt-1">
                      <em>Socio-cultural</em>
                      <div className="pl-6 grid grid-cols-2 mt-1 mb-2 gap-y-1">
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Socio-cultural Regional') ? 'x' : ' '} ] Regional</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Socio-cultural National') ? 'x' : ' '} ] National</div>
                      </div>
                    </div>
                    <div className="pl-6 mt-1">
                      <em>Institutional</em>
                      <div className="pl-6 grid grid-cols-2 mt-1 mb-2 gap-y-1">
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Dependent of Faculty') ? 'x' : ' '} ] Dependent of Faculty or Staff</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('President - SSC') ? 'x' : ' '} ] President - SSC</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('President - FLP') ? 'x' : ' '} ] President - FLP</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Editor-in-Chief') ? 'x' : ' '} ] Editor-in-Chief (Campus Publication)</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('CapSU Band') ? 'x' : ' '} ] CapSU Band / Chorale</div>
                        <div className="flex gap-2">[ {selectedSubmission.data.scholarshipCategory?.includes('Institutional Others') ? 'x' : ' '} ] Others (specify) <span className="border-b border-black flex-1"></span></div>
                      </div>
                    </div>

                    <strong className="block mt-4 mb-2">B. Externally-Funded</strong>
                    <div className="pl-6 mt-1">
                      <em>CHED</em>
                      <div className="pl-6 grid grid-cols-1 mt-1 mb-2 gap-y-1">
                        <div className="flex gap-2">[ {selectedSubmission.data.scholarshipCategory?.includes('Congressional') ? 'x' : ' '} ] Congressional District (specify) <span className="border-b border-black w-48"></span></div>
                        <div className="flex gap-2">[ {selectedSubmission.data.scholarshipCategory?.includes('One Town') ? 'x' : ' '} ] One Town One Scholar (specify) <span className="border-b border-black w-48"></span></div>
                        <div className="flex gap-2">[ {selectedSubmission.data.scholarshipCategory?.includes('Tulong Dunong') ? 'x' : ' '} ] Tulong Dunong (specify) <span className="border-b border-black w-48"></span></div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('ANAC - IP') ? 'x' : ' '} ] ANAC - IP</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Pag-ulikid') ? 'x' : ' '} ] Pag-ulikid</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Barangay') ? 'x' : ' '} ] Barangay (Legal dependents of Brgy. Officials)</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('ESGP-PA') ? 'x' : ' '} ] ESGP - PA</div>
                        <div className="flex gap-2">[ {selectedSubmission.data.scholarshipCategory?.includes('CHED Others') ? 'x' : ' '} ] Others (specify): <span className="border-b border-black w-64"></span></div>
                      </div>
                    </div>
                    <div className="pl-6 mt-1">
                      <em>Merit</em>
                      <div className="pl-6 grid grid-cols-2 mt-1 mb-2 gap-y-1">
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('VIC') ? 'x' : ' '} ] VIC</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('Capizeño Circle') ? 'x' : ' '} ] Capizeño Circle</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('DOST') ? 'x' : ' '} ] DOST</div>
                        <div>[ {selectedSubmission.data.scholarshipCategory?.includes('GRF') ? 'x' : ' '} ] GRF</div>
                        <div className="col-span-2 flex flex-col gap-1">
                          <div>[ {selectedSubmission.data.scholarshipCategory?.includes('LGU') ? 'x' : ' '} ] LGU: Barangay, Municipality, Province (Landline) Contact person</div>
                          <div className="flex gap-2 pl-6">or issuing office: <span className="border-b border-black flex-1"></span></div>
                        </div>
                        <div className="col-span-2 flex flex-col gap-1 mt-1">
                          <div className="flex gap-2">[ {selectedSubmission.data.scholarshipCategory?.includes('DSWD') ? 'x' : ' '} ] DSWD: Municipality <span className="border-b border-black flex-1"></span></div>
                          <div className="flex gap-2 pl-6">Contact person: <span className="border-b border-black flex-1"></span></div>
                          <div className="flex gap-2 pl-6">Designation: <span className="border-b border-black flex-1"></span></div>
                        </div>
                        <div className="col-span-2 flex gap-2 mt-1">[ {selectedSubmission.data.scholarshipCategory?.includes('Merit Others') ? 'x' : ' '} ] Others (specify): <span className="border-b border-black flex-1"></span></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 flex justify-between text-sm font-serif">
                    <div className="w-48 text-center">
                      <div className="border-b border-black text-center">{new Date(selectedSubmission.submittedAt).toLocaleDateString()}</div>
                      <div className="mt-1">Date Received</div>
                    </div>
                    <div className="w-64 text-center">
                      <div className="border-b border-black h-5 text-center font-bold"></div>
                      <div className="mt-1">Signature of Applicant</div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-xs italic text-gray-700 font-serif">
                    <p>Note: A student shall enjoy only one scholarship</p>
                    <p>Submit certificate of grades of previous semester and blue card/ registration form for record</p>
                  </div>
                </div>

                {/* PAGE 2: STUDENTS PROFILE AND ETG SURVEY */}
                <div className="print-page w-[793px] h-[1122px] mx-auto pt-8 break-after-page font-serif">
                  <div className="text-center mb-8">
                    <h1 className="italic font-bold text-xl mb-1">Office of the Student Affairs and Services</h1>
                    <h2 className="font-bold text-base">STUDENTS PROFILE AND ETG SURVEY</h2>
                    <h3 className="font-bold text-sm mb-2">2nd Sem 2025-2026</h3>
                    <p className="text-[10px] italic w-[80%] mx-auto">(Data and Personal Information will be kept with utmost confidentiality and will be protected through RA 10173 also known as Data Privacy Act of 2012)</p>
                  </div>

                  <div className="space-y-6 text-sm">
                    <strong className="text-base block">A. Personal Demographics</strong>
                    <div className="pl-4 space-y-4">
                      <div className="flex gap-2 items-end">
                        <span className="w-16">Name:</span><span className="flex-1 border-b border-black font-bold pl-2">{selectedSubmission.studentName}</span>
                      </div>
                      <div className="flex gap-2 items-start">
                        <span className="w-16">Course:</span>
                        <div className="w-32 space-y-1">
                          <div>( {selectedSubmission.data.course === 'BSCS' ? 'x' : ' '} ) BSCS</div>
                          <div>( {selectedSubmission.data.course === 'BSFT' ? 'x' : ' '} ) BSFT</div>
                          <div>( {selectedSubmission.data.course === 'BSOA' ? 'x' : ' '} ) BSOA</div>
                          <div>( {selectedSubmission.data.course === 'BAEL' ? 'x' : ' '} ) BAEL</div>
                        </div>
                        <span className="w-20">Year Level:</span>
                        <div className="w-36 space-y-1">
                          <div>( {selectedSubmission.data.yearLevel === 'First year' ? 'x' : ' '} ) First year</div>
                          <div>( {selectedSubmission.data.yearLevel === 'Second year' ? 'x' : ' '} ) Second year</div>
                          <div>( {selectedSubmission.data.yearLevel === 'Third year' ? 'x' : ' '} ) Third year</div>
                          <div>( {selectedSubmission.data.yearLevel === 'Fourth year' ? 'x' : ' '} ) Fourth year</div>
                        </div>
                        <div className="flex flex-1 items-start">
                          <span className="w-16">Section:</span><span className="flex-1 border-b border-black h-5 pl-2">{selectedSubmission.data.section}</span>
                        </div>
                      </div>
                      <div className="flex gap-8 items-center mt-2">
                        <span>Sex: <span className="ml-2">( {selectedSubmission.data.sex === 'Male' ? 'x' : ' '} ) Male  ( {selectedSubmission.data.sex === 'Female' ? 'x' : ' '} ) Female</span></span>
                        <span>Civil Status: <span className="ml-2">( {selectedSubmission.data.civilStatus === 'Single' ? 'x' : ' '} ) Single  ( {selectedSubmission.data.civilStatus === 'Married' ? 'x' : ' '} ) Married</span></span>
                      </div>
                    </div>

                    <strong className="text-base block mt-8">B. Family Background</strong>
                    <div className="pl-4 space-y-4">
                      <div className="flex gap-4">
                        <span className="w-40">Father's Occupation:</span><span className="flex-1 border-b border-black">{selectedSubmission.data.fatherOccupation}</span>
                        <span className="w-40 text-right pr-2">Mother's Occupation:</span><span className="flex-1 border-b border-black">{selectedSubmission.data.motherOccupation}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-44">Guardian's Occupation:</span><span className="flex-1 border-b border-black">{selectedSubmission.data.guardianOccupation}</span>
                      </div>
                      
                      <div className="mt-4">Highest Educational Attainment of your Parent/Guardian?</div>
                      <div className="grid grid-cols-2 pl-12 gap-y-1 mt-2">
                        <div>( {selectedSubmission.data.parentsEducationalAttainment === 'Elementary Level' ? 'x' : ' '} ) Elementary Level</div>
                        <div>( {selectedSubmission.data.parentsEducationalAttainment === 'Elementary Graduate' ? 'x' : ' '} ) Elementary Graduate</div>
                        <div>( {selectedSubmission.data.parentsEducationalAttainment === 'High School Level' ? 'x' : ' '} ) High School Level</div>
                        <div>( {selectedSubmission.data.parentsEducationalAttainment === 'High school Graduate' ? 'x' : ' '} ) High school Graduate</div>
                        <div>( {selectedSubmission.data.parentsEducationalAttainment === 'College Level' ? 'x' : ' '} ) College Level</div>
                        <div>( {selectedSubmission.data.parentsEducationalAttainment === 'College Graduate' ? 'x' : ' '} ) College Graduate</div>
                        <div className="col-span-2">( {selectedSubmission.data.parentsEducationalAttainment === 'post Graduate level/degree' ? 'x' : ' '} ) post Graduate level/degree</div>
                      </div>

                      <div className="mt-4">What is your family's approximate monthly income?</div>
                      <div className="pl-24 space-y-1 mt-2">
                        <div>( {selectedSubmission.data.monthlyIncome === 'below Php10,000' ? 'x' : ' '} ) below Php10,000</div>
                        <div>( {selectedSubmission.data.monthlyIncome === 'Php10,001 - 20,000' ? 'x' : ' '} ) Php10,001 - 20,000</div>
                        <div>( {selectedSubmission.data.monthlyIncome === 'Php20,001 - 30,000' ? 'x' : ' '} ) Php20,001 - 30,000</div>
                        <div>( {selectedSubmission.data.monthlyIncome === 'Above 30,000' ? 'x' : ' '} ) Above 30,000</div>
                      </div>

                      <div className="flex gap-4 mt-6">
                        <span>Are you the first in the family to attend College?</span>
                        <span className="ml-4">( {selectedSubmission.data.firstGenCollege === 'Yes' ? 'x' : ' '} ) Yes</span>
                        <span>( {selectedSubmission.data.firstGenCollege === 'No' ? 'x' : ' '} ) No</span>
                      </div>
                    </div>

                    <strong className="text-base block mt-8">C. Living Condition</strong>
                    <div className="pl-4 space-y-4">
                      <div className="flex gap-4">
                        <span className="w-56">With whom do you currently live?</span>
                        <div className="flex-1 grid grid-cols-2 gap-y-2">
                          <div>( {selectedSubmission.data.livingWith === 'Parents/Guardians' ? 'x' : ' '} ) Parents/Guardians</div>
                          <div>( {selectedSubmission.data.livingWith === 'Boarding house' ? 'x' : ' '} ) Boarding house</div>
                          <div>( {selectedSubmission.data.livingWith === 'Relatives' ? 'x' : ' '} ) Relatives</div>
                          <div className="col-span-2 flex gap-2">
                            <span>( {selectedSubmission.data.livingWith === 'others' ? 'x' : ' '} ) others (please specify)</span>
                            <span className="border-b border-black flex-1 text-center">{selectedSubmission.data.livingWithSpecify}</span>
                          </div>
                          <div>( {selectedSubmission.data.livingWith === 'Alone' ? 'x' : ' '} ) Alone</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 mt-4">
                        <span className="w-56">Type of Housing</span>
                        <div className="flex-1 space-y-2">
                          <div>( {selectedSubmission.data.housingType === 'Own house' ? 'x' : ' '} ) Own house</div>
                          <div>( {selectedSubmission.data.housingType === 'Rented house or apartment' ? 'x' : ' '} ) Rented house or apartment</div>
                          <div>( {selectedSubmission.data.housingType === 'Boarding house' ? 'x' : ' '} ) Boarding house</div>
                          <div className="flex gap-2">
                            <span>( {selectedSubmission.data.housingType === 'Others' ? 'x' : ' '} ) Others (please specify)</span>
                            <span className="border-b border-black flex-1 text-center">{selectedSubmission.data.housingTypeSpecify}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <strong className="text-base block mt-8">D. Access to Resources</strong>
                    <div className="pl-4">
                      <div className="mb-2">Do you have access of the following at home?</div>
                      <div className="pl-24 space-y-1">
                        <div>( {selectedSubmission.data.accessResources?.includes('Personal Computer/Laptop') ? 'x' : ' '} ) Personal Computer/Laptop</div>
                        <div>( {selectedSubmission.data.accessResources?.includes('Internet Connection') ? 'x' : ' '} ) Internet Connection</div>
                        <div>( {selectedSubmission.data.accessResources?.includes('Study space') ? 'x' : ' '} ) Study space</div>
                        <div>( {selectedSubmission.data.accessResources?.includes('Textbooks and learning materials') ? 'x' : ' '} ) Textbooks and learning materials</div>
                      </div>

                      <div className="flex gap-8 mt-6">
                        <span>Do you work while studying?</span>
                        <span>( {selectedSubmission.data.workingStudent === 'Yes, full-time' ? 'x' : ' '} ) Yes, full-time</span>
                        <span>( {selectedSubmission.data.workingStudent === 'Yes, part-time' ? 'x' : ' '} ) Yes, part-time</span>
                        <span>( {selectedSubmission.data.workingStudent === 'No' ? 'x' : ' '} ) No</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAGE 3: SURVEY CONTINUATION */}
                <div className="print-page w-[793px] h-[1122px] mx-auto pt-8 font-serif text-sm">
                  <strong className="text-base block mb-4">E. Student Classification</strong>
                  <div className="mb-4">Which of the following classification best describe your current status? (Multiple responses)</div>
                  
                  <div className="pl-16 space-y-1.5">
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
                      <div key={opt}>( {selectedSubmission.data.classifications?.includes(opt) ? 'x' : ' '} ) {opt}</div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <span>( {selectedSubmission.data.classifications?.includes('others') ? 'x' : ' '} ) others (Please specify)</span> 
                      <span className="border-b border-black w-64 text-center">{selectedSubmission.data.classificationOthersSpecify}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-8">
                    <div>
                      <div className="mb-2">If you are working student, please indicate your type of work or source of income</div>
                      <div className="border-b border-black w-full h-6 text-center pt-1">{selectedSubmission.data.workingStudentTypeOfWork}</div>
                    </div>
                    <div>
                      <div className="mb-2">If you are a student with special needs/Person with disability (PWD), please specify your condition or disability</div>
                      <div className="border-b border-black w-full h-6 text-center pt-1">{selectedSubmission.data.pwdCondition}</div>
                    </div>
                    <div>
                      <div className="mb-2">If you are a PDL (Drop out, or learner with interrupted schooling), please state the reason why your schooling was previously interrupted.</div>
                      <div className="border-b border-black w-full h-6 text-center pt-1">{selectedSubmission.data.pdlReason}</div>
                    </div>
                  </div>

                  <div className="mt-20">
                    <p className="mb-16">I hereby certify that the information I have provided is true and correct to the best of my knowledge. I understand that this information will be used solely for student profiling.</p>
                    <div className="w-80">
                      <div className="border-b border-black text-center h-6 font-bold uppercase">{selectedSubmission.studentName}</div>
                      <div className="text-center">Signature over Printed Name</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GuidanceSettings() {
  const [activeTab, setActiveTab] = useState('scholarships');
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<any>(null);
  const [scholarshipForm, setScholarshipForm] = useState({
    name: '', type: 'Internally-Funded', category: '',
    status: 'Active', slots: 0, deadline: '', description: ''
  });

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    const list = await db.scholarships.listAll();
    setScholarships(list);
  };

  const handleSaveScholarship = async () => {
    if (editingScholarship) {
      await db.scholarships.update(editingScholarship.id, scholarshipForm);
    } else {
      await db.scholarships.create(scholarshipForm);
    }
    setShowScholarshipModal(false);
    loadScholarships();
  };

  const handleEdit = (s: any) => {
    setEditingScholarship(s);
    setScholarshipForm(s);
    setShowScholarshipModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await db.scholarships.delete(id);
      loadScholarships();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#0f2e60]">System Settings</h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 flex gap-4 px-6 pt-4">
          <button className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'scholarships' ? 'border-[#1864db] text-[#1864db]' : 'border-transparent text-gray-500 hover:text-gray-900'}`} onClick={() => setActiveTab('scholarships')}>Scholarships Management</button>
          <button className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'courses' ? 'border-[#1864db] text-[#1864db]' : 'border-transparent text-gray-500 hover:text-gray-900'}`} onClick={() => setActiveTab('courses')}>Courses</button>
          <button className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'academic-years' ? 'border-[#1864db] text-[#1864db]' : 'border-transparent text-gray-500 hover:text-gray-900'}`} onClick={() => setActiveTab('academic-years')}>Academic Years</button>
        </div>

        <div className="p-6">
          {activeTab === 'scholarships' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Scholarship Registry</h3>
                <button 
                  onClick={() => {
                    setEditingScholarship(null);
                    setScholarshipForm({ name: '', type: 'Internally-Funded', category: '', status: 'Active', slots: 0, deadline: '', description: '' });
                    setShowScholarshipModal(true);
                  }}
                  className="bg-[#1864db] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#124b9f]"
                >
                  + Add Scholarship
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 font-bold">Name</th>
                      <th className="px-6 py-3 font-bold">Type</th>
                      <th className="px-6 py-3 font-bold">Category</th>
                      <th className="px-6 py-3 font-bold">Slots</th>
                      <th className="px-6 py-3 font-bold">Deadline</th>
                      <th className="px-6 py-3 font-bold">Status</th>
                      <th className="px-6 py-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {scholarships.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-gray-900">{s.name}</td>
                        <td className="px-6 py-4">{s.type}</td>
                        <td className="px-6 py-4">{s.category}</td>
                        <td className="px-6 py-4">{s.slots}</td>
                        <td className="px-6 py-4">{s.deadline}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button onClick={() => handleEdit(s)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                          <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'courses' && (
            <div className="text-gray-500 text-sm">Course management coming soon...</div>
          )}
          {activeTab === 'academic-years' && (
            <div className="text-gray-500 text-sm">Academic year management coming soon...</div>
          )}
        </div>
      </div>
      
      {/* Modal */}
        {showScholarshipModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg text-gray-900">{editingScholarship ? 'Edit Scholarship' : 'Add New Scholarship'}</h3>
                <button onClick={() => setShowScholarshipModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Scholarship Name</label>
                  <input type="text" value={scholarshipForm.name} onChange={e => setScholarshipForm({...scholarshipForm, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]" placeholder="e.g. Tulong Dunong" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                  <textarea value={scholarshipForm.description} onChange={e => setScholarshipForm({...scholarshipForm, description: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]" placeholder="Short description..." rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Funding Type</label>
                    <select value={scholarshipForm.type} onChange={e => setScholarshipForm({...scholarshipForm, type: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]">
                      <option>Internally-Funded</option>
                      <option>Externally-Funded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Category / Tag</label>
                    <input type="text" value={scholarshipForm.category} onChange={e => setScholarshipForm({...scholarshipForm, category: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]" placeholder="e.g. Entrance, CHED" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Status</label>
                    <select value={scholarshipForm.status} onChange={e => setScholarshipForm({...scholarshipForm, status: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]">
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Slots</label>
                    <input type="number" value={isNaN(scholarshipForm.slots) || scholarshipForm.slots === 0 ? '' : scholarshipForm.slots} onChange={e => setScholarshipForm({...scholarshipForm, slots: e.target.value === '' ? 0 : (parseInt(e.target.value, 10) || 0)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Deadline</label>
                  <input type="date" value={scholarshipForm.deadline} onChange={e => setScholarshipForm({...scholarshipForm, deadline: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1864db]" />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setShowScholarshipModal(false)} className="px-4 py-2 font-bold text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={handleSaveScholarship} className="px-6 py-2 bg-[#1864db] text-white rounded-lg font-bold text-sm hover:bg-[#124b9f]">Save Scholarship</button>
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
