# C17 – Relaciones y validaciones en la librería

Actividad AI-C17 de Desarrollo de Software (UTN FRLP). Parte de la librería de C16 (Express 5 + Prisma 7 + PostgreSQL) y agrega:

- **Relaciones reales**: `Autor 1:N Libro` (FK `Libro.autorId`) y `Libro N:M Categoria` (tabla intermedia implícita).
- **Validación con Zod 4** en el backend, con middlewares `validate` y `validateParams`.
- **`errorHandler` centralizado**: los controllers no tienen `try/catch` y cada error sale con su status (400/404/409/500).
- **CRUD de categorías** en capas, igual que libros y autores.

El frontend es el de C16, sin cambios: no consume la API.

## Relaciones

```
┌──────────────┐ 1      N ┌──────────────────┐ N   (_CategoriaToLibro)   M ┌──────────────┐
│ Autor        │──────────│ Libro            │──────────────────────────────│ Categoria    │
│ id (PK)      │          │ id (PK)          │                              │ id (PK)      │
│ nombre  uniq │          │ titulo           │                              │ nombre  uniq │
│ nacionalidad │          │ precio, imagen   │                              └──────────────┘
└──────────────┘          │ disponible       │
                          │ autorId (FK) ────┼──> Autor.id  ON DELETE RESTRICT
                          └──────────────────┘
```

- **1:N**: la FK va del lado N (`Libro.autorId`). `Autor.libros Libro[]` no es una columna: es el atajo de Prisma para navegar la relación.
- **N:M implícita**: `Libro.categorias Categoria[]` + `Categoria.libros Libro[]`. Prisma crea solo la tabla `_CategoriaToLibro` (columnas `A` = categoría, `B` = libro). Sería explícita si el vínculo tuviera datos propios (p. ej. fecha de alta).
- **`onDelete: Restrict`** (explícito): no se puede borrar un autor que tiene libros (la API responde 409). `Cascade` borraría sus libros, y `SetNull` solo sirve con una FK opcional.

## Estructura

```
c17-relaciones-validaciones/
├── frontend/                  # app React de C16, sin cambios
├── backend/
│   ├── api.http               # requests felices y de error (REST Client)
│   ├── prisma.config.ts
│   ├── prisma/
│   │   ├── schema.prisma      # Autor, Libro, Categoria con relaciones
│   │   ├── migrations/        # init_libro_autor (C16) + relaciones_autor_categoria
│   │   └── seed.ts            # autores -> categorías -> libros con connect
│   └── src/
│       ├── index.ts           # rutas + errorHandler al final
│       ├── config/prisma.ts
│       ├── routes/            # verbo + ruta + middlewares de validación -> controller
│       ├── middlewares/       # validate.middleware.ts, error.middleware.ts
│       ├── validations/       # schemas Zod: libro, autor, categoria (+ idParamSchema)
│       ├── controllers/       # await + status, sin try/catch
│       ├── services/          # Prisma; include y tipos GetPayload
│       ├── types/             # Libro, Autor, Categoria del cliente generado
│       └── generated/         # cliente de Prisma (NO va a Git)
└── docker-compose.yml
```

## Endpoints

`libros`, `autores` y `categorias` tienen los mismos 5 endpoints. Todos pueden responder 500 `{ "error": "Error interno del servidor" }` ante un error inesperado.

| Método | Ruta | Éxito | Errores |
|--------|------|-------|---------|
| GET | `/api/libros` (`?disponible=true\|false`) | 200, cada libro con `autor` anidado | 500 |
| GET | `/api/libros/:id` | 200, con `autor` y `categorias` | 400 id inválido, 404 |
| POST | `/api/libros` | 201, con `autor` | 400 body inválido, 409 `autorId` inexistente (P2003) |
| PUT | `/api/libros/:id` | 200 (body parcial) | 400, 404, 409 `autorId` inexistente |
| DELETE | `/api/libros/:id` | 204 | 400, 404 |
| GET | `/api/autores` | 200 | 500 |
| GET | `/api/autores/:id` | 200 | 400, 404 |
| POST | `/api/autores` | 201 | 400, 409 nombre repetido (P2002) |
| PUT | `/api/autores/:id` | 200 (body parcial) | 400, 404, 409 nombre repetido |
| DELETE | `/api/autores/:id` | 204 | 400, 404, 409 tiene libros (Restrict, P2003) |
| GET | `/api/categorias` | 200 | 500 |
| GET | `/api/categorias/:id` | 200 | 400, 404 |
| POST | `/api/categorias` | 201 | 400, 409 nombre repetido |
| PUT | `/api/categorias/:id` | 200 (body parcial) | 400, 404, 409 nombre repetido |
| DELETE | `/api/categorias/:id` | 204 (sus vínculos en `_CategoriaToLibro` se borran en cascada; los libros no) | 400, 404 |

Forma del 400:

```json
{ "error": "Datos inválidos", "detalles": [{ "campo": "precio", "mensaje": "El precio debe ser mayor a 0" }] }
```

**Cambio de contrato respecto de C16**: el libro ya no trae `autor: "texto"`. Trae `autorId` y, por el `include`, un objeto `autor: { id, nombre, nacionalidad }`. El detalle (`GET /:id`) suma `categorias: [...]`. Para crear o editar se manda `autorId`, no el nombre.

## Validación vs regla de negocio vs constraint

Defensa en profundidad: el front valida por UX, el back por seguridad (el front se puede saltear) y la base por integridad.

| Capa | Qué controla | Ejemplo | Dónde | Status |
|------|--------------|---------|-------|--------|
| Validación | La **forma** del request | `precio` negativo, falta `titulo`, `id = "abc"` | Zod en `validations/` + middleware | 400 |
| Regla de negocio | Algo que depende de los datos | el libro con id 9999 no existe | service devuelve `null`/`false` y el controller decide | 404 |
| Constraint | Integridad garantizada por la base | `nombre` repetido (`@unique`), FK a un autor inexistente, borrar un autor con libros | `schema.prisma` -> error de Prisma -> `errorHandler` | 409 (P2002 / P2003), 404 (P2025) |

4xx = el cliente lo arregla cambiando el request. 5xx = el problema es nuestro.

## Middlewares

- `validate(schema)`: `safeParse(req.body)`. Si falla, `next(error)`; si pasa, reemplaza `req.body` por el dato limpio y llama a `next()`.
- `validateParams(schema)`: igual con `req.params` (usa `z.coerce.number()` porque todo lo que viene en la URL es string).
- `errorHandler(err, req, res, next)`: 4 parámetros, va **después** de todas las rutas. Traduce `ZodError` a 400, `P2002`/`P2003` a 409 y `P2025` a 404; cualquier otro error lo loguea y responde 500.

Express 5 manda solo a `next(err)` las promesas rechazadas de un handler `async`: por eso los controllers no necesitan `try/catch`.

## Cómo levantar y migrar

```bash
cp backend/.env.example backend/.env   # completar usuario y contraseña
docker compose up -d --build           # --build: package.json cambió (zod)
docker compose exec api npx prisma migrate reset --force   # BORRA la base y re-aplica las migraciones
docker compose exec api npx prisma generate
docker compose exec api npx prisma db seed                 # reset no corre el seed
```

### Por qué `migrate reset`

La migración `relaciones_autor_categoria` hace `DROP COLUMN "autor"` y `ADD COLUMN "autorId" INTEGER NOT NULL` sin default. Sobre una base que ya tiene libros, Postgres no sabe qué `autorId` poner y la migración falla. En **desarrollo** se resuelve con `migrate reset` (se pierden los datos y el seed los vuelve a cargar). En **producción**, con datos reales, se harían tres migraciones: 1) `autorId` nullable, 2) un script que completa `autorId` buscando el autor por nombre, 3) `autorId` obligatorio y `DROP` de `autor`.

La migración se generó sin base con `prisma migrate diff --from-schema <schema C16> --to-schema prisma/schema.prisma --script`.

## Pendiente de probar (necesita Postgres)

Se verificó sin base: `prisma validate`, `prisma generate`, `tsc --noEmit`, y los casos 400 de `api.http` levantando la API con una `DATABASE_URL` falsa (la validación corta antes de llegar a Prisma).

Falta probar con Docker:

- [ ] Aplicar la migración con `migrate reset --force` y revisar las tablas (`\d "Libro"`, `\d "_CategoriaToLibro"`).
- [ ] Correr el seed y verificar: `SELECT count(*) FROM "Autor";` (4), `"Categoria"` (3), `"Libro"` (4), `"_CategoriaToLibro"` (8).
- [ ] Correr `api.http` completo, en orden: casos felices (con `autor` anidado), 404 y 409.
- [ ] Verificar que el `errorHandler` traduce P2002 / P2003 / P2025 con el adapter-pg real (que lleguen como `PrismaClientKnownRequestError` con esos `code`).
