# Components

_Última actualización: 2026-05-09_

Todos los componentes son **Client Components** (`"use client"`).
Se encuentran en la carpeta `components/`.

---

## Providers

**Archivo:** `components/Providers.tsx`

Wrapper raíz que envuelve toda la app en `app/layout.tsx`.

```tsx
<ThemeProvider attribute="data-theme" defaultTheme="dark">
  <SessionProvider>
    {children}
    <Toaster />
  </SessionProvider>
</ThemeProvider>
```

| Responsabilidad | Librería |
|---|---|
| Gestión de tema dark/light | `next-themes` |
| Sesión de usuario | `next-auth/react` |
| Notificaciones toast | `react-hot-toast` |

Los toasts usan CSS variables para adaptarse al tema activo.

---

## AppShell

**Archivo:** `components/AppShell.tsx`

Layout principal para todas las páginas autenticadas. Verifica sesión y redirige a `/login` si no hay usuario.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `children` | `ReactNode` | Contenido de la página |

**Comportamiento:**
- Muestra spinner mientras `status === "loading"`
- Redirige a `/login` si `status === "unauthenticated"`
- En móvil muestra header con botón hamburguesa para abrir el sidebar
- En desktop el sidebar es fijo y siempre visible

**Estructura:**
```
AppShell
├── overlay (móvil, al abrir sidebar)
├── Sidebar
└── main
    ├── header móvil (☰ + título)
    └── {children}
```

---

## Sidebar

**Archivo:** `components/Sidebar.tsx`

Navegación lateral de la app.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `onClose` | `() => void` (opcional) | Callback para cerrar en móvil |

**Contenido:**
- Logo "✒ Inkwell"
- Links de navegación (activo resaltado con `var(--accent)`)
- `ThemeToggle`
- Email del usuario y botón de cerrar sesión

**Rutas de navegación:**

| Icono | Ruta | Label |
|---|---|---|
| ⊞ | `/dashboard` | Inicio |
| ◈ | `/articles` | Artículos |
| ◎ | `/knowledge` | Conocimiento |
| ✉ | `/generate/summary` | Resumen email |
| ✒ | `/generate/content` | Generar contenido |

**Sección inferior** (debajo del toggle de tema):

| Elemento | Descripción |
|---|---|
| `ThemeToggle` | Cambia entre tema oscuro y claro |
| `?` Manual de usuario | Link a `/manual` (resaltado con `var(--accent)` si está activo) |
| Email + Cerrar sesión | Email del usuario y botón `signOut` |

---

## ThemeToggle

**Archivo:** `components/ThemeToggle.tsx`

Toggle de dark/light mode con animación slide.

**Props:** ninguna.

**Comportamiento:**
- Usa `useTheme()` de `next-themes`
- Renderiza `null` hasta que el componente está montado (evita hydration mismatch)
- Persiste la preferencia en `localStorage`
- Muestra "☾ Oscuro" / "☀ Claro" según el tema activo

---

## ArticleCard

**Archivo:** `components/ArticleCard.tsx`

Card reutilizable para mostrar un artículo en listas y selectores.

**Props:**

| Prop | Tipo | Requerido | Descripción |
|---|---|---|---|
| `article` | `Article` | ✓ | Datos del artículo |
| `selected` | `boolean` | — | Estado del checkbox de selección |
| `onSelect` | `(id, checked) => void` | — | Callback al marcar/desmarcar |
| `onDelete` | `(id) => void` | — | Muestra botón ✕ y llama al callback |
| `onTagsChange` | `(id, tags) => void` | — | Muestra input inline para añadir tags |

**Tipo `Article`:**
```ts
{
  id: string;
  title: string;
  url?: string | null;
  language: string;   // "en", "es", etc.
  tags: string[];
  createdAt: string;
}
```

**Subcomponente interno `TagEditor`:** input inline que añade tags al pulsar Enter o coma, y elimina el último con Backspace.

**Usos:**
- `/articles` → con `onDelete` y `onTagsChange`, sin `onSelect`
- `/generate/summary` y `/generate/content` → con `onSelect`, sin `onDelete` ni `onTagsChange`
