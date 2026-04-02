const validateMiddleware = (requiredFields) => {
  return (req, res, next) => {
    // Check for null or undefined instead of !value to allow falsy values like 0 or false
    const missingFields = requiredFields.filter((field) => 
      req.body[field] === undefined || req.body[field] === null || req.body[field] === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields.",
        fields: missingFields
      });
    }

    next();
  };
};

module.exports = validateMiddleware;