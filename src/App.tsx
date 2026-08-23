import { useEffect, lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { seedDatabase } from "./lib/seed";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "./lib/db";

const GuidanceLogin = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceLogin })));
const GuidanceLayout = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceLayout })));
const GuidanceDashboard = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceDashboard })));
const GuidanceSubmissions = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceSubmissions })));




const GuidanceSettings = lazy(() => import('./pages/guidance').then(module => ({ default: module.GuidanceSettings })));
const GuidanceReports = lazy(() => import('./pages/guidance/reports').then(module => ({ default: module.GuidanceReports })));
const GuidanceNotifications = lazy(() => import('./pages/guidance/notifications').then(module => ({ default: module.GuidanceNotifications })));
const GuidanceCommunications = lazy(() => import('./pages/guidance/communications').then(module => ({ default: module.GuidanceCommunications })));


const StudentLogin = lazy(() => import('./pages/student').then(module => ({ default: module.StudentLogin })));
const StudentLayout = lazy(() => import('./pages/student').then(module => ({ default: module.StudentLayout })));
const StudentDashboard = lazy(() => import('./pages/student').then(module => ({ default: module.StudentDashboard })));
const StudentSubmissionForm = lazy(() => import('./pages/student').then(module => ({ default: module.StudentSubmissionForm })));

const AdminAuthGuard = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Double check they have admin role in DB
          const userDoc = await db.users.get(user.uid);
          if (userDoc?.role === 'admin') {
            setIsAuth(true);
            return;
          }
        } catch (e) {
          console.warn("Could not verify admin role, falling back.", e);
        }
        setIsAuth(localStorage.getItem('adminAuth') === 'true');
      } else {
        setIsAuth(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (isAuth === null) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-[#0f2e60] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

const StudentAuthGuard = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(localStorage.getItem('studentAuth') === 'true');
      } else {
        setIsAuth(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (isAuth === null) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-[#0f2e60] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/student/login" replace />;
};

const RootRedirect = () => {
  const isAdminAuth = localStorage.getItem('adminAuth') === 'true';
  const isStudentAuth = localStorage.getItem('studentAuth') === 'true';
  
  if (isAdminAuth) return <Navigate to="/admin/dashboard" replace />;
  if (isStudentAuth) return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/student/login" replace />;
};

export default function App() {
  useEffect(() => {
    seedDatabase().catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-[#0f2e60] border-t-transparent rounded-full animate-spin"></div></div>}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          
          {/* Guidance Portal Routes */}
        <Route path="/admin/login" element={<GuidanceLogin />} />
        <Route path="/admin" element={<AdminAuthGuard />}>
          <Route element={<GuidanceLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<GuidanceDashboard />} />
            <Route path="submissions" element={<GuidanceSubmissions />} />
            
            
            
            
            <Route path="settings" element={<GuidanceSettings />} />
            <Route path="reports" element={<GuidanceReports />} />
            <Route path="notifications" element={<GuidanceNotifications />} />
            <Route path="communications" element={<GuidanceCommunications />} />

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
