import React, { useEffect, useState } from "react";
import { Trash2, ShieldAlert, UserCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const roles = ["viewer", "analyst", "admin"];

const TeamManagement = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState(null);

  // 🔒 RBAC PROTECTION
  useEffect(() => {
    if (currentUser?.role !== "admin") {
      toast.error("Unauthorized access");
    }
  }, [currentUser]);

  // 🔄 LOAD USERS
  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const res = await API.get("/auth");
        if (!isMounted) return;
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load users.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUsers();
    return () => (isMounted = false);
  }, []);

  // 🧠 ROLE CHANGE
  const handleRoleChange = async (id, newRole) => {
    if (id === currentUser?._id) {
      toast.error("You cannot change your own role.");
      return;
    }

    const prevUsers = [...users];

    setUpdatingRole(id);

    // optimistic update
    setUsers(prev =>
      prev.map(u => (u._id === id ? { ...u, role: newRole } : u))
    );

    try {
      await API.put(`/auth/role/${id}`, { role: newRole });
      toast.success("Role updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update role");
      setUsers(prevUsers); // rollback
    } finally {
      setUpdatingRole(null);
    }
  };

  // 🗑 DELETE USER
  const handleDelete = async (id) => {
    if (id === currentUser?._id) {
      toast.error("You cannot remove yourself.");
      return;
    }

    if (!window.confirm("Are you sure? This action is irreversible.")) return;

    const prevUsers = users;
    setUsers(prev => prev.filter(u => u._id !== id));

    try {
      await API.delete(`/auth/${id}`);
      toast.success("User removed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
      setUsers(prevUsers);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Organization Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage user roles and permissions
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse h-16" />
                ))
              ) : users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  
                  {/* USER */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-indigo-600">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold">{user.name}</span>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>

                  {/* ROLE */}
                  <td className="px-6 py-4">
                    {updatingRole === user._id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        disabled={user._id === currentUser?._id}
                        className="text-xs px-2 py-1 rounded-lg border dark:bg-gray-800"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>
                            {role.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={user._id === currentUser?._id}
                      className="p-2 text-gray-400 hover:text-red-600"
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