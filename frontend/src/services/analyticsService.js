import API from "./api";

export const getDashboardSummary = async () => {

  const res = await API.get("/analytics/dashboard");

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