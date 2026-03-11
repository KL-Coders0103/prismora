import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import AIInsights from "./pages/ai-insights/AIInsights";
import SalesAnalytics from "./pages/sales-analytics/SalesAnalytics";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/sales" element={<SalesAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;
