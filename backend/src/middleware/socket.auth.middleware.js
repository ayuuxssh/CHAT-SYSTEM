
import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cookie from "cookie";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // Extract cookies from Socket.IO handshake
    const cookies = cookie.parse(
      socket.handshake.headers.cookie || ""
    );

    const token = cookies.jwt;

    if (!token) {
      console.log("Socket rejected: JWT cookie not received");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return next(new Error("Invalid token payload"));
    }

    // Find authenticated user
    const user = await User.findById(decoded.userId)
      .select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    // Attach authenticated user
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Socket authenticated: ${user.fullName}`);

    next();

  } catch (error) {
    console.error("Socket authentication error:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};
