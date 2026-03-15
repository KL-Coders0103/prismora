const parseCSV = require("../utils/csvParser");
const Sales = require("../models/Sales");
const { logActivity } = require("../services/activityService");

exports.uploadCSV = async (req, res) => {

  try {

    const filePath = req.file.path;

    const data = await parseCSV(filePath);

    const formattedData = data.map(row => ({
      date: new Date(row.date),
      product: row.product,
      category: row.category,
      quantity: Number(row.quantity),
      revenue: Number(row.revenue),
      region: row.region
    }));

    const batchSize = 1000;

    for (let i = 0; i < formattedData.length; i += batchSize) {

      const batch = formattedData.slice(i, i + batchSize);

      await Sales.insertMany(batch);

    }

    await logActivity("System", "Dataset uploaded");

    res.json({
      message: "Dataset uploaded successfully",
      records: formattedData.length
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};