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
import Home from "./pages/home/Home";

const AppRoutes = () => {

  return (

    <Routes>

      {/* PUBLIC */}

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ALL USERS */}

      <Route element={<ProtectedRoute allowedRoles={["admin","analyst","viewer"]}/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* ANALYST + ADMIN */}

      <Route element={<ProtectedRoute allowedRoles={["admin","analyst"]}/>}>
        <Route path="/sales-analytics" element={<SalesAnalytics />} />
        <Route path="/customer-analytics" element={<CustomerAnalytics />} />
        <Route path="/upload-data" element={<UploadData />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/ai-chat" element={<AIChat />} />
      </Route>

      {/* ADMIN ONLY */}

      <Route element={<ProtectedRoute allowedRoles={["admin"]}/>}>
        <Route path="/team" element={<TeamManagement />} />
        <Route path="/activity" element={<ActivityLogs />} />
      </Route>

    </Routes>

  );

};

export default AppRoutes;