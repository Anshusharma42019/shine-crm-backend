import express from "express";
import {
  getPresentEmployees,
  assignTask,
  getTasks,
  updateTaskStatus
} from "../controllers/TaskController.js";

const router = express.Router();

// Task routes
router.get("/present-employees", getPresentEmployees);
router.post("/assign", assignTask);
router.get("/", getTasks);
router.patch("/:id/status", updateTaskStatus);

export default router;