# Tema 4: Base de Datos con Mongoose

En este tema final aprenderás a conectar tu aplicación Fastify con MongoDB usando Mongoose, crear modelos de datos, y realizar operaciones CRUD completas con manejo profesional de errores.

## 📋 Objetivos

- Instalar y configurar Mongoose en un proyecto Fastify
- Conectar la aplicación a una base de datos MongoDB
- Crear modelos de datos (schemas) con Mongoose
- Implementar operaciones CRUD completas
- Manejar errores de base de datos y validaciones
- Estructurar respuestas JSON consistentes

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

```bash
# Instalar Mongoose
pnpm add mongoose

# Instalar dependencias de desarrollo (opcional)
pnpm add -D @types/node

# Para variables de entorno
pnpm add dotenv
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# .env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fastify-curso
DB_NAME=fastify-curso

# Para MongoDB Atlas (opcional)
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/fastify-curso?retryWrites=true&w=majority
```

### 3. Configurar la Conexión a MongoDB

Crea el archivo `src/config/database.js`:

```javascript
// src/config/database.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

class Database {
  constructor() {
    this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fastify-curso'
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout después de 5s
      socketTimeoutMS: 45000, // Cerrar conexiones después de 45s de inactividad
      maxPoolSize: 10, // Mantener hasta 10 conexiones de socket
      serverSelectionTimeoutMS: 5000, // Tiempo de espera para seleccionar servidor
      bufferMaxEntries: 0,
      bufferCommands: false,
    }
  }

  async connect() {
    try {
      await mongoose.connect(this.mongoUri, this.options)
      console.log('🍃 Conectado a MongoDB exitosamente')
      console.log(`📍 Base de datos: ${mongoose.connection.name}`)

      // Eventos de conexión
      mongoose.connection.on('error', (err) => {
        console.error('❌ Error de conexión a MongoDB:', err)
      })

      mongoose.connection.on('disconnected', () => {
        console.log('🔌 Desconectado de MongoDB')
      })

      process.on('SIGINT', () => {
        mongoose.connection.close(() => {
          console.log('🔐 Conexión a MongoDB cerrada por terminación de la aplicación')
          process.exit(0)
        })
      })

    } catch (error) {
      console.error('❌ Error al conectar con MongoDB:', error)
      process.exit(1)
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect()
      console.log('🔌 Desconectado de MongoDB')
    } catch (error) {
      console.error('❌ Error al desconectar de MongoDB:', error)
    }
  }

  getConnection() {
    return mongoose.connection
  }

  isConnected() {
    return mongoose.connection.readyState === 1
  }
}

export default new Database()
```

## 📊 Creación de Modelos

### 1. Modelo de Usuario

```javascript
// src/models/Usuario.js
import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Por favor ingresa un email válido'
    ]
  },
  edad: {
    type: Number,
    min: [0, 'La edad no puede ser negativa'],
    max: [120, 'La edad no puede ser mayor a 120']
  },
  telefono: {
    type: String,
    trim: true,
    match: [
      /^[\+]?[0-9\s\-\(\)]+$/,
      'Por favor ingresa un número de teléfono válido'
    ]
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  ultimaConexion: {
    type: Date
  },
  direccion: {
    calle: String,
    ciudad: String,
    codigoPostal: String,
    pais: {
      type: String,
      default: 'Colombia'
    }
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  versionKey: false // Remueve __v
})

// Índeel para búsquedas rápidas
usuarioSchema.index({ email: 1 })
usuarioSchema.index({ activo: 1 })
usuarioSchema.index({ fechaRegistro: -1 })

// Método virtual para obtener nombre completo
usuarioSchema.virtual('datosCompletos').get(function() {
  return {
    id: this._id,
    nombre: this.nombre,
    email: this.email,
    activo: this.activo,
    antiguedad: Math.floor((Date.now() - this.fechaRegistro) / (1000 * 60 * 60 * 24))
  }
})

// Método estático para buscar usuarios activos
usuarioSchema.statics.buscarActivos = function() {
  return this.find({ activo: true }).sort({ fechaRegistro: -1 })
}

// Método de instancia para actualizar última conexión
usuarioSchema.methods.actualizarConexion = function() {
  this.ultimaConexion = new Date()
  return this.save()
}

// Middleware pre-save para validaciones adicionales
usuarioSchema.pre('save', function(next) {
  if (this.isNew) {
    console.log(`🆕 Creando nuevo usuario: ${this.email}`)
  }
  next()
})

// Middleware post-save para logging
usuarioSchema.post('save', function(doc) {
  console.log(`✅ Usuario guardado: ${doc.email}`)
})

const Usuario = mongoose.model('Usuario', usuarioSchema)

export default Usuario
```

### 2. Modelo de Producto

```javascript
// src/models/Producto.js
import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo'],
    get: function(value) {
      return Math.round(value * 100) / 100 // Redondear a 2 decimales
    }
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: {
      values: ['electronicos', 'ropa', 'hogar', 'deportes', 'libros', 'otros'],
      message: 'Categoría no válida: {VALUE}'
    },
    lowercase: true
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true, // Permite múltiples documentos con valor null
    uppercase: true,
    match: [/^[A-Z0-9]{3,20}$/, 'SKU debe contener solo letras mayúsculas y números']
  },
  disponible: {
    type: Boolean,
    default: true
  },
  imagenes: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    esPrincipal: {
      type: Boolean,
      default: false
    }
  }],
  especificaciones: {
    peso: Number,
    dimensiones: {
      largo: Number,
      ancho: Number,
      alto: Number
    },
    material: String,
    color: String
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { getters: true } // Incluir getters en JSON
})

// Índices para búsquedas optimizadas
productoSchema.index({ categoria: 1, precio: 1 })
productoSchema.index({ nombre: 'text', descripcion: 'text' }) // Búsqueda de texto
productoSchema.index({ disponible: 1, stock: 1 })

// Virtual para determinar si está en stock
productoSchema.virtual('enStock').get(function() {
  return this.disponible && this.stock > 0
})

// Virtual para URL de imagen principal
productoSchema.virtual('imagenPrincipal').get(function() {
  const imagenPrincipal = this.imagenes.find(img => img.esPrincipal)
  return imagenPrincipal ? imagenPrincipal.url : (this.imagenes[0]?.url || null)
})

// Método estático para buscar por categoría
productoSchema.statics.buscarPorCategoria = function(categoria, opciones = {}) {
  const query = { categoria: categoria.toLowerCase(), disponible: true }

  if (opciones.precioMin) query.precio = { $gte: opciones.precioMin }
  if (opciones.precioMax) query.precio = { ...query.precio, $lte: opciones.precioMax }
  if (opciones.enStock) query.stock = { $gt: 0 }

  return this.find(query).sort(opciones.ordenar || { createdAt: -1 })
}

// Método de instancia para actualizar stock
productoSchema.methods.actualizarStock = function(cantidad, operacion = 'restar') {
  if (operacion === 'restar') {
    this.stock = Math.max(0, this.stock - cantidad)
  } else if (operacion === 'sumar') {
    this.stock += cantidad
  }

  this.disponible = this.stock > 0
  return this.save()
}

// Middleware pre-save para generar SKU automático
productoSchema.pre('save', function(next) {
  if (this.isNew && !this.sku) {
    const categoria = this.categoria.toUpperCase().substring(0, 3)
    const timestamp = Date.now().toString().slice(-6)
    this.sku = `${categoria}${timestamp}`
  }
  next()
})

const Producto = mongoose.model('Producto', productoSchema)

export default Producto
```

## 🔌 Integración con Fastify

### 1. Actualizar el archivo principal

```javascript
// app.js
import Fastify from 'fastify'
import dotenv from 'dotenv'
import Database from './src/config/database.js'

dotenv.config()

// Crear instancia de Fastify
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info'
  }
})

// Conectar a la base de datos antes de iniciar el servidor
async function startServer() {
  try {
    // Conectar a MongoDB
    await Database.connect()

    // Registrar plugins de rutas
    await Promise.all([
      fastify.register(import('./src/routes/usuarios.js'), { prefix: '/api/usuarios' }),
      fastify.register(import('./src/routes/productos.js'), { prefix: '/api/productos' }),
      fastify.register(import('./src/routes/auth.js'), { prefix: '/api/auth' })
    ])

    // Ruta de salud con información de DB
    fastify.get('/health', async (request, reply) => {
      return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        database: {
          connected: Database.isConnected(),
          name: Database.getConnection().name
        }
      }
    })

    // Iniciar servidor
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    })

    console.log('🚀 Servidor Fastify corriendo en http://localhost:3000')
    console.log('📊 Endpoints disponibles:')
    console.log('   - GET  /health')
    console.log('   - CRUD /api/usuarios')
    console.log('   - CRUD /api/productos')
    console.log('   - AUTH /api/auth')

  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err)
    await Database.disconnect()
    process.exit(1)
  }
}

startServer()
```

### 2. Rutas de Usuarios con MongoDB

```javascript
// src/routes/usuarios.js
import Usuario from '../models/Usuario.js'

async function usuariosRoutes(fastify, options) {

  // GET /api/usuarios - Obtener todos los usuarios
  fastify.get('/', async (request, reply) => {
    try {
      const {
        activo,
        buscar,
        limite = 10,
        pagina = 1,
        ordenar = '-fechaRegistro'
      } = request.query

      // Construir filtros
      const filtros = {}
      if (activo !== undefined) {
        filtros.activo = activo === 'true'
      }

      if (buscar) {
        filtros.$or = [
          { nombre: { $regex: buscar, $options: 'i' } },
          { email: { $regex: buscar, $options: 'i' } }
        ]
      }

      // Paginación
      const skip = (parseInt(pagina) - 1) * parseInt(limite)

      // Ejecutar consulta con paginación
      const [usuarios, total] = await Promise.all([
        Usuario.find(filtros)
          .sort(ordenar)
          .limit(parseInt(limite))
          .skip(skip)
          .select('-__v'), // Excluir campo __v
        Usuario.countDocuments(filtros)
      ])

      return {
        usuarios,
        paginacion: {
          total,
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          totalPaginas: Math.ceil(total / parseInt(limite))
        },
        filtros: { activo, buscar, ordenar },
        status: 'success'
      }

    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        status: 'error'
      }
    }
  })

  // GET /api/usuarios/:id - Obtener usuario específico
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params

      // Validar formato de ObjectId
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        reply.code(400)
        return {
          error: 'ID de usuario no válido',
          status: 'error'
        }
      }

      const usuario = await Usuario.findById(id).select('-__v')

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

    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        status: 'error'
      }
    }
  })

  // POST /api/usuarios - Crear nuevo usuario
  fastify.post('/', async (request, reply) => {
    try {
      const datosUsuario = request.body

      // Crear usuario
      const nuevoUsuario = new Usuario(datosUsuario)
      await nuevoUsuario.save()

      reply.code(201)
      return {
        usuario: nuevoUsuario,
        mensaje: 'Usuario creado exitosamente',
        status: 'success'
      }

    } catch (error) {
      fastify.log.error(error)

      // Manejar errores específicos de MongoDB
      if (error.code === 11000) {
        // Error de duplicado (email único)
        reply.code(409)
        return {
          error: 'El email ya está registrado',
          campo: 'email',
          status: 'error'
        }
      }

      if (error.name === 'ValidationError') {
        // Errores de validación de Mongoose
        const errores = Object.values(error.errors).map(err => ({
          campo: err.path,
          mensaje: err.message
        }))

        reply.code(400)
        return {
          error: 'Datos de usuario no válidos',
          errores,
          status: 'error'
        }
      }

      reply.code(500)
      return {
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        status: 'error'
      }
    }
  })

  // PUT /api/usuarios/:id - Actualizar usuario completo
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params
      const datosActualizacion = request.body

      // Validar formato de ObjectId
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        reply.code(400)
        return {
          error: 'ID de usuario no válido',
          status: 'error'
        }
      }

      const usuario = await Usuario.findByIdAndUpdate(
        id,
        datosActualizacion,
        {
          new: true, // Devolver documento actualizado
          runValidators: true // Ejecutar validaciones del schema
        }
      ).select('-__v')

      if (!usuario) {
        reply.code(404)
        return {
          error: 'Usuario no encontrado',
          status: 'error'
        }
      }

      return {
        usuario,
        mensaje: 'Usuario actualizado exitosamente',
        status: 'success'
      }

    } catch (error) {
      fastify.log.error(error)

      if (error.code === 11000) {
        reply.code(409)
        return {
          error: 'El email ya está registrado por otro usuario',
          status: 'error'
        }
      }

      if (error.name === 'ValidationError') {
        const errores = Object.values(error.errors).map(err => ({
          campo: err.path,
          mensaje: err.message
        }))

        reply.code(400)
        return {
          error: 'Datos de usuario no válidos',
          errores,
          status: 'error'
        }
      }

      reply.code(500)
      return {
        error: 'Error interno del servidor',
        status: 'error'
      }
    }
  })

  // DELETE /api/usuarios/:id - Eliminar usuario
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        reply.code(400)
        return {
          error: 'ID de usuario no válido',
          status: 'error'
        }
      }

      const usuario = await Usuario.findByIdAndDelete(id)

      if (!usuario) {
        reply.code(404)
        return {
          error: 'Usuario no encontrado',
          status: 'error'
        }
      }

      return {
        mensaje: 'Usuario eliminado exitosamente',
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email
        },
        status: 'success'
      }

    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        error: 'Error interno del servidor',
        status: 'error'
      }
    }
  })

  // GET /api/usuarios/activos - Obtener solo usuarios activos (método estático)
  fastify.get('/estado/activos', async (request, reply) => {
    try {
      const usuarios = await Usuario.buscarActivos()

      return {
        usuarios,
        total: usuarios.length,
        status: 'success'
      }

    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        error: 'Error interno del servidor',
        status: 'error'
      }
    }
  })
}

export default usuariosRoutes
```

## 🧪 Comandos de Prueba

```bash
# Crear usuario
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@email.com",
    "edad": 30,
    "telefono": "+57-300-123-4567",
    "direccion": {
      "calle": "Calle 123 #45-67",
      "ciudad": "Bogotá",
      "codigoPostal": "110111"
    }
  }'

# Buscar usuarios
curl "http://localhost:3000/api/usuarios?buscar=juan&limite=5&pagina=1"

# Actualizar usuario
curl -X PUT http://localhost:3000/api/usuarios/[ID_USUARIO] \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan Carlos Pérez", "edad": 31}'
```

## ✅ Verificación Final

Al completar este tema completo deberías poder:

1. ✅ Conectar Fastify con MongoDB usando Mongoose
2. ✅ Crear modelos con validaciones y tipos de datos
3. ✅ Implementar operaciones CRUD completas
4. ✅ Manejar errores de base de datos apropiadamente
5. ✅ Usar funciones avanzadas como índices, virtuals y middleware
6. ✅ Implementar paginación y filtros
7. ✅ Estructurar respuestas JSON consistentes

## 🎓 ¡Felicitaciones!

Has completado el curso completo de Fastify con pnpm. Ahora tienes las habilidades para:

- ✅ Crear proyectos profesionales con Fastify
- ✅ Organizar código de manera mantenible
- ✅ Integrar bases de datos MongoDB
- ✅ Implementar APIs REST completas
- ✅ Manejar errores y validaciones
- ✅ Usar mejores prácticas de desarrollo

## 📚 Recursos Adicionales

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/)
- [Fastify Best Practices](https://www.fastify.io/docs/latest/Guides/Best-Practices/)
- [Node.js Production Best Practices](https://github.com/goldbergyoni/nodebestpractices)
