# C18 – Seguridad en la librería

Actividad AI-C18 de Desarrollo de Software (UTN FRLP). Parte de la librería de C17 (Express 5 + Prisma 7 + PostgreSQL + Zod 4) y agrega:

- **Usuarios** con modelo `Usuario` y `enum Rol { ADMIN CLIENTE }`.
- **Contraseñas hasheadas con bcrypt** (costo 10). En la base se guarda `passwordHash`, nunca la contraseña.
- **Registro y login con JWT** (`POST /api/auth/registro`, `POST /api/auth/login`, `GET /api/auth/yo`).
- **Middlewares `authenticate` (401) y `authorize` (403)**: la lectura es pública y la escritura queda solo para ADMIN.
- **`omit` global de `passwordHash`** en el cliente de Prisma: el hash no sale de ninguna query salvo que se pida explícito (solo el login lo pide).

El frontend es el de C16/C17, sin cambios.

## Matriz de permisos

| Endpoint | Invitado | CLIENTE | ADMIN |
|----------|:--------:|:-------:|:-----:|
| `POST /api/auth/registro` | ✅ 201 | ✅ 201 | ✅ 201 |
| `POST /api/auth/login` | ✅ 200 | ✅ 200 | ✅ 200 |
| `GET /api/auth/yo` | ❌ 401 | ✅ 200 | ✅ 200 |
| `GET /api/libros`, `GET /api/libros/:id` | ✅ 200 | ✅ 200 | ✅ 200 |
| `GET /api/autores`, `GET /api/autores/:id` | ✅ 200 | ✅ 200 | ✅ 200 |
| `GET /api/categorias`, `GET /api/categorias/:id` | ✅ 200 | ✅ 200 | ✅ 200 |
| `POST` / `PUT` / `DELETE` de libros | ❌ 401 | ❌ 403 | ✅ |
| `POST` / `PUT` / `DELETE` de autores | ❌ 401 | ❌ 403 | ✅ |
| `POST` / `PUT` / `DELETE` de categorías | ❌ 401 | ❌ 403 | ✅ |

- **401 = autenticación**: "no sé quién sos" (falta el token, está vencido o mal firmado).
- **403 = autorización**: "sé quién sos y no podés".

Orden en las rutas de escritura: `authenticate -> authorize("ADMIN") -> validateParams -> validate -> controller`. Los middlewares más baratos y restrictivos van primero: un invitado recibe 401 sin ver los mensajes de validación, que describen la API. Un ADMIN con un body inválido recibe 400 (no 403).

## Flujo de autenticación

1. **Registro**: el cliente manda `{ nombre, email, password }`. Zod normaliza el email (trim + minúsculas) y exige una contraseña fuerte. El rol **no** se acepta del body: lo pone la base (`@default(CLIENTE)`).
2. **Hash**: `bcrypt.hash(password, 10)` genera un salt aleatorio y lo guarda dentro del hash. Se guarda `passwordHash`; la respuesta (201) no incluye el hash. Un email repetido da P2002 -> 409.
3. **Login**: se busca el usuario por email (pidiendo el hash con `omit: { passwordHash: false }`) y se verifica con `bcrypt.compare`. Si el email no existe o la clave está mal, se responde lo mismo, **401 "Credenciales inválidas"**, para no revelar qué emails están registrados (user enumeration).
4. **Token**: `jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: "2h" })`. El JWT (`header.payload.signature`) está **firmado, no encriptado**: cualquiera lee el payload, por eso solo lleva id y rol. Nadie puede modificarlo sin el secret.
5. **Requests protegidos**: el cliente manda `Authorization: Bearer <token>`. `authenticate` hace `jwt.verify` (firma + vencimiento) y carga `req.usuario`. Si falla, 401 ("Falta el token", "Token inválido" o "Token expirado").
6. **Autorización**: `authorize("ADMIN")` compara `req.usuario.rol` con los roles permitidos. Si no está, 403. Es stateless: el servidor no guarda sesiones, y como contrapartida un token no se puede revocar antes de su `exp`.

## Estructura

```
c18-autenticacion/
├── frontend/                  # app React de C16, sin cambios
├── backend/
│   ├── api.http               # 12 casos de auth + requests de C17 (escrituras con token ADMIN)
│   ├── .env.example           # JWT_SECRET con placeholder (el real va en .env, que no se versiona)
│   ├── prisma.config.ts
│   ├── prisma/
│   │   ├── schema.prisma      # Autor, Libro, Categoria + Usuario y enum Rol
│   │   ├── migrations/        # ... + usuarios_y_roles
│   │   └── seed.ts            # idempotente; usuarios con contraseña hasheada
│   └── src/
│       ├── index.ts           # /api/auth antes que el resto, errorHandler último
│       ├── config/
│       │   ├── env.ts         # JWT_SECRET obligatorio, JWT_EXPIRES_IN, SALT_ROUNDS
│       │   └── prisma.ts      # PrismaClient con omit global de passwordHash
│       ├── routes/            # auth.routes.ts + libro/autor/categoria con authenticate/authorize
│       ├── middlewares/       # auth.middleware.ts, validate.middleware.ts, error.middleware.ts
│       ├── validations/       # auth.validation.ts (registro, login) + los de C17
│       ├── controllers/       # auth.controller.ts + los de C17, sin try/catch
│       ├── services/          # auth.service.ts (bcrypt + jwt) + los de C17
│       ├── types/             # auth.types.ts, express.d.ts (req.usuario) + los de C17
│       └── generated/         # cliente de Prisma (NO va a Git)
└── docker-compose.yml
```

## Cómo levantar

1. En `backend/.env` (copiado de `.env.example`) agregar un `JWT_SECRET` real, largo y aleatorio:

   ```bash
   node -e 'console.log(require("crypto").randomBytes(48).toString("hex"))'
   ```

   Sin `JWT_SECRET`, la API no arranca (`Falta JWT_SECRET en el .env`), y el seed tampoco, porque importa `config/env.ts`.

2. Levantar y preparar la base:

   ```bash
   docker compose up -d --build                     # --build: se agregaron bcrypt y jsonwebtoken
   docker compose exec api npx prisma migrate dev   # aplica usuarios_y_roles
   docker compose exec api npx prisma generate      # no se dispara solo
   docker compose exec api npx prisma db seed       # tampoco se dispara solo
   ```

La migración `usuarios_y_roles` solo crea el tipo `Rol`, la tabla `Usuario` y el índice único de `email`. No toca tablas existentes, así que se aplica sobre la base de C17 sin perder datos. Se generó sin base con `prisma migrate diff --from-schema <schema C17> --to-schema prisma/schema.prisma --script`.

## Usuarios del seed

> ⚠️ Credenciales **solo de desarrollo**. No usar en producción.

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@libreria.test` | `Admin1234` | ADMIN |
| `cliente@libreria.test` | `Cliente1234` | CLIENTE |

El seed es idempotente: autores y categorías con `createMany({ skipDuplicates: true })`, libros solo si la tabla está vacía y usuarios con `upsert` por email.

## Vulnerabilidades cubiertas

| Riesgo | Quién lo cubre |
|--------|----------------|
| SQL injection | Prisma parametriza las queries (salvo `$queryRawUnsafe`) |
| XSS | React escapa lo que renderiza (salvo `dangerouslySetInnerHTML`) |
| Datos con forma inválida | Zod en el backend |
| Exposición de datos sensibles | `passwordHash` + `omit` global + `select` explícito; payload del JWT solo con id y rol |
| Autenticación rota | bcrypt, mensaje genérico en el login, JWT verificado con `jwt.verify`, secret fuera de Git |
| Escalada de privilegios | El rol no se acepta del body; `authorize("ADMIN")` en las escrituras |

bcrypt no protege contra contraseñas malas: por eso el registro exige 8 caracteres, una mayúscula y un número.

## Probado sin base (sin Docker)

Con `JWT_SECRET` de prueba, `DATABASE_URL` de mentira y `npx tsx src/index.ts`, más tokens firmados con node + jsonwebtoken:

- Caso 3: registro con password `"corta"` -> 400 con los 3 errores.
- Caso 7: `GET /api/auth/yo` sin header -> 401 "Falta el token".
- Caso 9: `POST /api/libros` sin header -> 401.
- Caso 10: `POST /api/libros` con token CLIENTE -> 403.
- ADMIN con `{"precio":-5}` -> 400.
- Token con un carácter del payload cambiado -> 401 "Token inválido".
- Token vencido (`expiresIn` negativo) -> 401 "Token expirado".

## Pendiente de probar

Necesita Docker/Postgres:

- [ ] Aplicar la migración `usuarios_y_roles` (`migrate dev`).
- [ ] Correr el seed **dos veces** y confirmar que la segunda no falla ni duplica datos.
- [ ] Correr los 12 casos de `api.http` contra Postgres (en particular 1, 2, 4, 5, 6, 8, 11 y 12, que tocan la base) y las requests de C17 con token ADMIN.
- [ ] Confirmar que bcrypt funciona dentro de la imagen `node:22-alpine` (el paquete trae un prebuild `musl`, así que no debería necesitar compilar).
