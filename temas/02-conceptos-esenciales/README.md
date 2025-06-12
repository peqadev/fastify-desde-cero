# Tema 2: Conceptos Esenciales de Fastify

En este tema profundizarás en los conceptos fundamentales de Fastify: cómo instanciarlo correctamente, trabajar con diferentes métodos HTTP y estructurar rutas básicas.

## 📋 Objetivos

- Entender cómo instanciar Fastify con diferentes opciones
- Dominar los métodos HTTP principales (GET, POST, PUT, DELETE)
- Aprender la estructura básica de una ruta
- Manejar parámetros, query strings y body de requests
- Implementar validación básica de datos

## 🚀 Conceptos Fundamentales

### 1. Instanciación de Fastify

Fastify se puede instanciar con diferentes configuraciones según tus necesidades:

```javascript
import Fastify from 'fastify'

// Configuración básica
const fastify = Fastify({
  logger: true // Habilita logging
})

// Configuración avanzada
const fastifyAvanzado = Fastify({
  logger: {
    level: 'info' // Niveles: fatal, error, warn, info, debug, trace
  },
  ignoreTrailingSlash: true, // /users y /users/ son equivalentes
  maxParamLength: 100, // Longitud máxima de parámetros de URL
  bodyLimit: 1048576, // Límite del body: 1MB
  caseSensitive: false // Rutas no sensibles a mayúsculas/minúsculas
})
```

### 2. Métodos HTTP Principales

#### GET - Obtener datos

```javascript
// GET simple
fastify.get('/usuarios', async (request, reply) => {
  return {
    usuarios: [
      { id: 1, nombre: 'Juan', email: 'juan@email.com' },
      { id: 2, nombre: 'María', email: 'maria@email.com' }
    ],
    total: 2,
    status: 'success'
  }
})

// GET con parámetros de ruta
fastify.get('/usuarios/:id', async (request, reply) => {
  const { id } = request.params

  // Simular búsqueda de usuario
  const usuario = {
    id: parseInt(id),
    nombre: 'Usuario ' + id,
    email: `usuario${id}@email.com`
  }

  return {
    usuario,
    status: 'success'
  }
})

// GET con query parameters
fastify.get('/buscar', async (request, reply) => {
  const { nombre, edad } = request.query

  return {
    criterios: { nombre, edad },
    mensaje: `Buscando usuarios con nombre: ${nombre}, edad: ${edad}`,
    status: 'success'
  }
})
```

#### POST - Crear datos

```javascript
// POST para crear un usuario
fastify.post('/usuarios', async (request, reply) => {
  const { nombre, email, edad } = request.body

  // Validación básica
  if (!nombre || !email) {
    reply.code(400)
    return {
      error: 'Nombre y email son requeridos',
      status: 'error'
    }
  }

  // Simular creación de usuario
  const nuevoUsuario = {
    id: Date.now(), // ID simple para el ejemplo
    nombre,
    email,
    edad: edad || null,
    fechaCreacion: new Date().toISOString()
  }

  reply.code(201) // Código 201 para recurso creado
  return {
    usuario: nuevoUsuario,
    mensaje: 'Usuario creado exitosamente',
    status: 'success'
  }
})
```

#### PUT - Actualizar datos completos

```javascript
// PUT para actualizar un usuario completamente
fastify.put('/usuarios/:id', async (request, reply) => {
  const { id } = request.params
  const { nombre, email, edad } = request.body

  // Validación
  if (!nombre || !email) {
    reply.code(400)
    return {
      error: 'Nombre y email son requeridos para actualización completa',
      status: 'error'
    }
  }

  // Simular actualización
  const usuarioActualizado = {
    id: parseInt(id),
    nombre,
    email,
    edad: edad || null,
    fechaActualizacion: new Date().toISOString()
  }

  return {
    usuario: usuarioActualizado,
    mensaje: 'Usuario actualizado exitosamente',
    status: 'success'
  }
})
```

#### PATCH - Actualizar datos parciales

```javascript
// PATCH para actualizar parcialmente
fastify.patch('/usuarios/:id', async (request, reply) => {
  const { id } = request.params
  const datosActualizacion = request.body

  // Simular usuario existente
  const usuarioExistente = {
    id: parseInt(id),
    nombre: 'Usuario Original',
    email: 'original@email.com',
    edad: 25
  }

  // Actualización parcial
  const usuarioActualizado = {
    ...usuarioExistente,
    ...datosActualizacion, // Solo actualiza los campos enviados
    fechaActualizacion: new Date().toISOString()
  }

  return {
    usuario: usuarioActualizado,
    mensaje: 'Usuario actualizado parcialmente',
    status: 'success'
  }
})
```

#### DELETE - Eliminar datos

```javascript
// DELETE para eliminar un usuario
fastify.delete('/usuarios/:id', async (request, reply) => {
  const { id } = request.params

  // Simular eliminación
  reply.code(200)
  return {
    mensaje: `Usuario con ID ${id} eliminado exitosamente`,
    id: parseInt(id),
    fechaEliminacion: new Date().toISOString(),
    status: 'success'
  }
})
```

### 3. Manejo de Headers y Status Codes

```javascript
// Configurar headers personalizados
fastify.get('/headers-ejemplo', async (request, reply) => {
  reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .header('X-Custom-Header', 'Mi-Valor-Personalizado')

  return {
    mensaje: 'Respuesta con headers personalizados',
    headers: request.headers,
    status: 'success'
  }
})

// Diferentes códigos de estado
fastify.get('/status-ejemplos/:tipo', async (request, reply) => {
  const { tipo } = request.params

  switch (tipo) {
    case 'success':
      reply.code(200)
      return { mensaje: 'Operación exitosa', status: 'success' }

    case 'created':
      reply.code(201)
      return { mensaje: 'Recurso creado', status: 'created' }

    case 'not-found':
      reply.code(404)
      return { error: 'Recurso no encontrado', status: 'error' }

    case 'server-error':
      reply.code(500)
      return { error: 'Error interno del servidor', status: 'error' }

    default:
      reply.code(400)
      return { error: 'Tipo de status no válido', status: 'error' }
  }
})
```

## 📝 Ejemplo Completo: API de Tareas

Crea un archivo `ejemplos/api-tareas.js`:

```javascript
import Fastify from 'fastify'

const fastify = Fastify({ logger: true })

// Simulación de base de datos en memoria
let tareas = [
  { id: 1, titulo: 'Aprender Fastify', completada: false, fecha: '2024-01-15' },
  { id: 2, titulo: 'Crear API REST', completada: false, fecha: '2024-01-16' }
]
let contadorId = 3

// GET - Obtener todas las tareas
fastify.get('/tareas', async (request, reply) => {
  const { completada } = request.query

  let tareasFiltradas = tareas

  if (completada !== undefined) {
    const filtroCompletada = completada === 'true'
    tareasFiltradas = tareas.filter(tarea => tarea.completada === filtroCompletada)
  }

  return {
    tareas: tareasFiltradas,
    total: tareasFiltradas.length,
    status: 'success'
  }
})

// GET - Obtener una tarea específica
fastify.get('/tareas/:id', async (request, reply) => {
  const { id } = request.params
  const tarea = tareas.find(t => t.id === parseInt(id))

  if (!tarea) {
    reply.code(404)
    return {
      error: 'Tarea no encontrada',
      status: 'error'
    }
  }

  return {
    tarea,
    status: 'success'
  }
})

// POST - Crear nueva tarea
fastify.post('/tareas', async (request, reply) => {
  const { titulo, fecha } = request.body

  if (!titulo) {
    reply.code(400)
    return {
      error: 'El título es requerido',
      status: 'error'
    }
  }

  const nuevaTarea = {
    id: contadorId++,
    titulo,
    completada: false,
    fecha: fecha || new Date().toISOString().split('T')[0]
  }

  tareas.push(nuevaTarea)

  reply.code(201)
  return {
    tarea: nuevaTarea,
    mensaje: 'Tarea creada exitosamente',
    status: 'success'
  }
})

// PATCH - Actualizar tarea (marcar como completada)
fastify.patch('/tareas/:id', async (request, reply) => {
  const { id } = request.params
  const { completada, titulo } = request.body

  const tarea = tareas.find(t => t.id === parseInt(id))

  if (!tarea) {
    reply.code(404)
    return {
      error: 'Tarea no encontrada',
      status: 'error'
    }
  }

  // Actualizar solo los campos proporcionados
  if (completada !== undefined) {
    tarea.completada = completada
  }
  if (titulo) {
    tarea.titulo = titulo
  }

  return {
    tarea,
    mensaje: 'Tarea actualizada exitosamente',
    status: 'success'
  }
})

// DELETE - Eliminar tarea
fastify.delete('/tareas/:id', async (request, reply) => {
  const { id } = request.params
  const indice = tareas.findIndex(t => t.id === parseInt(id))

  if (indice === -1) {
    reply.code(404)
    return {
      error: 'Tarea no encontrada',
      status: 'error'
    }
  }

  const tareaEliminada = tareas.splice(indice, 1)[0]

  return {
    tarea: tareaEliminada,
    mensaje: 'Tarea eliminada exitosamente',
    status: 'success'
  }
})

// Iniciar servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 API de Tareas corriendo en http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
```

## 🧪 Probando la API

### Con curl:

```bash
# Obtener todas las tareas
curl http://localhost:3000/tareas

# Crear una nueva tarea
curl -X POST http://localhost:3000/tareas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Nueva tarea", "fecha": "2024-01-20"}'

# Marcar tarea como completada
curl -X PATCH http://localhost:3000/tareas/1 \
  -H "Content-Type: application/json" \
  -d '{"completada": true}'

# Eliminar una tarea
curl -X DELETE http://localhost:3000/tareas/1
```

### Con Postman o Thunder Client:
1. Importa las rutas como una colección
2. Prueba cada endpoint con diferentes datos
3. Verifica los códigos de estado HTTP

## 🔗 Siguientes Pasos

Una vez que domines estos conceptos, continúa con:
**[Tema 3: Organización de Rutas](../03-organizacion-rutas/README.md)**

## 📚 Recursos Adicionales

- [Fastify Routes Documentation](https://www.fastify.io/docs/latest/Reference/Routes/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)
