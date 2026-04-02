const Sales = require("../models/Sales");
const AnalyticsSummary = require("../models/AnalyticsSummary");

exports.dashboardSummary = async (req, res) => {
  try {
    const summary = await AnalyticsSummary.findOne();

    if (!summary) {
      return res.status(200).json({ revenue: 0, sales: 0, customers: 0, conversionRate: 0 });
    }

    const conversionRate = summary.customers > 0 
      ? ((summary.totalSales / summary.customers) * 100).toFixed(2) 
      : 0;

    res.status(200).json({
      revenue: summary.totalRevenue,
      sales: summary.totalSales,
      customers: summary.customers,
      conversionRate
    });
  } catch (error) {
    console.error("[Dashboard Summary Error]:", error);
    res.status(500).json({ message: "Failed to fetch dashboard summary." });
  }
};

exports.salesByCategory = async (req, res) => {
  try {
    const result = await Sales.aggregate([
      { $group: { _id: "$category", totalSales: { $sum: "$quantity" } } },
      { $sort: { totalSales: -1 } }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category sales." });
  }
};

exports.salesByRegion = async (req, res) => {
  try {
    const result = await Sales.aggregate([
      { $group: { _id: "$region", totalRevenue: { $sum: "$revenue" } } }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch regional sales." });
  }
};

exports.monthlyRevenue = async (req, res) => {
  try {
    // CRITICAL FIX: Only aggregate the current year to prevent multi-year month merging
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const result = await Sales.aggregate([
      { $match: { date: { $gte: startOfYear, $lte: endOfYear } } },
      { $group: { _id: { $month: "$date" }, revenue: { $sum: "$revenue" } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch monthly revenue." });
  }
};

exports.topProducts = async (req, res) => {
  try {
    const result = await Sales.aggregate([
      { $group: { _id: "$product", totalSales: { $sum: "$quantity" } } },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top products." });
  }
};

exports.customerByRegion = async (req, res) => {
  try {
    const result = await Sales.aggregate([
      { $group: { _id: "$region", customers: { $sum: 1 } } } // Assuming 1 transaction = 1 customer for now
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customers by region." });
  }
};

exports.productPerformance = async (req, res) => {
  try {
    const result = await Sales.aggregate([
      { $group: { _id: "$product", revenue: { $sum: "$revenue" } } },
      { $sort: { revenue: -1 } },
      { $limit: 20 }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product performance." });
  }
};

exports.customerRevenue = async (req, res) => {
  try {
    const result = await Sales.aggregate([
      { $group: { _id: "$region", revenue: { $sum: "$revenue" } } }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch regional customer revenue." });
  }
};