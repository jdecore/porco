# porco - Estado actual

## Descripción
Observatorio visual de riesgos sanitarios en LatAm. Conecta inventario porcino, cisticercosis, PPA y la brecha de datos con enfoque One Health.

## Stack
- Astro 6 (`output: static`) + adaptador Vercel.
- Vue 3 (islas `client:visible`).
- vue-data-ui para barras y dona.
- mcp-handler + Zod para el endpoint MCP.
- Node 22+.

## Página
- `src/pages/index.astro`: hero + cuatro tarjetas.
- `CardProblema.vue`: barras comparativas Colombia / UE-27 / EE.UU. y dato "24 de 40".
- `CardAmenaza.vue`: dona 9.7% de cisticercosis y métricas de Tolima.
- `CardAccion.vue`: mockup de chat con botón "Copiar Prompt".
- `CardDesarrolladores.vue`: terminal con `npx @porco/mcp-server`.
- Estilos globales en `src/styles/porco.css`.

## Datos
- Fuente canónica: `src/data/porco/riesgos_sanitarios.json`.
- Copias públicas generadas: `public/data/riesgos_sanitarios.json` y `public/data/sanidad.json`.
- Sincronización: `scripts/sync-porco-data.mjs` (se ejecuta en `predev` y `prebuild`).
- Contexto para agentes: `public/llms.txt`.

## MCP
- Ruta: `src/pages/api/mcp.ts` (`prerender = false`).
- Herramientas de solo lectura: `get_riesgos_sanitarios`, `get_inventario_porcino`, `get_cisticercosis`, `get_estado_ppa`, `get_resumen_porco`.
- Deploy objetivo: Vercel (`vercel.json` con CORS y cache).

## Scripts heredados
- `scripts/generar_estado_fuentes.py` y `scripts/generar_datasets_publicos.mjs` siguen disponibles para snapshots, aunque la home ya no depende de ellos.

## Deploy
- Vercel: build `npm run build`.
- GitHub Pages: `.github/workflows/deploy-pages.yml` (sitio estático; el endpoint MCP requiere Vercel).
