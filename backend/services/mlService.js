const axios = require("axios");

const ML_API = "http://localhost:5001";

exports.forecastSales = async (days = 30) => {

  try {

    const res = await axios.post(`${ML_API}/forecast-sales`, {
      days
    });

    return res.data;

  } catch (error) {

    console.error("ML forecast error:", error.message);

    return null;

  }

};


exports.detectAnomaly = async (data) => {

  try {

    const res = await axios.post(`${ML_API}/detect-anomaly`, data);

    return res.data;

  } catch (error) {

    console.error("ML anomaly error:", error.message);

    return null;

  }

};


exports.predictChurn = async (data) => {

  try {

    const res = await axios.post(`${ML_API}/predict-churn`, data);

    return res.data;

  } catch (error) {

    console.error("ML churn error:", error.message);

    return null;

  }

};


exports.recommendProducts = async (product) => {

  try {

    const res = await axios.post(`${ML_API}/recommend-products`, {
      product
    });

    return res.data;

  } catch (error) {

    console.error("ML recommendation error:", error.message);

    return null;

  }

};