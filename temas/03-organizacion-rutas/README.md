# Tema 3: Organización de Rutas

En este tema aprenderás a organizar tu código de manera profesional, separando las rutas en diferentes archivos y utilizando el sistema de plugins de Fastify para mantener un código limpio y mantenible.

## 📋 Objetivos

- Separar rutas en archivos modulares
- Utilizar el sistema de plugins de Fastify (`fastify.register`)
- Crear una estructura de carpetas profesional
- Implementar prefijos de rutas y agrupaciones
- Manejar middleware y hooks a nivel de plugin

## 🏗️ Estructura de Proyecto Recomendada

```
mi-proyecto-fastify/
├── package.json
├── app.js                    # Archivo principal
├── src/
│   ├── config/              # Configuraciones
│   │   └── database.js
│   ├── routes/              # Rutas organizadas por módulo
│   │   ├── usuarios.js
│   │   ├── productos.js
│   │   └── auth.js
│   ├── models/              # Modelos de datos
│   │   ├── Usuario.js
│   │   └── Producto.js
│   ├── middleware/          # Middleware personalizado
│   │   └── auth.js
│   └── utils/               # Utilidades
│       └── helpers.js
└── README.md
```

## 🚀 Implementación Paso a Paso

### 1. Archivo Principal (app.js)

```javascript
// app.js
import Fastify from 'fastify'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Crear instancia de Fastify
const fastify = Fastify({
  logger: {
    level: 'info'
  }
})

// Registrar plugins de rutas
async function registerRoutes() {
  // Rutas de usuarios con prefijo /api/usuarios
  await fastify.register(import('./src/routes/usuarios.js'), {
    prefix: '/api/usuarios'
  })

  // Rutas de productos con prefijo /api/productos
  await fastify.register(import('./src/routes/productos.js'), {
    prefix: '/api/productos'
  })

  // Rutas de autenticación con prefijo /api/auth
  await fastify.register(import('./src/routes/auth.js'), {
    prefix: '/api/auth'
  })
}

// Ruta de salud del servidor
fastify.get('/health', async (request, reply) => {
  return {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  }
})

// Registrar todas las rutas
registerRoutes()

// Función para iniciar el servidor
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    })
    console.log('🚀 Servidor corriendo en http://localhost:3000')
    console.log('📍 Rutas disponibles:')
    console.log('   - GET  /health')
    console.log('   - /api/usuarios/* ')
    console.log('   - /api/productos/*')
    console.log('   - /api/auth/*')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
```

### 2. Plugin de Rutas de Usuarios

```javascript
// src/routes/usuarios.js
async function usuariosRoutes(fastify, options) {
  // Simulación de base de datos
  let usuarios = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', activo: true },
    { id: 2, nombre: 'María García', email: 'maria@email.com', activo: true },
    { id: 3, nombre: 'Pedro López', email: 'pedro@email.com', activo: false }
  ]
  let contadorId = 4

  // Hook que se ejecuta antes de cada ruta de este plugin
  fastify.addHook('preHandler', async (request, reply) => {
    request.log.info(`Accediendo a ruta de usuarios: ${request.method} ${request.url}`)
  })

  // GET /api/usuarios - Obtener todos los usuarios
  fastify.get('/', async (request, reply) => {
    const { activo, buscar } = request.query

    let usuariosFiltrados = usuarios

    // Filtrar por estado activo
    if (activo !== undefined) {
      const filtroActivo = activo === 'true'
      usuariosFiltrados = usuariosFiltrados.filter(u => u.activo === filtroActivo)
    }

    // Buscar por nombre o email
    if (buscar) {
      usuariosFiltrados = usuariosFiltrados.filter(u =>
        u.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
        u.email.toLowerCase().includes(buscar.toLowerCase())
      )
    }

    return {
      usuarios: usuariosFiltrados,
      total: usuariosFiltrados.length,
      filtros: { activo, buscar },
      status: 'success'
    }
  })

  // GET /api/usuarios/:id - Obtener usuario específico
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params
    const usuario = usuarios.find(u => u.id === parseInt(id))

    if (!usuario) {
      reply.code(404)
      return {
        error: 'Usuario no encontrado',
        status: 'error'
      }
    }

    return {
      usuario,
      status: 'success'
    }
  })

  // POST /api/usuarios - Crear nuevo usuario
  fastify.post('/', async (request, reply) => {
    const { nombre, email } = request.body

    // Validaciones
    if (!nombre || !email) {
      reply.code(400)
      return {
        error: 'Nombre y email son requeridos',
        status: 'error'
      }
    }

    // Verificar email único
    const emailExiste = usuarios.find(u => u.email === email)
    if (emailExiste) {
      reply.code(409)
      return {
        error: 'El email ya está registrado',
        status: 'error'
      }
    }

    const nuevoUsuario = {
      id: contadorId++,
      nombre,
      email,
      activo: true,
      fechaCreacion: new Date().toISOString()
    }

    usuarios.push(nuevoUsuario)

    reply.code(201)
    return {
      usuario: nuevoUsuario,
      mensaje: 'Usuario creado exitosamente',
      status: 'success'
    }
  })

  // PUT /api/usuarios/:id - Actualizar usuario completo
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params
    const { nombre, email, activo } = request.body

    const indiceUsuario = usuarios.findIndex(u => u.id === parseInt(id))

    if (indiceUsuario === -1) {
      reply.code(404)
      return {
        error: 'Usuario no encontrado',
        status: 'error'
      }
    }

    // Validaciones
    if (!nombre || !email) {
      reply.code(400)
      return {
        error: 'Nombre y email son requeridos',
        status: 'error'
      }
    }

    // Verificar email único (excepto el usuario actual)
    const emailExiste = usuarios.find(u => u.email === email && u.id !== parseInt(id))
    if (emailExiste) {
      reply.code(409)
      return {
        error: 'El email ya está registrado por otro usuario',
        status: 'error'
      }
    }

    // Actualizar usuario
    usuarios[indiceUsuario] = {
      ...usuarios[indiceUsuario],
      nombre,
      email,
      activo: activo !== undefined ? activo : usuarios[indiceUsuario].activo,
      fechaActualizacion: new Date().toISOString()
    }

    return {
      usuario: usuarios[indiceUsuario],
      mensaje: 'Usuario actualizado exitosamente',
      status: 'success'
    }
  })

  // PATCH /api/usuarios/:id - Actualizar usuario parcial
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params
    const datosActualizacion = request.body

    const indiceUsuario = usuarios.findIndex(u => u.id === parseInt(id))

    if (indiceUsuario === -1) {
      reply.code(404)
      return {
        error: 'Usuario no encontrado',
        status: 'error'
      }
    }

    // Verificar email único si se está actualizando
    if (datosActualizacion.email) {
      const emailExiste = usuarios.find(u =>
        u.email === datosActualizacion.email && u.id !== parseInt(id)
      )
      if (emailExiste) {
        reply.code(409)
        return {
          error: 'El email ya está registrado por otro usuario',
          status: 'error'
        }
      }
    }

    // Actualizar solo los campos proporcionados
    usuarios[indiceUsuario] = {
      ...usuarios[indiceUsuario],
      ...datosActualizacion,
      fechaActualizacion: new Date().toISOString()
    }

    return {
      usuario: usuarios[indiceUsuario],
      mensaje: 'Usuario actualizado exitosamente',
      status: 'success'
    }
  })

  // DELETE /api/usuarios/:id - Eliminar usuario
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params
    const indiceUsuario = usuarios.findIndex(u => u.id === parseInt(id))

    if (indiceUsuario === -1) {
      reply.code(404)
      return {
        error: 'Usuario no encontrado',
        status: 'error'
      }
    }

    const usuarioEliminado = usuarios.splice(indiceUsuario, 1)[0]

    return {
      usuario: usuarioEliminado,
      mensaje: 'Usuario eliminado exitosamente',
      status: 'success'
    }
  })
}

export default usuariosRoutes
```

### 3. Plugin de Rutas de Productos

```javascript
// src/routes/productos.js
async function productosRoutes(fastify, options) {
  // Simulación de base de datos
  let productos = [
    { id: 1, nombre: 'Laptop HP', precio: 899.99, categoria: 'electronicos', stock: 10 },
    { id: 2, nombre: 'Camiseta Nike', precio: 29.99, categoria: 'ropa', stock: 50 },
    { id: 3, nombre: 'Sofá 3 plazas', precio: 599.99, categoria: 'hogar', stock: 5 }
  ]
  let contadorId = 4

  const categoriesValidas = ['electronicos', 'ropa', 'hogar', 'deportes', 'libros']

  // Hook para logging específico de productos
  fastify.addHook('preHandler', async (request, reply) => {
    request.log.info(`Operación en productos: ${request.method} ${request.url}`)
  })

  // GET /api/productos - Obtener todos los productos
  fastify.get('/', async (request, reply) => {
    const { categoria, precio_min, precio_max, ordenar, stock_min } = request.query

    let productosFiltrados = productos

    // Filtrar por categoría
    if (categoria) {
      productosFiltrados = productosFiltrados.filter(p =>
        p.categoria.toLowerCase() === categoria.toLowerCase()
      )
    }

    // Filtrar por rango de precio
    if (precio_min) {
      productosFiltrados = productosFiltrados.filter(p => p.precio >= parseFloat(precio_min))
    }
    if (precio_max) {
      productosFiltrados = productosFiltrados.filter(p => p.precio <= parseFloat(precio_max))
    }

    // Filtrar por stock mínimo
    if (stock_min) {
      productosFiltrados = productosFiltrados.filter(p => p.stock >= parseInt(stock_min))
    }

    // Ordenar resultados
    if (ordenar) {
      switch (ordenar.toLowerCase()) {
        case 'precio_asc':
          productosFiltrados.sort((a, b) => a.precio - b.precio)
          break
        case 'precio_desc':
          productosFiltrados.sort((a, b) => b.precio - a.precio)
          break
        case 'nombre':
          productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre))
          break
        case 'stock':
          productosFiltrados.sort((a, b) => b.stock - a.stock)
          break
      }
    }

    return {
      productos: productosFiltrados,
      total: productosFiltrados.length,
      filtros: { categoria, precio_min, precio_max, ordenar, stock_min },
      categorias_disponibles: categoriesValidas,
      status: 'success'
    }
  })

  // GET /api/productos/:id - Obtener producto específico
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params
    const producto = productos.find(p => p.id === parseInt(id))

    if (!producto) {
      reply.code(404)
      return {
        error: 'Producto no encontrado',
        status: 'error'
      }
    }

    return {
      producto,
      status: 'success'
    }
  })

  // POST /api/productos - Crear nuevo producto
  fastify.post('/', async (request, reply) => {
    const { nombre, precio, categoria, stock } = request.body

    // Validaciones
    if (!nombre || !precio || !categoria) {
      reply.code(400)
      return {
        error: 'Nombre, precio y categoría son requeridos',
        status: 'error'
      }
    }

    if (precio <= 0) {
      reply.code(400)
      return {
        error: 'El precio debe ser mayor a 0',
        status: 'error'
      }
    }

    if (!categoriesValidas.includes(categoria.toLowerCase())) {
      reply.code(400)
      return {
        error: `Categoría no válida. Opciones: ${categoriesValidas.join(', ')}`,
        status: 'error'
      }
    }

    const nuevoProducto = {
      id: contadorId++,
      nombre,
      precio: parseFloat(precio),
      categoria: categoria.toLowerCase(),
      stock: stock || 0,
      fechaCreacion: new Date().toISOString()
    }

    productos.push(nuevoProducto)

    reply.code(201)
    return {
      producto: nuevoProducto,
      mensaje: 'Producto creado exitosamente',
      status: 'success'
    }
  })

  // PUT /api/productos/:id - Actualizar producto completo
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params
    const { nombre, precio, categoria, stock } = request.body

    const indiceProducto = productos.findIndex(p => p.id === parseInt(id))

    if (indiceProducto === -1) {
      reply.code(404)
      return {
        error: 'Producto no encontrado',
        status: 'error'
      }
    }

    // Validaciones (mismas que POST)
    if (!nombre || !precio || !categoria) {
      reply.code(400)
      return {
        error: 'Nombre, precio y categoría son requeridos',
        status: 'error'
      }
    }

    if (precio <= 0) {
      reply.code(400)
      return {
        error: 'El precio debe ser mayor a 0',
        status: 'error'
      }
    }

    if (!categoriesValidas.includes(categoria.toLowerCase())) {
      reply.code(400)
      return {
        error: `Categoría no válida. Opciones: ${categoriesValidas.join(', ')}`,
        status: 'error'
      }
    }

    // Actualizar producto
    productos[indiceProducto] = {
      ...productos[indiceProducto],
      nombre,
      precio: parseFloat(precio),
      categoria: categoria.toLowerCase(),
      stock: stock || 0,
      fechaActualizacion: new Date().toISOString()
    }

    return {
      producto: productos[indiceProducto],
      mensaje: 'Producto actualizado exitosamente',
      status: 'success'
    }
  })

  // DELETE /api/productos/:id - Eliminar producto
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params
    const indiceProducto = productos.findIndex(p => p.id === parseInt(id))

    if (indiceProducto === -1) {
      reply.code(404)
      return {
        error: 'Producto no encontrado',
        status: 'error'
      }
    }

    const productoEliminado = productos.splice(indiceProducto, 1)[0]

    return {
      producto: productoEliminado,
      mensaje: 'Producto eliminado exitosamente',
      status: 'success'
    }
  })

  // GET /api/productos/categorias - Obtener categorías disponibles
  fastify.get('/categorias', async (request, reply) => {
    const categoriasConConteo = categoriesValidas.map(categoria => {
      const cantidad = productos.filter(p => p.categoria === categoria).length
      return { categoria, cantidad }
    })

    return {
      categorias: categoriasConConteo,
      total_categorias: categoriesValidas.length,
      status: 'success'
    }
  })
}

export default productosRoutes
```

### 4. Plugin de Rutas de Autenticación

```javascript
// src/routes/auth.js
async function authRoutes(fastify, options) {
  // Simulación de usuarios registrados
  const usuariosRegistrados = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'usuario', password: 'user123', role: 'user' }
  ]

  // POST /api/auth/login - Iniciar sesión
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body

    if (!username || !password) {
      reply.code(400)
      return {
        error: 'Username y password son requeridos',
        status: 'error'
      }
    }

    const usuario = usuariosRegistrados.find(u =>
      u.username === username && u.password === password
    )

    if (!usuario) {
      reply.code(401)
      return {
        error: 'Credenciales inválidas',
        status: 'error'
      }
    }

    // En un caso real, aquí generarías un JWT
    const token = Buffer.from(`${usuario.id}:${usuario.username}:${Date.now()}`).toString('base64')

    return {
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        role: usuario.role
      },
      status: 'success'
    }
  })

  // POST /api/auth/register - Registrar usuario
  fastify.post('/register', async (request, reply) => {
    const { username, password, confirmPassword } = request.body

    // Validaciones
    if (!username || !password || !confirmPassword) {
      reply.code(400)
      return {
        error: 'Todos los campos son requeridos',
        status: 'error'
      }
    }

    if (password !== confirmPassword) {
      reply.code(400)
      return {
        error: 'Las contraseñas no coinciden',
        status: 'error'
      }
    }

    if (password.length < 6) {
      reply.code(400)
      return {
        error: 'La contraseña debe tener al menos 6 caracteres',
        status: 'error'
      }
    }

    // Verificar si el usuario ya existe
    const usuarioExiste = usuariosRegistrados.find(u => u.username === username)
    if (usuarioExiste) {
      reply.code(409)
      return {
        error: 'El username ya está registrado',
        status: 'error'
      }
    }

    // Registrar nuevo usuario
    const nuevoUsuario = {
      id: usuariosRegistrados.length + 1,
      username,
      password, // En un caso real, deberías hashear la contraseña
      role: 'user',
      fechaRegistro: new Date().toISOString()
    }

    usuariosRegistrados.push(nuevoUsuario)

    reply.code(201)
    return {
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        username: nuevoUsuario.username,
        role: nuevoUsuario.role
      },
      status: 'success'
    }
  })

  // GET /api/auth/me - Obtener información del usuario actual (requiere token)
  fastify.get('/me', async (request, reply) => {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.code(401)
      return {
        error: 'Token de autorización requerido',
        status: 'error'
      }
    }

    const token = authHeader.substring(7) // Remover "Bearer "

    try {
      // Decodificar token simple (en un caso real usarías JWT)
      const decoded = Buffer.from(token, 'base64').toString()
      const [userId, username] = decoded.split(':')

      const usuario = usuariosRegistrados.find(u =>
        u.id === parseInt(userId) && u.username === username
      )

      if (!usuario) {
        reply.code(401)
        return {
          error: 'Token inválido',
          status: 'error'
        }
      }

      return {
        usuario: {
          id: usuario.id,
          username: usuario.username,
          role: usuario.role
        },
        status: 'success'
      }
    } catch (error) {
      reply.code(401)
      return {
        error: 'Token inválido',
        status: 'error'
      }
    }
  })
}

export default authRoutes
```

## 🧪 Probando la API Organizada

```bash
# Salud del servidor
curl http://localhost:3000/health

# Usuarios
curl http://localhost:3000/api/usuarios
curl http://localhost:3000/api/usuarios?activo=true&buscar=juan

# Productos
curl http://localhost:3000/api/productos
curl http://localhost:3000/api/productos?categoria=electronicos&precio_min=100

# Autenticación
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

## ✅ Verificación

Al completar este tema deberías poder:

1. ✅ Separar rutas en archivos modulares
2. ✅ Usar fastify.register para cargar plugins
3. ✅ Implementar prefijos de rutas
4. ✅ Crear hooks específicos por plugin
5. ✅ Organizar código en una estructura mantenible
6. ✅ Manejar diferentes dominios de la aplicación por separado

## 🔗 Siguientes Pasos

Una vez que tengas tu código bien organizado, continúa con:
**[Tema 4: Base de Datos con Mongoose](../04-base-datos-mongoose/README.md)**

## 📚 Recursos Adicionales

- [Fastify Plugins](https://www.fastify.io/docs/latest/Reference/Plugins/)
- [Fastify Hooks](https://www.fastify.io/docs/latest/Reference/Hooks/)
- [Node.js Project Structure](https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/)
```
