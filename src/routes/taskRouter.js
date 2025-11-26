import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireSupervisor, requireAdmin } from "../middleware/roleMiddleware.js";
import { createTask, deleteTask, updateTask, getAllTasks } from "../controllers/taskController.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get("/", getAllTasks);

router.post("/", requireSupervisor, createTask);

router.patch("/:id", requireSupervisor, updateTask);

router.delete("/:id", requireSupervisor, deleteTask);

export default router;
