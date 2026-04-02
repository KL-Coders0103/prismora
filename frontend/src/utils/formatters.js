/**
 * Formats a numeric value into a localized currency string.
 * Standardized for PRISMORA Business Analytics (INR).
 * * @param {number|string} value - The amount to format
 * @param {boolean} compact - If true, formats as 10K, 1.2M etc.
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, compact = false) => {
  // Null safety: Return placeholder if value is missing
  if (value === null || value === undefined || isNaN(value)) {
    return "₹0";
  }

  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: compact ? 1 : 0,
    ...(compact && { notation: "compact", compactDisplay: "short" }),
  }).format(numericValue);
};

/**
 * Standard number formatter for non-currency metrics (units, counts)
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0";
  return new Intl.NumberFormat("en-IN").format(value);
};