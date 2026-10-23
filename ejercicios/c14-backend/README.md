# C14 – Primer endpoint en la librería

Actividad AI-C14 de Desarrollo de Software (UTN FRLP). Parte de la librería de C13 (frontend React + backend + Postgres con Docker Compose) y migra el backend a **Express + TypeScript**, con modo dev (hot reload) y los primeros endpoints con datos hardcodeados.

El frontend todavía no está dockerizado ni consume la API: se corre aparte con `npm run dev`.

## Estructura

```
c14-backend/
├── frontend/              # app React (Vite + TS), igual que C13
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example       # plantilla de variables (se versiona)
│   ├── .env               # valores reales (NO va a Git)
│   ├── api.http           # requests para la extensión REST Client
│   ├── package.json
│   ├── tsconfig.json
│   └── src/index.ts       # servidor Express
├── docker-compose.yml     # servicios api y db + volumen pgdata
└── .gitignore
```

## Cómo levantar

```bash
cp backend/.env.example backend/.env   # completar usuario y contraseña de Postgres
docker compose up --build
```

La API queda en <http://localhost:3000>. El volume `./backend/src:/app/src` hace que los cambios en `src/` recarguen la API solos (`tsx watch`). Si cambia `package.json`, `tsconfig.json` o el `Dockerfile`, hay que repetir `docker compose up --build`.

Para bajar: `docker compose down` (conserva los datos de Postgres) o `docker compose down -v` (los borra).

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Hello: `{ "mensaje": "API de la Librería 🐳" }` |
| GET | `/libros` | Lista de libros (misma forma que `frontend/src/types/libro.ts`) |
| GET | `/libros?disponible=true` | Solo los libros disponibles (`false` para los no disponibles) |
| GET | `/autores` | Lista de autores |

## Cómo probar con api.http

1. Instalar la extensión **REST Client** en VS Code.
2. Abrir `backend/api.http` y hacer clic en "Send Request" sobre cada request.

## Pendiente de probar

Docker no está instalado en la máquina de desarrollo, así que falta validar:

- `docker compose up --build` completo (api + db).
- El hot reload dentro del contenedor (editar `src/` y ver que la API se reinicia).

Lo que sí se probó: el backend sin Docker (`PORT=3000 npx tsx src/index.ts`) y `npx tsc --noEmit`.
