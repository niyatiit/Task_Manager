import { Router } from "express";
import { adminOnly, protect } from "../middleware/Auth.Middleware.js";
import {
  createTask,
  deleteTask,
  getDashboardData,
  getTask,
  getTaskId,
  getUserDashboardData,
  updateTask,
  updateTaskCheckbox,
  updateTaskStatus,
} from "../controller/Task.Controller.js";

const taskRouter = Router();

taskRouter.route("/dashboard-data").get(protect, getDashboardData);
taskRouter.route("/user-dashboard-data").get(protect, getUserDashboardData);
taskRouter.route("/").get(protect, getTask);
taskRouter.route("/:id").get(protect, getTaskId);
taskRouter.route("/").post(protect, adminOnly, createTask);
taskRouter.route("/:id").put(protect, updateTask);
taskRouter.route("/:id").delete(protect, adminOnly, deleteTask);
taskRouter.route("/:id/status").put(protect, updateTaskStatus);
taskRouter.route("/:id/todo").put(protect, updateTaskCheckbox);

export { taskRouter };
