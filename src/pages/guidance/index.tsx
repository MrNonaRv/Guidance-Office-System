import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { mockStudents } from '../../types';
import { LayoutDashboard, FileText, Bell, Mail, BarChart2, Settings, LogOut, Filter, ChevronDown, View } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import backgroundImg from '../../assets/BI.png';
import logoImg from '../../assets/capsu-logo.png';

export function GuidanceLogin() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="relative bg-[#a5d8ff] p-8 rounded-[32px] shadow-2xl w-full max-w-[380px] text-center">
        <div className="mx-auto h-16 flex items-center justify-center mb-3">
          <img src={logoImg} alt="Logo" className="h-full object-contain" />
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
          
          <button type="button" className="w-full bg-[#1864db] text-white py-2.5 rounded-full font-medium hover:bg-[#124b9f] transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 text-[13px]">
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

export function GuidanceLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
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
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Relie" alt="Avatar" />
          </div>
          <div>
            <p className="font-semibold text-sm">Relie Aguilas</p>
            <p className="text-xs text-blue-200">aguilas.relie@capsu.edu</p>
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
            onClick={() => {
              sessionStorage.removeItem('adminAuth');
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
          <p className="text-4xl font-bold mb-1">213</p>
          <p className="text-sm text-blue-200">â 4 this week</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg shadow-green-500/20">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-green-100 font-medium">Complete Submissions</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold mb-1">150</p>
          <p className="text-sm text-green-200">â 3 new today</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-2xl text-white shadow-lg shadow-yellow-500/20">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-yellow-100 font-medium">Incomplete Submissions</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold mb-1">63</p>
          <p className="text-sm text-yellow-200">â 4 this month</p>
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
                {mockStudents.slice(0, 5).map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-500" />
                      </div>
                      {s.name}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{s.course}</td>
                    <td className="p-4 text-sm text-gray-600">{s.date}</td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                        s.status === 'Complete' 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", s.status === 'Complete' ? "bg-green-500" : "bg-yellow-500")}></span>
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
                  <div className="h-full bg-green-500" style={{ width: '70%' }}></div>
                  <div className="h-full bg-yellow-400" style={{ width: '30%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Gender Status Distribution</span>
                </div>
                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-500" style={{ width: '55%' }}></div>
                  <div className="h-full bg-pink-400" style={{ width: '45%' }}></div>
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
              {[1,2,3].map(i => (
                <div key={i} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800"><span className="font-semibold">Anna Marie A. Santos</span> submitted scholarship requirements.</p>
                    <p className="text-xs text-gray-400 mt-1">Today, 1:03 PM</p>
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
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#0f2e60]">Scholarship Submissions</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 relative">
          <div className="flex-1 max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-2">No. of Submissions (213)</h2>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Search by student" 
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
                    <select className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>All status</option>
                      <option>Complete</option>
                      <option>Incomplete</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">By Course</label>
                    <select className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>All courses</option>
                      <option>BAEL</option>
                      <option>BSCS</option>
                      <option>BSFT</option>
                      <option>BSOA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">By Date</label>
                    <input type="date" className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button onClick={() => setFilterOpen(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium">Reset</button>
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
              {mockStudents.map(s => (
                <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    {s.name}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{s.course}</td>
                  <td className="p-4 text-sm text-gray-600">{s.date}</td>
                  <td className="p-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                      s.status === 'Complete' 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", s.status === 'Complete' ? "bg-green-500" : "bg-yellow-500")}></span>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <button className="text-gray-500 hover:text-blue-600 font-medium transition-colors">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
