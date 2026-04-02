import API from "./api";

/**
 * High-level Dashboard KPI data
 */
export const getDashboardSummary = async () => {
  const res = await API.get("/analytics/dashboard");
  return res.data;
};

/**
 * Sales break-down by Product Category
 */
export const getSalesByCategory = async () => {
  const res = await API.get("/analytics/sales/category");
  return res.data;
};

/**
 * Revenue break-down by Geographic Region
 */
export const getSalesByRegion = async () => {
  const res = await API.get("/analytics/sales/region");
  return res.data;
};

/**
 * Product-specific performance metrics
 */
export const getProductPerformance = async () => {
  const res = await API.get("/analytics/products/performance");
  return res.data;
};

export const getTopProducts = async () => {
  const res = await API.get("/analytics/products/top");
  return res.data;
};

/**
 * Customer distribution and demographic revenue
 */
export const getCustomerByRegion = async () => {
  const res = await API.get("/analytics/customers/region");
  return res.data;
};

export const getCustomerRevenue = async () => {
  const res = await API.get("/analytics/customers/revenue");
  return res.data;
};

/**
 * Historical Revenue Trend (Chronological)
 */
export const getMonthlyRevenue = async () => {
  const res = await API.get("/analytics/revenue/monthly");
  return res.data;
};