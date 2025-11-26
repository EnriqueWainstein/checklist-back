import express from "express";
import { 
    getAllTasks
} from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireSupervisor, requireAdmin } from "../middleware/roleMiddleware.js";
import { createTask, deleteTask, updateTask } from "../controllers/taskController.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get("/", getAllTasks);

router.post("/", createTask);

router.patch("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;
