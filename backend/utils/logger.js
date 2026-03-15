// backend/utils/logger.js

exports.logInfo = (message) => {

  console.log(
    `[INFO] ${new Date().toISOString()} - ${message}`
  );

};

exports.logError = (error) => {

  console.error(
    `[ERROR] ${new Date().toISOString()} - ${error}`
  );

};