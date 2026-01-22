import express from "express";
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes need login
router.use(protect);

router
  .route("/")
  .get(getDepartments)
  .post(authorize("admin"), createDepartment);

router
  .route("/:id")
  .get(getDepartment)
  .put(authorize("admin"), updateDepartment)
  .delete(authorize("admin"), deleteDepartment);

export default router;
