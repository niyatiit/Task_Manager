import jwt from "jsonwebtoken";
import { User } from "../module/User.Module.js";

// This is code of the video
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // Bearer is the part of the authorization end check that you have already logged in or not .
    // startsWith check that Bearer is the format or not . this is inbuilt function like
    if (token && token.startsWith("Bearer")) {
      // This is remove the space split function end 1 is strart with 2 index bcz array is startign 0.
      token = token.split(" ")[1]; //Extract Token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      return res.json({ success: false, message: "No Authorized No Token" });
    }
  } catch (err) {
    return res.json({ success: false, message: "Invalid or expired token" });
  }
};





const adminOnly = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.json({
        success: false,
        message: "Access Denied , Admin Only ",
      });
    }
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export { protect, adminOnly };
