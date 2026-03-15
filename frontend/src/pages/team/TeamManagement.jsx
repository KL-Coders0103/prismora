import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

const getRoleColor = (role) => {

  if(role==="admin") return "bg-red-500";
  if(role==="analyst") return "bg-blue-500";

  return "bg-gray-500";

};

const TeamManagement = () => {

  const [users,setUsers] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    const loadUsers = async ()=>{

      try{

        const res = await API.get("/auth/users");

        setUsers(res.data);

      }catch(error){

        console.error("Users error",error);

      }finally{

        setLoading(false);

      }

    };

    loadUsers();

  },[]);

  const deleteUser = async (id)=>{

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if(!confirmDelete) return;

    await API.delete(`/auth/users/${id}`);

    setUsers(users.filter(u => u._id !== id));

  };

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Team Management
      </h1>

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

      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr className="text-left text-sm">

              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3"></th>

            </tr>

          </thead>

          <tbody>

            {users.map(user=>(

              <tr
                key={user._id}
                className="border-t border-slate-700 hover:bg-slate-800"
              >

                <td className="p-3">
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
                    onClick={()=>deleteUser(user._id)}
                    className="bg-red-500 px-3 py-1 rounded text-sm"
                  >

                    Delete

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