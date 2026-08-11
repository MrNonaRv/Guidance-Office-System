import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { mockStudents } from '../../types';
import { LayoutDashboard, FileText, Bell, Mail, BarChart2, Settings, LogOut, Filter, ChevronDown, View, User, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { db } from '../../lib/db';

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
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized in Firebase. Add this URL to Firebase Auth settings.');
      } else {
        setError('Failed to sign in. If previewing, try opening in a new tab.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/BI.png')] bg-cover bg-center p-4">
      <div className="relative bg-[#a5d8ff] p-8 rounded-[32px] shadow-2xl w-full max-w-[380px] text-center">
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
      </div>
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
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
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
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all w-full text-sm font-medium"
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
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Submissions</h2>
            <Link to="/admin/submissions" className="text-blue-600 text-sm font-medium hover:underline">View all</Link>
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Reports</h2>
              <Link to="/admin/reports" className="text-blue-600 text-sm font-medium hover:underline">View all</Link>
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
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Notifications</h2>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#0f2e60]">Scholarship Submissions</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 relative">
          <div className="flex-1 max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-2">No. of Submissions ({filteredSubmissions.length})</h2>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Search by student"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0f2e60] text-white rounded-lg text-sm font-medium hover:bg-[#1a4484] transition-colors shadow-sm"
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
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Reset
                    </button>
                    <button onClick={() => setFilterOpen(false)} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Apply</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Records</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No submissions found matching your filters.</td>
                </tr>
              )}
              {filteredSubmissions.map(s => (
                <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
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
                  <td className="p-4 text-sm">
                    <button onClick={() => setSelectedSubmission(s)} className="text-gray-500 hover:text-blue-600 font-medium transition-colors">View</button>
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

export function GuidancePlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#0f2e60]">{title}</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
        <p className="mb-4">This section is part of the Guidance Portal.</p>
        <p className="text-sm">For a full implementation, you would see complex interactive components here matching the design specification.</p>
      </div>
    </div>
  );
}
