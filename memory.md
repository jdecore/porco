# Memoria del proyecto — Porco

> Contexto persistente para agentes y para el equipo. Se actualiza cuando cambia una decisión, no cuando cambia un detalle.

## 1. Qué es Porco

Observatorio visual de riesgos sanitarios en LatAm. Cuatro señales conectan animales, datos y personas con enfoque One Health: inventario porcino, cisticercosis, PPA y la brecha de datos pública.

Repo: `https://github.com/jdecore/porkxi` — rama `master`.
Último commit base de esta fase: `b47baac` ("feat: transformar porkxi en Porco con 4 tarjetas y servidor MCP").

## 2. Decisiones tomadas

| Fecha | Decisión | Motivo |
| :--- | :--- | :--- |
| 2026-11 | Adoptar la estructura del design system de FUTTEB⚽L (4 colores, geometría, 3 roles tipográficos, reglas anti-vibe-coding) | Da rigor y evita decisiones ad hoc |
| 2026-11 | Conservar la paleta base de Porco (crema, tinta, rojo, verde, carbón) | Ya funciona y diferencia a Porco de fútbol |
| 2026-11 | Eliminar el acento rosa y dejar el rojo `#D93A2B` como único acento | El rojo ya era el color de alerta; un solo acento evita competencia cromática y cumple 4 base + 1 acento |
| 2026-11 | Sobre claro usar `#A32318` para texto; sobre oscuro usar `#FF7A6B` | El rojo pleno no pasa AA como texto pequeño en crema ni en carbón |
| 2026-11 | El verde bosque queda solo para estados | No es acento; confirma copiado, en línea o disponible |
| 2026-11 | No introducir modo oscuro ni selector de tema | Porco es una página estática de una sola vista; el coste no se justifica |
| 2026-11 | No usar Tailwind ni Nativewind | El proyecto ya está resuelto con CSS plano y tokens |

## 3. Sistema visual en una línea

Papel `#F2EEE7` + tinta `#161512` + verde bosque `#1F5C45` + carbón `#17181A`, con un único acento: rojo `#D93A2B`. Sobre claro se oscurece a `#A32318`; sobre carbón se ilumina a `#FF7A6B`.

## 4. Paleta y tokens

```
--bg #F2EEE7        --card #FBF9F4       --ink #161512
--muted #726B5F     --line #DED6C9       --red #D93A2B
--red-deep #A32318  --green #1F5C45      --dark #17181A
--accent #D93A2B    --accent-deep #A32318
--accent-bright #FF7A6B                 --accent-soft #F6D7D2
--accent-wash rgba(217,58,43,0.11)
```

Contraste: `#A32318` sobre crema ≈ 7.1:1 (AAA). `#D93A2B` con blanco ≈ 4.57:1 (AA). `#FF7A6B` sobre `#17181A` ≈ 7.0:1 (AA). `#D93A2B` sobre carbón ≈ 3.9:1 (prohibido para texto pequeño).

## 5. Tipografía

- Display: Bricolage Grotesque 600/800.
- Cuerpo: Inter 400–700.
- Datos: JetBrains Mono 500/700, `tabular-nums`.
- Mínimo absoluto: 13px.

## 6. Reglas que no se negocian

1. Máximo 4 colores base + 1 acento. El acento es el rojo.
2. Máximo 2 oraciones de copy por tarjeta.
3. Cero mini-títulos decorativos (`01 // ...`, `// MCP`).
4. Cero texto visible por debajo de 13px.
5. Un solo radio de tarjeta por vista (28px).
6. Un solo bloque oscuro por página: la tarjeta de desarrolladores.
7. El verde no se usa como acento; solo como estado.
8. Nada de gradientes animados, parallax ni autoplay.

## 7. Mapa de archivos

- `design.md` — sistema visual canónico.
- `tareas.md` — backlog priorizado.
- `memory.md` — este documento.
- `AGENTS.md` — estado y convenciones para agentes.
- `src/pages/index.astro` — composición de la home.
- `src/styles/porco.css` — tokens y estilos globales.
- `src/components/porco/*.vue` — las cuatro tarjetas.
- `src/data/porco/riesgos_sanitarios.json` — fuente canónica de datos.
- `scripts/sync-porco-data.mjs` — sincroniza JSON públicos.
- `src/pages/api/mcp.ts` — endpoint MCP v1 (Streamable HTTP, solo Vercel).
- `src/pages/api/feedback.ts` — guarda comentarios en Neon.
- `src/pages/conectar.astro` — guía para conectar Claude y agentes.
- `src/components/porco/FeedbackForm.vue` — formulario por pasos.
- `db/schema.sql` — tabla `porco_feedback`.
- `public/llms.txt` — contexto para agentes.

## 8. Historial

- **2026-11** — Refactor completo de porkxi a Porco: nueva home de 4 tarjetas, datos JSON, `llms.txt`, endpoint MCP y configuración Vercel. Commit `b47baac`.
- **2026-11** — Revisión del `design.md` de FUTTEB⚽L (`C:\Users\jenri\Videos\brain\futtebol\`). Se adoptan sus reglas y se crea `design.md` de Porco.
- **2026-11** — Se elimina el rosa ácido. El rojo `#D93A2B` pasa a ser el único acento, con `#A32318` sobre claro y `#FF7A6B` sobre carbón. Se suben todas las etiquetas a ≥13px.
- **2026-11** — Se migra el endpoint MCP de `mcp-handler` v2 a `@modelcontextprotocol/sdk` v1 con `WebStandardStreamableHTTPServerTransport`.
- **2026-11** — Se añade el formulario de comentarios por pasos y se conecta a Neon (`porco_feedback`).
- **2026-11** — Se crea la guía `/conectar` adaptada del flujo de conectores de Claude.
- **2026-11** — Se reescribe `llms.txt` con URLs, herramientas, cifras y reglas de interpretación.
- **2026-11** — Deploy a producción en Vercel (proyecto `porco`, team `jovexi`). `DATABASE_URL` configurada en `production` y `preview`. Verificado en vivo: `/conectar` responde 200, MCP devuelve JSON con las 5 herramientas y `/api/feedback` inserta y valida en `porco_feedback`.

## 9. Pendiente crítico

- Verificar el conector en Claude real (agregar, listar herramientas y hacer una consulta).
- Revisar el resultado del rojo coral en la tarjeta oscura en navegador real.

## 10. Fuentes de datos

Eurostat, USDA NASS, Porcinews y estudios de Córdoba y Tolima. La fuente canónica dentro del repo es `src/data/porco/riesgos_sanitarios.json`; nunca editar las copias de `public/data/` a mano.

- **2026-11** � Nueva paleta: fondo claro + terracota `#B5502B` como base de las 4 tarjetas + verde claro `#B8E3A0` como �nico color de atenci�n. Se eliminan rojo, coral, carb�n, verde bosque y halos. Logo nuevo en `public/logo.svg`. Contraste: crema sobre terracota �4.6:1; tinta sobre verde claro �11:1.
