import {
  LayoutDashboard,
  BarChart3,
  Users,
  Upload,
  FileText,
  Settings,
  Brain,
  Bell,
  Clock,
  User,
  X
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const menu = [

  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    roles: ["admin","analyst","viewer"]
  },

  {
    icon: Brain,
    label: "AI Insights",
    path: "/ai-insights",
    roles: ["admin","analyst"]
  },

  {
    icon: Brain,
    label: "AI Assistant",
    path: "/ai-chat",
    roles: ["admin","analyst"]
  },

  {
    icon: BarChart3,
    label: "Sales Analytics",
    path: "/sales-analytics",
    roles: ["admin","analyst"]
  },

  {
    icon: Users,
    label: "Customer Analytics",
    path: "/customer-analytics",
    roles: ["admin","analyst"]
  },

  {
    icon: Upload,
    label: "Upload Data",
    path: "/upload-data",
    roles: ["admin","analyst"]
  },

  {
    icon: FileText,
    label: "Reports",
    path: "/reports",
    roles: ["admin","analyst","viewer"]
  },

  {
    icon: Bell,
    label: "Alerts",
    path: "/alerts",
    roles: ["admin","analyst"]
  },

  {
    icon: Users,
    label: "Team Management",
    path: "/team",
    roles: ["admin"]
  },

  {
    icon: Clock,
    label: "Activity Logs",
    path: "/activity",
    roles: ["admin"]
  },

  {
    icon: User,
    label: "Profile",
    path: "/profile",
    roles: ["admin","analyst","viewer"]
  },

  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    roles: ["admin","analyst","viewer"]
  }

];

const Sidebar = ({ open, setOpen }) => {

  const { user } = useContext(AuthContext);

  const filteredMenu = menu.filter(item =>
    item.roles.includes(user?.role)
  );

  return (

    <aside
      className={`fixed md:static top-0 left-0 h-screen w-64
      bg-slate-900 border-r border-slate-700 p-6
      transform ${open ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 transition-transform duration-300`}
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

      <nav className="space-y-2 overflow-y-auto">

        {filteredMenu.map((item) => {

          const Icon = item.icon;

          return (

            <Motion.div whileHover={{ scale: 1.02 }} key={item.path}>

              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg text-sm transition
                  ${
                    isActive
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >

                <Icon size={18} />

                {item.label}

              </NavLink>

            </Motion.div>

          );

        })}

      </nav>

    </aside>

  );

};

export default Sidebar;