# Deployment

_Última actualización: 2026-05-08_

## Infraestructura

| Servicio | Proveedor | Uso |
|---|---|---|
| Frontend + API routes | Vercel | Deploy automático desde `main` |
| Base de datos | Supabase (eu-west-1) | PostgreSQL managed |
| IA | Anthropic API | Generación de contenido |
| Email | Resend | Envío de resúmenes |

---

## Variables de entorno

Definidas en `.env` (local) y en **Vercel → Settings → Environment Variables** (producción).

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Supabase pooler (runtime) | `postgresql://postgres.xxx:pass@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Supabase direct (migraciones) | `postgresql://postgres.xxx:pass@aws-0-eu-west-1.pooler.supabase.com:5432/postgres` |
| `NEXTAUTH_SECRET` | Clave de firma JWT | Generar con `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL base de la app | `https://inkwell.vercel.app` (prod) / `http://localhost:3000` (dev) |
| `ANTHROPIC_API_KEY` | API key de Anthropic | `sk-ant-api03-...` |
| `RESEND_API_KEY` | API key de Resend | `re_...` |
| `RESEND_FROM_EMAIL` | Email remitente | `onboarding@resend.dev` (sin dominio propio) |

> ⚠️ **Nunca subir `.env` al repositorio.** Solo está versionado `.env.example` con los nombres de las variables vacíos.

---

## Build

El comando de build ejecuta `prisma generate` antes de `next build` para evitar el error de cliente Prisma desactualizado en Vercel:

```json
"build": "prisma generate && next build"
```

Esto es necesario porque Vercel cachea `node_modules` y no ejecuta `postinstall` automáticamente.

---

## Conexión Supabase + Prisma

Supabase requiere dos URLs distintas:

- **`DATABASE_URL`** (puerto 6543, `?pgbouncer=true`): para queries en runtime. PgBouncer en modo transaction no soporta prepared statements — el flag `pgbouncer=true` desactiva prepared statements en Prisma.
- **`DIRECT_URL`** (puerto 5432): para `prisma migrate` y `prisma db push`, que necesitan conexión directa.

El schema de Prisma usa `directUrl`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## Deploy local

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npm run db:generate

# Aplicar schema a la BD
npm run db:push

# Arrancar servidor de desarrollo
npm run dev
```

---

## Rama de producción

Vercel está conectado a la rama **`main`**. El flujo de trabajo es:

```
feature/* → staging → main → Vercel (producción automática)
```

No hacer push directo a `main`. Consultar `AGENTS.md` para el flujo completo.
