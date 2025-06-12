# Ejemplos Prácticos de Fastify

Esta carpeta contiene proyectos de ejemplo progresivos para practicar con Fastify, desde lo más básico hasta operaciones REST completas.

## 📂 Estructura de Ejemplos

### 🟢 **Ejemplo 1: Hello World Básico**
**Carpeta:** `01-hello-world/`

Un servidor Fastify minimalista que demuestra:
- ✅ Configuración básica de Fastify
- ✅ Una ruta simple GET
- ✅ Respuestas JSON básicas
- ✅ Configuración de puerto y host

**Ideal para:** Primeros pasos con Fastify

---

### 🔵 **Ejemplo 2: API REST de Estudiantes**
**Carpeta:** `02-api-estudiantes/`

Una API REST completa que maneja estudiantes con:
- ✅ Operaciones CRUD completas (Create, Read, Update, Delete)
- ✅ Validaciones de datos
- ✅ Manejo de errores
- ✅ Filtros y búsquedas
- ✅ Respuestas JSON estructuradas
- ✅ Códigos de estado HTTP apropiados

**Ideal para:** Entender APIs REST y operaciones con datos

---

## 🚀 Instrucciones de Uso

### Opción 1: Ejecutar un ejemplo específico

```bash
# Navegar al ejemplo que quieres probar
cd 01-hello-world
# o
cd 02-api-estudiantes

# Instalar dependencias
pnpm install

# Ejecutar el servidor
pnpm run dev
```

### Opción 2: Ejecutar todos desde la raíz

```bash
# Desde la carpeta ejemplos-practicos/
pnpm install  # En cada subcarpeta
pnpm run dev  # En la carpeta del ejemplo que quieras ejecutar
```

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- pnpm instalado globalmente: `npm install -g pnpm`
- Editor de código (VS Code recomendado)
- Cliente REST (Postman, Thunder Client, o curl)

## 🎯 Objetivos de Aprendizaje

Al completar estos ejemplos, los estudiantes podrán:

1. **Hello World (Ejemplo 1):**
   - ✅ Crear un servidor Fastify básico
   - ✅ Definir rutas simples
   - ✅ Enviar respuestas JSON
   - ✅ Configurar puerto y logging

2. **API Estudiantes (Ejemplo 2):**
   - ✅ Implementar operaciones CRUD completas
   - ✅ Manejar diferentes métodos HTTP
   - ✅ Validar datos de entrada
   - ✅ Estructurar respuestas consistentes
   - ✅ Usar parámetros de ruta y query strings
   - ✅ Implementar búsquedas y filtros
   - ✅ Manejar errores apropiadamente

## 🧪 Probando los Ejemplos

### Para el Hello World:
```bash
curl http://localhost:3000
curl http://localhost:3000/saludo/TuNombre
```

### Para la API de Estudiantes:
```bash
# Obtener todos los estudiantes
curl http://localhost:3000/estudiantes

# Crear un estudiante
curl -X POST http://localhost:3000/estudiantes \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan Pérez", "edad": 20, "carrera": "Ingeniería"}'

# Obtener un estudiante específico
curl http://localhost:3000/estudiantes/1

# Actualizar un estudiante
curl -X PUT http://localhost:3000/estudiantes/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan Carlos Pérez", "edad": 21, "carrera": "Ingeniería de Sistemas"}'

# Eliminar un estudiante
curl -X DELETE http://localhost:3000/estudiantes/1
```

## 📚 Siguientes Pasos

Una vez que domines estos ejemplos, puedes continuar con:

1. **[Tema 1: Instalación Básica](../temas/01-instalacion-basica/README.md)**
2. **[Tema 2: Conceptos Esenciales](../temas/02-conceptos-esenciales/README.md)**
3. **[Tema 3: Organización de Rutas](../temas/03-organizacion-rutas/README.md)**
4. **[Tema 4: Base de Datos con Mongoose](../temas/04-base-datos-mongoose/README.md)**

## 💡 Consejos para Estudiantes

- 🔍 **Examina el código:** Lee cada línea y entiende qué hace
- 🧪 **Experimenta:** Modifica los ejemplos y ve qué pasa
- 🔧 **Prueba todo:** Usa diferentes herramientas para probar las APIs
- 📝 **Toma notas:** Documenta lo que aprendes y las dudas que surjan
- 🤝 **Pregunta:** No dudes en preguntar si algo no está claro

---

**¡Comienza con el [Ejemplo 1: Hello World](./01-hello-world/README.md) y luego avanza al [Ejemplo 2: API de Estudiantes](./02-api-estudiantes/README.md)!**
