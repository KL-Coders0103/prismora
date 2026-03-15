import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const Settings = () => {

  const [darkMode,setDarkMode] = useState(true);
  const [notifications,setNotifications] = useState(true);

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Settings
      </h1>

      <div className="space-y-6 max-w-lg">

        {/* Theme */}

        <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl flex justify-between items-center">

          <div>

            <p className="font-semibold">
              Dark Mode
            </p>

            <p className="text-sm text-gray-400">
              Toggle dashboard theme
            </p>

          </div>

          <button
            onClick={()=>setDarkMode(!darkMode)}
            className={`px-4 py-1 rounded ${
              darkMode
              ? "bg-blue-500"
              : "bg-gray-600"
            }`}
          >

            {darkMode ? "ON" : "OFF"}

          </button>

        </div>

        {/* Notifications */}

        <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl flex justify-between items-center">

          <div>

            <p className="font-semibold">
              Notifications
            </p>

            <p className="text-sm text-gray-400">
              Receive system alerts
            </p>

          </div>

          <button
            onClick={()=>setNotifications(!notifications)}
            className={`px-4 py-1 rounded ${
              notifications
              ? "bg-green-500"
              : "bg-gray-600"
            }`}
          >

            {notifications ? "Enabled" : "Disabled"}

          </button>

        </div>

        {/* API Integration */}

        <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl">

          <p className="font-semibold mb-1">
            API Integrations
          </p>

          <p className="text-sm text-gray-400">
            Connect external analytics APIs and data sources.
          </p>

        </div>

      </div>

    </DashboardLayout>

  )

}

export default Settings