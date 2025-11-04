# Colección Postman - Checklist Backend API

Esta colección de Postman contiene todas las pruebas necesarias para validar el funcionamiento completo del backend del sistema de checklists.

## 📁 Archivos Incluidos

- **`Checklist-Backend.postman_collection.json`** - Colección principal con todos los endpoints
- **`Checklist-Backend.postman_environment.json`** - Variables de entorno
- **`README.md`** - Este archivo con instrucciones

## 🚀 Configuración Inicial

### 1. Importar en Postman

1. Abrir Postman
2. Hacer clic en **Import**
3. Seleccionar ambos archivos JSON:
   - `Checklist-Backend.postman_collection.json`
   - `Checklist-Backend.postman_environment.json`
4. Seleccionar el environment **"Checklist Backend Environment"**

### 2. Verificar Variables de Entorno

Asegúrate de que las siguientes variables estén configuradas:

- `base_url`: `http://localhost:3000`
- `admin_email`: `admin@checklist.com`
- `supervisor_email`: `supervisor@ort.edu.ar`
- `collaborator_email`: `Nestor.Wilke@ejemplo.com`

### 3. Iniciar el Servidor Backend

```bash
cd /home/dev/code/2025/c2/proyectos/checklist/checklist-back
npm run dev
```

## 🧪 Flujo de Pruebas Recomendado

### Paso 1: Autenticación
1. **Login Admin** - Obtiene token JWT con permisos completos
2. **Login Supervisor** - Obtiene token con permisos de supervisión
3. **Login Colaborador** - Obtiene token con permisos básicos

### Paso 2: Gestión de Usuarios
1. **Get All Users** - Ver todos los usuarios del sistema
2. **Register New User** - Crear un nuevo usuario
3. **Get User by ID** - Obtener usuario específico

### Paso 3: Gestión de Checklists
1. **Get All Checklists** - Ver checklists disponibles (Oil & Gas)
2. **Get Checklist by ID** - Ver detalles de un checklist específico
3. **Create Checklist** - Crear nuevo checklist (solo supervisores)
4. **Update Checklist** - Actualizar checklist existente

### Paso 4: Gestión de Asignaciones
1. **Get All Assignments** - Ver todas las asignaciones
2. **Get Assignments by Collaborator** - Filtrar por colaborador
3. **Create Assignment** - Asignar checklist a colaborador
4. **Update Assignment** - Cambiar estado o detalles

### Paso 5: Gestión de Ejecuciones
1. **Get All Executions** - Ver todas las ejecuciones
2. **Create Execution** - Iniciar ejecución de checklist
3. **Update Execution** - Guardar progreso
4. **Complete Execution** - Finalizar checklist

### Paso 6: Pruebas de Seguridad
1. **Test Unauthorized Access** - Acceso sin token
2. **Test Role-Based Access** - Control de permisos por rol
3. **Test Invalid Login** - Credenciales incorrectas

## 🔐 Roles y Permisos

### Admin (`admin@checklist.com`)
- ✅ Acceso completo a todos los endpoints
- ✅ Crear, editar, eliminar checklists
- ✅ Gestionar usuarios y asignaciones

### Supervisor (`supervisor@ort.edu.ar`)
- ✅ Crear y editar checklists
- ✅ Crear y gestionar asignaciones
- ✅ Ver todas las ejecuciones
- ❌ Gestión avanzada de usuarios

### Colaborador (`Nestor.Wilke@ejemplo.com`)
- ✅ Ver checklists asignados
- ✅ Ejecutar checklists
- ✅ Ver sus propias ejecuciones
- ❌ Crear checklists
- ❌ Crear asignaciones

## 📋 Datos de Prueba Disponibles

### Usuarios Reales (del Frontend)
- **Nestor Wilke**: `Nestor.Wilke@ejemplo.com` / `pass123`
- **Adele Vance**: `Adele.Vance@ejemplo.com` / `pass123`
- **Alex Wilber**: `Alex.Wilber@ejemplo.com` / `pass123`
- **Diego Siciliani**: `Diego.Siciliani@ejemplo.com` / `pass123`

### Checklists Oil & Gas
1. **Inspección diaria de pozo en operación**
   - Medición de presión (PSI)
   - Tasa de producción (barriles/día)
   - Verificación de fugas
   - Estado de válvulas

2. **Inspección de seguridad en área de pozo**
   - Señalización del área
   - Uso de EPP
   - Estado de tableros eléctricos
   - Calibración de detectores

3. **Mantenimiento preventivo ESP**
   - Medición de voltaje
   - Inspección de cables
   - Estado del fluido dieléctrico
   - Anomalías detectadas

### Asignaciones Existentes
- 4 asignaciones con diferentes estados:
  - 2 pendientes (Nestor)
  - 1 en progreso (Adele)
  - 1 completada (Alex)

## 🔧 Obtener IDs para Pruebas

Para obtener los IDs reales de los documentos:

1. Ejecutar **Get All Checklists** y copiar un `_id`
2. Ejecutar **Get All Assignments** y copiar un `_id`
3. Ejecutar **Get All Executions** y copiar un `_id`
4. Reemplazar `CHECKLIST_ID_HERE`, `ASSIGNMENT_ID_HERE`, etc. en las URLs

## ⚠️ Notas Importantes

1. **Autenticación Automática**: Los requests de login guardan automáticamente el JWT token
2. **Variables Dinámicas**: Usa las variables de entorno para evitar hardcodear valores
3. **Orden de Ejecución**: Algunos requests dependen de otros (ej: crear antes de actualizar)
4. **Validación de Roles**: Prueba diferentes usuarios para validar permisos
5. **Datos Realistas**: Los ejemplos usan datos del sector Oil & Gas

## 🐛 Solución de Problemas

### Error 401 (Unauthorized)
- Verificar que el token JWT esté configurado
- Ejecutar login nuevamente

### Error 403 (Forbidden)
- Verificar que el usuario tenga los permisos necesarios
- Usar supervisor/admin para operaciones restringidas

### Error 404 (Not Found)
- Verificar que los IDs en las URLs sean válidos
- Obtener IDs actuales con los endpoints GET

### Error 500 (Server Error)
- Verificar que el servidor esté ejecutándose
- Revisar logs del servidor para detalles

## 📊 Métricas de Prueba

La colección incluye tests automáticos que verifican:
- ✅ Códigos de respuesta HTTP correctos
- ✅ Estructura de respuestas JSON
- ✅ Autenticación y autorización
- ✅ Validación de datos de entrada
- ✅ Manejo de errores

¡Listo para probar el backend completo! 🚀
