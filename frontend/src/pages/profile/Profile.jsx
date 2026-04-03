import React, { useEffect, useState } from "react";
import { User, Mail, Shield, Save, Camera, Key, Trash2, AlertOctagon, X, Eye, EyeOff, Lock } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import API from "../../services/api";

const Profile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Password Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const res = await API.get("/profile");
        if (!isMounted) return;
        const safeUser = typeof res.data === "object" && res.data !== null ? res.data : {};
        setUser(safeUser);
        setName(safeUser.name || "");
      } catch  {
        if (isMounted) toast.error("Failed to load profile.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProfile();
    return () => { isMounted = false; };
  }, []);

  const handleUpdateProfile = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return toast.error("Name cannot be empty.");
    if (updating) return;

    setUpdating(true);
    try {
      const res = await API.put("/profile", { name: trimmedName });
      setUser((prev) => ({ ...prev, ...res.data }));
      setName(res.data?.name || trimmedName);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  // 🔥 HANDLE PASSWORD CHANGE API CALL
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match!");
    }
    if (passwords.new.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setUpdatingPass(true);
    try {
      await API.put("/profile/password", {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      
      toast.success("Password updated securely!");
      setShowPasswordModal(false);
      setPasswords({ current: "", new: "", confirm: "" }); // Reset form
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    } finally {
      setUpdatingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 max-w-3xl">
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Avatar & Role */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm">
            <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                {(user?.name?.charAt(0) || "U").toUpperCase()}
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name || "Unknown User"}</h2>
            <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Shield size={14} /> {user?.role || "user"}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* General Info Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email Address (Read-only)</label>
                <div className="relative opacity-70 cursor-not-allowed">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input value={user?.email || "-"} disabled className="w-full pl-10 p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 outline-none" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 px-6 flex justify-end">
              <button onClick={handleUpdateProfile} disabled={updating} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
                {updating ? "Saving..." : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Password & Authentication</h3>
            {/* 🔥 OPEN MODAL BUTTON */}
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition"
            >
              <Key size={16} /> Change Password
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 PASSWORD CHANGE MODAL */}
      <AnimatePresence>
        {showPasswordModal && (
          <>
            {/* Backdrop */}
            <Motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            {/* Modal */}
            <Motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-[101] overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <Lock className="text-indigo-500" size={20} /> Update Password
                </h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={20}/></button>
              </div>

              <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                {/* Inputs */}
                {["current", "new", "confirm"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1.5 capitalize text-gray-700 dark:text-gray-300">
                      {field} Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        required
                        value={passwords[field]}
                        onChange={(e) => setPasswords({...passwords, [field]: e.target.value})}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white pr-10"
                        placeholder={`Enter ${field} password`}
                      />
                      {/* Show/Hide Button */}
                      {field === "current" && (
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400">
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button 
                  type="submit" 
                  disabled={updatingPass}
                  className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                  {updatingPass ? "Updating..." : "Update Securely"}
                </button>
              </form>
            </Motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Profile;