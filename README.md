# Porco

> Observatorio visual de riesgos sanitarios en LatAm. Cuatro tarjetas conectan inventario porcino, cisticercosis, PPA y datos abiertos con enfoque One Health.

**Sitio:** [porco-tau.vercel.app](https://porco-tau.vercel.app/) · **Datos para agentes:** [/llms.txt](https://porco-tau.vercel.app/llms.txt) · **MCP:** `https://porco-tau.vercel.app/api/mcp` · **Guía:** [/conectar](https://porco-tau.vercel.app/conectar)

---

## Stack

| Herramienta | Uso |
|---|---|
| Astro 6 (`output: static`) | Sitio SSG |
| Vue 3 | Islas interactivas (`client:visible`) |
| vue-data-ui | Gráficos de barras y dona |
| Vercel Adapter | Deploy + rutas on-demand (`/api/mcp`, `/api/feedback`) |
| `@modelcontextprotocol/sdk` v1 + Zod | Servidor MCP sobre `public/data/*.json` |
| Neon Postgres | Persistencia del formulario de comentarios |

**Requisitos:** Node.js ≥ 22.12

---

## Comandos

```bash
npm install
npm run dev        # desarrollo local
npm run check      # tipos Astro
npm run build      # build de producción
npm run preview    # previsualizar build
npm run sync:data  # regenerar public/data desde src/data/porco
npm run db:init    # crear la tabla porco_feedback en Neon
```

---

## Estructura

```text
src/
  pages/index.astro              # landing de 4 tarjetas
  pages/conectar.astro           # guía para conectar Claude y agentes
  pages/api/mcp.ts               # endpoint MCP (Streamable HTTP)
  pages/api/feedback.ts          # guarda comentarios en Neon
  components/porco/              # tarjetas + FeedbackForm
  data/porco/riesgos_sanitarios.json  # fuente canónica
  styles/porco.css               # sistema visual
public/
  llms.txt                       # contexto para agentes
  data/riesgos_sanitarios.json   # copia pública (generada)
  data/sanidad.json              # resumen público (generado)
db/
  schema.sql                     # tabla porco_feedback
scripts/
  sync-porco-data.mjs            # sincroniza JSON públicos
  init-feedback-db.mjs           # aplica el esquema de comentarios
```

`npm run build` ejecuta `prebuild` y sincroniza automáticamente los JSON de `public/data/`.

---

## Datos

- **Inventario:** Colombia 10.67 M (2024, Porcinews) · UE-27 132.14 M (2024, Eurostat) · EE.UU. 75.5 M (Dic 2025, USDA NASS).
- **Acceso:** 24 de 40 territorios de LatAm sin datos de PPA.
- **Cisticercosis:** 9.7% en cerdos (Córdoba, 2024); 14% cerdos y 8.5% humanos (Tolima, 2025).
- **PPA:** riesgo "probable" en Colombia por importaciones informales; mortalidad cercana al 100%.

---

## MCP

El endpoint expone cinco herramientas de solo lectura:

| Herramienta | Contenido |
|---|---|
| `get_riesgos_sanitarios` | Observatorio completo |
| `get_inventario_porcino` | Inventario comparado |
| `get_cisticercosis` | Prevalencia + contexto One Health opcional |
| `get_estado_ppa` | Brecha de datos y riesgo PPA |
| `get_resumen_porco` | Cifras ejecutivas |

Claude Code (Streamable HTTP):

```bash
claude mcp add --transport http porco https://porco-tau.vercel.app/api/mcp
```

Cliente compatible con Streamable HTTP (Cursor, VS Code, etc.):

```json
{
  "mcpServers": {
    "porco": {
      "url": "https://porco-tau.vercel.app/api/mcp"
    }
  }
}
```

Cliente solo stdio:

```bash
npx -y mcp-remote https://porco-tau.vercel.app/api/mcp
```

El servidor es stateless, de solo lectura y no pide autenticación. La guía completa está en `/conectar`.

---

## Comentarios

El botón **Comentarios** abre un formulario de 4 pasos (puntuación, mejoras, colaboración y envío). Las respuestas se guardan en la tabla `porco_feedback` de Neon.

- Esquema: `db/schema.sql`.
- Inicialización: `npm run db:init` (lee `DATABASE_URL` de `.env.local`).
- En Vercel: configura `DATABASE_URL` en el proyecto.
- El endpoint es `POST /api/feedback`, con validación Zod, honeypot y límite de 5 envíos cada 10 minutos por IP.

---

## Deploy en Vercel

1. Importa el repositorio en Vercel.
2. Framework preset: **Astro** (detectado automáticamente).
3. Build command: `npm run build`.
4. Variables: `DATABASE_URL` (Neon) para `/api/feedback`.
5. Las rutas `/api/mcp` y `/api/feedback` se emiten como funciones serverless; el resto del sitio se prerenderiza.

`vercel.json` añade CORS para MCP y cachea `llms.txt` y `/data/*`.

---

Hecho por Juan Enríquez.
