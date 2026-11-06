# Porco

> Observatorio visual de riesgos sanitarios en LatAm. Cuatro tarjetas conectan inventario porcino, cisticercosis, PPA y datos abiertos con enfoque One Health.

**Sitio:** [porco.org](https://porco.org) · **Datos para agentes:** [/llms.txt](https://porco.org/llms.txt) · **MCP:** `https://porco.org/api/mcp`

---

## Stack

| Herramienta | Uso |
|---|---|
| Astro 6 (`output: static`) | Sitio SSG |
| Vue 3 | Islas interactivas (`client:visible`) |
| vue-data-ui | Gráficos de barras y dona |
| Vercel Adapter | Deploy + ruta MCP on-demand |
| mcp-handler + Zod | Servidor MCP sobre `public/data/*.json` |

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
```

---

## Estructura

```text
src/
  pages/index.astro              # landing de 4 tarjetas
  pages/api/mcp.ts               # endpoint MCP (Streamable HTTP)
  components/porco/              # CardProblema, CardAmenaza, CardAccion, CardDesarrolladores
  data/porco/riesgos_sanitarios.json  # fuente canónica
  styles/porco.css               # sistema visual
public/
  llms.txt                       # contexto para agentes
  data/riesgos_sanitarios.json   # copia pública (generada)
  data/sanidad.json              # resumen público (generado)
scripts/
  sync-porco-data.mjs            # sincroniza JSON públicos
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

Cliente compatible con Streamable HTTP:

```json
{
  "porco": {
    "url": "https://porco.org/api/mcp"
  }
}
```

Cliente solo stdio:

```json
{
  "porco": {
    "command": "npx",
    "args": ["-y", "mcp-remote", "https://porco.org/api/mcp"]
  }
}
```

---

## Deploy en Vercel

1. Importa el repositorio en Vercel.
2. Framework preset: **Astro** (detectado automáticamente).
3. Build command: `npm run build`.
4. La ruta `/api/mcp` se emite como función serverless; el resto del sitio se prerenderiza.

`vercel.json` añade CORS para MCP y cachea `llms.txt` y `/data/*`.

---

Hecho por Juan Enríquez.
