const Sales = require("../models/Sales");

exports.processQuery = async (query) => {

  try {

    query = query.toLowerCase();

    // TOP SELLING PRODUCT
    if (query.includes("top") && query.includes("product")) {

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

      return `Top selling product is ${result[0]._id} with ${result[0].total} units sold.`;
    }


    // HIGHEST REVENUE REGION
    if (query.includes("region") || query.includes("location")) {

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

      return `Highest revenue region is ${result[0]._id}.`;
    }


    // TOTAL REVENUE
    if (query.includes("total revenue") || query.includes("overall revenue")) {

      const result = await Sales.aggregate([
        {
          $group: {
            _id: null,
            revenue: { $sum: "$revenue" }
          }
        }
      ]);

      return `Total revenue is ${result[0].revenue}.`;
    }


    // SALES BY CATEGORY
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


    // MONTHLY REVENUE TREND
    if (query.includes("monthly") || query.includes("trend")) {

      const result = await Sales.aggregate([
        {
          $group: {
            _id: { $month: "$date" },
            revenue: { $sum: "$revenue" }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const summary = result
        .map(r => `Month ${r._id}: ${r.revenue}`)
        .join(", ");

      return `Monthly revenue trend → ${summary}`;
    }


    // TOP 5 PRODUCTS
    if (query.includes("top") && query.includes("products")) {

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


    return "I couldn't understand the query. Try asking about revenue, products, or sales trends.";

  } catch (error) {

    console.error("Chat AI Error:", error.message);

    return "Error processing your request.";

  }

};