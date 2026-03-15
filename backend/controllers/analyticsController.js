const Sales = require("../models/Sales");

exports.dashboardSummary = async (req, res) => {

  try {

    const revenue = await Sales.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$revenue" } } }
    ]);

    const sales = await Sales.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$quantity" } } }
    ]);

    const customers = await Sales.aggregate([
      { $group: { _id: "$region" } },
      { $count: "totalCustomers" }
    ]);

    res.json({
      revenue: revenue[0]?.totalRevenue || 0,
      sales: sales[0]?.totalSales || 0,
      customers: customers[0]?.totalCustomers || 0
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

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
          revenue: { $sum: "$revenue" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(result);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};