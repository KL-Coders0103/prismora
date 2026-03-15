import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/dashboard/Dashboard";
import AIInsights from "./pages/ai-insights/AIInsights";
import AIChat from "./pages/ai-chat/AIChat";
import SalesAnalytics from "./pages/sales-analytics/SalesAnalytics";
import CustomerAnalytics from "./pages/customer-analytics/CustomerAnalytics";
import UploadData from "./pages/upload-data/UploadData";
import Reports from "./pages/reports/Reports";
import Alerts from "./pages/alerts/Alerts";
import TeamManagement from "./pages/team/TeamManagement";
import ActivityLogs from "./pages/activity/ActivityLogs";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";

const AppRoutes = () => {
  return (
    <Routes>

      {/* AUTH ROUTES */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED ROUTES */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-insights"
        element={
          <ProtectedRoute>
            <AIInsights />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-chat"
        element={
          <ProtectedRoute>
            <AIChat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales-analytics"
        element={
          <ProtectedRoute>
            <SalesAnalytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer-analytics"
        element={
          <ProtectedRoute>
            <CustomerAnalytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload-data"
        element={
          <ProtectedRoute>
            <UploadData />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <TeamManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <ActivityLogs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;