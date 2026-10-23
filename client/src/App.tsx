import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

// Public pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Authenticated pages
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { CampDetailsPage } from './pages/camps/CampDetailsPage';
import { CampRegisterPage } from './pages/camps/CampRegisterPage';
import { MyRegistrationsPage } from './pages/camps/MyRegistrationsPage';
import { AICompanionPage } from './pages/ai/AICompanionPage';
import { BreathingExercisePage } from './pages/breathing/BreathingExercisePage';
import { BodyDoublingPage } from './pages/bodyDoubling/BodyDoublingPage';
import { LiveBodyDoublingPage } from './pages/bodyDoubling/LiveBodyDoublingPage';
import { PharmacyPage, DoctorsPage, BooksPage } from './pages/services/ComingSoonPages';
import { ProfilePage } from './pages/profile/ProfilePage';
import { AdminPortalPage } from './pages/admin/AdminPortalPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminPortalPage />} />
          </Route>

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverviewPage />} />
            <Route path="companion" element={<AICompanionPage />} />
            <Route path="breathing" element={<BreathingExercisePage />} />
            <Route path="body-doubling" element={<BodyDoublingPage />} />
            <Route path="body-doubling/live" element={<LiveBodyDoublingPage />} />
            <Route path="camps" element={<CampDetailsPage />} />
            <Route path="camps/brainwell/register" element={<CampRegisterPage />} />
            <Route path="my-registrations" element={<MyRegistrationsPage />} />
            <Route path="pharmacy" element={<PharmacyPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPortalPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
