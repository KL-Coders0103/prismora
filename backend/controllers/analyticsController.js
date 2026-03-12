const Sales = require("../models/Sales");

// TOTAL REVENUE
exports.getTotalRevenue = async (req, res) => {

  try {

    const result = await Sales.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" }
        }
      }
    ]);

    res.json(result[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


// SALES BY CATEGORY
exports.salesByCategory = async (req, res) => {

  try {

    const result = await Sales.aggregate([
      {
        $group: {
          _id: "$category",
          totalSales: { $sum: "$quantity" }
        }
      }
    ]);

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


// SALES BY REGION
exports.salesByRegion = async (req, res) => {

  try {

    const result = await Sales.aggregate([
      {
        $group: {
          _id: "$region",
          totalRevenue: { $sum: "$revenue" }
        }
      }
    ]);

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};