# Scripts de Inicialización de Base de Datos

Este directorio contiene scripts para inicializar la base de datos MongoDB del sistema de checklists con datos de prueba.

## Archivos

- `init-db.js` - Script principal de inicialización
- `package.json` - Dependencias específicas para los scripts
- `README.md` - Este archivo con instrucciones

## Requisitos Previos

1. **MongoDB** debe estar ejecutándose (local o remoto)
2. **Node.js** versión 16 o superior
3. **Variables de entorno** configuradas

## Configuración de Variables de Entorno

El script utiliza las mismas variables de entorno que el backend principal. Asegúrate de tener configurado:

```bash
MONGODB_URI=mongodb://localhost:27017
```

O si usas MongoDB Atlas:
```bash
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/
```

## Instrucciones de Ejecución

### Opción 1: Ejecutar desde el directorio scripts

```bash
# 1. Navegar al directorio scripts
cd /home/dev/code/2025/c2/proyectos/checklist/checklist-back/scripts

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Copiar el archivo .env del directorio padre o crear uno nuevo
cp ../.env . 
# O crear un nuevo .env con MONGODB_URI

# 4. Ejecutar el script
npm run init-db
```

### Opción 2: Ejecutar desde el directorio raíz del backend

```bash
# 1. Desde el directorio raíz del backend
cd /home/dev/code/2025/c2/proyectos/checklist/checklist-back

# 2. Ejecutar directamente con node
node scripts/init-db.js
```

### Opción 3: Usar las dependencias del proyecto principal

```bash
# 1. Desde el directorio raíz del backend
cd /home/dev/code/2025/c2/proyectos/checklist/checklist-back

# 2. Asegurarse de que las dependencias estén instaladas
npm install

# 3. Ejecutar el script
node scripts/init-db.js
```

## ¿Qué hace el script?

El script `init-db.js` realiza las siguientes acciones:

### 1. **Limpieza de datos existentes**
- Elimina colecciones existentes si las hay
- Muestra advertencia antes de proceder

### 2. **Creación de colecciones con validación**
- `users` - Usuarios del sistema
- `checklists` - Templates de checklists
- `assignments` - Asignaciones de checklists a colaboradores
- `executions` - Ejecuciones/respuestas de checklists

### 3. **Creación de índices**
- Índices únicos para emails
- Índices de búsqueda por texto
- Índices de rendimiento para consultas frecuentes

### 4. **Inserción de datos de prueba**

#### Usuarios creados (compatibles con frontend):
- **Admin**: `admin@checklist.com` / `admin123`
- **Supervisor**: `supervisor@ort.edu.ar` / `super123`
- **Nestor Wilke**: `Nestor.Wilke@ejemplo.com` / `pass123`
- **Adele Vance**: `Adele.Vance@ejemplo.com` / `pass123`
- **Alex Wilber**: `Alex.Wilber@ejemplo.com` / `pass123`
- **Diego Siciliani**: `Diego.Siciliani@ejemplo.com` / `pass123`

#### Checklists creados (Oil & Gas):
- **Inspección diaria de pozo en operación** - 5 items (números con validación, selects, archivos condicionales)
- **Inspección de seguridad en área de pozo** - 5 items (selects, archivos condicionales, fechas)
- **Mantenimiento preventivo ESP** - 5 items (números, selects, texto, archivos condicionales)

#### Asignaciones creadas:
- 4 asignaciones con usuarios reales del frontend, diferentes estados y prioridades
- Fechas de vencimiento variadas

#### Ejecuciones creadas:
- 1 ejecución completada como ejemplo

## Estructura de Datos

### Usuarios
```javascript
{
  username: "string",
  email: "string", // único
  password: "string", // hasheado con bcrypt
  role: "admin|supervisor|collaborator",
  createdAt: Date,
  updatedAt: Date
}
```

### Checklists
```javascript
{
  title: "string",
  description: "string",
  category: "string",
  items: [
    {
      id: "string",
      text: "string",
      type: "checkbox|text|number|select",
      required: boolean,
      options: ["array"] // solo para type: "select"
    }
  ],
  createdBy: "string", // email del creador
  createdAt: Date,
  updatedAt: Date
}
```

### Asignaciones
```javascript
{
  checklistId: ObjectId,
  collaboratorEmail: "string",
  assignedBy: "string",
  dueDate: Date,
  priority: "low|medium|high",
  status: "pending|in_progress|completed|reviewed",
  notes: "string",
  createdAt: Date,
  updatedAt: Date
}
```

### Ejecuciones
```javascript
{
  assignmentId: "string",
  collaboratorEmail: "string",
  responses: {
    "item_id": {
      value: "any", // boolean, string, number según el tipo
      completedAt: Date
    }
  },
  status: "in_progress|completed|reviewed",
  startedAt: Date,
  completedAt: Date,
  reviewedAt: Date,
  reviewedBy: "string",
  reviewNotes: "string",
  createdAt: Date,
  updatedAt: Date
}
```

## Solución de Problemas

### Error de conexión
```
❌ Error durante la inicialización: MongoServerError: connect ECONNREFUSED
```
**Solución**: Verificar que MongoDB esté ejecutándose y que la URI sea correcta.

### Error de variables de entorno
```
❌ La variable de entorno MONGODB_URI no está definida.
```
**Solución**: Crear archivo `.env` con `MONGODB_URI=mongodb://localhost:27017`

### Error de permisos
```
❌ Error durante la inicialización: MongoServerError: not authorized
```
**Solución**: Verificar credenciales en la URI de MongoDB.

### Error de dependencias
```
Error: Cannot find module 'mongodb'
```
**Solución**: Ejecutar `npm install` en el directorio correspondiente.

## Verificación

Después de ejecutar el script, puedes verificar que todo se creó correctamente:

```bash
# Conectar a MongoDB y verificar
mongo # o mongosh
use checklist_system
show collections
db.users.count()
db.checklists.count()
db.assignments.count()
db.executions.count()
```

## Notas Importantes

- ⚠️ **El script elimina todos los datos existentes** en la base de datos
- 🔐 **Las contraseñas se hashean automáticamente** con bcrypt
- 📊 **Se crean índices para optimizar las consultas**
- ✅ **Los datos son compatibles** con la estructura del backend existente
