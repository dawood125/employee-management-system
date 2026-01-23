import express from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getMyTasks,
  getTaskStats
} from "../controllers/taskController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes need login
router.use(protect);

// Special routes first (before /:id)
router.get("/my-tasks", getMyTasks);
router.get("/stats", getTaskStats);
router.patch("/:id/status", updateTaskStatus);

router.route("/")
  .get(getTasks)
  .post(authorize("admin", "manager"), createTask);

router.route("/:id")
  .get(getTask)
  .put(authorize("admin", "manager"), updateTask)
  .delete(authorize("admin", "manager"), deleteTask);

export default router;