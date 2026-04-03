import API from "./api";

// 🔥 ADD TIMEOUT + FALLBACK
export const getInsights = async () => {
  const res = await API.get("/insights", {
    headers: {
      "Cache-Control": "no-cache"
    }
  });
  return res.data;
};