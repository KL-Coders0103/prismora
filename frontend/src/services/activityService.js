import API from "./api";

// Audit Logs
export const getActivityLogs = async () => {
  const res = await API.get("/activity");
  return res.data;
};