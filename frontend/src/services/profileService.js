import API from "./api";

export const getProfile = async () => {

  const res = await API.get("/profile");

  return res.data;

};

export const updateProfileName = async (name) => {

  const res = await API.put("/profile",{ name });

  return res.data;

};