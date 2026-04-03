import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout"; // Standard SaaS Layout (Sidebar + Navbar)

// === LAZY LOADING IMPORTS ===
// Performance optimization: Only loads the JS for a page when the user visits it

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// Public
const Home = lazy(() => import("./pages/home/Home"));

// All Users (Viewers, Analysts, Admins)
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Reports = lazy(() => import("./pages/reports/Reports"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Settings = lazy(() => import("./pages/settings/Settings"));

// Analysts + Admins (ML & Data specific)
const SalesAnalytics = lazy(() => import("./pages/sales-analytics/SalesAnalytics"));
const CustomerAnalytics = lazy(() => import("./pages/customer-analytics/CustomerAnalytics"));
const UploadData = lazy(() => import("./pages/upload-data/UploadData"));
const Alerts = lazy(() => import("./pages/alerts/Alerts"));
const AIInsights = lazy(() => import("./pages/ai-insights/AIInsights"));
const AIChat = lazy(() => import("./pages/ai-chat/AIChat"));

// Admins Only
const TeamManagement = lazy(() => import("./pages/team/TeamManagement"));
const ActivityLogs = lazy(() => import("./pages/activity/ActivityLogs"));


// --- Global Fallback Loader for Suspense ---
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
    <Motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent"
    />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED */}
        <Route element={<Layout />}>

          <Route element={<ProtectedRoute permission="dashboard" />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRoute permission="reports" />}>
            <Route path="/reports" element={<Reports />} />
          </Route>

          <Route element={<ProtectedRoute permission="profile" />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute permission="settings" />}>
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route element={<ProtectedRoute permission="sales" />}>
            <Route path="/sales-analytics" element={<SalesAnalytics />} />
          </Route>

          <Route element={<ProtectedRoute permission="team" />}>
            <Route path="/team" element={<TeamManagement />} />
          </Route>

          <Route element={<ProtectedRoute permission="customers" />}>
            <Route path="/customers" element={<CustomerAnalytics />} />
          </Route>

          <Route element={<ProtectedRoute permission="upload" />}>
            <Route path="/upload" element={<UploadData />} />
          </Route>

          <Route element={<ProtectedRoute permission="alerts" />}>
            <Route path="/alerts" element={<Alerts />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="aiInsights" />}>
            <Route path="/ai-insights" element={<AIInsights />} />
          </Route>

          <Route element={<ProtectedRoute permission="aiChat" />}>
            <Route path="/ai-chat" element={<AIChat />} />
          </Route>

          <Route element={<ProtectedRoute permission="logs" />}>
            <Route path="/logs" element={<ActivityLogs />} />
          </Route>

        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;