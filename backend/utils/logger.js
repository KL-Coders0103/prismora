// Keeping it lightweight, but standardizing the output format
const formatTimestamp = () => new Date().toISOString();

exports.logInfo = (message) => {
  console.log(`[INFO] [${formatTimestamp()}] ${message}`);
};

exports.logWarn = (message) => {
  console.warn(`[WARN] [${formatTimestamp()}] ${message}`);
};

exports.logError = (error, context = "") => {
  const errorMsg = error instanceof Error ? error.stack || error.message : error;
  console.error(`[ERROR] [${formatTimestamp()}] ${context ? `(${context}) ` : ""}${errorMsg}`);
};