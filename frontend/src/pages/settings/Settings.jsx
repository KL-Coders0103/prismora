import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getSettings,
  updateSettings
} from "../../services/settingsService";

const Settings = () => {

  const [settings,setSettings] = useState({
    darkMode:true,
    notifications:true
  });

  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);

  const [success,setSuccess] = useState("");
  const [error,setError] = useState("");

  useEffect(()=>{

    const loadSettings = async ()=>{

      try{

        const data = await getSettings();

        setSettings(data);

      }catch(err){

        console.error(err);
        setError("Failed to load settings");

      }finally{

        setLoading(false);

      }

    };

    loadSettings();

  },[]);

  const toggleSetting = async (key)=>{

    const updated = {
      ...settings,
      [key]:!settings[key]
    };

    setSettings(updated);

    setSaving(true);
    setSuccess("");
    setError("");

    try{

      await updateSettings(updated);

      setSuccess("Settings updated");

    }catch(err){

      console.error(err);
      setError("Failed to save settings");

    }finally{

      setSaving(false);

    }

  };

  if(loading){

    return(

      <DashboardLayout>

        <p className="text-gray-400">
          Loading settings...
        </p>

      </DashboardLayout>

    )

  }

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Settings
      </h1>

      {success && (
        <p className="text-green-400 mb-4">
          {success}
        </p>
      )}

      {error && (
        <p className="text-red-400 mb-4">
          {error}
        </p>
      )}

      <div className="space-y-6 max-w-lg">

        {/* Dark Mode */}

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
            onClick={()=>toggleSetting("darkMode")}
            disabled={saving}
            className={`px-4 py-1 rounded ${
              settings.darkMode
              ? "bg-blue-500"
              : "bg-gray-600"
            }`}
          >

            {settings.darkMode ? "ON" : "OFF"}

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
            onClick={()=>toggleSetting("notifications")}
            disabled={saving}
            className={`px-4 py-1 rounded ${
              settings.notifications
              ? "bg-green-500"
              : "bg-gray-600"
            }`}
          >

            {settings.notifications ? "Enabled" : "Disabled"}

          </button>

        </div>

        {/* API Integrations */}

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