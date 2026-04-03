const Sales = require("../models/Sales");

exports.generateInsights = async () => {
  const insights = [];

  try {
    const [revenueByRegion, categorySales, topProduct, monthlyRevenue] =
      await Promise.all([
        Sales.aggregate([
          { $group: { _id: "$region", revenue: { $sum: "$revenue" } } }
        ]),

        Sales.aggregate([
          { $group: { _id: "$category", sales: { $sum: "$quantity" } } }
        ]),

        Sales.aggregate([
          { $group: { _id: "$product", sales: { $sum: "$quantity" } } },
          { $sort: { sales: -1 } },
          { $limit: 1 }
        ]),

        Sales.aggregate([
          {
            $group: {
              _id: { year: { $year: "$date" }, month: { $month: "$date" } },
              revenue: { $sum: "$revenue" }
            }
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } }
        ])
      ]);

    // ✅ HIGH REVENUE REGION
    revenueByRegion.forEach((region, i) => {
      if (region.revenue > 100000) {
        insights.push({
          id: `region-${i}`, // 🔥 UNIQUE KEY
          title: "High Revenue Region",
          description: `${region._id || "Unknown"} region is performing strongly.`,
          confidence: 85
        });
      }
    });

    // ✅ UNDERPERFORMING CATEGORY (FIXED DUPLICATE)
    categorySales.forEach((cat, i) => {
      if (cat.sales < 50) {
        insights.push({
          id: `category-${i}`,
          title: `Low Sales: ${cat._id || "Unknown"}`, // 🔥 FIX
          description: `Category '${cat._id || "Unknown"}' is underperforming.`,
          confidence: 78
        });
      }
    });

    // ✅ TOP PRODUCT
    if (topProduct.length > 0) {
      insights.push({
        id: "top-product",
        title: "Top Product",
        description: `${topProduct[0]._id} is leading in sales.`,
        confidence: 90
      });
    }

    // ✅ TREND
    if (monthlyRevenue.length >= 2) {
      const last = monthlyRevenue.at(-1);
      const prev = monthlyRevenue.at(-2);

      if (last.revenue > prev.revenue) {
        insights.push({
          id: "growth",
          title: "Revenue Growth",
          description: "Revenue is increasing month-over-month.",
          confidence: 88
        });
      } else {
        insights.push({
          id: "decline",
          title: "Revenue Drop",
          description: "Revenue declined compared to last month.",
          confidence: 82
        });
      }
    }

    return insights;

  } catch (error) {
    console.error("[AI Insight Error]:", error.message);
    return [];
  }
};