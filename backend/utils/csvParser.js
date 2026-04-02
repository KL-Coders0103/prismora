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

          // Validate Date
          const date = new Date(row.date);
          if (isNaN(date.getTime())) return;

          // Sanitize numeric fields (strip commas, currency symbols, spaces)
          // E.g., "$1,200.50" -> "1200.50"
          const cleanQuantity = String(row.quantity || "").replace(/[^0-9.-]+/g, "");
          const cleanRevenue = String(row.revenue || "").replace(/[^0-9.-]+/g, "");

          const quantity = Number(cleanQuantity);
          const revenue = Number(cleanRevenue);

          const cleanedRow = {
            date: date,
            product: row.product?.trim(),
            category: row.category?.trim(),
            quantity: quantity,
            revenue: revenue,
            region: row.region?.trim()
          };

          // Strict Validation: Skip row if essential data is missing or NaN
          if (
            !cleanedRow.product ||
            !cleanedRow.category ||
            !cleanedRow.region ||
            isNaN(cleanedRow.quantity) ||
            isNaN(cleanedRow.revenue)
          ) {
            return; // Skip invalid row silently
          }

          results.push(cleanedRow);

        } catch (err) {
          // Log row error but don't crash the stream
          console.warn("Skipped invalid CSV row due to parsing error.");
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