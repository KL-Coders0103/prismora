const Sales = require("../models/Sales");


const formatCurrency = (value) => {

  return `₹${Number(value).toLocaleString("en-IN")}`;

};


exports.processQuery = async (query) => {

  try {

    query = query.toLowerCase();


    // =========================
    // TOP SELLING PRODUCT
    // =========================

    if (
      query.includes("top product") ||
      query.includes("best product") ||
      query.includes("highest selling product")
    ) {

      const result = await Sales.aggregate([
        {
          $group: {
            _id: "$product",
            total: { $sum: "$quantity" }
          }
        },
        { $sort: { total: -1 } },
        { $limit: 1 }
      ]);

      if (result.length === 0) {
        return "No product data available.";
      }

      return `Top selling product sold ${result[0].total} units.`;

    }


    // =========================
    // HIGHEST REVENUE REGION
    // =========================

    if (
      query.includes("region") ||
      query.includes("location") ||
      query.includes("highest region")
    ) {

      const result = await Sales.aggregate([
        {
          $group: {
            _id: "$region",
            total: { $sum: "$revenue" }
          }
        },
        { $sort: { total: -1 } },
        { $limit: 1 }
      ]);

      if (result.length === 0) {
        return "No regional sales data available.";
      }

      return `Highest revenue region is ${result[0]._id} with ${formatCurrency(result[0].total)} revenue.`;

    }


    // =========================
    // TOTAL REVENUE
    // =========================

    if (
      query.includes("total revenue") ||
      query.includes("overall revenue") ||
      query.includes("total sales revenue")
    ) {

      const result = await Sales.aggregate([
        {
          $group: {
            _id: null,
            revenue: { $sum: "$revenue" }
          }
        }
      ]);

      return `Total revenue is ${formatCurrency(result[0].revenue)}.`;

    }


    // =========================
    // SALES BY CATEGORY
    // =========================

    if (query.includes("category")) {

      const result = await Sales.aggregate([
        {
          $group: {
            _id: "$category",
            sales: { $sum: "$quantity" }
          }
        }
      ]);

      const summary = result
        .map(r => `${r._id}: ${r.sales}`)
        .join(", ");

      return `Sales by category → ${summary}`;

    }


    // =========================
    // MONTHLY REVENUE TREND
    // =========================

    if (
      query.includes("monthly") ||
      query.includes("trend") ||
      query.includes("revenue trend")
    ) {

      const result = await Sales.aggregate([
        {
          $group: {
            _id: { $month: "$date" },
            revenue: { $sum: "$revenue" }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      const summary = result
        .map(r => `Month ${r._id}: ${formatCurrency(r.revenue)}`)
        .join(", ");

      return `Monthly revenue trend → ${summary}`;

    }


    // =========================
    // TOP 5 PRODUCTS
    // =========================

    if (query.includes("top products")) {

      const result = await Sales.aggregate([
        {
          $group: {
            _id: "$product",
            sales: { $sum: "$quantity" }
          }
        },
        { $sort: { sales: -1 } },
        { $limit: 5 }
      ]);

      const summary = result
        .map(r => `${r._id} (${r.sales})`)
        .join(", ");

      return `Top products are: ${summary}`;

    }


    return "I couldn't understand the query. Try asking about revenue, products, regions, or sales trends.";

  } catch (error) {

    console.error("Chat AI Error:", error.message);

    return "Error processing your request.";

  }

};