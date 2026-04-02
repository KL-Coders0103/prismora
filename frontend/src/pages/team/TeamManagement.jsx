import React, { useEffect, useState } from "react";
import { User, Trash2, ShieldAlert, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../services/api";

const TeamManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await API.get("/auth"); // Root auth gets all users for admin
        setUsers(res.data);
      } catch  {
        toast.error("Access denied. Admin permissions required.");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This action is irreversible.")) return;
    try {
      await API.delete(`/auth/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success("User removed from organization.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage user access roles and team permissions.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Full Member</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Access Level</th>
                <th className="px-6 py-4 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                [1,2,3].map(i => <tr key={i} className="animate-pulse h-16 bg-gray-50 dark:bg-gray-900/50" />)
              ) : users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-indigo-600">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      user.role === "admin" 
                        ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" 
                        : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                    }`}>
                      {user.role === "admin" ? <ShieldAlert size={12} /> : <UserCheck size={12} />} {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Remove User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;