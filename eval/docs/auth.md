# Auth

_Última actualización: 2026-05-08_

## Proveedor

**NextAuth.js v4** con estrategia **JWT** (no database sessions).

Configuración en `lib/auth.ts` → exportada como `authOptions`.

---

## Estrategia de sesión

```ts
session: { strategy: "jwt" }
```

La sesión se almacena en una cookie firmada en el cliente. No se usa la tabla `Session` de la BD para las sesiones activas (aunque existe por compatibilidad con el PrismaAdapter).

---

## Proveedor de credenciales

Único proveedor activo: `CredentialsProvider` (email + password).

### Flujo de login

```
POST /api/auth/callback/credentials
  → authorize()
    → prisma.user.findUnique({ where: { email } })
    → bcrypt.compare(password, user.password)
    → return { id, email, name }  ← o null si falla
  → jwt() callback: token.id = user.id
  → session() callback: session.user.id = token.id
```

### Flujo de registro

```
POST /api/auth/register
  → validar email + password
  → prisma.user.findUnique() → error si ya existe
  → bcrypt.hash(password, 10)
  → prisma.user.create()
  → signIn("credentials", { email, password })  ← desde el cliente
```

---

## Callbacks JWT y Session

```ts
// jwt: persiste el id del usuario en el token
async jwt({ token, user }) {
  if (user) token.id = user.id;
  return token;
}

// session: expone el id en session.user
async session({ session, token }) {
  if (token && session.user) session.user.id = token.id;
  return session;
}
```

---

## Uso en API routes (server-side)

```ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const session = await getServerSession(authOptions);
if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

const userId = (session.user as { id: string }).id;
```

## Uso en páginas (client-side)

```ts
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();
// status: "loading" | "authenticated" | "unauthenticated"
```

`AppShell` gestiona la redirección a `/login` cuando `status === "unauthenticated"`.

---

## Páginas personalizadas

```ts
pages: { signIn: "/login" }
```

`/login` maneja tanto login como registro en el mismo formulario con tabs.

---

## Seguridad de contraseñas

- Hash con **bcrypt**, coste 10.
- La contraseña nunca se devuelve en ninguna respuesta de la API.
- El campo `password` en el modelo `User` es nullable para compatibilidad con OAuth futuro.

---

## Adapter

`@auth/prisma-adapter` está instalado y configurado, aunque con JWT strategy no se usa activamente para sesiones. Está preparado para soportar OAuth providers en el futuro sin cambios de schema.
