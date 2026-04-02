import API from "./api";

// AI Insights
export const getInsights = async () => {
  const res = await API.get("/insights");
  return res.data;
};