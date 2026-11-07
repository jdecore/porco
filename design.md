# PORCO Design System — Observatorio Editorial de Alto Contraste

> **Documento canónico de arquitectura visual de Porco.**
> Derivado del sistema de FUTTEB⚽L (`design.landing.md` + `design.md`), conservando su lógica de 4 colores, geometría estricta, tipografía de 3 roles y estética editorial tipo BunPod.
> **Decisión de color:** no hay quinto color. El **rojo (`#D93A2B`)** es el único acento; el verde bosque queda solo para estados. Se elimina el Volt Lime y no se sustituye por otro ácido.
> Stack real de Porco: **Astro 6 (static) + Vue 3 + CSS plano (`src/styles/porco.css`)**. No hay Tailwind ni Nativewind; las reglas se traducen a tokens CSS.

---

## 1. Filosofía del producto

> **"Porco es un observatorio visual de riesgos sanitarios en LatAm."**

Cuatro tarjetas conectan inventario porcino, cisticercosis, PPA y la brecha de datos. El diseño no decora: jerarquiza evidencia. Una persona debe entender el riesgo en menos de 15 segundos y un agente debe poder leer los mismos datos vía MCP.

**Principios no negociables**

1. **Editorial, no dashboard.** Tipografía grande, cifras protagonistas, cero adornos.
2. **Cuatro colores base y un acento.** Papel, tinta, verde bosque y carbón. El rojo es el único acento y se usa con avaricia. No hay quinto color.
3. **Dos oraciones máximo por tarjeta.** Si no cabe, el copy está mal, no el diseño.
4. **Alto contraste siempre.** Ningún texto decorativo por debajo de 13px.
5. **El dato manda.** Los gráficos son la evidencia; el texto solo la traduce.

---

## 2. Reglas anti-vibe-coding (obligatorias)

### A. Cero micro-textos basura
- Prohibidos los mini-títulos decorativos tipo `01 // SEÑAL`, `// MCP`, `02 // PROTOCOLO`, `DATA-DRIVEN`.
- Los índices `01–04` de tarjeta se permiten **solo** como numeración funcional, no como decoración repetida en cada bloque interno.
- Prohibido cualquier texto visible menor a **13px** (`0.8125rem`). Etiquetas, pills, metadatos y enlaces incluidos.
- Prohibidos los subtítulos explicativos redundantes bajo un título.

### B. Lienzo limpio
- Fondo general crema `#F2EEE7`. Se permiten **dos** halos radiales suaves (rojo 8% y verde 8%) como atmósfera; nada de blobs, mallas ni gradientes de arcoíris.
- Prohibido usar superficies pastel lavadas (`#FCF6E8`, azul pálido, verde menta) sobre el lienzo claro.
- Prohibido apilar más de dos niveles de superficie con borde: lienzo → tarjeta → panel interno. El tercer nivel debe ser sutil.

### C. Superficies
| Contexto | Superficie | Borde |
| :--- | :--- | :--- |
| Lienzo | `#F2EEE7` | — |
| Tarjeta clara | `#FBF9F4` | `1px #DED6C9` |
| Panel interno claro | `rgba(242,238,231,0.55)` | `1px #DED6C9` |
| Tarjeta oscura (devs) | `#17181A` | `1px #2C2D30` |
| Panel oscuro | `#0D0E0F` | `1px #26282B` |

### D. Regla del acento
- El rojo es el **único** acento. No se añade azul, rosa, ámbar ni un segundo color brillante.
- Sobre lienzo claro, el rojo de texto se oscurece a **Rojo Profundo `#A32318`** (AA). El rojo pleno `#D93A2B` se reserva para rellenos, cifras grandes y bordes.
- Sobre la tarjeta oscura, el rojo se ilumina a **Rojo Coral `#FF7A6B`** (≈7:1 sobre `#17181A`). Es un tinte del mismo acento, no un color nuevo.
- El verde bosque **no es acento**: solo confirma estados (copiado, en línea, disponible).
- El rojo puede aparecer en las cuatro tarjetas porque es el sistema, pero nunca dos rojos distintos compitiendo en la misma superficie.

---

## 3. Paleta oficial (4 colores + acento)

### A. Base
| Token CSS | Valor | Nombre | Aplicación |
| :--- | :--- | :--- | :--- |
| `--bg` | `#F2EEE7` | Papel Crudo | Lienzo general |
| `--bg-soft` | `#EAE4DA` | Papel Sombra | Skeletons, superficies hundidas |
| `--card` | `#FBF9F4` | Papel Tarjeta | Tarjetas principales |
| `--ink` | `#161512` | Tinta Carbón | Texto principal, fondos de burbuja usuario |
| `--muted` | `#726B5F` | Tinta Secundaria | Microcopy y metadatos (≥13px) |
| `--line` | `#DED6C9` | Línea | Bordes de 1px |
| `--green` | `#1F5C45` | Verde Bosque | Solo confirmación y estado OK. Nunca acento. |
| `--dark` | `#17181A` | Carbón Táctico | Tarjeta de desarrolladores |
| `--dark-soft` | `#232427` | Carbón Elevado | Contenedores internos oscuros |

### B. Acento único (el rojo)
| Token CSS | Valor | Nombre | Aplicación |
| :--- | :--- | :--- | :--- |
| `--accent` | `#D93A2B` | Rojo Acento | Rellenos, cifras grandes, botones, foco, bordes |
| `--accent-deep` | `#A32318` | Rojo Profundo | Texto/iconos de acento sobre lienzo claro |
| `--accent-bright` | `#FF7A6B` | Rojo Coral | Acento sobre carbón: prompt, pills, enlaces, índices |
| `--accent-soft` | `#F6D7D2` | Rojo Suave | Fondos translúcidos, selección de texto |
| `--accent-wash` | `rgba(217,58,43,0.11)` | Lavado Rojo | Pills, bordes suaves, estado activo |

`--red` y `--red-deep` se conservan como alias semánticos del acento para las alertas.
No existen `--acid`, `--lime` ni ningún quinto color.

**Contraste verificado**
- `#D93A2B` sobre `#FBF9F4` ≈ **4.35:1** → solo texto grande o rellenos; para texto normal usar `#A32318` (≈7.1:1).
- `#D93A2B` con blanco encima ≈ **4.57:1** → AA para botones.
- `#A32318` sobre `#FBF9F4` ≈ **7.1:1** → AAA.
- `#FF7A6B` sobre `#17181A` ≈ **7.0:1** → AA/AAA en la tarjeta oscura.
- `#D93A2B` sobre `#17181A` ≈ **3.9:1** → **prohibido** para texto pequeño en oscuro.

**Equivalencia con FUTTEB⚽L**

| Fútbol | Porco | Rol |
| :--- | :--- | :--- |
| `#FAF8F5` Papel Prensa | `#F2EEE7` Papel Crudo | Lienzo |
| `#FFFFFF` Blanco Puro | `#FBF9F4` Papel Tarjeta | Superficie |
| `#111111` Carbon Black | `#17181A` Carbón Táctico | Ancla oscura |
| `#0A2416` Forest Deep | `#1F5C45` Verde Bosque | Ancla técnica / estado |
| `#D2E858` Volt Lime | **eliminado** | No hay acento ácido |
| `#DC2626` Live Red | **`#D93A2B` Rojo Acento** | Alerta y único acento |

---

## 4. Geometría estricta (4 niveles de radio)

| Nivel | Token | Valor | Uso |
| :--- | :--- | :--- | :--- |
| Tarjeta principal | `--radius` | `28px` | Las 4 tarjetas del grid |
| Contenedor interno | `--radius-md` | `20px` | Chat, terminal, paneles de gráfico |
| Control | `--radius-sm` | `12–14px` | Botones de copia, métricas, pills internas |
| Cápsula | `999px` | `999px` | Topbar, live-pill, badges, enlaces del footer |

Reglas:
- Un solo radio de tarjeta por vista.
- Los bordes son siempre `1px`; nunca 2px salvo foco accesible.
- Sombra permitida: `0 1px 0 rgba(22,21,18,0.04), 0 24px 60px -44px rgba(22,21,18,0.5)`. Nada de `shadow-2xl`.
- Separación del grid: `clamp(14px, 2vw, 22px)`.

---

## 5. Sistema tipográfico de 3 roles

1. **Display — `Bricolage Grotesque`** (`--font-display`)
   - Hero: `clamp(3rem, 8.4vw, 7.6rem)`, peso 800, `line-height: 0.9`, `letter-spacing: -0.055em`.
   - Títulos de tarjeta: `clamp(1.6rem, 2.4vw, 2.2rem)`, peso 700, `line-height: 1.02`.
   - Cifras gigantes: `clamp(3.4rem, 6vw, 5.4rem)`, peso 800.
   - Prohibido usar serif itálica: Porco es grotesco, no editorial clásico. La cursiva se reserva para citas si existieran.

2. **UI & cuerpo — `Inter`** (`--font-body`)
   - Pesos 400/500/600/700. Texto recto, sin cursivas decorativas.
   - Microcopy de tarjeta: `0.9rem`, `line-height: 1.55`, máximo 2 oraciones.

3. **Cuantitativo — `JetBrains Mono`** (`--font-mono`)
   - Pesos 500/700, `font-variant-numeric: tabular-nums`.
   - Comandos, porcentajes, cifras de metadatos, pills y estados.
   - Tamaño mínimo absoluto: **13px** (0.8125rem). Toda etiqueta visible del sitio ya cumple ese umbral; no se aceptan excepciones.

---

## 6. Layout

- Contenedor: `min(1240px, 100%)`, padding `24px clamp(16px, 3vw, 36px) 48px`.
- Hero: eyebrow mono → H1 display → lede de una línea → 4 stats en grid.
- Grid de tarjetas: 2×2 en desktop, 1 columna por debajo de `900px`.
- Altura mínima de tarjeta: `560px` en desktop; se libera en móvil.
- La tarjeta de desarrolladores es la única superficie oscura de la página: es el ancla visual.
- Footer: marca + descripción corta, enlaces en pills, nota de fuentes a todo el ancho.

**Topbar**
- No es cápsula flotante translúcida (Porco es estático y sobrio): es una barra plana sobre el lienzo.
- Marca: cuadro tinta de 38px con el hocico en rojo + wordmark display.
- Navegación en pills; estado `Datos abiertos` con punto verde.

---

## 7. Especificación de las 4 tarjetas

### 01 · CardProblema — "La brecha de datos"
- Superficie clara. Barras comparativas Colombia / UE-27 / EE.UU. con `vue-data-ui`.
- Cifra protagonista: **24 de 40** territorios sin datos de PPA.
- El rojo se usa solo en la serie de Colombia o en la cifra crítica.
- Copy: una frase + el dato. Sin párrafo explicativo.

### 02 · CardAmenaza — "Cisticercosis"
- Superficie clara con halo rojo al 10% arriba a la derecha.
- Dona con centro tipográfico: **9.7%** en display, etiqueta mono debajo.
- Tres métricas de Tolima en paneles `--bg-soft`; la métrica crítica lleva borde rojo al 35%.

### 03 · CardAccion — "Copiar Prompt"
- Superficie clara con halo verde al 10% abajo a la izquierda.
- Mockup de chat: barra con puntos, burbuja usuario en tinta, burbuja agente en tarjeta.
- CTA `Copiar Prompt` en **rojo** (acción primaria), estado copiado en **verde**.
- El verde solo aparece después de copiar: es confirmación, no acento.

### 04 · CardDesarrolladores — "Terminal MCP"
- Única tarjeta oscura: `#17181A` con halo rojo coral al 16% arriba a la derecha.
- Índice y tag en **Rojo Coral `#FF7A6B`**; terminal en `#0D0E0F` con borde `#34363A`.
- Comando real `claude mcp add --transport http porco …` con prompt `$` en coral.
- Pills de herramientas en `--accent-wash` con texto `--accent-bright`.
- **Aquí el rojo es protagonista en su versión iluminada.** Es el mismo acento, no un color nuevo.
- El comando debe ser copiable y apuntar al endpoint público; la guía completa vive en `/conectar`.

---

## 8. Movimiento y estados

- Entrada de tarjetas: `rise` 0.7s, escalonada 70ms, `translateY(18px)`.
- Respetar `prefers-reduced-motion`: sin animación.
- Hover de botón: cambio de color + `translateY(-1px)`, 200ms.
- Foco visible: `outline: 3px solid var(--red)`, offset 3px. En superficies oscuras, usar `--accent-bright`.
- Prohibido: parallax, autoplay, gradientes animados.

---

## 9. Accesibilidad

- Contraste mínimo AA en todo texto; las cifras gigantes son AAA por tamaño.
- No usar color como único portador de significado: la alerta roja siempre lleva texto o cifra.
- Todo gráfico debe tener leyenda textual o `aria-label` con el dato.
- `prefers-reduced-motion` respetado.
- Navegación por teclado en botones de copia y enlaces del footer.

---

## 10. Checklist antes de publicar

- [ ] ¿Hay algún texto menor a 13px?
- [ ] ¿Aparece algún color fuera de los 4 base + rojo?
- [ ] ¿El rojo es el único acento y el verde solo un estado?
- [ ] ¿Alguna tarjeta tiene más de dos oraciones de copy?
- [ ] ¿Hay mini-títulos decorativos redundantes?
- [ ] ¿Los bordes son de 1px y los radios pertenecen a la escala?
- [ ] ¿El build pasa `npm run check` y `npm run build`?
- [ ] ¿El contraste del rojo sobre su superficie supera 4.5:1?
