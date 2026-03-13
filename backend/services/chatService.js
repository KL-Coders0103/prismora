const Sales = require("../models/Sales");

exports.processQuery = async (query) => {

  query = query.toLowerCase();

  // Top selling product
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

    return `Top selling product is ${result[0]._id}`;
  }

  // Highest revenue region
  if (query.includes("region")) {

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

    return `Highest revenue region is ${result[0]._id}`;
  }

  return "Sorry, I couldn't understand the query.";
};