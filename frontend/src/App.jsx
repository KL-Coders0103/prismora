// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Dashboard from "./pages/dashboard/Dashboard";

// import SalesAnalytics from "./pages/sales-analytics/SalesAnalytics";
// import CustomerAnalytics from "./pages/customer-analytics/CustomerAnalytics";
// import UploadData from "./pages/upload-data/UploadData";
// import Alerts from "./pages/alerts/Alerts";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/ai-insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
//         <Route path="/sales" element={<ProtectedRoute><SalesAnalytics /></ProtectedRoute>} />
//         <Route path="/customers" element={<ProtectedRoute><CustomerAnalytics /></ProtectedRoute>} />
//         <Route path="/upload" element={<ProtectedRoute><UploadData /></ProtectedRoute>} />
//         <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/dashboard/Dashboard";
import AIInsights from "./pages/ai-insights/AIInsights";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/ai-insights" element={<AIInsights />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;