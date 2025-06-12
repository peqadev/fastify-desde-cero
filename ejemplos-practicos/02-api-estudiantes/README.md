# 🔵 Ejemplo 2: API REST de Estudiantes

Esta es una API REST completa que demuestra operaciones CRUD (Create, Read, Update, Delete) para manejar estudiantes universitarios usando un array en memoria como base de datos simulada.

## 📋 ¿Qué aprenderás?

- ✅ **Operaciones CRUD completas**: GET, POST, PUT, PATCH, DELETE
- ✅ **Validación de datos**: Validaciones de entrada y tipos de datos
- ✅ **Manejo de errores**: Códigos de estado HTTP apropiados
- ✅ **Filtros y búsquedas**: Query parameters para filtrar y ordenar
- ✅ **Estructuras de datos complejas**: Objetos con múltiples propiedades
- ✅ **Funciones auxiliares**: Validaciones y cálculos personalizados
- ✅ **Respuestas consistentes**: Estructura JSON estandarizada

## 🏗️ Estructura de Datos

Cada estudiante tiene la siguiente estructura:

```javascript
{
  id: 1,                                    // Identificador único (auto-generado)
  nombre: "Ana García",                     // Nombre completo (requerido)
  edad: 20,                                 // Edad en años (16-100)
  carrera: "Ingeniería de Sistemas",        // Carrera universitaria (requerido)
  semestre: 4,                              // Semestre actual (1-12)
  activo: true,                             // Estado del estudiante
  notas: [4.2, 3.8, 4.5],                 // Array de calificaciones
  fechaIngreso: "2022-02-15",              // Fecha de ingreso a la universidad
  email: "ana.garcia@universidad.edu",      // Email institucional
  promedio: 4.17,                          // Promedio calculado automáticamente
  fechaCreacion: "2024-01-15T10:30:00Z",   // Timestamp de creación
  fechaActualizacion: "2024-01-15T10:30:00Z" // Timestamp de última actualización
}
```

## 🚀 Ejecutar el Ejemplo

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Ejecutar el servidor
```bash
# Modo desarrollo (se reinicia automáticamente)
pnpm run dev

# Modo producción
pnpm start
```

### 3. Verificar que funciona
```bash
curl http://localhost:3000/estudiantes
```

## 📚 Endpoints Disponibles

### 🔍 **GET /estudiantes** - Obtener todos los estudiantes

**Descripción:** Lista todos los estudiantes con filtros opcionales.

**Query Parameters:**
- `activo` - Filtrar por estado (true/false)
- `carrera` - Filtrar por carrera (búsqueda parcial)
- `semestre_min` - Semestre mínimo
- `semestre_max` - Semestre máximo
- `buscar` - Buscar en nombre o email
- `ordenar` - Ordenar por: nombre, edad, semestre, promedio

**Ejemplos:**
```bash
# Todos los estudiantes
curl http://localhost:3000/estudiantes

# Solo estudiantes activos
curl "http://localhost:3000/estudiantes?activo=true"

# Estudiantes de ingeniería
curl "http://localhost:3000/estudiantes?carrera=ingenieria"

# Estudiantes de semestres 3-6, ordenados por promedio
curl "http://localhost:3000/estudiantes?semestre_min=3&semestre_max=6&ordenar=promedio"

# Buscar estudiantes que contengan "ana"
curl "http://localhost:3000/estudiantes?buscar=ana"
```

**Respuesta:**
```json
{
  "estudiantes": [
    {
      "id": 1,
      "nombre": "Ana García",
      "edad": 20,
      "carrera": "Ingeniería de Sistemas",
      "semestre": 4,
      "activo": true,
      "notas": [4.2, 3.8, 4.5],
      "fechaIngreso": "2022-02-15",
      "email": "ana.garcia@universidad.edu",
      "promedio": 4.17
    }
  ],
  "total": 1,
  "filtros": {
    "activo": "true",
    "carrera": null,
    "semestre_min": null,
    "semestre_max": null,
    "buscar": null,
    "ordenar": null
  },
  "estadisticas": {
    "totalGeneral": 3,
    "activos": 2,
    "inactivos": 1,
    "promedioEdad": 20
  },
  "status": "success"
}
```

---

### 🔍 **GET /estudiantes/:id** - Obtener un estudiante específico

**Descripción:** Obtiene los detalles de un estudiante por su ID.

**Ejemplo:**
```bash
curl http://localhost:3000/estudiantes/1
```

**Respuesta:**
```json
{
  "estudiante": {
    "id": 1,
    "nombre": "Ana García",
    "edad": 20,
    "carrera": "Ingeniería de Sistemas",
    "semestre": 4,
    "activo": true,
    "notas": [4.2, 3.8, 4.5],
    "fechaIngreso": "2022-02-15",
    "email": "ana.garcia@universidad.edu",
    "promedio": 4.17,
    "diasEnUniversidad": 650,
    "ultimaActualizacion": "2024-01-15T10:30:00.000Z"
  },
  "status": "success"
}
```

**Error 404:**
```json
{
  "error": "Estudiante no encontrado",
  "id": 999,
  "status": "error"
}
```

---

### ➕ **POST /estudiantes** - Crear un nuevo estudiante

**Descripción:** Crea un nuevo estudiante en el sistema.

**Campos requeridos:**
- `nombre` (string): Nombre del estudiante
- `edad` (number): Edad entre 16 y 100 años
- `carrera` (string): Carrera universitaria

**Campos opcionales:**
- `semestre` (number): Semestre actual (1-12, por defecto: 1)
- `activo` (boolean): Estado del estudiante (por defecto: true)
- `notas` (array): Array de calificaciones (por defecto: [])
- `fechaIngreso` (string): Fecha de ingreso (por defecto: fecha actual)
- `email` (string): Email (se genera automáticamente si no se provee)

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pedro Martínez",
    "edad": 21,
    "carrera": "Arquitectura",
    "semestre": 3,
    "notas": [3.5, 4.0, 3.8],
    "email": "pedro.martinez@universidad.edu"
  }'
```

**Respuesta exitosa (201):**
```json
{
  "estudiante": {
    "id": 4,
    "nombre": "Pedro Martínez",
    "edad": 21,
    "carrera": "Arquitectura",
    "semestre": 3,
    "activo": true,
    "notas": [3.5, 4.0, 3.8],
    "fechaIngreso": "2024-01-15",
    "email": "pedro.martinez@universidad.edu",
    "fechaCreacion": "2024-01-15T10:30:00.000Z",
    "promedio": 3.77
  },
  "mensaje": "Estudiante creado exitosamente",
  "status": "success"
}
```

**Error de validación (400):**
```json
{
  "error": "Datos del estudiante no válidos",
  "errores": [
    "El nombre es requerido",
    "La edad debe estar entre 16 y 100 años"
  ],
  "status": "error"
}
```

**Error de email duplicado (409):**
```json
{
  "error": "El email ya está registrado",
  "email": "pedro.martinez@universidad.edu",
  "status": "error"
}
```

---

### ✏️ **PUT /estudiantes/:id** - Actualizar un estudiante completo

**Descripción:** Actualiza todos los datos de un estudiante (reemplaza completamente).

**Ejemplo:**
```bash
curl -X PUT http://localhost:3000/estudiantes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana Sofía García",
    "edad": 21,
    "carrera": "Ingeniería de Sistemas",
    "semestre": 5,
    "activo": true,
    "notas": [4.2, 3.8, 4.5, 4.0],
    "email": "ana.garcia@universidad.edu"
  }'
```

**Respuesta:**
```json
{
  "estudiante": {
    "id": 1,
    "nombre": "Ana Sofía García",
    "edad": 21,
    "carrera": "Ingeniería de Sistemas",
    "semestre": 5,
    "activo": true,
    "notas": [4.2, 3.8, 4.5, 4.0],
    "fechaIngreso": "2022-02-15",
    "email": "ana.garcia@universidad.edu",
    "fechaActualizacion": "2024-01-15T10:35:00.000Z",
    "promedio": 4.13
  },
  "mensaje": "Estudiante actualizado exitosamente",
  "status": "success"
}
```

---

### 🔄 **PATCH /estudiantes/:id** - Actualizar parcialmente un estudiante

**Descripción:** Actualiza solo los campos proporcionados (actualización parcial).

**Ejemplo:**
```bash
# Solo actualizar el semestre y agregar una nueva nota
curl -X PATCH http://localhost:3000/estudiantes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "semestre": 6,
    "notas": [4.2, 3.8, 4.5, 4.0, 4.3]
  }'
```

**Respuesta:**
```json
{
  "estudiante": {
    "id": 1,
    "nombre": "Ana García",
    "edad": 20,
    "carrera": "Ingeniería de Sistemas",
    "semestre": 6,
    "activo": true,
    "notas": [4.2, 3.8, 4.5, 4.0, 4.3],
    "fechaIngreso": "2022-02-15",
    "email": "ana.garcia@universidad.edu",
    "fechaCreacion": "2022-02-15T08:00:00.000Z",
    "fechaActualizacion": "2024-01-15T10:40:00.000Z",
    "promedio": 4.16
  },
  "camposActualizados": ["semestre", "notas"],
  "mensaje": "Estudiante actualizado parcialmente",
  "status": "success"
}
```

---

### ❌ **DELETE /estudiantes/:id** - Eliminar un estudiante

**Descripción:** Elimina un estudiante del sistema.

**Ejemplo:**
```bash
curl -X DELETE http://localhost:3000/estudiantes/1
```

**Respuesta:**
```json
{
  "estudiante": {
    "id": 1,
    "nombre": "Ana García",
    "carrera": "Ingeniería de Sistemas"
  },
  "mensaje": "Estudiante eliminado exitosamente",
  "fechaEliminacion": "2024-01-15T10:45:00.000Z",
  "status": "success"
}
```

---

### 📊 **GET /estudiantes/estadisticas/resumen** - Estadísticas generales

**Descripción:** Proporciona estadísticas generales y por carrera.

**Ejemplo:**
```bash
curl http://localhost:3000/estudiantes/estadisticas/resumen
```

**Respuesta:**
```json
{
  "resumen": {
    "totalEstudiantes": 3,
    "activos": 2,
    "inactivos": 1,
    "promedioEdadGeneral": 20,
    "promedioNotasGeneral": 4.03,
    "totalCarreras": 3
  },
  "estadisticasPorCarrera": [
    {
      "carrera": "Ingeniería de Sistemas",
      "cantidad": 1,
      "activos": 1,
      "promedioEdad": 20,
      "promedioNotas": 4.17
    },
    {
      "carrera": "Medicina",
      "cantidad": 1,
      "activos": 1,
      "promedioEdad": 22,
      "promedioNotas": 4.07
    },
    {
      "carrera": "Psicología",
      "cantidad": 1,
      "activos": 0,
      "promedioEdad": 19,
      "promedioNotas": 3.77
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "success"
}
```

---

### ❤️ **GET /health** - Estado de la API

**Descripción:** Información sobre el estado y salud de la API.

**Ejemplo:**
```bash
curl http://localhost:3000/health
```

**Respuesta:**
```json
{
  "status": "OK ✅",
  "api": "API de Estudiantes",
  "version": "1.0.0",
  "uptime": 123.45,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "type": "Array en memoria",
    "estudiantes": 3,
    "conectado": true
  },
  "endpoints": [
    "GET /estudiantes",
    "GET /estudiantes/:id",
    "POST /estudiantes",
    "PUT /estudiantes/:id",
    "PATCH /estudiantes/:id",
    "DELETE /estudiantes/:id",
    "GET /estudiantes/estadisticas/resumen"
  ]
}
```

## 🔧 Funciones Auxiliares

### Validación de Estudiantes
```javascript
function validarEstudiante(datos) {
  // Valida:
  // - Nombre requerido y no vacío
  // - Edad entre 16 y 100 años
  // - Carrera requerida y no vacía
  // - Semestre entre 1 y 12 (opcional)
  // - Email con formato válido (opcional)
}
```

### Cálculo de Promedio
```javascript
function calcularPromedio(notas) {
  // Calcula el promedio de un array de notas
  // Retorna 0 si no hay notas
  // Redondea a 2 decimales
}
```

### Búsqueda de Estudiantes
```javascript
function encontrarEstudiante(id) {
  // Busca un estudiante por ID
  // Convierte el ID a número automáticamente
}
```

## 🎯 Ejercicios Prácticos

### Ejercicio 1: Agregar Campo Teléfono
Modifica la API para incluir un campo `telefono`:
- Agrega validación de formato
- Incluye en todas las operaciones CRUD
- Haz que sea opcional

### Ejercicio 2: Endpoint de Búsqueda Avanzada
Crea un endpoint `GET /estudiantes/buscar` que permita:
- Búsqueda por múltiples criterios simultáneamente
- Rangos de edad y notas
- Filtros por fecha de ingreso

### Ejercicio 3: Validaciones Más Estrictas
Implementa validaciones adicionales:
- Nombres con al menos 2 palabras
- Emails únicos por carrera
- Notas en escala 0.0 a 5.0
- Semestre acorde a la fecha de ingreso

### Ejercicio 4: Endpoint de Reportes
Crea `GET /estudiantes/reportes` que incluya:
- Top 5 estudiantes con mejor promedio
- Distribución por edades
- Tendencias de notas por semestre

### Ejercicio 5: Operaciones en Lote
Implementa endpoints para:
- `POST /estudiantes/lote` - Crear múltiples estudiantes
- `PATCH /estudiantes/activar-todos` - Activar todos los estudiantes
- `DELETE /estudiantes/inactivos` - Eliminar estudiantes inactivos

## ✅ Códigos de Estado HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | Operaciones exitosas (GET, PUT, PATCH, DELETE) |
| 201 | Created | Estudiante creado exitosamente (POST) |
| 400 | Bad Request | Datos de entrada inválidos |
| 404 | Not Found | Estudiante no encontrado |
| 409 | Conflict | Email duplicado o conflicto de datos |
| 500 | Internal Server Error | Errores del servidor |

## 🧪 Flujo de Pruebas Completo

### 1. Verificar estado inicial
```bash
curl http://localhost:3000/estudiantes
curl http://localhost:3000/health
```

### 2. Crear un nuevo estudiante
```bash
curl -X POST http://localhost:3000/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laura Pérez",
    "edad": 19,
    "carrera": "Psicología",
    "semestre": 2,
    "notas": [4.5, 4.2],
    "email": "laura.perez@universidad.edu"
  }'
```

### 3. Obtener el estudiante creado
```bash
curl http://localhost:3000/estudiantes/4
```

### 4. Actualizar parcialmente
```bash
curl -X PATCH http://localhost:3000/estudiantes/4 \
  -H "Content-Type: application/json" \
  -d '{"semestre": 3, "notas": [4.5, 4.2, 4.0]}'
```

### 5. Probar filtros
```bash
curl "http://localhost:3000/estudiantes?carrera=psicologia&ordenar=promedio"
```

### 6. Ver estadísticas
```bash
curl http://localhost:3000/estudiantes/estadisticas/resumen
```

### 7. Eliminar estudiante
```bash
curl -X DELETE http://localhost:3000/estudiantes/4
```

## 💡 Conceptos Clave Aprendidos

### **REST API Principles**
- Uso correcto de métodos HTTP
- Códigos de estado apropiados
- URLs descriptivas y consistentes

### **Validación de Datos**
- Validación en el servidor
- Mensajes de error descriptivos
- Manejo de casos edge

### **Estructura de Respuestas**
- Formato JSON consistente
- Inclusión de metadata útil
- Campos calculados dinámicamente

### **Filtros y Búsquedas**
- Query parameters para filtros
- Búsqueda en múltiples campos
- Ordenamiento dinámico

### **Manejo de Errores**
- Try-catch apropiados
- Logging de errores
- Respuestas de error informativas

## 🔗 Siguientes Pasos

Una vez que domines esta API completa, puedes:

1. **Avanzar a los temas del curso principal:**
   - [Tema 3: Organización de Rutas](../../temas/03-organizacion-rutas/README.md)
   - [Tema 4: Base de Datos con Mongoose](../../temas/04-base-datos-mongoose/README.md)

2. **Mejorar esta API:**
   - Conectar a una base de datos real
   - Agregar autenticación y autorización
   - Implementar paginación
   - Agregar documentación automática con Swagger

3. **Crear APIs similares:**
   - API de cursos
   - API de profesores
   - API de calificaciones

## 🐛 Solución de Problemas

### Error: "Cannot find module 'fastify'"
```bash
pnpm install
```

### Error: "Port already in use"
```bash
PORT=3001 pnpm run dev
```

### Error: "Invalid JSON"
- Verifica que el `Content-Type` sea `application/json`
- Usa comillas dobles en el JSON
- Verifica la sintaxis del JSON

### Estudiante no se crea
- Verifica que incluyas todos los campos requeridos
- Revisa que el email no esté duplicado
- Confirma que la edad esté en el rango válido

¡Esta API de estudiantes te da una base sólida para entender cómo funcionan las APIs REST completas con Fastify! 🎓
