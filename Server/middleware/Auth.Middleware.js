import jwt from "jsonwebtoken";
import { User } from "../module/User.Module.js";

// This is code of the video
// const protect = async (req, res, next) => {
//   try {
//     let token = req.headers.authorization;

//     // Bearer is the part of the authorization end check that you have already logged in or not .
//     // startsWith check that Bearer is the format or not . this is inbuilt function like
//     if (token && token.startsWith("Bearer")) {
//       // This is remove the space split function end 1 is strart with 2 index bcz array is startign 0.
//       token = token.split(" ")[1]; //Extract Token
//       const decoded = jwt.verify(token, process.env.SECRET_KEY);
//       req.user = await User.findById(decoded.id).select("-password");
//       next();
//     } else {
//       return res.json({ success: false, message: "No Authorized No Token" });
//     }
//   } catch (err) {
//     return res.json({ success: false, message: err.message });
//   }
// };

// This code of GetStrack Channel
const protect = async (req, res, next) => {
 let token;

  // Check for token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Attach user to the request object
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: "Not authorized, no token" });
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
