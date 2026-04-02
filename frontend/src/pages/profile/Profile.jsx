import React, { useEffect, useState } from "react";
import { User, Mail, Shield, Save } from "lucide-react";
import { motion as Motion } from "framer-motion";
import toast from "react-hot-toast";

import API from "../../services/api";

const Profile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/profile");
        setUser(res.data);
        setName(res.data.name);
      } catch  {
        toast.error("Failed to load profile settings.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleUpdate = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty.");
    setUpdating(true);
    try {
      const res = await API.put("/profile", { name });
      setUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="animate-pulse space-y-4 max-w-md">
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
    </div>
  );

  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Personal Account</h1>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</p>
              <div className="flex items-center gap-2 mt-1 px-2 py-0.5 w-fit rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Shield size={12} /> {user.role}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500">
                <Mail size={18} />
                <span className="text-sm">{user.email}</span>
              </div>
              <p className="mt-1.5 text-xs text-gray-400">Email addresses cannot be changed currently.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 p-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 px-8 flex justify-end">
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          >
            {updating ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </div>
    </Motion.div>
  );
};

export default Profile;