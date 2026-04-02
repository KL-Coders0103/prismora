exports.cleanSalesData = (rows) => {
  return rows.reduce((acc, row) => {
    if (!row) return acc;

    // Strict Date Validation: Do not fake dates with new Date() if missing
    const date = new Date(row.date);
    if (isNaN(date.getTime())) return acc;

    // Sanitize numeric fields (strip currency symbols and commas)
    const cleanQty = String(row.quantity || "").replace(/[^0-9.-]+/g, "");
    const cleanRev = String(row.revenue || "").replace(/[^0-9.-]+/g, "");
    
    const quantity = Number(cleanQty);
    const revenue = Number(cleanRev);

    // Drop row if essential data is missing or NaN
    if (
      !row.product ||
      !row.category ||
      !row.region ||
      isNaN(quantity) ||
      isNaN(revenue)
    ) {
      return acc;
    }

    acc.push({
      date,
      product: row.product.trim(),
      category: row.category.trim(),
      quantity,
      revenue,
      region: row.region.trim()
    });

    return acc;
  }, []);
};