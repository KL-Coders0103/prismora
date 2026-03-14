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

exports.monthlyRevenue = async (req, res) => {

  try {

    const result = await Sales.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          totalRevenue: { $sum: "$revenue" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(result);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.topProducts = async (req, res) => {

  try {

    const result = await Sales.aggregate([
      {
        $group: {
          _id: "$product",
          totalSales: { $sum: "$quantity" }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }
    ]);

    res.json(result);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.productPerformance = async (req, res) => {

  try {

    const result = await Sales.aggregate([
      {
        $group: {
          _id: "$product",
          revenue: { $sum: "$revenue" }
        }
      }
    ]);

    res.json(result);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.customerByRegion = async (req, res) => {

  try {

    const result = await Sales.aggregate([
      {
        $group: {
          _id: "$region",
          customers: { $sum: 1 }
        }
      }
    ]);

    res.json(result);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.customerRevenue = async (req, res) => {

  try {

    const result = await Sales.aggregate([
      {
        $group: {
          _id: "$region",
          revenue: { $sum: "$revenue" }
        }
      }
    ]);

    res.json(result);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
