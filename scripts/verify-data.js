import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = "checklist_system";

async function verifyData() {
    let client;
    
    try {
        console.log("🔍 Verificando datos en la base de datos...");
        
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db(dbName);
        
        // Verificar usuarios
        const users = await db.collection("users").find({}).toArray();
        console.log(`\n👥 Usuarios encontrados: ${users.length}`);
        users.forEach(user => {
            console.log(`  - ${user.username} (${user.email}) - ${user.role}`);
        });
        
        // Verificar checklists
        const checklists = await db.collection("checklists").find({}).toArray();
        console.log(`\n📋 Checklists encontrados: ${checklists.length}`);
        checklists.forEach(checklist => {
            console.log(`  - ${checklist.title} (${checklist.category}) - ${checklist.items.length} items`);
        });
        
        // Verificar asignaciones
        const assignments = await db.collection("assignments").find({}).toArray();
        console.log(`\n📋 Asignaciones encontradas: ${assignments.length}`);
        assignments.forEach(assignment => {
            console.log(`  - ${assignment.checklistTitle} → ${assignment.collaboratorEmail} (${assignment.status})`);
        });
        
        // Verificar ejecuciones
        const executions = await db.collection("executions").find({}).toArray();
        console.log(`\n✅ Ejecuciones encontradas: ${executions.length}`);
        executions.forEach(execution => {
            console.log(`  - ${execution.checklistTitle} por ${execution.collaboratorEmail} (${execution.status})`);
        });
        
        console.log("\n✅ Verificación completada");
        
    } catch (error) {
        console.error("❌ Error durante la verificación:", error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

verifyData();
