import API from "./api";

// Settings & Preferences
export const getSettings = async () => {
  // If your backend doesn't have a settings table yet, 
  // this can fallback to localStorage
  const res = await API.get("/settings");
  return res.data;
};

export const updateSettings = async (settings) => {
  const res = await API.put("/settings", settings);
  return res.data;
};