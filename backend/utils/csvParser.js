const fs = require("fs");
const csv = require("csv-parser");

const parseCSV = (filePath) => {

  return new Promise((resolve, reject) => {

    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {

        // Skip empty rows
        if (!row || Object.keys(row).length === 0) return;

        const cleanedRow = {
          date: row.date ? new Date(row.date) : null,
          product: row.product?.trim(),
          category: row.category?.trim(),
          quantity: Number(row.quantity) || 0,
          revenue: Number(row.revenue) || 0,
          region: row.region?.trim()
        };

        results.push(cleanedRow);

      })
      .on("end", () => {

        resolve(results);

      })
      .on("error", (error) => {

        reject(error);

      });

  });

};

module.exports = parseCSV;