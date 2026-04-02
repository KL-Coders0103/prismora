import API from "./api";

// --- ADMIN USER MANAGEMENT ---
export const getUsers = async () => {
  const res = await API.get("/auth"); // Updated to match our refactored route
  return res.data;
};

export const deleteUserById = async (id) => {
  const res = await API.delete(`/auth/${id}`); // Updated to match our refactored route
  return res.data;
};