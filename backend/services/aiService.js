const Sales = require("../models/Sales");

exports.generateInsights = async () => {

  const insights = [];

  try {

    // HIGH REVENUE REGION
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
          description: `${region._id} region generated high revenue`,
          type: "trend",
          confidence: 85
        });

      }

    });


    // LOW PERFORMING CATEGORY
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
          description: `${cat._id} category has low sales`,
          type: "recommendation",
          confidence: 78
        });

      }

    });


    // TOP PRODUCT
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
        description: `${topProduct[0]._id} is currently the top selling product`,
        type: "trend",
        confidence: 90
      });

    }


    // MONTHLY REVENUE TREND
    const monthlyRevenue = await Sales.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          revenue: { $sum: "$revenue" }
        }
      },
      { $sort: { _id: 1 } }
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

      }

    }


    return insights;

  } catch (error) {

    console.error("AI Insight Error:", error.message);

    return [];

  }

};