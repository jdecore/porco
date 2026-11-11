# porco - Estado actual

## Descripción
Observatorio visual de riesgos sanitarios en LatAm. Conecta inventario porcino, cisticercosis, PPA y la brecha de datos con enfoque One Health.

## Stack
- Astro 6 (`output: static`) + adaptador Vercel.
- Vue 3 (islas `client:visible`).
- vue-data-ui para barras y dona.
- `@modelcontextprotocol/sdk` v1 + Zod para el endpoint MCP (Streamable HTTP stateless).
- Neon Postgres (`@neondatabase/serverless`) para el formulario de comentarios.
- CSS plano con tokens en `src/styles/porco.css` (sin Tailwind).
- Node 22+.

## Documentos de trabajo
- `design.md`: sistema visual canónico (paleta, tipografía, geometría, reglas).
- `tareas.md`: backlog priorizado.
- `memory.md`: decisiones, historial y contexto persistente.
- `README.md`: documentación general para humanos.

## Páginas
- `src/pages/index.astro`: hero + cuatro tarjetas + botón Comentarios.
- `src/pages/conectar.astro`: guía paso a paso para conectar Claude y otros agentes por MCP.
- `CardProblema.vue`: barras comparativas Colombia / UE-27 / EE.UU. y dato "24 de 40".
- `CardAmenaza.vue`: dona 9.7% de cisticercosis y métricas de Tolima.
- `CardAccion.vue`: mockup de chat con botón "Copiar Prompt".
- `CardDesarrolladores.vue`: terminal con `claude mcp add --transport http porco …`.
- `FeedbackForm.vue`: modal de comentarios en 4 pasos (rating, mejoras, colaboración, envío).
- Estilos globales en `src/styles/porco.css`.

## Sistema visual
- Tres roles de color: fondo claro papel #F2EEE7, base terracota #E35336 (superficie de las 4 tarjetas) y verde claro #B8E3A0 para llamar la atención (cifras clave, botones, pills, serie crítica).
- Apoyos: terracota profunda #B8401F / oscura #9A3219 (paneles internos), crema #FBF9F4 (texto sobre terracota), tinta #161512 (texto sobre claro y sobre verde claro).
- Sin halos ni degradados decorativos. Sin rojo, coral, carbón ni verde bosque.
- Logo: `public/logo.svg` (también `public/favicon.svg`).
- Tipografías: Bricolage Grotesque (display), Inter (cuerpo), JetBrains Mono (datos).
- Radios: 28px tarjeta, 20px panel, 12–14px control, 999px cápsula.
- Máximo 2 oraciones de copy por tarjeta; tipografía mínima 13px sin excepciones.
- Detalle completo en `design.md`.

## Datos
- Fuente canónica: `src/data/porco/riesgos_sanitarios.json`.
- Copias públicas generadas: `public/data/riesgos_sanitarios.json` y `public/data/sanidad.json`.
- Sincronización: `scripts/sync-porco-data.mjs` (se ejecuta en `predev` y `prebuild`).
- Contexto para agentes: `public/llms.txt` (incluye URLs, herramientas, cifras y reglas de interpretación).
- Comentarios: tabla `porco_feedback` en Neon. Esquema en `db/schema.sql`; `npm run db:init` lo aplica.

## MCP
- Ruta: `src/pages/api/mcp.ts` (`prerender = false`).
- SDK: `@modelcontextprotocol/sdk` v1 con `WebStandardStreamableHTTPServerTransport` stateless y `enableJsonResponse`.
- Herramientas de solo lectura: `get_riesgos_sanitarios`, `get_inventario_porcino`, `get_cisticercosis`, `get_estado_ppa`, `get_resumen_porco`.
- Endpoint público: `https://porco-tau.vercel.app/api/mcp`.
- Guía: `src/pages/conectar.astro` → `/conectar`.
- Deploy objetivo: Vercel (`vercel.json` con CORS y cache).

## Scripts heredados
- `scripts/generar_estado_fuentes.py` y `scripts/generar_datasets_publicos.mjs` siguen disponibles para snapshots, aunque la home ya no depende de ellos.

## Deploy
- Vercel: build `npm run build`.
- URL viva: `https://porco-tau.vercel.app/`.
- Variables en Vercel: `DATABASE_URL` (Neon) para `/api/feedback`. El MCP no necesita variables.
- GitHub Pages: `.github/workflows/deploy-pages.yml` (sitio estático; MCP y comentarios requieren Vercel).
- Repo: `https://github.com/jdecore/porkxi`, rama `master`.

## Convenciones para agentes
- Leer `design.md` antes de tocar UI.
- No introducir un segundo acento ni degradados decorativos. El rojo es el único acento.
- Cualquier cambio de datos debe partir de `src/data/porco/riesgos_sanitarios.json` y ejecutar la sincronización.
- No editar `public/data/*` a mano.
- Antes de cerrar: `npm run check` y `npm run build`.
