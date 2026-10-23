# C13 – Docker en la librería

Proyecto de la clase 13 (Desarrollo de Software, UTN FRLP). Parte del frontend de la clase 11 (Vite + React + TS) y agrega un backend Express y una base Postgres, levantados con Docker Compose.

El frontend todavía no está dockerizado: se corre aparte con `npm run dev`.

## Requisitos

- Docker
- Docker Compose v2 (comando `docker compose`)

## Cómo levantar

```bash
cp backend/.env.example backend/.env   # completar usuario y contraseña de Postgres
docker compose up --build
```

URL de prueba: <http://localhost:3000> (responde un JSON de hello-world).

## Cómo bajar

```bash
docker compose down      # borra contenedores y red; los datos de Postgres se conservan (volumen pgdata)
docker compose down -v   # además borra el volumen pgdata: se pierden los datos
```

## Estructura

```
c13-docker/
├── frontend/            # app React (copia de c11, sin Dockerfile)
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example     # plantilla de variables (se versiona)
│   ├── .env             # valores reales (NO va a Git)
│   ├── package.json
│   └── src/index.js     # servidor Express
├── docker-compose.yml   # servicios api y db + volumen pgdata
└── .gitignore
```
