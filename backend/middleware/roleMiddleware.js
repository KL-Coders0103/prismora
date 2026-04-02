const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized. User context missing." });
    }

    // Admins usually have omnipotent access, but we enforce strict array checking
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied. You do not have the required permissions to perform this action." 
      });
    }

    next();
  };
};

module.exports = roleMiddleware;