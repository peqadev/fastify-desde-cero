// Importar Fastify
import Fastify from 'fastify'

// Crear una instancia de Fastify con logging habilitado
const fastify = Fastify({
  logger: true // Esto mostrará logs útiles en la consola
})

// ============================================================================
// RUTAS DE LA APLICACIÓN
// ============================================================================

// Ruta principal - GET /
fastify.get('/', async (request, reply) => {
  return {
    mensaje: '¡Hola Mundo desde Fastify! 🚀',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    autor: 'Curso Fastify',
    descripcion: 'Este es un ejemplo básico de servidor Fastify'
  }
})

// Ruta de saludo personalizado - GET /saludo/:nombre
fastify.get('/saludo/:nombre', async (request, reply) => {
  const { nombre } = request.params

  return {
    mensaje: `¡Hola ${nombre}! 👋`,
    timestamp: new Date().toISOString(),
    personalizado: true,
    datos: {
      nombreRecibido: nombre,
      longitudNombre: nombre.length,
      primeraLetra: nombre.charAt(0).toUpperCase()
    }
  }
})

// Ruta de información del servidor - GET /info
fastify.get('/info', async (request, reply) => {
  return {
    servidor: 'Fastify Hello World',
    version: '1.0.0',
    nodeVersion: process.version,
    plataforma: process.platform,
    tiempoActivo: Math.floor(process.uptime()),
    memoria: {
      usado: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unidad: 'MB'
    },
    pid: process.pid,
    timestamp: new Date().toISOString()
  }
})

// Ruta de prueba con query parameters - GET /prueba
fastify.get('/prueba', async (request, reply) => {
  const { mensaje, color, numero } = request.query

  return {
    mensaje: '🧪 Esta es una ruta de prueba',
    parametrosRecibidos: {
      mensaje: mensaje || 'No se envió mensaje',
      color: color || 'No se envió color',
      numero: numero ? parseInt(numero) : null
    },
    ejemploDeUso: 'Prueba con: /prueba?mensaje=hola&color=azul&numero=42',
    queryCompleto: request.query,
    timestamp: new Date().toISOString()
  }
})

// Ruta de estado de salud - GET /health
fastify.get('/health', async (request, reply) => {
  return {
    status: 'OK ✅',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks: {
      servidor: 'funcionando',
      memoria: 'normal',
      respuesta: 'rápida'
    }
  }
})

// ============================================================================
// CONFIGURACIÓN DEL SERVIDOR
// ============================================================================

// Función para iniciar el servidor
const iniciarServidor = async () => {
  try {
    // Configurar el puerto y host
    const puerto = process.env.PORT || 3000
    const host = process.env.HOST || '0.0.0.0'

    // Iniciar el servidor
    await fastify.listen({
      port: puerto,
      host: host
    })

    // Mostrar información de inicio
    console.log('')
    console.log('🎉 ¡Servidor Hello World iniciado exitosamente!')
    console.log(`🌐 URL: http://localhost:${puerto}`)
    console.log('')
    console.log('📋 Rutas disponibles:')
    console.log(`   ✅ GET  http://localhost:${puerto}/`)
    console.log(`   👋 GET  http://localhost:${puerto}/saludo/[nombre]`)
    console.log(`   ℹ️  GET  http://localhost:${puerto}/info`)
    console.log(`   🧪 GET  http://localhost:${puerto}/prueba`)
    console.log(`   ❤️  GET  http://localhost:${puerto}/health`)
    console.log('')
    console.log('💡 Tip: Usa Ctrl+C para detener el servidor')
    console.log('')

  } catch (error) {
    // Si hay un error al iniciar, mostrarlo y salir
    console.error('❌ Error al iniciar el servidor:', error)
    process.exit(1)
  }
}

// Manejar cierre graceful del servidor
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...')
  try {
    await fastify.close()
    console.log('✅ Servidor cerrado correctamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error al cerrar el servidor:', error)
    process.exit(1)
  }
})

// Iniciar el servidor
iniciarServidor()
