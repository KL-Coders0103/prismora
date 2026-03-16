const fs = require("fs");
const csv = require("csv-parser");

const parseCSV = (filePath) => {

  return new Promise((resolve, reject) => {

    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().toLowerCase()
      }))
      .on("data", (row) => {

        try {

          if (!row) return;

          const date = new Date(row.date);

          if (isNaN(date)) return;

          const cleanedRow = {
            date,
            product: row.product?.trim(),
            category: row.category?.trim(),
            quantity: Number(row.quantity),
            revenue: Number(row.revenue),
            region: row.region?.trim()
          };

          // Skip invalid rows
          if (
            !cleanedRow.product ||
            !cleanedRow.category ||
            !cleanedRow.region ||
            isNaN(cleanedRow.quantity) ||
            isNaN(cleanedRow.revenue)
          ) {
            return;
          }

          results.push(cleanedRow);

        } catch (err) {

          console.log("Row parse error:", err);

        }

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