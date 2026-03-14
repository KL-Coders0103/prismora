const Sales = require("../models/Sales");
const { sendAlert } = require("../sockets/realtimeSocket");
const {createAlert} = require("./alertService");

exports.generateInsights = async () => {

  const insights = [];

  const revenue = await Sales.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$revenue" }
      }
    }
  ]);

  if (revenue.length && revenue[0].total > 20000) {
    const msg = "Revenue spike detected";
    insights.push(msg);
    await createAlert(msg, "warning");
  }

  if (revenue.length && revenue[0].total < 5000) {

  const msg = "Sales dropped significantly ⚠️";

  insights.push(msg);

  await createAlert(msg, "danger");

}

  const topCategory = await Sales.aggregate([
    {
      $group: {
        _id: "$category",
        total: { $sum: "$quantity" }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 1 }
  ]);

  if (topCategory.length) {
    insights.push(`Top performing category is ${topCategory[0]._id}.`);
  }

  const topRegion = await Sales.aggregate([
    {
      $group: {
        _id: "$region",
        total: { $sum: "$revenue" }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 1 }
  ]);

  if (topRegion.length) {
    insights.push(`Highest revenue generated from ${topRegion[0]._id}.`);
  }

  return insights;

};