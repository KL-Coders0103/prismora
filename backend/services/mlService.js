const axios = require("axios");

// Fallback to localhost if env var is missing
const ML_API = process.env.ML_API_URL || "http://localhost:5001";

// Create an Axios instance with a strict timeout so Node doesn't hang
const mlClient = axios.create({
  baseURL: ML_API,
  timeout: 5000, // 5 seconds max wait for Python
  headers: {
    "Content-Type": "application/json"
  }
});

exports.forecastSales = async (days = 30) => {
  try {
    const res = await mlClient.post("/forecast-sales", { days });
    return res.data;
  } catch (error) {
    console.error("[ML Service] Forecast error:", error.message);
    return null;
  }
};

exports.detectAnomaly = async (data) => {
  try {
    const res = await mlClient.post("/detect-anomaly", data);
    return res.data;
  } catch (error) {
    console.error("[ML Service] Anomaly error:", error.message);
    return null;
  }
};

exports.predictChurn = async (data) => {
  try {
    const res = await mlClient.post("/predict-churn", data);
    return res.data;
  } catch (error) {
    console.error("[ML Service] Churn error:", error.message);
    return null;
  }
};

exports.recommendProducts = async (product) => {
  try {
    const res = await mlClient.post("/recommend-products", { product });
    return res.data;
  } catch (error) {
    console.error("[ML Service] Recommendation error:", error.message);
    return null;
  }
};