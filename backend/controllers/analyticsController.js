const Sales = require("../models/Sales");
const AnalyticsSummary = require("../models/AnalyticsSummary");


exports.dashboardSummary = async (req, res) => {

  try {

    const summary = await AnalyticsSummary.findOne();

    if (!summary) {
      return res.json({
        revenue: 0,
        sales: 0,
        customers: 0,
        conversionRate: 0
      });
    }

    const conversionRate =
      summary.customers > 0
        ? ((summary.totalSales / summary.customers) * 100).toFixed(2)
        : 0;

    res.json({
      revenue: summary.totalRevenue,
      sales: summary.totalSales,
      customers: summary.customers,
      conversionRate
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

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
      },
      { $sort: { totalSales: -1 } }
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


exports.productPerformance = async (req, res) => {

  try {

    const result = await Sales.aggregate([
      {
        $group: {
          _id: "$product",
          revenue: { $sum: "$revenue" }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 20 }
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