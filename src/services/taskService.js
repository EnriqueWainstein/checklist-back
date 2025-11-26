import * as taskData from "../data/taskData.js";

export const getAllTasks = async () => {
    try {
        return await taskData.getAllTasks();
    } catch (error) {
        throw new Error(`Error al obtener tareas: ${error.message}`);
    }
};

export const createTask = async (taskInfo, createdBy) => {
    try {
        if (!taskInfo.title) {
            throw new Error("el titulo es obligatorio");
        }

        const task = {
            title: taskInfo.title,
            description: taskInfo.description || "",
            dueDate: taskInfo.dueDate ? new Date(taskInfo.dueDate) : null,
            status: taskInfo.status || "pending",
            assignee: taskInfo.assignee || null,
            createdBy,
        };

        return await taskData.createTask(task);
    } catch (error) {
        throw error;
    }
};

export const deleteTask = async (id) => {
    try {
        const result = await taskData.deleteTask(id);
        if (!result || result.deletedCount === 0) {
            throw new Error("Tarea no encontrada");
        }
        return result;
    } catch (error) {
        throw error;
    }
};

export const updateTask = async (id, taskInfo) => {
    try {
        // Campos permitidos para actualizar
        const allowedFields = ["title", "description", "dueDate", "status", "assignee"];
        const updateData = {};

        for (const field of allowedFields) {
            if (taskInfo[field] !== undefined) {
                updateData[field] = taskInfo[field];
            }
        }

        // Si viene dueDate, la convertimos a Date
        if (updateData.dueDate) {
            updateData.dueDate = new Date(updateData.dueDate);
        }

        const result = await taskData.updateTask(id, updateData);

        if (!result || result.matchedCount === 0) {
            throw new Error("Tarea no encontrada");
        }

        return result;
    } catch (error) {
        throw error;
    }
};
