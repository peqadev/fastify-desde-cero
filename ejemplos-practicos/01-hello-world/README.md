# 🟢 Ejemplo 1: Hello World con Fastify

Este es un ejemplo básico de un servidor Fastify que demuestra los conceptos fundamentales de manera simple y clara.

## 📋 ¿Qué aprenderás?

- ✅ Cómo crear una instancia básica de Fastify
- ✅ Cómo definir rutas GET simples
- ✅ Cómo manejar parámetros de ruta (`:nombre`)
- ✅ Cómo usar query parameters (`?mensaje=hola`)
- ✅ Cómo estructurar respuestas JSON
- ✅ Cómo configurar logging
- ✅ Cómo manejar el cierre graceful del servidor

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

### 3. Probar las rutas
Una vez que el servidor esté corriendo, verás en la consola las rutas disponibles:

```
🎉 ¡Servidor Hello World iniciado exitosamente!
🌐 URL: http://localhost:3000

📋 Rutas disponibles:
   ✅ GET  http://localhost:3000/
   👋 GET  http://localhost:3000/saludo/[nombre]
   ℹ️  GET  http://localhost:3000/info
   🧪 GET  http://localhost:3000/prueba
   ❤️  GET  http://localhost:3000/health
```

## 🧪 Probando las Rutas

### 1. Ruta Principal (/)
```bash
curl http://localhost:3000/
```
**Respuesta esperada:**
```json
{
  "mensaje": "¡Hola Mundo desde Fastify! 🚀",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "autor": "Curso Fastify",
  "descripcion": "Este es un ejemplo básico de servidor Fastify"
}
```

### 2. Saludo Personalizado (/saludo/:nombre)
```bash
curl http://localhost:3000/saludo/Juan
curl http://localhost:3000/saludo/María
```
**Respuesta esperada:**
```json
{
  "mensaje": "¡Hola Juan! 👋",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "personalizado": true,
  "datos": {
    "nombreRecibido": "Juan",
    "longitudNombre": 4,
    "primeraLetra": "J"
  }
}
```

### 3. Información del Servidor (/info)
```bash
curl http://localhost:3000/info
```
**Respuesta esperada:**
```json
{
  "servidor": "Fastify Hello World",
  "version": "1.0.0",
  "nodeVersion": "v18.17.0",
  "plataforma": "darwin",
  "tiempoActivo": 45,
  "memoria": {
    "usado": 25,
    "total": 32,
    "unidad": "MB"
  },
  "pid": 12345,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 4. Ruta de Prueba con Query Parameters (/prueba)
```bash
curl "http://localhost:3000/prueba?mensaje=hola&color=azul&numero=42"
```
**Respuesta esperada:**
```json
{
  "mensaje": "🧪 Esta es una ruta de prueba",
  "parametrosRecibidos": {
    "mensaje": "hola",
    "color": "azul",
    "numero": 42
  },
  "ejemploDeUso": "Prueba con: /prueba?mensaje=hola&color=azul&numero=42",
  "queryCompleto": {
    "mensaje": "hola",
    "color": "azul",
    "numero": "42"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 5. Estado de Salud (/health)
```bash
curl http://localhost:3000/health
```
**Respuesta esperada:**
```json
{
  "status": "OK ✅",
  "uptime": 123.45,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "checks": {
    "servidor": "funcionando",
    "memoria": "normal",
    "respuesta": "rápida"
  }
}
```

## 📖 Análisis del Código

### Estructura del archivo `app.js`:

1. **Importación y configuración inicial:**
   ```javascript
   import Fastify from 'fastify'

   const fastify = Fastify({
     logger: true // Habilita logging automático
   })
   ```

2. **Definición de rutas:**
   - Cada ruta usa `fastify.get()` para manejar requests GET
   - Las funciones son `async` para manejar operaciones asíncronas
   - Todas las respuestas son objetos JSON

3. **Parámetros de ruta:**
   ```javascript
   fastify.get('/saludo/:nombre', async (request, reply) => {
     const { nombre } = request.params // Extraer parámetro de la URL
   })
   ```

4. **Query parameters:**
   ```javascript
   const { mensaje, color, numero } = request.query // Extraer query params
   ```

5. **Inicio del servidor:**
   ```javascript
   await fastify.listen({ port: 3000, host: '0.0.0.0' })
   ```

## 🎯 Ejercicios para Practicar

### Ejercicio 1: Nueva Ruta Personal
Crea una ruta `/perfil/:nombre` que devuelva:
- Nombre recibido
- Un saludo personalizado
- La hora actual
- Un número aleatorio entre 1 y 100

### Ejercicio 2: Calculadora Simple
Crea una ruta `/sumar/:a/:b` que:
- Reciba dos números como parámetros
- Devuelva la suma
- Valide que ambos parámetros sean números

### Ejercicio 3: Query Parameters Avanzados
Modifica la ruta `/prueba` para que:
- Maneje al menos 5 parámetros diferentes
- Valide tipos de datos
- Devuelva estadísticas sobre los parámetros recibidos

### Ejercicio 4: Información Extendida
Mejora la ruta `/info` para que incluya:
- Variables de entorno disponibles
- Información de la red
- Estadísticas del sistema

## ✅ Verificación

Deberías poder:

1. ✅ Iniciar el servidor sin errores
2. ✅ Ver los logs en la consola
3. ✅ Acceder a todas las rutas desde el navegador
4. ✅ Recibir respuestas JSON válidas
5. ✅ Detener el servidor con Ctrl+C

## 🔗 Siguientes Pasos

Una vez que domines este ejemplo básico, continúa con:
**[Ejemplo 2: API de Estudiantes](../02-api-estudiantes/README.md)**

## 💡 Conceptos Clave Aprendidos

- **Fastify Instance**: Cómo crear y configurar una instancia de Fastify
- **Route Handlers**: Funciones que manejan las requests HTTP
- **Request Object**: Contiene información sobre la request (params, query, body, etc.)
- **Reply Object**: Usado para enviar respuestas (códigos de estado, headers, etc.)
- **Async/Await**: Manejo de operaciones asíncronas en JavaScript
- **JSON Responses**: Fastify automáticamente serializa objetos a JSON
- **Logging**: Sistema de logs integrado para debugging y monitoreo

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module 'fastify'"
```bash
# Asegúrate de instalar las dependencias
pnpm install
```

### Error: "Port already in use"
```bash
# Mata el proceso que usa el puerto
lsof -ti:3000 | xargs kill -9
# O cambia el puerto
PORT=3001 pnpm run dev
```

### Error: "Address already in use"
- Verifica que no tengas otro servidor corriendo en el mismo puerto
- Usa un puerto diferente modificando la variable de entorno PORT
