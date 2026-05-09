# Database

_Última actualización: 2026-05-09_

## Proveedor

**Supabase** (PostgreSQL) — región `eu-west-1`.

Conexión mediante **PgBouncer** (transaction pooler) para compatibilidad con Vercel serverless:
- `DATABASE_URL` → puerto `6543`, parámetro `?pgbouncer=true` (runtime, Prisma queries)
- `DIRECT_URL` → puerto `5432` (migraciones con `prisma migrate` / `prisma db push`)

---

## Schema Prisma

Fichero: `prisma/schema.prisma`

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## Modelos

### User

Tabla central de usuarios. Compatible con el adapter de NextAuth.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `String` (cuid) | PK |
| `email` | `String` unique | Email de acceso |
| `password` | `String?` | Hash bcrypt (nullable para OAuth futuro) |
| `name` | `String?` | Nombre opcional |
| `emailVerified` | `DateTime?` | Para magic link (no usado actualmente) |
| `image` | `String?` | Avatar (no usado actualmente) |
| `aiProvider` | `String?` | Proveedor de IA elegido: `anthropic`, `openai` o `gemini` |
| `aiApiKeyEncrypted` | `Text?` | API Key cifrada con AES-256-GCM (nunca en claro) |
| `createdAt` | `DateTime` | Fecha de registro |

Relaciones: `accounts[]`, `sessions[]`, `articles[]`, `knowledgeItems[]`

---

### Article

Artículo guardado por el usuario.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `String` (cuid) | PK |
| `title` | `String` | Título extraído o introducido |
| `url` | `String?` | URL origen (nullable si es texto/PDF) |
| `content` | `Text` | Texto completo del artículo |
| `language` | `String` | Idioma detectado (`en`, `es`, etc.) |
| `tags` | `String[]` | Array de etiquetas libres |
| `createdAt` | `DateTime` | Fecha de creación |
| `userId` | `String` | FK → User |

---

### KnowledgeItem

Elemento de la base de conocimiento del usuario.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `String` (cuid) | PK |
| `title` | `String` | Título descriptivo |
| `url` | `String?` | URL origen (nullable) |
| `content` | `Text` | Contenido de referencia |
| `type` | `String` | Categoría: `tone`, `style`, `topic`, `example` |
| `createdAt` | `DateTime` | Fecha de creación |
| `userId` | `String` | FK → User |

---

### Account, Session, VerificationToken

Tablas estándar del **PrismaAdapter de NextAuth**. No se acceden directamente desde la app — las gestiona NextAuth internamente.

---

## Relaciones

```
User 1──* Article
User 1──* KnowledgeItem
User 1──* Account
User 1──* Session
```

Todas las FK tienen `onDelete: Cascade` — al eliminar un usuario se eliminan todos sus datos.

---

## Migraciones

La migración inicial está en `prisma/migrations/0001_init/migration.sql`.

Para aplicar el schema en un entorno nuevo:

```bash
# Desarrollo (aplica directamente sin historial de migraciones)
npm run db:push

# Producción (con historial formal)
npm run db:migrate
```

Para explorar los datos visualmente:
```bash
npm run db:studio
```
