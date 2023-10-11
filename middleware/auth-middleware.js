const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key"; // Replace with your secret key

// Verify user's JWT token
exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  // Remove "Bearer" prefix if present
  const receivedToken = token.replace("Bearer ", "");

  jwt.verify(receivedToken, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token." });
    }

    res.locals.user = decoded;
    next();
  });
};

// // Verify user role
exports.isAutherized = (allowedRoles) => {
  return (_, res, next) => {
    const user = res.locals.user;

    if (allowedRoles.includes(user.role) || user.role === "superadmin") {
      next();
    } else {
      res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
  };
};
