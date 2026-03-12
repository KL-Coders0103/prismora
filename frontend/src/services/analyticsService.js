import API from "./api";

export const getTotalRevenue = async () => {
  const res = await API.get("/analytics/revenue");
  return res.data;
};

export const getSalesByCategory = async () => {
  const res = await API.get("/analytics/category");
  return res.data;
};

export const getSalesByRegion = async () => {
  const res = await API.get("/analytics/region");
  return res.data;
};