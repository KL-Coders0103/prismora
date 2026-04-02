const errorMiddleware = (err, req, res, next) => {
  // Only log full stack traces in development
  if (process.env.NODE_ENV !== "production") {
    console.error(`[Error] ${err.message}\n`, err.stack);
  } else {
    console.error(`[Error] ${err.message}`);
  }

  // Ensure we don't return 200 for an error
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Handle Mongoose duplicate key errors securely (don't expose exact DB structure)
  if (err.code === 11000) {
    return res.status(400).json({ message: "A record with that value already exists." });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: "Validation Error", errors: messages });
  }

  res.status(statusCode).json({
    message: err.message || "An internal server error occurred.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

module.exports = errorMiddleware;