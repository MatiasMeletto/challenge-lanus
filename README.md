# GranaBank — Challenge Técnico Club Atlético Lanús

Aplicación web bancaria y billetera virtual desarrollada para el **Challenge Técnico del Club Atlético Lanús**. Respeta el diseño **Mobile-First** provisto en Figma e incorpora una adaptación completa para **Desktop**, consumiendo una API propia respaldada por **PostgreSQL** y **Prisma ORM**.

---

## Tabla de Contenidos

1. [Demo y Credenciales de Acceso](#demo-y-credenciales-de-acceso)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Requisitos Previos](#requisitos-previos)
4. [Guía Paso a Paso: Cómo correr el proyecto en Local (con Docker)](#guía-paso-a-paso-cómo-correr-el-proyecto-en-local-con-docker)
5. [Ejecución Alternativa con Base de Datos Cloud (Neon / Supabase)](#ejecución-alternativa-con-base-de-datos-cloud-neon--supabase)
6. [Scripts Disponibles](#scripts-disponibles)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Decisiones Técnicas Tomadas](#decisiones-técnicas-tomadas)
9. [Qué mejoraría con más tiempo](#qué-mejoraría-con-más-tiempo)

---

## Demo y Credenciales de Acceso

Para ingresar a la aplicación (tanto en el entorno desplegado en Vercel como en el entorno local tras ejecutar el *seed*), utilizá las credenciales oficiales del challenge:

* **Email:** `soygranate@clublanus.com`
* **Contraseña:** `GRANATE1@`

---

## Stack Tecnológico

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4.
* **Backend:** Next.js Route Handlers (Node.js runtime con TypeScript).
* **Base de Datos:** PostgreSQL 15 (vía Docker en entorno local y Neon Serverless en producción).
* **ORM:** Prisma ORM (`@prisma/client` + `@prisma/adapter-neon`).
* **Validaciones y Seguridad:** Zod (validación de esquemas de entrada y query params) + `jose` (firma y verificación de sesiones JWT en cookies `HttpOnly`).

---

## Requisitos Previos

Antes de comenzar a correr el proyecto en tu máquina local, asegurate de tener instalado:

* **Node.js** (versión `20.9.0` o superior).
* **pnpm** (gestor de paquetes utilizado en el proyecto; podés activarlo ejecutando `corepack enable`).
* **Docker Desktop** (o Docker Engine + Docker Compose) corriendo en segundo plano para levantar la base de datos PostgreSQL local.

---

## Guía Paso a Paso: Cómo correr el proyecto en Local (con Docker)

El proyecto incluye un archivo `docker-compose.yml` preconfigurado para levantar una instancia limpia de **PostgreSQL 15** sin necesidad de instalar PostgreSQL de forma nativa en tu sistema operativo.

### 1. Clonar el repositorio e instalar dependencias

Abrí una terminal y ejecutá:

```bash
git clone <URL_DEL_REPOSITORIO>
cd challenge-lanus
pnpm install
```

*(El script `postinstall` generará automáticamente los tipos del cliente de Prisma al finalizar la instalación).*

### 2. Configurar las variables de entorno (`.env`)

Creá un archivo llamado `.env` en la raíz del proyecto copiando la plantilla `.env.example`:

```bash
cp .env.example .env
```

En Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Verificá que tu archivo `.env` tenga activas las credenciales correspondientes al contenedor de Docker:

```env
DATABASE_URL="postgresql://postgres:granatepassword@localhost:5432/granabank?schema=public"
DIRECT_URL="postgresql://postgres:granatepassword@localhost:5432/granabank?schema=public"
SESSION_SECRET="granabank-club-lanus-secret-key-2026"
```

### 3. Levantar la base de datos PostgreSQL con Docker

Asegurate de que **Docker Desktop** esté abierto y ejecutá en la raíz del proyecto:

```bash
docker compose up -d
```

Esto descargará la imagen `postgres:15-alpine` y levantará el contenedor en segundo plano exponiendo el puerto `5432`, con un volumen persistente llamado `pgdata`. Podés verificar que el contenedor esté corriendo con `docker ps`.

### 4. Sincronizar el esquema de Prisma con la base de datos

Impactá las tablas (`User`, `Card` y `Movement`) en la base de datos PostgreSQL recién creada:

```bash
npx prisma db push
```

### 5. Poblar la base de datos (Seed inicial)

Ejecutá el script de *seed* para cargar el usuario `soygranate@clublanus.com`, las tarjetas bancarias (Mastercard y Visa) y todos los movimientos del diseño de Figma:

```bash
npx prisma db seed
```

Deberías ver en consola el mensaje: `Seed completado exitosamente para: soygranate@clublanus.com`.

### 6. Iniciar el servidor de desarrollo

Levantá la aplicación en modo desarrollo:

```bash
pnpm dev
```

Abrí tu navegador en **[http://localhost:3000](http://localhost:3000)**. Serás redirigido automáticamente a `/login`, donde podrás ingresar con las credenciales indicadas arriba.

---

## Ejecución Alternativa con Base de Datos Cloud (Neon / Supabase)

Si no deseás utilizar Docker localmente, podés apuntar el archivo `.env` a cualquier instancia remota de PostgreSQL (como **Neon** o **Supabase**):

1. Reemplazá `DATABASE_URL` y `DIRECT_URL` en tu archivo `.env` con las cadenas de conexión provistas por tu proveedor en la nube.
2. Ejecutá `npx prisma db push` y luego `npx prisma db seed`.
3. Ejecutá `pnpm dev`.

> **Nota técnica:** El archivo `lib/prisma.ts` detecta automáticamente si la `DATABASE_URL` pertenece a `neon.tech` (activando el adaptador serverless `@prisma/adapter-neon` para entornos como Vercel) o si es una conexión TCP estándar como el contenedor local de Docker, instanciando `PrismaClient` de forma transparente en ambos entornos.

---

## Scripts Disponibles

* `pnpm dev`: Inicia el servidor de desarrollo en `http://localhost:3000`.
* `pnpm build`: Genera el cliente de Prisma, sincroniza el esquema y compila la aplicación para producción.
* `pnpm start`: Inicia el servidor de producción luego de un `build`.
* `pnpm lint`: Ejecuta ESLint para verificar reglas de código y tipado estricto de TypeScript.
* `pnpm seed` (o `npx prisma db seed`): Reinicia y puebla la base de datos con los datos iniciales del challenge.
* `npx prisma studio`: Abre una interfaz visual en el navegador (`http://localhost:5555`) para explorar y editar las tablas de PostgreSQL.

---

## Estructura del Proyecto

```text
challenge-lanus/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       # POST: Validación Zod, verificación y creación de cookie JWT
│   │   │   └── logout/route.ts      # POST: Eliminación de cookie de sesión
│   │   ├── dashboard/route.ts       # GET: Datos del usuario, tarjetas y últimos 4 movimientos
│   │   └── movements/
│   │       ├── route.ts             # GET: Listado de movimientos con búsqueda (q) y filtros (filter)
│   │       └── [id]/route.ts        # GET: Detalle individual de un movimiento por ID
│   ├── login/page.tsx               # Pantalla de Login con validaciones y toggle de contraseña
│   ├── movimientos/
│   │   ├── page.tsx                 # Pantalla de Movimientos con buscador debounced y filtros rápidos
│   │   └── [id]/page.tsx            # Vista de Detalle / Comprobante de un movimiento
│   ├── globals.css                  # Tokens de tema Tailwind v4 (--color-granate, etc.) y utilidades
│   ├── layout.tsx                   # Configuración de fuentes Google (Poppins e Inter)
│   └── page.tsx                     # Pantalla Home (Saludo, carrusel de tarjetas, últimos movimientos)
├── components/
│   └── ui/
│       ├── BankCard.tsx             # Tarjeta bancaria con soporte dinámico para Mastercard y Visa
│       ├── BottomNav.tsx            # Barra inferior en Mobile (<768px) y Sidebar fijo en Desktop (>=768px)
│       └── MovementItem.tsx         # Ítem de movimiento con variantes SUS, CASH_IN y CASH_OUT
├── lib/
│   ├── prisma.ts                    # Singleton de PrismaClient híbrido (Docker local / Neon Serverless)
│   └── session.ts                   # Encriptación/desencriptación JWT (HS256) y gestión de cookies
├── prisma/
│   ├── schema.prisma                # Modelos relacionales User, Card y Movement
│   └── seed.ts                      # Datos semilla fieles al diseño de Figma
├── docker-compose.yml               # Contenedor PostgreSQL 15 para desarrollo local
├── middleware.ts                    # Protección de rutas privadas y redirección de usuarios autenticados
└── package.json
```

---

## Decisiones Técnicas Tomadas

1. **Fullstack Monolítico con Next.js App Router:**
   Se optó por implementar el backend mediante **Route Handlers** (`app/api/...`) en TypeScript dentro del mismo proyecto Next.js. Esto mantiene una única fuente de verdad para los tipos generados por Prisma, evita problemas de CORS y permite desplegar tanto el frontend como la API de forma atómica en Vercel.

2. **Diseño Adaptativo (Fidelidad Mobile en Figma + Escalabilidad Web Desktop):**
   * En resoluciones móviles (`< 768px`), la interfaz respeta al píxel las medidas, tipografías (`Poppins` e `Inter`), sombras (`0px 8px 30px rgba(0,0,0,0.06)`), radios y colores del Figma (`#7A1D2D`, `#F9FAFC`, variantes morada `#B946FF` para suscripciones, granate `#7A1D2D` para ingresos y naranja `#EF9C55` para egresos), incluyendo el carrusel horizontal de tarjetas y la barra de navegación fija inferior.
   * En resoluciones de escritorio (`>= 768px`), la barra inferior se transforma en un **Sidebar de navegación lateral izquierdo** y el contenido principal se organiza en grillas de múltiples columnas, ofreciendo una experiencia de banca web real sin espacios vacíos.

3. **Vista de Detalle de Movimiento (`/movimientos/[id]`):**
   Para cumplir con el requerimiento funcional de *"Permitir ver el detalle de un elemento"*, cada movimiento tanto en `Home` como en `Movimientos` es navegable y lleva a una vista de comprobante detallado que consume el endpoint dinámico `GET /api/movements/[id]`, permitiendo además copiar el código de operación al portapapeles.

4. **Autenticación Stateless con JWT y Middleware Edge:**
   Se implementó el manejo de sesión mediante tokens JWT firmados con `HS256` (usando la librería `jose`, compatible con el Edge Runtime de Next.js) almacenados en cookies `HttpOnly`. El archivo `middleware.ts` intercepta los accesos a `/`, `/movimientos` y `/movimientos/[id]`, verificando la validez criptográfica del token antes de renderizar la vista y soportando la extensión de sesión mediante el checkbox *"Recordarme"*.

5. **Manejo de Estados y Experiencia de Usuario (UX):**
   * **Loading:** Esqueletos de carga (`animate-pulse`) con las dimensiones exactas de las tarjetas y movimientos para evitar saltos de layout (*Cumulative Layout Shift*), y spinner en la vista de comprobante.
   * **Error y Vacío:** Mensajes claros con opción de reintento o limpieza cuando una búsqueda o combinación de filtros no arroja resultados.
   * **Búsqueda con Debounce:** El buscador de la pantalla de movimientos aplica un *debounce* de `300ms` antes de consultar `/api/movements?q=...&filter=...`, evitando saturar la base de datos mientras el usuario escribe.

---

## Qué mejoraría con más tiempo

* **Seguridad de Contraseñas y Autenticación:** Almacenar las contraseñas hasheadas en la base de datos utilizando `bcrypt` o `argon2` en lugar de texto plano en el *seed*, e incorporar rotación de *Refresh Tokens* y *Rate Limiting* en el endpoint `/api/auth/login` para mitigar ataques de fuerza bruta. Por el momento y teniendo en cuenta que no hay registro y la cuenta es unica no hizo falta.
* **Paginación Basada en Cursores (*Infinite Scroll*):** Implementar paginación mediante `cursor` en Prisma dentro de `/api/movements` para mantener tiempos de respuesta constantes cuando el historial del socio supere cientos de transacciones.
* **Testing Automatizado (Unitario y E2E):** Agregar pruebas unitarias con **Vitest** para los validadores Zod y utilidades de sesión, y pruebas End-to-End con **Playwright** que verifiquen el flujo completo: login, redirección con la lupa del Home, filtrado por tipo, búsqueda por texto y apertura de un comprobante.
* **Exportación de Comprobantes en PDF:** Permitir descargar el comprobante de `/movimientos/[id]` en formato PDF o imagen lista para compartir.
* **Filtros Avanzados y Ordenamiento:** Incorporar filtrado por rango de fechas, rango de montos y tarjeta asociada (Mastercard vs. Visa).