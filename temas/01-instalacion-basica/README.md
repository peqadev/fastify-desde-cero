# Tema 1: Instalación Básica del Proyecto

En este primer tema aprenderás a crear un proyecto Fastify desde cero utilizando **pnpm** como gestor de paquetes.

## 📋 Objetivos

- Inicializar un proyecto Node.js con pnpm
- Configurar el `package.json` correctamente
- Instalar Fastify
- Crear un servidor básico funcional

## 🚀 Paso a Paso

### 1. Crear el directorio del proyecto

```bash
mkdir mi-proyecto-fastify
cd mi-proyecto-fastify
```

### 2. Inicializar el proyecto con pnpm

```bash
pnpm init
```

Este comando creará un `package.json` básico. Ahora lo configuraremos apropiadamente.

### 3. Configurar el package.json

Edita tu `package.json` para que se vea así:

```json
{
  "name": "mi-proyecto-fastify",
  "version": "1.0.0",
  "description": "Mi primer proyecto con Fastify",
  "main": "app.js",
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "dev": "node --watch app.js"
  },
  "keywords": ["fastify", "api", "nodejs"],
  "author": "Tu nombre",
  "license": "MIT",
  "packageManager": "pnpm@10.5.2"
}
```

**Puntos importantes:**
- `"type": "module"`: Permite usar ES6 modules (import/export)
- `"main": "app.js"`: Define el archivo principal de entrada
- Script `"dev"`: Usa `--watch` para reiniciar automáticamente al hacer cambios

### 4. Instalar Fastify

```bash
pnpm add fastify
```

Este comando instalará Fastify y actualizará tu `package.json` con la dependencia.

### 5. Crear el archivo app.js

Crea el archivo `app.js` en la raíz del proyecto:

```javascript
// app.js
import Fastify from 'fastify'

// Crear una instancia de Fastify
const fastify = Fastify({
  logger: true // Habilita los logs para ver lo que sucede
})

// Declarar una ruta simple
fastify.get('/', async (request, reply) => {
  return {
    message: '¡Hola mundo desde Fastify!',
    timestamp: new Date().toISOString(),
    status: 'success'
  }
})

// Función para iniciar el servidor
const start = async () => {
  try {
    await fastify.listen({
      port: 3000,
      host: '0.0.0.0' // Permite conexiones desde cualquier IP
    })
    console.log('🚀 Servidor corriendo en http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
```

### 6. Ejecutar el servidor

```bash
pnpm run dev
```

Deberías ver algo similar a:

```
{"level":30,"time":1234567890,"pid":12345,"hostname":"localhost","msg":"Server listening at http://0.0.0.0:3000"}
🚀 Servidor corriendo en http://localhost:3000
```

### 7. Probar la API

Abre tu navegador y visita: `http://localhost:3000`

También puedes usar curl:

```bash
curl http://localhost:3000
```

Deberías recibir una respuesta JSON como:

```json
{
  "message": "¡Hola mundo desde Fastify!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "success"
}
```

## 🛠️ Estructura de archivos resultante

```
mi-proyecto-fastify/
├── package.json
├── pnpm-lock.yaml
├── node_modules/
└── app.js
```
## 🔗 Siguientes Pasos

Una vez que tengas tu servidor básico funcionando, continúa con:
**[Tema 2: Conceptos Esenciales de Fastify](../02-conceptos-esenciales/README.md)**

## 📚 Recursos Adicionales

- [Documentación oficial de Fastify](https://www.fastify.io/docs/latest/Guides/Getting-Started/)
- [Documentación de pnpm](https://pnpm.io/cli/init)
- [Node.js Watch Mode](https://nodejs.org/api/cli.html#--watch)
