# C15 – Capas en la librería

Actividad AI-C15 de Desarrollo de Software (UTN FRLP). Parte del backend de C14 (Express + TypeScript + Postgres con Docker Compose) y lo reorganiza **en capas** (routes → controllers → services), con **CRUD completo** de libros y autores sobre datos en memoria.

El frontend todavía no está dockerizado ni consume la API: se corre aparte con `npm run dev`.

## Estructura

```
c15-api-rest/
├── frontend/              # app React (Vite + TS), igual que C14
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example       # plantilla de variables (se versiona)
│   ├── .env               # valores reales (NO va a Git)
│   ├── api.http           # requests para la extensión REST Client
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                  # servidor: express.json() y montaje de routers
│       ├── routes/                   # libro.routes.ts, autor.routes.ts
│       ├── controllers/              # libro.controller.ts, autor.controller.ts
│       ├── services/                 # libro.service.ts, autor.service.ts
│       └── types/                    # libro.types.ts, autor.types.ts
├── docker-compose.yml     # servicios api y db + volumen pgdata
└── .gitignore
```

### Responsabilidad de cada capa

| Capa | Qué hace | Qué NO hace |
|------|----------|-------------|
| `index.ts` | Crea la app, registra `express.json()` (antes de las rutas) y monta cada router con su prefijo (`/api/libros`, `/api/autores`). | No tiene datos ni lógica. |
| `routes` | Asocia verbo + ruta con una función del controller. Rutas relativas (`/` y `/:id`). | Ni un `if`. |
| `controllers` | Traducen HTTP ↔ dominio: leen `params`, `query` y `body`, llaman al service y eligen el status (200, 201, 204, 404). | No buscan ni guardan datos. |
| `services` | Lógica y datos (array en memoria, generación de ids). Devuelven el dato, `undefined` o `true`/`false`. | Nunca mencionan `req`, `res` ni status codes. |
| `types` | Las formas (`Libro`, `Autor`). | Sin lógica. |

## Cómo levantar

```bash
cp backend/.env.example backend/.env   # completar usuario y contraseña de Postgres
docker compose up --build
```

La API queda en <http://localhost:3000>. El volume `./backend/src:/app/src` hace que los cambios en `src/` recarguen la API solos (`tsx watch`). Si cambia `package.json`, `tsconfig.json` o el `Dockerfile`, hay que repetir `docker compose up --build`.

Para bajar: `docker compose down` (conserva los datos de Postgres) o `docker compose down -v` (los borra).

## Endpoints

Libros y autores tienen los mismos endpoints. El `id` lo asigna el servidor; en `POST` y `PUT` el body lleva todos los campos menos `id`. Los datos viven en memoria: se reinician al reiniciar la API.

| Método | Ruta | Éxito | Errores |
|--------|------|-------|---------|
| GET | `/` | 200 `{ "mensaje": "API de la Librería 🐳" }` | – |
| GET | `/api/libros` | 200, lista de libros | 500 si explota |
| GET | `/api/libros?disponible=true` | 200, solo disponibles (`false` para los no disponibles) | 500 si explota |
| GET | `/api/libros/:id` | 200, el libro | 404 `{ "error": "Libro no encontrado" }` |
| POST | `/api/libros` | 201, el libro creado con su `id` | – |
| PUT | `/api/libros/:id` | 200, el libro actualizado | 404 |
| DELETE | `/api/libros/:id` | 204, sin body | 404 |
| GET | `/api/autores` | 200, lista de autores | 500 si explota |
| GET | `/api/autores/:id` | 200, el autor | 404 `{ "error": "Autor no encontrado" }` |
| POST | `/api/autores` | 201, el autor creado con su `id` | – |
| PUT | `/api/autores/:id` | 200, el autor actualizado | 404 |
| DELETE | `/api/autores/:id` | 204, sin body | 404 |

### Limitación conocida

Hoy no se emite 400. `GET /api/libros/abc` devuelve **404** (`Number("abc")` es `NaN` y no matchea ningún libro), pero debería devolver **400** porque el id es inválido. Lo mismo pasa con bodies incompletos o de tipo incorrecto en `POST`/`PUT`. Se resuelve en C17 con validación.

## Cómo probar con api.http

1. Instalar la extensión **REST Client** en VS Code.
2. Abrir `backend/api.http` y hacer clic en "Send Request" sobre cada request.
3. Correrlas en orden con la API recién levantada: el libro creado recibe `id 5` y el autor creado `id 4`, que usan las requests de editar y borrar.
