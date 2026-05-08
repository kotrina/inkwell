# Data Patterns

_Última actualización: 2026-05-08_

## Principios generales

- Toda lectura y mutación de datos pasa por **API routes** (`app/api/`), nunca directamente desde el cliente.
- Toda API route verifica sesión con `getServerSession(authOptions)` antes de operar.
- El `userId` siempre se extrae de la sesión del servidor — nunca se acepta del body de la request.
- Los datos se filtran siempre por `userId` para garantizar aislamiento entre usuarios.

---

## Patrón de lectura (GET)

```ts
// 1. Verificar sesión
const session = await getServerSession(authOptions);
if (!session?.user) return 401;
const userId = (session.user as { id: string }).id;

// 2. Query filtrada por usuario
const items = await prisma.model.findMany({
  where: { userId },
  orderBy: { createdAt: "desc" },
  select: { /* solo los campos necesarios */ },
});

return NextResponse.json(items);
```

Los listados devuelven solo los campos necesarios para la UI (no el `content` completo en listas).

---

## Patrón de creación (POST)

```ts
// 1. Sesión + userId
// 2. Validar campos requeridos → 400 si faltan
// 3. Lógica de negocio (scraping, detección de idioma, etc.)
// 4. prisma.model.create({ data: { ...fields, userId } })
// 5. Devolver el objeto creado completo
```

El objeto creado se devuelve completo para que el cliente lo añada al estado local sin necesidad de refetch.

---

## Patrón de mutación parcial (PATCH)

Usado solo para actualizar `tags` de un artículo:

```ts
// 1. Verificar que el recurso pertenece al userId antes de actualizar
const article = await prisma.article.findFirst({ where: { id, userId } });
if (!article) return 404;

await prisma.article.update({ where: { id }, data: { tags } });
```

---

## Patrón de eliminación (DELETE)

```ts
// Verificar propiedad antes de eliminar
const item = await prisma.model.findFirst({ where: { id, userId } });
if (!item) return 404;

await prisma.model.delete({ where: { id } });
return { success: true }
```

---

## Patrón de generación con IA

Usado en `/api/generate/summary` y `/api/generate/content`:

```ts
// 1. Rate limiting básico (Map en memoria, 6s entre requests por userId)
// 2. Cargar artículos del usuario desde BD
// 3. [Solo content] Cargar knowledge items completos del usuario
// 4. Construir prompt con los datos
// 5. anthropic.messages.create({ model, max_tokens, messages })
// 6. Devolver content[0].text
```

**Rate limiting:** implementado con un `Map<userId, timestamp>` en memoria. Se resetea con cada redeploy. Límite: 1 request cada 6 segundos por usuario.

---

## Estado en el cliente

Las páginas mantienen estado local con `useState` y lo actualizan optimísticamente tras cada operación:

| Operación | Actualización de estado |
|---|---|
| Crear | `setPrev([newItem, ...prev])` |
| Eliminar | `setPrev(prev.filter(i => i.id !== id))` |
| Patch (tags) | `setPrev(prev.map(i => i.id === id ? {...i, tags} : i))` |

No se hace refetch tras mutaciones — el objeto devuelto por la API se usa directamente.

---

## Scraping e ingesta

```
URL  → POST /api/scrape  → Readability + JSDOM → { title, content }
PDF  → POST /api/upload  → pdf-parse            → { title, content }
Text → directo en cliente (no pasa por API)
```

Tras la extracción, el cliente rellena los campos del formulario y el usuario puede editarlos antes de guardar con `POST /api/articles`.

La detección de idioma se hace en el servidor al crear el artículo (`lib/language.ts`), comparando frecuencia de palabras comunes en ES/EN.
