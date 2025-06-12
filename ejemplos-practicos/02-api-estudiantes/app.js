// Importar Fastify
import Fastify from 'fastify'

// Crear una instancia de Fastify con logging habilitado
const fastify = Fastify({
  logger: true
})

// ============================================================================
// BASE DE DATOS SIMULADA (Array en memoria)
// ============================================================================

// Array que simula una base de datos de estudiantes
let estudiantes = [
  {
    id: 1,
    nombre: "Ana García",
    edad: 20,
    carrera: "Ingeniería de Sistemas",
    semestre: 4,
    activo: true,
    notas: [4.2, 3.8, 4.5],
    fechaIngreso: "2022-02-15",
    email: "ana.garcia@universidad.edu"
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    edad: 22,
    carrera: "Medicina",
    semestre: 6,
    activo: true,
    notas: [4.0, 4.3, 3.9],
    fechaIngreso: "2021-08-20",
    email: "carlos.rodriguez@universidad.edu"
  },
  {
    id: 3,
    nombre: "María López",
    edad: 19,
    carrera: "Psicología",
    semestre: 2,
    activo: false,
    notas: [3.5, 3.8, 4.0],
    fechaIngreso: "2023-01-10",
    email: "maria.lopez@universidad.edu"
  }
]

// Contador para generar IDs únicos
let siguienteId = 4

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

// Función para validar datos de estudiante
function validarEstudiante(datos) {
  const errores = []

  if (!datos.nombre || datos.nombre.trim() === '') {
    errores.push('El nombre es requerido')
  }

  if (!datos.edad || datos.edad < 16 || datos.edad > 100) {
    errores.push('La edad debe estar entre 16 y 100 años')
  }

  if (!datos.carrera || datos.carrera.trim() === '') {
    errores.push('La carrera es requerida')
  }

  if (datos.semestre && (datos.semestre < 1 || datos.semestre > 12)) {
    errores.push('El semestre debe estar entre 1 y 12')
  }

  if (datos.email && !datos.email.includes('@')) {
    errores.push('El email debe tener un formato válido')
  }

  return errores
}

// Función para calcular promedio de notas
function calcularPromedio(notas) {
  if (!notas || notas.length === 0) return 0
  return Math.round((notas.reduce((sum, nota) => sum + nota, 0) / notas.length) * 100) / 100
}

// Función para buscar estudiante por ID
function encontrarEstudiante(id) {
  return estudiantes.find(estudiante => estudiante.id === parseInt(id))
}

// ============================================================================
// RUTAS DE LA API
// ============================================================================

// 📋 GET /estudiantes - Obtener todos los estudiantes (con filtros)
fastify.get('/estudiantes', async (request, reply) => {
  try {
    const {
      activo,
      carrera,
      semestre_min,
      semestre_max,
      buscar,
      ordenar
    } = request.query

    let estudiantesFiltrados = [...estudiantes]

    // Filtrar por estado activo
    if (activo !== undefined) {
      const esActivo = activo === 'true'
      estudiantesFiltrados = estudiantesFiltrados.filter(e => e.activo === esActivo)
    }

    // Filtrar por carrera
    if (carrera) {
      estudiantesFiltrados = estudiantesFiltrados.filter(e =>
        e.carrera.toLowerCase().includes(carrera.toLowerCase())
      )
    }

    // Filtrar por semestre mínimo
    if (semestre_min) {
      estudiantesFiltrados = estudiantesFiltrados.filter(e =>
        e.semestre >= parseInt(semestre_min)
      )
    }

    // Filtrar por semestre máximo
    if (semestre_max) {
      estudiantesFiltrados = estudiantesFiltrados.filter(e =>
        e.semestre <= parseInt(semestre_max)
      )
    }

    // Buscar por nombre o email
    if (buscar) {
      estudiantesFiltrados = estudiantesFiltrados.filter(e =>
        e.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
        e.email.toLowerCase().includes(buscar.toLowerCase())
      )
    }

    // Ordenar resultados
    if (ordenar) {
      switch (ordenar.toLowerCase()) {
        case 'nombre':
          estudiantesFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre))
          break
        case 'edad':
          estudiantesFiltrados.sort((a, b) => a.edad - b.edad)
          break
        case 'semestre':
          estudiantesFiltrados.sort((a, b) => a.semestre - b.semestre)
          break
        case 'promedio':
          estudiantesFiltrados.sort((a, b) =>
            calcularPromedio(b.notas) - calcularPromedio(a.notas)
          )
          break
      }
    }

    // Agregar promedio calculado a cada estudiante
    const estudiantesConPromedio = estudiantesFiltrados.map(estudiante => ({
      ...estudiante,
      promedio: calcularPromedio(estudiante.notas)
    }))

    return {
      estudiantes: estudiantesConPromedio,
      total: estudiantesConPromedio.length,
      filtros: {
        activo,
        carrera,
        semestre_min,
        semestre_max,
        buscar,
        ordenar
      },
      estadisticas: {
        totalGeneral: estudiantes.length,
        activos: estudiantes.filter(e => e.activo).length,
        inactivos: estudiantes.filter(e => !e.activo).length,
        promedioEdad: Math.round(
          estudiantes.reduce((sum, e) => sum + e.edad, 0) / estudiantes.length
        )
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

// 🔍 GET /estudiantes/:id - Obtener un estudiante específico
fastify.get('/estudiantes/:id', async (request, reply) => {
  try {
    const { id } = request.params
    const estudiante = encontrarEstudiante(id)

    if (!estudiante) {
      reply.code(404)
      return {
        error: 'Estudiante no encontrado',
        id: parseInt(id),
        status: 'error'
      }
    }

    // Agregar información adicional
    const estudianteCompleto = {
      ...estudiante,
      promedio: calcularPromedio(estudiante.notas),
      diasEnUniversidad: Math.floor(
        (new Date() - new Date(estudiante.fechaIngreso)) / (1000 * 60 * 60 * 24)
      ),
      ultimaActualizacion: new Date().toISOString()
    }

    return {
      estudiante: estudianteCompleto,
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

// ➕ POST /estudiantes - Crear un nuevo estudiante
fastify.post('/estudiantes', async (request, reply) => {
  try {
    const datosEstudiante = request.body

    // Validar datos
    const errores = validarEstudiante(datosEstudiante)
    if (errores.length > 0) {
      reply.code(400)
      return {
        error: 'Datos del estudiante no válidos',
        errores,
        status: 'error'
      }
    }

    // Verificar email único
    if (datosEstudiante.email) {
      const emailExiste = estudiantes.find(e => e.email === datosEstudiante.email)
      if (emailExiste) {
        reply.code(409)
        return {
          error: 'El email ya está registrado',
          email: datosEstudiante.email,
          status: 'error'
        }
      }
    }

    // Crear nuevo estudiante
    const nuevoEstudiante = {
      id: siguienteId++,
      nombre: datosEstudiante.nombre.trim(),
      edad: parseInt(datosEstudiante.edad),
      carrera: datosEstudiante.carrera.trim(),
      semestre: datosEstudiante.semestre || 1,
      activo: datosEstudiante.activo !== undefined ? datosEstudiante.activo : true,
      notas: datosEstudiante.notas || [],
      fechaIngreso: datosEstudiante.fechaIngreso || new Date().toISOString().split('T')[0],
      email: datosEstudiante.email || `${datosEstudiante.nombre.toLowerCase().replace(/\s+/g, '.')}@universidad.edu`,
      fechaCreacion: new Date().toISOString()
    }

    estudiantes.push(nuevoEstudiante)

    reply.code(201)
    return {
      estudiante: {
        ...nuevoEstudiante,
        promedio: calcularPromedio(nuevoEstudiante.notas)
      },
      mensaje: 'Estudiante creado exitosamente',
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

// ✏️ PUT /estudiantes/:id - Actualizar un estudiante completo
fastify.put('/estudiantes/:id', async (request, reply) => {
  try {
    const { id } = request.params
    const datosActualizacion = request.body

    const indiceEstudiante = estudiantes.findIndex(e => e.id === parseInt(id))

    if (indiceEstudiante === -1) {
      reply.code(404)
      return {
        error: 'Estudiante no encontrado',
        id: parseInt(id),
        status: 'error'
      }
    }

    // Validar datos
    const errores = validarEstudiante(datosActualizacion)
    if (errores.length > 0) {
      reply.code(400)
      return {
        error: 'Datos del estudiante no válidos',
        errores,
        status: 'error'
      }
    }

    // Verificar email único (excepto el estudiante actual)
    if (datosActualizacion.email) {
      const emailExiste = estudiantes.find(e =>
        e.email === datosActualizacion.email && e.id !== parseInt(id)
      )
      if (emailExiste) {
        reply.code(409)
        return {
          error: 'El email ya está registrado por otro estudiante',
          email: datosActualizacion.email,
          status: 'error'
        }
      }
    }

    // Actualizar estudiante
    estudiantes[indiceEstudiante] = {
      ...estudiantes[indiceEstudiante],
      nombre: datosActualizacion.nombre.trim(),
      edad: parseInt(datosActualizacion.edad),
      carrera: datosActualizacion.carrera.trim(),
      semestre: datosActualizacion.semestre || estudiantes[indiceEstudiante].semestre,
      activo: datosActualizacion.activo !== undefined ? datosActualizacion.activo : estudiantes[indiceEstudiante].activo,
      notas: datosActualizacion.notas || estudiantes[indiceEstudiante].notas,
      email: datosActualizacion.email || estudiantes[indiceEstudiante].email,
      fechaActualizacion: new Date().toISOString()
    }

    return {
      estudiante: {
        ...estudiantes[indiceEstudiante],
        promedio: calcularPromedio(estudiantes[indiceEstudiante].notas)
      },
      mensaje: 'Estudiante actualizado exitosamente',
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

// 🔄 PATCH /estudiantes/:id - Actualizar parcialmente un estudiante
fastify.patch('/estudiantes/:id', async (request, reply) => {
  try {
    const { id } = request.params
    const datosActualizacion = request.body

    const indiceEstudiante = estudiantes.findIndex(e => e.id === parseInt(id))

    if (indiceEstudiante === -1) {
      reply.code(404)
      return {
        error: 'Estudiante no encontrado',
        id: parseInt(id),
        status: 'error'
      }
    }

    // Verificar email único si se está actualizando
    if (datosActualizacion.email) {
      const emailExiste = estudiantes.find(e =>
        e.email === datosActualizacion.email && e.id !== parseInt(id)
      )
      if (emailExiste) {
        reply.code(409)
        return {
          error: 'El email ya está registrado por otro estudiante',
          email: datosActualizacion.email,
          status: 'error'
        }
      }
    }

    // Actualizar solo los campos proporcionados
    const estudianteActual = estudiantes[indiceEstudiante]
    estudiantes[indiceEstudiante] = {
      ...estudianteActual,
      ...datosActualizacion,
      id: estudianteActual.id, // Mantener ID original
      fechaCreacion: estudianteActual.fechaCreacion, // Mantener fecha de creación
      fechaActualizacion: new Date().toISOString()
    }

    return {
      estudiante: {
        ...estudiantes[indiceEstudiante],
        promedio: calcularPromedio(estudiantes[indiceEstudiante].notas)
      },
      camposActualizados: Object.keys(datosActualizacion),
      mensaje: 'Estudiante actualizado parcialmente',
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

// ❌ DELETE /estudiantes/:id - Eliminar un estudiante
fastify.delete('/estudiantes/:id', async (request, reply) => {
  try {
    const { id } = request.params
    const indiceEstudiante = estudiantes.findIndex(e => e.id === parseInt(id))

    if (indiceEstudiante === -1) {
      reply.code(404)
      return {
        error: 'Estudiante no encontrado',
        id: parseInt(id),
        status: 'error'
      }
    }

    const estudianteEliminado = estudiantes.splice(indiceEstudiante, 1)[0]

    return {
      estudiante: {
        id: estudianteEliminado.id,
        nombre: estudianteEliminado.nombre,
        carrera: estudianteEliminado.carrera
      },
      mensaje: 'Estudiante eliminado exitosamente',
      fechaEliminacion: new Date().toISOString(),
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

// 📊 GET /estudiantes/estadisticas/resumen - Estadísticas generales
fastify.get('/estudiantes/estadisticas/resumen', async (request, reply) => {
  try {
    const carreras = [...new Set(estudiantes.map(e => e.carrera))]
    const estadisticasPorCarrera = carreras.map(carrera => {
      const estudiantesCarrera = estudiantes.filter(e => e.carrera === carrera)
      return {
        carrera,
        cantidad: estudiantesCarrera.length,
        activos: estudiantesCarrera.filter(e => e.activo).length,
        promedioEdad: Math.round(
          estudiantesCarrera.reduce((sum, e) => sum + e.edad, 0) / estudiantesCarrera.length
        ),
        promedioNotas: Math.round(
          estudiantesCarrera.reduce((sum, e) => sum + calcularPromedio(e.notas), 0) / estudiantesCarrera.length * 100
        ) / 100
      }
    })

    return {
      resumen: {
        totalEstudiantes: estudiantes.length,
        activos: estudiantes.filter(e => e.activo).length,
        inactivos: estudiantes.filter(e => !e.activo).length,
        promedioEdadGeneral: Math.round(
          estudiantes.reduce((sum, e) => sum + e.edad, 0) / estudiantes.length
        ),
        promedioNotasGeneral: Math.round(
          estudiantes.reduce((sum, e) => sum + calcularPromedio(e.notas), 0) / estudiantes.length * 100
        ) / 100,
        totalCarreras: carreras.length
      },
      estadisticasPorCarrera,
      timestamp: new Date().toISOString(),
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

// ❤️ GET /health - Estado de salud de la API
fastify.get('/health', async (request, reply) => {
  return {
    status: 'OK ✅',
    api: 'API de Estudiantes',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      type: 'Array en memoria',
      estudiantes: estudiantes.length,
      conectado: true
    },
    endpoints: [
      'GET /estudiantes',
      'GET /estudiantes/:id',
      'POST /estudiantes',
      'PUT /estudiantes/:id',
      'PATCH /estudiantes/:id',
      'DELETE /estudiantes/:id',
      'GET /estudiantes/estadisticas/resumen'
    ]
  }
})

// ============================================================================
// CONFIGURACIÓN DEL SERVIDOR
// ============================================================================

// Función para iniciar el servidor
const iniciarServidor = async () => {
  try {
    const puerto = process.env.PORT || 3000
    const host = process.env.HOST || '0.0.0.0'

    await fastify.listen({ port: puerto, host: host })

    console.log('')
    console.log('🎓 ¡API de Estudiantes iniciada exitosamente!')
    console.log(`🌐 URL Base: http://localhost:${puerto}`)
    console.log('')
    console.log('📚 Endpoints disponibles:')
    console.log(`   📋 GET     http://localhost:${puerto}/estudiantes`)
    console.log(`   🔍 GET     http://localhost:${puerto}/estudiantes/:id`)
    console.log(`   ➕ POST    http://localhost:${puerto}/estudiantes`)
    console.log(`   ✏️  PUT     http://localhost:${puerto}/estudiantes/:id`)
    console.log(`   🔄 PATCH   http://localhost:${puerto}/estudiantes/:id`)
    console.log(`   ❌ DELETE  http://localhost:${puerto}/estudiantes/:id`)
    console.log(`   📊 GET     http://localhost:${puerto}/estudiantes/estadisticas/resumen`)
    console.log(`   ❤️  GET     http://localhost:${puerto}/health`)
    console.log('')
    console.log('📖 Ejemplos de uso:')
    console.log(`   curl http://localhost:${puerto}/estudiantes`)
    console.log(`   curl http://localhost:${puerto}/estudiantes?carrera=ingenieria&activo=true`)
    console.log('')
    console.log('💡 Tip: Usa Ctrl+C para detener el servidor')
    console.log(`📄 Datos iniciales: ${estudiantes.length} estudiantes cargados`)
    console.log('')

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error)
    process.exit(1)
  }
}

// Manejar cierre graceful del servidor
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando API de Estudiantes...')
  try {
    await fastify.close()
    console.log('✅ API cerrada correctamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error al cerrar la API:', error)
    process.exit(1)
  }
})

// Iniciar el servidor
iniciarServidor()
