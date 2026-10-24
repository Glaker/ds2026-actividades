# C16 – Persistencia en la librería

Actividad AI-C16 de Desarrollo de Software (UTN FRLP). Parte de la API en capas de C15 y reemplaza los arrays en memoria por **PostgreSQL con Prisma 7**: libros y autores ahora viven en la base y sobreviven a reinicios. La API (rutas, verbos y status) es la misma que en C15.

El frontend sigue sin dockerizar ni consumir la API: se corre aparte con `npm run dev`.

## Estructura

```
c16-persistencia/
├── frontend/              # app React (Vite + TS), igual que C15
├── backend/
│   ├── Dockerfile
│   ├── .env.example       # plantilla de variables (se versiona)
│   ├── .env               # valores reales (NO va a Git)
│   ├── api.http           # requests para la extensión REST Client (igual que C15)
│   ├── prisma.config.ts   # config de Prisma 7: schema, migraciones, seed y DATABASE_URL
│   ├── prisma/
│   │   ├── schema.prisma  # modelos Libro y Autor (fuente de verdad)
│   │   ├── migrations/    # SQL versionado que lleva la base de un estado al siguiente
│   │   └── seed.ts        # datos iniciales (se corre una sola vez)
│   └── src/
│       ├── index.ts       # servidor: express.json() y montaje de routers
│       ├── config/        # prisma.ts: única instancia de PrismaClient (con adapter pg)
│       ├── routes/        # verbo + ruta -> función del controller
│       ├── controllers/   # HTTP <-> dominio, async con try/catch
│       ├── services/      # acceso a datos con Prisma, async
│       ├── types/         # Libro y Autor, derivados del cliente generado
│       └── generated/     # cliente de Prisma generado (NO va a Git)
├── docker-compose.yml     # servicios api y db + volumen pgdata
└── .gitignore
```

### Las tres piezas de Prisma

| Pieza | Qué es | ¿Se commitea? |
|-------|--------|---------------|
| `schema.prisma` | Los modelos, escritos a mano. Fuente de verdad. | Sí |
| `migrations/` | El SQL que lleva la base de A a B. | Sí |
| `src/generated/prisma` | Cliente generado a partir del schema (`prisma generate`). Código derivado. | No |

En Prisma 7 la URL de conexión no va en el schema: va en `prisma.config.ts` (`datasource.url = process.env.DATABASE_URL`). El cliente necesita un adapter (`@prisma/adapter-pg`, driver `pg`) y se crea una sola vez en `src/config/prisma.ts`, porque cada instancia abre su propio pool de conexiones.

### Responsabilidad de cada capa

| Capa | Qué hace | Qué NO hace |
|------|----------|-------------|
| `routes` | Asocia verbo + ruta con una función del controller. | Ni un `if`. |
| `controllers` | Leen `params`, `query` y `body`, hacen `await` al service y eligen el status (200, 201, 204, 404, 500). | No tocan la base. |
| `services` | Consultas con Prisma. Devuelven el dato, `null` o `true`/`false`. | Nunca mencionan `req`, `res` ni status. |
| `types` | `Libro` y `Autor`, tomados del cliente generado. | Sin lógica. |

Los services y controllers son `async`: Prisma devuelve Promises y el `await` tiene que llegar hasta el controller. Un `await` olvidado no da error: responde `{}`.

Los `try/catch` repetidos en los controllers son deuda a propósito: C17 los reemplaza por un middleware de errores.

## Cómo levantar

```bash
cp backend/.env.example backend/.env   # completar usuario y contraseña de Postgres
docker compose up -d
docker compose exec api npx prisma migrate dev    # crea las tablas (en desarrollo)
# o: docker compose exec api npx prisma migrate deploy   # aplica las existentes sin generar nuevas
docker compose exec api npx prisma db seed        # carga los datos iniciales (UNA sola vez)
```

La API queda en <http://localhost:3000>. En el contenedor, el host de la base es `db` (el nombre del servicio en Compose); desde la máquina sería `localhost:5432`.

El volume `./backend/src:/app/src` recarga la API al cambiar `src/`. Además se montan `prisma/` y `prisma.config.ts` para que los comandos de Prisma dentro del contenedor usen los archivos reales y las migraciones nuevas queden en el repo.

Si cambian `package.json`, `tsconfig.json` o el `Dockerfile`: `docker compose up -d --build`. El cliente de Prisma se genera con `docker compose exec api npx prisma generate` (también lo hace `migrate dev`).

El seed se corre una sola vez: dos veces duplica los libros y falla en los autores (`nombre` es único). Para volver a empezar: `docker compose exec api npx prisma migrate reset -f`.

### Prisma Studio

```bash
docker compose exec api npx prisma studio --port 5555 --browser none
```

Abrir <http://localhost:5555> (el puerto 5555 está publicado en `docker-compose.yml`).

### Bajar los servicios

| Comando | Contenedores | Datos de Postgres (volumen `pgdata`) |
|---------|--------------|--------------------------------------|
| `docker compose down` | Se eliminan | Se conservan |
| `docker compose down -v` | Se eliminan | Se borran (hay que migrar y sembrar de nuevo) |

### Healthcheck

`db` tiene un healthcheck (`pg_isready`) y `api` usa `depends_on: condition: service_healthy`: la API arranca cuando Postgres ya acepta conexiones, no solo cuando su contenedor existe.

## Endpoints

Idénticos a C15. El `id` lo asigna la base; en `POST` y `PUT` el body lleva todos los campos menos `id`.

| Método | Ruta | Éxito | Errores |
|--------|------|-------|---------|
| GET | `/` | 200 `{ "mensaje": "API de la Librería 🐳" }` | – |
| GET | `/api/libros` | 200, lista de libros | 500 |
| GET | `/api/libros?disponible=true` | 200, solo disponibles (`false` para los no disponibles) | 500 |
| GET | `/api/libros/:id` | 200, el libro | 404 `{ "error": "Libro no encontrado" }` |
| POST | `/api/libros` | 201, el libro creado con su `id` | 500 |
| PUT | `/api/libros/:id` | 200, el libro actualizado | 404 |
| DELETE | `/api/libros/:id` | 204, sin body | 404 |
| GET | `/api/autores` | 200, lista de autores | 500 |
| GET | `/api/autores/:id` | 200, el autor | 404 `{ "error": "Autor no encontrado" }` |
| POST | `/api/autores` | 201, el autor creado con su `id` | 500 (p. ej. nombre repetido) |
| PUT | `/api/autores/:id` | 200, el autor actualizado | 404 |
| DELETE | `/api/autores/:id` | 204, sin body | 404 |

Todos los errores inesperados responden `500 { "error": "Error interno del servidor" }`.

### Diferencias con C15

- `Autor.nombre` es único: crear un autor repetido falla con 500 (en C15 se permitía).
- Un id no numérico (`GET /api/libros/abc`) ahora da **500**, no 404: `Number("abc")` es `NaN`, Prisma lanza `PrismaClientValidationError` (comprobado sin base) y el `catch` responde 500. Debería ser 400; se resuelve en C17 con validación.
- Los ids los asigna una secuencia de Postgres: no se reutilizan al borrar. Los ids de `api.http` (libro 5, autor 4) valen solo si se corre en orden sobre una base recién sembrada.

## Cómo probar con api.http

1. Instalar la extensión **REST Client** en VS Code.
2. Abrir `backend/api.http` (es el de C15, sin cambios) y hacer clic en "Send Request" sobre cada request.
3. Correrlas en orden con la base recién migrada y sembrada: el libro creado recibe `id 5` y el autor creado `id 4`.

## Pendiente de probar

No se tuvo Docker durante el desarrollo, así que nada se probó contra Postgres. Verificado sin base: `prisma validate`, `prisma generate`, `tsc --noEmit` y que el cliente carga. Falta:

- [ ] Aplicar la migración (`migrate dev` o `migrate deploy`) y ver las tablas creadas.
- [ ] Correr el seed.
- [ ] Correr `api.http` entero contra Postgres (status esperados, incluidos los 404).
- [ ] Comprobar que los datos sobreviven a `docker compose restart api`.
- [ ] Comprobar que Prisma Studio abre en <http://localhost:5555> desde el navegador.
- [ ] Confirmar que `depends_on` con healthcheck hace esperar a la API.
