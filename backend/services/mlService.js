const axios = require("axios");

// 🔥 FORCE CORRECT BASE URL
const ML_API = process.env.ML_API_URL || "http://localhost:5001/api";

const mlClient = axios.create({
  baseURL: ML_API, // MUST include /api
  timeout: 2000,
  headers: {
    "Content-Type": "application/json"
  }
});

// ✅ FIXED PATHS (NO CHANGE NEEDED HERE)
exports.forecastSales = async (days = 30) => {
  try {
    const res = await mlClient.post("/forecast-sales", { days });
    return res.data;
  } catch (error) {
    console.error("[ML Service] Forecast error:", error.response?.data || error.message);
    return null;
  }
};

exports.detectAnomaly = async (data) => {
  try {
    const res = await mlClient.post("/detect-anomaly", data);
    return res.data;
  } catch (error) {
    console.error("[ML Service] Anomaly error:", error.response?.data || error.message);
    return null;
  }
};

exports.predictChurn = async (data) => {
  try {
    const res = await mlClient.post("/predict-churn", data);
    return res.data;
  } catch (error) {
    console.error("[ML Service] Churn error:", error.response?.data || error.message);
    return null;
  }
};

exports.recommendProducts = async (product) => {
  try {
    const res = await mlClient.post("/recommend-products", { product });
    return res.data;
  } catch (error) {
    console.error("[ML Service] Recommendation error:", error.response?.data || error.message);
    return null;
  }
};