import { Bell, Search, Menu } from "lucide-react";
import API from "../../services/api";
import { useEffect, useState } from "react";

const TopNavbar = ({ setOpen }) => {

  const [alerts, setAlerts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {

    const loadAlerts = async () => {

      try {

        const res = await API.get("/alerts");

        setAlerts(res.data);

      } catch (error) {

        console.error("Error fetching alerts", error);

      }

    };

    loadAlerts();

  }, []);

  return (
    <div className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        <Menu
          className="md:hidden cursor-pointer"
          onClick={() => setOpen(true)}
        />

        <div className="hidden md:flex items-center bg-slate-800 px-3 py-2 rounded-lg">
          <Search size={18} />
          <input
            className="bg-transparent outline-none ml-2 text-sm"
            placeholder="Search..."
          />
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5 relative">

        {/* Notification Bell */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative"
        >

          <Bell size={20} />

          {alerts.length > 0 && (

            <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">

              {alerts.length}

            </span>

          )}

        </button>

        {/* Notification Dropdown */}
        {showNotifications && (

          <div className="absolute right-10 top-10 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-4">

            <h3 className="font-semibold mb-3">
              Notifications
            </h3>

            {alerts.length === 0 && (

              <p className="text-sm text-gray-400">
                No alerts
              </p>

            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">

              {alerts.map((alert, index) => (

                <div
                  key={index}
                  className="bg-slate-800 p-2 rounded text-sm"
                >
                  {alert.message}
                </div>

              ))}

            </div>

          </div>

        )}

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-500"></div>

      </div>

    </div>
  );
};

export default TopNavbar;