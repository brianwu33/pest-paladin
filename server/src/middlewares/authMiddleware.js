const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const authMiddleware = (req, res, next) => {
  try {
    let token = req.cookies?.jwt_token; // Get JWT from cookies (Web)
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1]; // Get JWT from headers (Mobile)
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Clerk Authentication Middleware
    ClerkExpressRequireAuth()(req, res, () => {
      next(); // Proceed if authentication is successful
    });

  } catch (error) {
    console.error("🔴 Authentication Error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Export middleware for use in server.js
module.exports = authMiddleware;
