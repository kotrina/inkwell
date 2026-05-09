# Architecture

_Última actualización: 2026-05-08_

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 4.x |
| ORM | Prisma | 5.22 |
| Base de datos | PostgreSQL (Supabase) | — |
| Autenticación | NextAuth.js | 4.x |
| IA | Anthropic SDK (`claude-sonnet-4-5-20250929`) | 0.89 |
| Email | Resend | 6.x |
| Scraping | Mozilla Readability + JSDOM | — |
| PDF | pdf-parse | 2.x |
| Theme | next-themes | 0.4 |
| Toasts | react-hot-toast | 2.x |
| Deploy | Vercel (frontend + API) | — |
| DB hosting | Supabase (eu-west-1) | — |

---

## Estructura de carpetas

```
inkwell/
├── app/
│   ├── api/
│   │   ├── articles/
│   │   │   ├── route.ts          # GET (lista) / POST (crear)
│   │   │   └── [id]/route.ts     # GET / PATCH (tags) / DELETE
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   └── register/route.ts        # Registro de usuario
│   │   ├── generate/
│   │   │   ├── content/route.ts         # POST — generador de contenido
│   │   │   ├── summary/route.ts         # POST — generador de resumen
│   │   │   └── send-email/route.ts      # POST — envío por Resend
│   │   ├── knowledge/
│   │   │   ├── route.ts          # GET / POST
│   │   │   └── [id]/route.ts     # DELETE
│   │   ├── scrape/route.ts       # POST — extracción de URL
│   │   └── upload/route.ts       # POST — parsing de PDF
│   ├── articles/page.tsx
│   ├── dashboard/page.tsx
│   ├── generate/
│   │   ├── content/page.tsx
│   │   └── summary/page.tsx
│   ├── knowledge/page.tsx
│   ├── login/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Redirect → /dashboard
├── components/
│   ├── AppShell.tsx              # Layout autenticado con sidebar
│   ├── ArticleCard.tsx           # Card reutilizable de artículo
│   ├── Providers.tsx             # SessionProvider + ThemeProvider + Toaster
│   ├── Sidebar.tsx               # Navegación lateral
│   └── ThemeToggle.tsx           # Toggle dark/light
├── lib/
│   ├── anthropic.ts              # Cliente Anthropic + nombre de modelo
│   ├── auth.ts                   # Configuración NextAuth (authOptions)
│   ├── language.ts               # Detección de idioma + labels
│   ├── prisma.ts                 # Singleton PrismaClient
│   └── scraper.ts                # scrapeUrl() con Readability
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── eval/
│   └── docs/                     # Documentación técnica del proyecto
├── AGENTS.md                     # Protocolo de trabajo del agente
├── .env.example
└── next.config.ts
```

---

## Rutas de la aplicación

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | Static | Redirect a `/dashboard` |
| `/login` | Static | Login y registro |
| `/dashboard` | Static | Vista principal con stats |
| `/articles` | Static | CRUD de artículos |
| `/knowledge` | Static | CRUD base de conocimiento |
| `/generate/summary` | Static | Generador de resumen por email |
| `/generate/content` | Static | Generador de contenido (Twitter/LinkedIn/artículo) |

Todas las páginas autenticadas están envueltas por `AppShell`, que redirige a `/login` si no hay sesión activa.

---

## Flujo de datos general

```
Usuario → Página (Client Component)
         → fetch() → API Route (Server)
                   → Prisma → Supabase (PostgreSQL)
                   → Anthropic SDK → Claude API
                   → Resend → Email
```

---

## Convenciones

- Todas las páginas son Client Components (`"use client"`) — la autenticación se gestiona en el cliente vía `useSession`.
- Las API routes son Server-side y hacen `getServerSession(authOptions)` para verificar sesión.
- Los colores usan CSS variables definidas en `globals.css` para soportar dark/light mode. No se usan colores hardcodeados en componentes.
