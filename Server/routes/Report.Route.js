import { Router } from "express";
import { adminOnly, protect } from "../middleware/Auth.Middleware.js";
import {
  exportTaskReport,
  exportUserReport,
} from "../controller/Report.Controller.js";

const reportRouter = Router();

reportRouter.route("/export/tasks").get(protect, adminOnly, exportTaskReport);
reportRouter.route("/export/users").get(protect, adminOnly, exportUserReport);

export {reportRouter}