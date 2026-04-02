import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
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
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === PROTECTED ROUTES (WRAPPED IN DASHBOARD LAYOUT) === */}
        <Route element={<Layout />}>
          
          {/* ALL AUTHENTICATED USERS */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "analyst", "viewer"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* ANALYSTS & ADMINS ONLY */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "analyst"]} />}>
            <Route path="/sales-analytics" element={<SalesAnalytics />} />
            <Route path="/customer-analytics" element={<CustomerAnalytics />} />
            <Route path="/upload-data" element={<UploadData />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/ai-chat" element={<AIChat />} />
          </Route>

          {/* ADMINS ONLY */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/activity" element={<ActivityLogs />} />
          </Route>

        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;