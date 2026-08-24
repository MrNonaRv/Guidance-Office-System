import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('/BI.png')] bg-cover bg-center py-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-4xl p-4 sm:p-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-white/90 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-xl p-2.5 sm:p-3">
            <img src="/capsu-logo.png" alt="CAPSU Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg leading-tight">
            Web-Based Scholarship Submission<br className="hidden sm:inline" /> Alert System
          </h1>
          <p className="text-sm sm:text-lg text-blue-100 font-medium max-w-2xl mx-auto drop-shadow-md">
            Capiz State University - Mambusao Satellite College
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-3xl mx-auto">
          {/* Guidance Portal Card */}
          <div className="bg-white/90 backdrop-blur-md p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 text-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-inner">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Guidance Portal</h2>
            <p className="text-xs sm:text-base text-gray-600 mb-6 sm:mb-8 flex-1 leading-relaxed">
              For guidance staff to manage, review, and evaluate scholarship submissions and generate reports.
            </p>
            <Link 
              to="/admin/login" 
              className="w-full bg-[#0f2e60] text-white py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-medium hover:bg-[#1a4484] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 group-hover:shadow-blue-900/40"
            >
              Access Guidance Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Student Portal Card */}
          <div className="bg-white/90 backdrop-blur-md p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 text-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-inner">
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Student Portal</h2>
            <p className="text-xs sm:text-base text-gray-600 mb-6 sm:mb-8 flex-1 leading-relaxed">
              For students to securely submit requirements, track their application status, and receive alerts.
            </p>
            <Link 
              to="/student/login" 
              className="w-full bg-blue-600 text-white py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40"
            >
              Access Student Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
