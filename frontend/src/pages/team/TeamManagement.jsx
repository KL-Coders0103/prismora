import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getUsers,
  deleteUserById
} from "../../services/userService";

const getRoleColor = (role) => {

  if(role==="admin") return "bg-red-500 text-white";
  if(role==="analyst") return "bg-blue-500 text-white";

  return "bg-gray-500 text-white";

};

const TeamManagement = () => {

  const [users,setUsers] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [deleting,setDeleting] = useState(null);

  useEffect(()=>{

    const loadUsers = async ()=>{

      try{

        const data = await getUsers();

        setUsers(data);

      }catch(err){

        console.error(err);

        setError("Failed to load users");

      }finally{

        setLoading(false);

      }

    };

    loadUsers();

  },[]);

  const handleDelete = async (id)=>{

    const confirmDelete = window.confirm(
      "Delete this user?"
    );

    if(!confirmDelete) return;

    setDeleting(id);

    try{

      await deleteUserById(id);

      setUsers(prev => prev.filter(u => u._id !== id));

    }catch(err){

      console.error(err);

      setError("Failed to delete user");

    }finally{

      setDeleting(null);

    }

  };

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Team Management
      </h1>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-gray-400">
          Loading users...
        </p>
      )}

      {!loading && users.length===0 && (
        <p className="text-gray-400">
          No team members found.
        </p>
      )}

      {!loading && users.length>0 && (

      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr className="text-left text-sm">

              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>

            </tr>

          </thead>

          <tbody>

            {users.map(user=>(

              <tr
                key={user._id}
                className="border-t border-slate-700 hover:bg-slate-800"
              >

                <td className="p-3 flex items-center gap-3">

                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm">

                    {user.name?.charAt(0).toUpperCase()}

                  </div>

                  {user.name}

                </td>

                <td className="p-3 text-gray-400">
                  {user.email}
                </td>

                <td className="p-3">

                  <span
                    className={`px-2 py-1 text-xs rounded ${getRoleColor(user.role)}`}
                  >
                    {user.role}
                  </span>

                </td>

                <td className="p-3">

                  <button
                    onClick={()=>handleDelete(user._id)}
                    disabled={deleting===user._id}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm disabled:opacity-50"
                  >

                    {deleting===user._id
                      ? "Deleting..."
                      : "Delete"}

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      )}

    </DashboardLayout>

  )

}

export default TeamManagement;