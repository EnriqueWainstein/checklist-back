import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "tasks";

export async function createTask(taskData) {
    console.log("Creando una nueva tarea en la base de datos");
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne({
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return result;
}

export async function deleteTask(id) {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
}

export async function updateTask(id, updateData) {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                ...updateData,
                updatedAt: new Date()
            }
        }
    );
}

export async function getAllTasks() {
    const db = getDb();
    return await db.collection(COLLECTION_NAME)
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
}

