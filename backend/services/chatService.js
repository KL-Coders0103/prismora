const Sales = require("../models/Sales");

// Use built-in standard formatter for cleaner strings
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
};

exports.processQuery = async (query) => {
  try {
    const safeQuery = query.toLowerCase();

    // =========================
    // TOP SELLING PRODUCT
    // =========================
    if (
      safeQuery.includes("top product") ||
      safeQuery.includes("best product") ||
      safeQuery.includes("highest selling product")
    ) {
      const result = await Sales.aggregate([
        { $group: { _id: "$product", total: { $sum: "$quantity" } } },
        { $sort: { total: -1 } },
        { $limit: 1 }
      ]);

      if (!result || result.length === 0 || !result[0]._id) {
        return "I don't have enough product sales data to determine the top seller right now.";
      }
      return `Your top-selling product is **${result[0]._id}** with ${result[0].total.toLocaleString()} units sold.`;
    }

    // =========================
    // HIGHEST REVENUE REGION
    // =========================
    if (
      safeQuery.includes("region") ||
      safeQuery.includes("location") ||
      safeQuery.includes("highest region")
    ) {
      const result = await Sales.aggregate([
        { $group: { _id: "$region", total: { $sum: "$revenue" } } },
        { $sort: { total: -1 } },
        { $limit: 1 }
      ]);

      if (!result || result.length === 0 || !result[0]._id) {
        return "I cannot determine regional performance as there is no regional sales data available.";
      }
      return `The **${result[0]._id}** region is currently generating the highest revenue at ${formatCurrency(result[0].total)}.`;
    }

    // =========================
    // TOTAL REVENUE
    // =========================
    if (
      safeQuery.includes("total revenue") ||
      safeQuery.includes("overall revenue") ||
      safeQuery.includes("total sales revenue")
    ) {
      const result = await Sales.aggregate([
        { $group: { _id: null, revenue: { $sum: "$revenue" } } }
      ]);

      if (!result || result.length === 0 || !result[0].revenue) {
        return "There are no recorded sales to calculate total revenue.";
      }
      return `Your total overall revenue stands at **${formatCurrency(result[0].revenue)}**.`;
    }

    // =========================
    // SALES BY CATEGORY
    // =========================
    if (safeQuery.includes("category") || safeQuery.includes("categories")) {
      const result = await Sales.aggregate([
        { $group: { _id: "$category", sales: { $sum: "$quantity" } } },
        { $sort: { sales: -1 } }
      ]);

      if (!result || result.length === 0) {
        return "No category data is currently available in the dataset.";
      }

      const summary = result.map(r => `${r._id || 'Uncategorized'} (${r.sales.toLocaleString()} units)`).join(", ");
      return `Here is the breakdown of sales by category: ${summary}.`;
    }

    // =========================
    // MONTHLY REVENUE TREND
    // =========================
    if (
      safeQuery.includes("monthly") ||
      safeQuery.includes("trend") ||
      safeQuery.includes("revenue trend")
    ) {
      const result = await Sales.aggregate([
        { $group: { _id: { $month: "$date" }, revenue: { $sum: "$revenue" } } },
        { $sort: { "_id": 1 } }
      ]);

      if (!result || result.length === 0) {
        return "There is insufficient chronological data to plot a monthly trend.";
      }

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const summary = result.map(r => `${months[(r._id || 1) - 1]}: ${formatCurrency(r.revenue)}`).join(" | ");
      return `Here is your monthly revenue trend: \n${summary}`;
    }

    // =========================
    // TOP 5 PRODUCTS
    // =========================
    if (safeQuery.includes("top products") || safeQuery.includes("top 5")) {
      const result = await Sales.aggregate([
        { $group: { _id: "$product", sales: { $sum: "$quantity" } } },
        { $sort: { sales: -1 } },
        { $limit: 5 }
      ]);

      if (!result || result.length === 0) {
        return "I don't have enough product data to list top sellers.";
      }

      const summary = result.map((r, i) => `${i + 1}. ${r._id} (${r.sales.toLocaleString()})`).join("\n");
      return `Here are your top 5 performing products:\n${summary}`;
    }

    // =========================
    // DEFAULT FALLBACK
    // =========================
    return "I couldn't quite understand that. Try asking about total revenue, top products, best-performing regions, or sales trends.";

  } catch (error) {
    console.error("[Chat AI Service Error]:", error.message);
    return "I encountered an error trying to search the database. Please try again.";
  }
};