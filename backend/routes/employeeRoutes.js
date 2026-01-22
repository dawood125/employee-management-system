import express from "express";
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} from "../controllers/employeeController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes need login
router.use(protect);

// Stats route (must be before /:id)
router.get("/stats", getEmployeeStats);

router.route("/").get(getEmployees).post(authorize("admin"), createEmployee);

router
  .route("/:id")
  .get(getEmployee)
  .put(authorize("admin", "manager"), updateEmployee)
  .delete(authorize("admin"), deleteEmployee);

export default router;
