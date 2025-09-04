import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dataBase } from "./config/db.js";
import { authRouter } from "./routes/Auth.Route.js";
import { userRouter } from "./routes/User.Route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// connect to DB
dataBase();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for form data

// ✅ Simple test route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ✅ Auth routes (already includes /register, /login, /profile)
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`server is running on port : ${PORT}`);
});
