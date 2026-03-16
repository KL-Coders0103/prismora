import { Bell, Search, Menu, User, LogOut } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import API from "../../services/api";
import socket from "../../services/socket";

import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext} from "../../context/AuthContext";

const TopNavbar = ({ setOpen }) => {

  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const dropdownRef = useRef();
  const profileRef = useRef();

  useEffect(() => {

    const loadAlerts = async () => {

      const res = await API.get("/alerts");

      setAlerts(res.data);

    };

    loadAlerts();

    socket.on("alert", (alert) => {

      setAlerts(prev => [alert, ...prev]);

    });

    return () => socket.off("alert");

  }, []);

  // CLOSE DROPDOWNS ON OUTSIDE CLICK

  useEffect(() => {

    const handler = (e) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {

        setShowNotifications(false);

      }

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {

        setShowProfile(false);

      }

    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);

  }, []);


  // LOGOUT FUNCTION

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };


  return (

    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">

      {/* LEFT */}

      <div className="flex items-center gap-4">

        <Menu
          className="md:hidden cursor-pointer"
          onClick={() => setOpen(true)}
        />

        <div className="hidden md:flex items-center bg-slate-800 px-3 py-2 rounded-lg">

          <Search size={18} />

          <input
            className="bg-transparent outline-none ml-2 text-sm"
            placeholder="Search datasets, insights..."
          />

        </div>

      </div>


      {/* RIGHT */}

      <div className="flex items-center gap-6 relative">

        {/* Notifications */}

        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative"
        >

          <Bell size={20} />

          {alerts.length > 0 && (

            <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">

              {alerts.length > 9 ? "9+" : alerts.length}

            </span>

          )}

        </button>


        {/* Notifications Dropdown */}

        <AnimatePresence>

        {showNotifications && (

          <Motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-10 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-4"
          >

            <h3 className="font-semibold mb-3">
              Alerts
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

          </Motion.div>

        )}

        </AnimatePresence>


        {/* PROFILE */}

        <div className="relative">

          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 cursor-pointer hover:text-blue-400"
          >

            <User size={20} />

            <span className="text-sm hidden md:block">
              {user?.role}
            </span>

          </button>


          {/* PROFILE DROPDOWN */}

          <AnimatePresence>

          {showProfile && (

            <Motion.div
              ref={profileRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-2"
            >

              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-800 rounded"
              >

                <LogOut size={16} />

                Logout

              </button>

            </Motion.div>

          )}

          </AnimatePresence>

        </div>

      </div>

    </header>

  );

};

export default TopNavbar;