# Tareas — Porco

> Backlog vivo. Orden por impacto visual/percepción, no por esfuerzo.
> Estados: `[ ]` pendiente · `[~]` en curso · `[x]` hecho.

## Fase 1 — Consolidar el sistema visual (esta iteración)

- [x] Analizar el `design.md` de FUTTEB⚽L y extraer sus reglas canónicas.
- [x] Redactar `design.md` de Porco con un único acento.
- [x] Eliminar el rosa ácido y dejar el rojo como único acento (`--accent*`).
- [x] Crear `tareas.md` y `memory.md`.
- [x] Actualizar `AGENTS.md` con el sistema visual y el índice de documentos.
- [x] Auditar tamaños de texto: todas las etiquetas visibles están a ≥13px.
- [x] Revisar contraste de `#A32318` sobre crema y `#FF7A6B` sobre `#17181A`.
- [x] Correr `npm run check` y `npm run build` tras el cambio de tokens.
- [ ] Verificar la tarjeta de desarrolladores con rojo coral en desktop y móvil reales.
- [ ] Commit y push de la fase visual.

## Fase 2 — Jerarquía editorial

- [ ] Subir el hero a un único mensaje: hoy compite el H1 con cuatro stats muy cerca.
- [ ] Reducir el microcopy de cada tarjeta a 2 oraciones exactas (hay casos de 3).
- [ ] Eliminar el índice `01–04` de las tarjetas claras y conservarlo solo en la oscura, o quitarlo del todo.
- [ ] Unificar el eyebrow del hero con el tono del resto (mono, 13px, sin exceso de tracking).
- [x] Revisar que el rojo sea el único acento y que el verde quede solo para estados.

## Fase 3 — Datos y gráficos

- [ ] Colorear las series de `vue-data-ui` con la paleta Porco (hoy usan hex sueltos en los componentes).
- [ ] Añadir leyenda textual accesible a barras y dona.
- [ ] Añadir `aria-label` con el valor numérico a cada gráfico.
- [ ] Mostrar el año/fuente directamente en cada tarjeta, no solo en el footer.
- [ ] Evaluar una quinta tarjeta o sección de "metodología" sin romper el 2×2.

## Fase 4 — Producto y distribución

- [x] Migrar el endpoint MCP a la SDK v1 con `WebStandardStreamableHTTPServerTransport`.
- [x] Añadir guía `/conectar` para Claude, Claude Code, Cursor y VS Code.
- [x] Reemplazar GitHub y "Datos abiertos" por el botón Comentarios.
- [x] Formulario de comentarios por pasos conectado a Neon.
- [x] Añadir `robots.txt` y `sitemap.xml`.
- [x] Reescribir `llms.txt` con URLs, herramientas y reglas de interpretación.
- [ ] Verificar el conector MCP en Claude real y documentar el resultado.
- [ ] Configurar `DATABASE_URL` en Vercel y probar el formulario en producción.
- [ ] Verificar GitHub Pages con `ASTRO_BASE=/porkxi/`.
- [ ] Añadir `og:image` real (hoy no existe).

## Fase 5 — Ideas de diseño a evaluar (no comprometidas)

- [ ] Tarjeta oscura con borde rojo coral de 1px y halo más contenido.
- [ ] Dona con el 9.7% en rojo coral sobre carbón, en lugar de rojo sobre crema.
- [ ] Separador editorial entre hero y grid con una regla de 1px y una cifra grande.
- [ ] Modo "ficha técnica" imprimible: una hoja A4 con las cuatro tarjetas.
- [ ] Micro-interacción de copiado: el botón se oscurece y vuelve a verde.
- [ ] Explorar tipografía display alternativa (más condensada) sin perder Bricolage.
- [ ] Sustituir el halo radial del body por una textura de papel muy sutil.
