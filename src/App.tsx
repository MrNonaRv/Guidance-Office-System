/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Home } from './pages/Home';

const GuidanceLogin = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceLogin })));
const GuidanceLayout = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceLayout })));
const GuidanceDashboard = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceDashboard })));
const GuidanceSubmissions = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceSubmissions })));
const GuidancePlaceholder = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidancePlaceholder })));

const StudentLogin = lazy(() => import('./pages/student').then(module => ({ default: module.StudentLogin })));
const StudentLayout = lazy(() => import('./pages/student').then(module => ({ default: module.StudentLayout })));
const StudentDashboard = lazy(() => import('./pages/student').then(module => ({ default: module.StudentDashboard })));
const StudentSubmissionForm = lazy(() => import('./pages/student').then(module => ({ default: module.StudentSubmissionForm })));

const AdminAuthGuard = () => {
  const isAuth = sessionStorage.getItem('adminAuth') === 'true';
  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

const StudentAuthGuard = () => {
  const isAuth = sessionStorage.getItem('studentAuth') === 'true';
  return isAuth ? <Outlet /> : <Navigate to="/student/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-[#0f2e60] border-t-transparent rounded-full animate-spin"></div></div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/student/login" replace />} />
          
          {/* Guidance Portal Routes */}
        <Route path="/admin/login" element={<GuidanceLogin />} />
        <Route path="/admin" element={<AdminAuthGuard />}>
          <Route element={<GuidanceLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<GuidanceDashboard />} />
            <Route path="submissions" element={<GuidanceSubmissions />} />
            <Route path="notifications" element={<GuidancePlaceholder title="Notifications" />} />
            <Route path="communications" element={<GuidancePlaceholder title="Communications" />} />
            <Route path="reports" element={<GuidancePlaceholder title="Reports & Analytics" />} />
            <Route path="settings" element={<GuidancePlaceholder title="Settings" />} />
          </Route>
        </Route>
        
        {/* Student Portal Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student" element={<StudentAuthGuard />}>
          <Route element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="submission" element={<StudentSubmissionForm />} />
          </Route>
        </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
