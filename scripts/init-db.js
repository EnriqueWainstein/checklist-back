import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = "checklist_system";

if (!uri) {
    console.error("❌ La variable de entorno MONGODB_URI no está definida.");
    process.exit(1);
}

// Datos de prueba basados en el frontend
const testData = {
    users: [
        {
            username: "Admin Sistema",
            email: "admin@checklist.com",
            password: "admin123",
            role: "admin",
            avatar: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            username: "Supervisor",
            email: "supervisor@ort.edu.ar",
            password: "super123",
            role: "supervisor",
            avatar: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            username: "Nestor Wilke",
            email: "Nestor.Wilke@ejemplo.com",
            password: "pass123",
            role: "collaborator",
            avatar: "Nestor Wilke.jpg",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            username: "Adele Vance",
            email: "Adele.Vance@ejemplo.com",
            password: "pass123",
            role: "collaborator",
            avatar: "Adele Vance.jpg",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            username: "Alex Wilber",
            email: "Alex.Wilber@ejemplo.com",
            password: "pass123",
            role: "collaborator",
            avatar: "Alex Wilber.jpg",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            username: "Diego Siciliani",
            email: "Diego.Siciliani@ejemplo.com",
            password: "pass123",
            role: "collaborator",
            avatar: "Diego Siciliani.jpg",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],

    checklists: [
        {
            title: "Inspección diaria de pozo en operación",
            description: "Verificar condiciones generales de un pozo activo para asegurar continuidad y seguridad.",
            category: "oil_gas",
            slug: "inspeccion-diaria-pozo",
            items: [
                {
                    id: "1",
                    text: "Medir presión en boca de pozo",
                    type: "number",
                    unit: "PSI",
                    required: true,
                    validation: { min: 0, max: 15000 }
                },
                {
                    id: "2",
                    text: "Registrar tasa de producción de fluidos",
                    type: "number",
                    unit: "barriles/día",
                    required: true,
                    validation: { min: 0, max: 100000 }
                },
                {
                    id: "3",
                    text: "Verificación de fugas visibles (gas/fluido)",
                    type: "select",
                    options: ["Sin fugas", "Con fugas"],
                    required: true
                },
                {
                    id: "4",
                    text: "Adjuntar evidencia de fuga (si aplica)",
                    type: "file",
                    required: false,
                    conditional: {
                        when: { step_id: "3", equals: "Con fugas" }
                    }
                },
                {
                    id: "5",
                    text: "Estado de válvulas maestras (según procedimiento)",
                    type: "select",
                    options: ["Abiertas", "Cerradas", "No aplica"],
                    required: true
                }
            ],
            createdBy: "supervisor@ort.edu.ar",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: "Inspección de seguridad en área de pozo",
            description: "Controlar condiciones de seguridad, señalización, medio ambiente y equipos de emergencia en la locación.",
            category: "seguridad",
            slug: "inspeccion-de-seguridad",
            items: [
                {
                    id: "1",
                    text: "Delimitación y señalización del área",
                    type: "select",
                    options: ["Correcta", "Incorrecta"],
                    required: true
                },
                {
                    id: "2",
                    text: "Uso de EPP por todo el personal",
                    type: "select",
                    options: ["Cumple", "No cumple"],
                    required: true
                },
                {
                    id: "3",
                    text: "Adjuntar foto si no se cumple uso de EPP",
                    type: "file",
                    required: false,
                    conditional: {
                        when: { step_id: "2", equals: "No cumple" }
                    }
                },
                {
                    id: "4",
                    text: "Estado de tableros eléctricos y cableado visible",
                    type: "select",
                    options: ["Seguro", "No seguro"],
                    required: true
                },
                {
                    id: "5",
                    text: "Detectores de gas funcionales y calibrados - fecha de última calibración",
                    type: "date",
                    required: true,
                    validation: { no_future: true, max_age_days: 365 }
                }
            ],
            createdBy: "supervisor@ort.edu.ar",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: "Mantenimiento preventivo de bomba electrosumergible (ESP)",
            description: "Verificar condiciones del sistema ESP y su tablero de control para asegurar operación eficiente.",
            category: "mantenimiento",
            slug: "mantenimiento-preventivo",
            items: [
                {
                    id: "1",
                    text: "Medición de voltaje en tablero",
                    type: "number",
                    unit: "V",
                    required: true,
                    validation: { min: 0, max: 15000 }
                },
                {
                    id: "2",
                    text: "Inspección visual de cables de potencia (aislamiento, conectores)",
                    type: "select",
                    options: ["Sin daños", "Con daños"],
                    required: true
                },
                {
                    id: "3",
                    text: "Adjuntar foto de cables (si hay daños)",
                    type: "file",
                    required: false,
                    conditional: {
                        when: { step_id: "2", equals: "Con daños" }
                    }
                },
                {
                    id: "4",
                    text: "Estado del fluido dieléctrico",
                    type: "select",
                    options: ["Adecuado", "Reemplazo requerido"],
                    required: true
                },
                {
                    id: "5",
                    text: "Anomalías detectadas",
                    type: "text",
                    required: false,
                    validation: { max_length: 1500 }
                }
            ],
            createdBy: "supervisor@ort.edu.ar",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]
};

async function hashPasswords(users) {
    const saltRounds = 10;
    for (let user of users) {
        user.password = await bcrypt.hash(user.password, saltRounds);
    }
    return users;
}

async function createCollections(db) {
    console.log("📋 Creando colecciones...");
    
    // Crear colecciones con validación de esquema
    await db.createCollection("users", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["username", "email", "password"],
                properties: {
                    username: { bsonType: "string" },
                    email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
                    password: { bsonType: "string" },
                    role: { enum: ["admin", "supervisor", "collaborator"] },
                    avatar: { bsonType: ["string", "null"] },
                    createdAt: { bsonType: "date" },
                    updatedAt: { bsonType: "date" }
                }
            }
        }
    });

    await db.createCollection("checklists", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["title", "items", "createdBy"],
                properties: {
                    title: { bsonType: "string" },
                    description: { bsonType: "string" },
                    category: { bsonType: "string" },
                    slug: { bsonType: "string" },
                    items: {
                        bsonType: "array",
                        items: {
                            bsonType: "object",
                            required: ["id", "text", "type"],
                            properties: {
                                id: { bsonType: ["string", "number"] }, // Permitir string o number
                                text: { bsonType: "string" },
                                type: { enum: ["checkbox", "text", "number", "select", "file", "date"] }, // Agregar tipos faltantes
                                required: { bsonType: "bool" },
                                options: { bsonType: "array" },
                                unit: { bsonType: "string" },
                                validation: { bsonType: "object" },
                                conditional: { bsonType: "object" }
                            }
                        }
                    },
                    createdBy: { bsonType: "string" },
                    createdAt: { bsonType: "date" },
                    updatedAt: { bsonType: "date" }
                }
            }
        }
    });

    await db.createCollection("assignments", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["checklistId", "collaboratorEmail", "assignedBy"],
                properties: {
                    checklistId: { bsonType: "objectId" },
                    collaboratorEmail: { bsonType: "string" },
                    assignedBy: { bsonType: "string" },
                    dueDate: { bsonType: "date" },
                    priority: { enum: ["low", "medium", "high"] },
                    status: { enum: ["pending", "in_progress", "completed", "reviewed"] },
                    notes: { bsonType: "string" },
                    checklistSlug: { bsonType: "string" },
                    checklistTitle: { bsonType: "string" },
                    createdAt: { bsonType: "date" },
                    updatedAt: { bsonType: "date" }
                }
            }
        }
    });

    await db.createCollection("executions", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["assignmentId", "collaboratorEmail"],
                properties: {
                    assignmentId: { bsonType: "string" },
                    collaboratorEmail: { bsonType: "string" },
                    checklistTitle: { bsonType: "string" },
                    responses: { bsonType: "object" },
                    status: { enum: ["in_progress", "completed", "reviewed"] },
                    startedAt: { bsonType: "date" },
                    completedAt: { bsonType: "date" },
                    reviewedAt: { bsonType: "date" },
                    reviewedBy: { bsonType: "string" },
                    reviewNotes: { bsonType: "string" },
                    createdAt: { bsonType: "date" },
                    updatedAt: { bsonType: "date" }
                }
            }
        }
    });

    console.log("✅ Colecciones creadas exitosamente");
}

async function createIndexes(db) {
    console.log("📊 Creando índices...");
    
    // Índices para users
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ username: 1 });
    
    // Índices para checklists
    await db.collection("checklists").createIndex({ createdBy: 1 });
    await db.collection("checklists").createIndex({ category: 1 });
    await db.collection("checklists").createIndex({ title: "text", description: "text" });
    
    // Índices para assignments
    await db.collection("assignments").createIndex({ collaboratorEmail: 1 });
    await db.collection("assignments").createIndex({ checklistId: 1 });
    await db.collection("assignments").createIndex({ status: 1 });
    await db.collection("assignments").createIndex({ dueDate: 1 });
    
    // Índices para executions
    await db.collection("executions").createIndex({ assignmentId: 1 });
    await db.collection("executions").createIndex({ collaboratorEmail: 1 });
    await db.collection("executions").createIndex({ status: 1 });
    
    console.log("✅ Índices creados exitosamente");
}

async function insertTestData(db) {
    console.log("📝 Insertando datos de prueba...");
    
    // Hashear contraseñas antes de insertar usuarios
    const hashedUsers = await hashPasswords([...testData.users]);
    
    // Insertar usuarios
    const usersResult = await db.collection("users").insertMany(hashedUsers);
    console.log(`👥 ${usersResult.insertedCount} usuarios insertados`);
    
    // Insertar checklists
    const checklistsResult = await db.collection("checklists").insertMany(testData.checklists);
    console.log(`📋 ${checklistsResult.insertedCount} checklists insertados`);
    
    // Crear algunas asignaciones de ejemplo basadas en el frontend
    const checklistIds = Object.values(checklistsResult.insertedIds);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const assignments = [
        {
            checklistId: checklistIds[1], // Inspección de seguridad
            collaboratorEmail: "Nestor.Wilke@ejemplo.com",
            assignedBy: "supervisor@ort.edu.ar",
            dueDate: tomorrow,
            priority: "high",
            status: "pending", // pending = Asignada en frontend
            notes: "Realizar inspección de seguridad en el área de producción",
            checklistSlug: "inspeccion-de-seguridad",
            checklistTitle: "Inspección de seguridad en área de pozo",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            checklistId: checklistIds[2], // Mantenimiento preventivo
            collaboratorEmail: "Nestor.Wilke@ejemplo.com",
            assignedBy: "supervisor@ort.edu.ar",
            dueDate: nextWeek,
            priority: "medium",
            status: "pending",
            notes: "Realizar mantenimiento preventivo en equipos del sector A",
            checklistSlug: "mantenimiento-preventivo",
            checklistTitle: "Mantenimiento preventivo de bomba electrosumergible (ESP)",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            checklistId: checklistIds[0], // Inspección diaria
            collaboratorEmail: "Adele.Vance@ejemplo.com",
            assignedBy: "supervisor@ort.edu.ar",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
            priority: "high",
            status: "in_progress", // En ejecución
            notes: "Inspección diaria del pozo principal - sector norte",
            checklistSlug: "inspeccion-diaria-pozo",
            checklistTitle: "Inspección diaria de pozo en operación",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            checklistId: checklistIds[1], // Inspección de seguridad
            collaboratorEmail: "Alex.Wilber@ejemplo.com",
            assignedBy: "supervisor@ort.edu.ar",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días
            priority: "medium",
            status: "completed", // Completada
            notes: "Inspección de seguridad - área de almacenamiento",
            checklistSlug: "inspeccion-de-seguridad",
            checklistTitle: "Inspección de seguridad en área de pozo",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
    
    const assignmentsResult = await db.collection("assignments").insertMany(assignments);
    console.log(`📋 ${assignmentsResult.insertedCount} asignaciones creadas`);
    
    // Crear ejecuciones de ejemplo basadas en el frontend
    const assignmentIds = Object.values(assignmentsResult.insertedIds);
    const executions = [
        {
            assignmentId: assignmentIds[2].toString(), // Asignación en progreso (Adele)
            collaboratorEmail: "Adele.Vance@ejemplo.com",
            checklistTitle: "Inspección diaria de pozo en operación",
            responses: {
                "1": { value: 1250, valid: true, visible: true, completedAt: new Date() }, // Presión PSI
                "2": { value: 850, valid: true, visible: true, completedAt: new Date() }, // Producción barriles/día
                "3": { value: "Sin fugas", valid: true, visible: true, completedAt: new Date() }, // Fugas
                "5": { value: "Abiertas", valid: true, visible: true, completedAt: new Date() } // Válvulas
            },
            status: "in_progress",
            startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            assignmentId: assignmentIds[3].toString(), // Asignación completada (Alex)
            collaboratorEmail: "Alex.Wilber@ejemplo.com",
            checklistTitle: "Inspección de seguridad en área de pozo",
            responses: {
                "1": { value: "Correcta", valid: true, visible: true, completedAt: new Date() }, // Señalización
                "2": { value: "Cumple", valid: true, visible: true, completedAt: new Date() }, // EPP
                "4": { value: "Seguro", valid: true, visible: true, completedAt: new Date() }, // Tableros
                "5": { value: "2024-10-15", valid: true, visible: true, completedAt: new Date() } // Calibración detectores
            },
            status: "completed",
            startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 horas atrás
            completedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
    
    const executionsResult = await db.collection("executions").insertMany(executions);
    console.log(`✅ ${executionsResult.insertedCount} ejecuciones creadas`);
    
    console.log("✅ Datos de prueba insertados exitosamente");
}

async function initializeDatabase() {
    let client;
    
    try {
        console.log("🚀 Iniciando configuración de base de datos...");
        console.log(`📡 Conectando a: ${uri}`);
        
        client = new MongoClient(uri);
        await client.connect();
        console.log("✅ Conexión establecida");
        
        const db = client.db(dbName);
        
        // Verificar si la base de datos ya tiene datos
        const collections = await db.listCollections().toArray();
        if (collections.length > 0) {
            console.log("⚠️  La base de datos ya contiene colecciones.");
            console.log("¿Desea continuar? Esto eliminará todos los datos existentes.");
            
            // En un entorno de producción, aquí deberías pedir confirmación al usuario
            // Por ahora, eliminaremos las colecciones existentes
            for (const collection of collections) {
                await db.collection(collection.name).drop();
                console.log(`🗑️  Colección '${collection.name}' eliminada`);
            }
        }
        
        // Crear colecciones con validación
        await createCollections(db);
        
        // Crear índices
        await createIndexes(db);
        
        // Insertar datos de prueba
        await insertTestData(db);
        
        console.log("\n🎉 ¡Base de datos inicializada exitosamente!");
        console.log("\n📊 Resumen de datos creados (compatibles con frontend):");
        console.log("👥 Usuarios: 6 (admin, supervisor, 4 colaboradores con nombres reales)");
        console.log("📋 Checklists: 3 (Oil & Gas - inspección diaria, seguridad, mantenimiento)");
        console.log("📋 Asignaciones: 4 (con diferentes estados y usuarios reales)");
        console.log("✅ Ejecuciones: 2 (1 en progreso, 1 completada)");
        
        console.log("\n🔐 Credenciales de prueba (compatibles con frontend):");
        console.log("Admin: admin@checklist.com / admin123");
        console.log("Supervisor: supervisor@ort.edu.ar / super123");
        console.log("Colaborador 1: Nestor.Wilke@ejemplo.com / pass123");
        console.log("Colaborador 2: Adele.Vance@ejemplo.com / pass123");
        console.log("Colaborador 3: Alex.Wilber@ejemplo.com / pass123");
        console.log("Colaborador 4: Diego.Siciliani@ejemplo.com / pass123");
        
    } catch (error) {
        console.error("❌ Error durante la inicialización:", error);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log("🔌 Conexión cerrada");
        }
    }
}

// Ejecutar el script
initializeDatabase();
