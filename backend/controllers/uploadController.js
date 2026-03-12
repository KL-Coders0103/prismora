const parseCSV = require("../utils/csvParser");
const Sales = require("../models/Sales");

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

    await Sales.insertMany(formattedData);

    res.json({
      message: "Dataset uploaded successfully",
      records: formattedData.length
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};