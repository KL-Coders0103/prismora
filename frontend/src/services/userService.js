import API from "./api";

export const getUsers = async () => {

  const res = await API.get("/auth/users");

  return res.data;

};

export const deleteUserById = async (id) => {

  const res = await API.delete(`/auth/users/${id}`);

  return res.data;

};