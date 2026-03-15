// backend/utils/dataCleaner.js

exports.cleanSalesData = (rows) => {

  const cleaned = rows
    .filter(row => {

      return (
        row.product &&
        row.category &&
        row.region &&
        !isNaN(row.quantity) &&
        !isNaN(row.revenue)
      );

    })
    .map(row => ({

      date: row.date ? new Date(row.date) : new Date(),

      product: row.product.trim(),

      category: row.category.trim(),

      quantity: Number(row.quantity),

      revenue: Number(row.revenue),

      region: row.region.trim()

    }));

  return cleaned;

};