import { LayoutDashboard, BarChart3, Users, Upload, FileText, Settings, X, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = ({ open, setOpen }) => {
  return (
    <div
      className={`fixed md:static top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-700 p-5 transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300`}
    >
      <div className="flex items-center justify-between mb-10">

        <h1 className="text-2xl font-bold text-blue-400">
          PRISMORA
        </h1>

        <X
          className="md:hidden cursor-pointer"
          onClick={() => setOpen(false)}
        />

      </div>

      <nav className="space-y-4">

        <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <LayoutDashboard size={18} />
           <Link to="/">
              Dashboard
           </Link>
        </div>

        <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <Brain size={18} />
           <Link to="/ai-insights">
             AI Insights
            </Link>
        </div>

        <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <Brain size={18} />
           <Link to="/ai-chat">
             AI Assistant
            </Link>
        </div>

        <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <BarChart3 size={18} />
          <Link to="/sales-analytics">
              Sales Analytics
            </Link>
        </div>

        <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <Users size={18} />
          <Link to="/customer-analytics">
              Customer Analytics      
          </Link>
        </div>

        <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <Upload size={18} />
          <Link to="/upload-data">
            Upload Data
          </Link>
        </div>

        <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <FileText size={18} />
          <Link to="/reports">
            Reports
          </Link>
        </div>

        <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <Settings size={18} />
          Settings
        </div>

      </nav>
    </div>
  );
};

export default Sidebar;