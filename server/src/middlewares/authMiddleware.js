const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const authMiddleware = (req, res, next) => {
  try {
    // Extract JWT from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // console.log("🔹 Extracted JWT Token:", authHeader.split(" ")[1]);

    // Clerk Authentication Middleware (Validates JWT Automatically)
    ClerkExpressRequireAuth()(req, res, next);
  } catch (error) {
    console.error("🔴 Authentication Error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Export middleware for use in server.js
module.exports = authMiddleware;
