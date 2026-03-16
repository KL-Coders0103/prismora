const Sales = require("../models/Sales");

exports.generateInsights = async () => {

  const insights = [];

  try {

    // ===============================
    // HIGH REVENUE REGION
    // ===============================

    const revenueByRegion = await Sales.aggregate([
      {
        $group: {
          _id: "$region",
          revenue: { $sum: "$revenue" }
        }
      }
    ]);

    revenueByRegion.forEach(region => {

      if (region.revenue > 100000) {

        insights.push({
          title: "High Revenue Region",
          description: `${region._id} region generated strong revenue performance`,
          type: "trend",
          confidence: 85
        });

      }

    });


    // ===============================
    // LOW PERFORMING CATEGORY
    // ===============================

    const categorySales = await Sales.aggregate([
      {
        $group: {
          _id: "$category",
          sales: { $sum: "$quantity" }
        }
      }
    ]);

    categorySales.forEach(cat => {

      if (cat.sales < 50) {

        insights.push({
          title: "Low Performing Category",
          description: `${cat._id} category sales are very low`,
          type: "recommendation",
          confidence: 78
        });

      }

    });


    // ===============================
    // TOP PRODUCT
    // ===============================

    const topProduct = await Sales.aggregate([
      {
        $group: {
          _id: "$product",
          sales: { $sum: "$quantity" }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 1 }
    ]);

    if (topProduct.length > 0) {

      insights.push({
        title: "Top Selling Product",
        description: `Product ${topProduct[0]._id} has the highest sales`,
        type: "trend",
        confidence: 90
      });

    }


    // ===============================
    // MONTHLY REVENUE TREND
    // ===============================

    const monthlyRevenue = await Sales.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          revenue: { $sum: "$revenue" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    if (monthlyRevenue.length >= 2) {

      const lastMonth = monthlyRevenue[monthlyRevenue.length - 1];
      const prevMonth = monthlyRevenue[monthlyRevenue.length - 2];

      if (lastMonth.revenue > prevMonth.revenue) {

        insights.push({
          title: "Revenue Growth Detected",
          description: "Revenue increased compared to the previous month",
          type: "trend",
          confidence: 88
        });

      } else {

        insights.push({
          title: "Revenue Drop Detected",
          description: "Revenue decreased compared to the previous month",
          type: "anomaly",
          confidence: 82
        });

      }

    }


    // ===============================
    // HIGH DEMAND CATEGORY
    // ===============================

    const topCategory = await Sales.aggregate([
      {
        $group: {
          _id: "$category",
          quantity: { $sum: "$quantity" }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 1 }
    ]);

    if (topCategory.length > 0) {

      insights.push({
        title: "High Demand Category",
        description: `${topCategory[0]._id} category has the highest demand`,
        type: "trend",
        confidence: 87
      });

    }


    return insights;

  } catch (error) {

    console.error("AI Insight Error:", error.message);

    return [];

  }

};