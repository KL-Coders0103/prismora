const Sales = require("../models/Sales");

// =========================
// FORMAT CURRENCY
// =========================
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);
};

// =========================
// SMART INTENT DETECTION
// =========================
const detectIntent = (query) => {
  const q = query.toLowerCase();

  if (/top|best|highest.*product|selling/i.test(q)) return "top_product";
  if (/region|area|location/i.test(q) && /top|highest|best/i.test(q)) return "top_region";
  if (/total revenue|overall revenue|earnings/i.test(q)) return "total_revenue";
  if (/category|categories/i.test(q)) return "category";
  if (/trend|growth|monthly|performance/i.test(q)) return "trend";

  return "unknown";
};

// =========================
// SMART FALLBACK
// =========================
const smartFallback = () => {
  return `🤖 I didn’t fully understand that.

But I can help you with:

• 📊 Sales & revenue analysis  
• 🏆 Top products  
• 🌍 Regional performance  
• 📈 Trends & growth  
• 🔮 Forecasting  

👉 Try asking:
• "What is total revenue?"
• "Top selling product"
• "Show sales trend"
• "Which region performs best?"`;
};

// =========================
// MAIN PROCESS FUNCTION
// =========================
exports.processQuery = async (query) => {
  try {
    const intent = detectIntent(query);

    // =========================
    // 🏆 TOP PRODUCT
    // =========================
    if (intent === "top_product") {
      const result = await Sales.aggregate([
        { $group: { _id: "$product", total: { $sum: "$quantity" } } },
        { $sort: { total: -1 } },
        { $limit: 1 }
      ]);

      if (!result.length) {
        return "⚠️ No product data available.";
      }

      return `🏆 Top Performing Product

• Product: ${result[0]._id}
• Units Sold: ${result[0].total}

This product is currently leading your sales 🚀`;
    }

    // =========================
    // 🌍 TOP REGION
    // =========================
    if (intent === "top_region") {
      const result = await Sales.aggregate([
        { $group: { _id: "$region", total: { $sum: "$revenue" } } },
        { $sort: { total: -1 } },
        { $limit: 1 }
      ]);

      if (!result.length) {
        return "⚠️ No regional data available.";
      }

      return `🌍 Highest Revenue Region

• Region: ${result[0]._id}
• Revenue: ${formatCurrency(result[0].total)}

This region is your strongest market 💪`;
    }

    // =========================
    // 💰 TOTAL REVENUE
    // =========================
    if (intent === "total_revenue") {
      const result = await Sales.aggregate([
        { $group: { _id: null, revenue: { $sum: "$revenue" } } }
      ]);

      if (!result.length) {
        return "⚠️ No revenue data available.";
      }

      return `💰 Total Revenue

${formatCurrency(result[0].revenue)}

This represents your complete business earnings 📊`;
    }

    // =========================
    // 📦 CATEGORY ANALYSIS
    // =========================
    if (intent === "category") {
      const result = await Sales.aggregate([
        { $group: { _id: "$category", sales: { $sum: "$quantity" } } },
        { $sort: { sales: -1 } }
      ]);

      if (!result.length) {
        return "⚠️ No category data available.";
      }

      const formatted = result
        .slice(0, 5)
        .map((r, i) => `${i + 1}. ${r._id || "Unknown"} → ${r.sales} units`)
        .join("\n");

      return `📦 Category Performance

${formatted}

Top categories are driving your business 📈`;
    }

    // =========================
    // 📈 TREND ANALYSIS
    // =========================
    if (intent === "trend") {
      const result = await Sales.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" }
            },
            revenue: { $sum: "$revenue" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);

      if (result.length < 2) {
        return "⚠️ Not enough data to analyze trends.";
      }

      const last = result.at(-1);
      const prev = result.at(-2);

      if (last.revenue > prev.revenue) {
        const growth = (((last.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1);

        return `📈 Positive Growth

Revenue increased by ${growth}% compared to last month.

Your business is growing 🚀`;
      } else {
        const drop = (((prev.revenue - last.revenue) / prev.revenue) * 100).toFixed(1);

        return `📉 Revenue Decline

Revenue dropped by ${drop}% compared to last month.

Consider optimizing weak areas ⚠️`;
      }
    }

    // =========================
    // 🤖 FALLBACK
    // =========================
    return smartFallback();

  } catch (error) {
    console.error("[Chat Service Error]:", error.message);
    return "⚠️ Something went wrong while processing your query.";
  }
};