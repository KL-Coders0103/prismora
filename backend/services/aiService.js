const Sales = require("../models/Sales");

exports.generateInsights = async () => {
  const insights = [];

  try {
    // Execute all independent database queries concurrently for massive performance gain
    const [revenueByRegion, categorySales, topProduct, monthlyRevenue] = await Promise.all([
      // 1. HIGH REVENUE REGION
      Sales.aggregate([{ $group: { _id: "$region", revenue: { $sum: "$revenue" } } }]),
      
      // 2. LOW PERFORMING CATEGORY
      Sales.aggregate([{ $group: { _id: "$category", sales: { $sum: "$quantity" } } }]),
      
      // 3. TOP PRODUCT
      Sales.aggregate([
        { $group: { _id: "$product", sales: { $sum: "$quantity" }, revenue: { $sum: "$revenue" } } },
        { $sort: { sales: -1 } },
        { $limit: 1 }
      ]),
      
      // 4. MONTHLY REVENUE TREND (Fixed to include Year to prevent data merging)
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

    // --- Process Results ---

    revenueByRegion.forEach(region => {
      if (region.revenue > 100000) {
        insights.push({
          title: "High Revenue Region Detected",
          description: `The ${region._id} region is showing exceptionally strong revenue performance.`,
          type: "trend",
          confidence: 85
        });
      }
    });

    categorySales.forEach(cat => {
      if (cat.sales < 50) {
        insights.push({
          title: "Underperforming Category",
          description: `Sales for the '${cat._id}' category are critically low. Consider a targeted marketing campaign.`,
          type: "recommendation",
          confidence: 78
        });
      }
    });

    if (topProduct.length > 0) {
      insights.push({
        title: "Top Selling Product",
        description: `The '${topProduct[0]._id}' is currently your highest selling product by volume.`,
        type: "trend",
        confidence: 90
      });
    }

    // Trend Analysis (Requires at least 2 months of data)
    if (monthlyRevenue.length >= 2) {
      const lastMonth = monthlyRevenue[monthlyRevenue.length - 1];
      const prevMonth = monthlyRevenue[monthlyRevenue.length - 2];

      if (lastMonth.revenue > prevMonth.revenue) {
        const growth = (((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1);
        insights.push({
          title: "Positive Revenue Growth",
          description: `Revenue increased by ${growth}% compared to the previous month.`,
          type: "trend",
          confidence: 88
        });
      } else {
        const drop = (((prevMonth.revenue - lastMonth.revenue) / prevMonth.revenue) * 100).toFixed(1);
        insights.push({
          title: "Revenue Contraction",
          description: `Revenue decreased by ${drop}% compared to the previous month. Monitor closely.`,
          type: "anomaly",
          confidence: 82
        });
      }
    }

    return insights;

  } catch (error) {
    console.error("[AI Insight Engine Error]:", error.message);
    return [];
  }
};