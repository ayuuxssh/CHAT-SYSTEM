
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Extract JWT from HTTP-only cookie
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find authenticated user
    const user = await User.findById(decoded.userId)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error("ProtectRoute Error:", error.message);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Unauthorized - Invalid or expired token",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
