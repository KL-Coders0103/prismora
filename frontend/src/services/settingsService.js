import API from "./api";

export const getSettings = async () => {

  const res = await API.get("/settings");

  return res.data;

};

export const updateSettings = async (settings) => {

  const res = await API.put("/settings",settings);

  return res.data;

};