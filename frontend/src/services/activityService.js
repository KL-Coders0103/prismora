import API from "./api";

export const getActivityLogs = async () => {

  const res = await API.get("/activity");

  return res.data;

};