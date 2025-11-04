import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = "checklist_system";

async function getIds() {
    let client;
    
    try {
        console.log("🔍 Obteniendo IDs para usar en Postman...\n");
        
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db(dbName);
        
        // Obtener IDs de checklists
        const checklists = await db.collection("checklists").find({}).toArray();
        console.log("📋 CHECKLIST IDs:");
        checklists.forEach((checklist, index) => {
            console.log(`${index + 1}. ${checklist.title}`);
            console.log(`   ID: ${checklist._id}`);
            console.log(`   Slug: ${checklist.slug}\n`);
        });
        
        // Obtener IDs de asignaciones
        const assignments = await db.collection("assignments").find({}).toArray();
        console.log("📝 ASSIGNMENT IDs:");
        assignments.forEach((assignment, index) => {
            console.log(`${index + 1}. ${assignment.checklistTitle} → ${assignment.collaboratorEmail}`);
            console.log(`   ID: ${assignment._id}`);
            console.log(`   Status: ${assignment.status}\n`);
        });
        
        // Obtener IDs de ejecuciones
        const executions = await db.collection("executions").find({}).toArray();
        console.log("✅ EXECUTION IDs:");
        executions.forEach((execution, index) => {
            console.log(`${index + 1}. ${execution.checklistTitle} por ${execution.collaboratorEmail}`);
            console.log(`   ID: ${execution._id}`);
            console.log(`   Status: ${execution.status}\n`);
        });
        
        // Obtener IDs de usuarios
        const users = await db.collection("users").find({}).toArray();
        console.log("👥 USER IDs:");
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username} (${user.role})`);
            console.log(`   ID: ${user._id}`);
            console.log(`   Email: ${user.email}\n`);
        });
        
        console.log("💡 INSTRUCCIONES:");
        console.log("1. Copia los IDs que necesites");
        console.log("2. En Postman, reemplaza 'CHECKLIST_ID_HERE', 'ASSIGNMENT_ID_HERE', etc.");
        console.log("3. O guárdalos como variables de entorno en Postman");
        
    } catch (error) {
        console.error("❌ Error obteniendo IDs:", error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

getIds();
