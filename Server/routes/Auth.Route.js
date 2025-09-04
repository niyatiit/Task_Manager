import { Router } from "express";
import {
  getUserProfile,
  login,
  register,
  updateUserProfile,
  uploadImage,
} from "../controller/Auth.Controller.js";
import { adminOnly, protect } from "../middleware/Auth.Middleware.js";
import { upload } from "../middleware/Uploaded.Middlware.js";

const authRouter = Router();

authRouter.route("/register").post(register); //Registration User
authRouter.route("/login").post(login); // Login User
authRouter.route("/profile").get(protect, getUserProfile); // Get User Profile
authRouter.route("/profile").put(protect, updateUserProfile); // Update Profile
authRouter.route("/upload-image").post(upload.single("image"), uploadImage);

export { authRouter };
