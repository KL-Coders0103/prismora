import API from "./api";

// DASHBOARD
export const getDashboardSummary = async () => {
  const res = await API.get("/analytics/dashboard");
  return res.data;
};

// SALES ANALYTICS
export const getSalesByCategory = async () => {
  const res = await API.get("/analytics/sales/category");
  return res.data;
};

export const getSalesByRegion = async () => {
  const res = await API.get("/analytics/sales/region");
  return res.data;
};

// PRODUCT ANALYTICS
export const getProductPerformance = async () => {
  const res = await API.get("/analytics/products/performance");
  return res.data;
};

export const getTopProducts = async () => {
  const res = await API.get("/analytics/products/top");
  return res.data;
};

// CUSTOMER ANALYTICS
export const getCustomerByRegion = async () => {
  const res = await API.get("/analytics/customers/region");
  return res.data;
};

export const getCustomerRevenue = async () => {
  const res = await API.get("/analytics/customers/revenue");
  return res.data;
};

// REVENUE
export const getMonthlyRevenue = async () => {
  const res = await API.get("/analytics/revenue/monthly");
  return res.data;
};