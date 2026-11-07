<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

type Colaboracion = 'si' | 'tal_vez' | 'no' | '';

const abierto = ref(false);
const paso = ref(1);
const rating = ref(0);
const etiquetas = ref<string[]>([]);
const texto = ref('');
const colaboracion = ref<Colaboracion>('');
const rol = ref('');
const email = ref('');
const nombre = ref('');
const consentimiento = ref(false);
const website = ref('');
const enviando = ref(false);
const error = ref('');
const enviado = ref(false);
const panel = ref<HTMLElement | null>(null);
let focoAnterior: HTMLElement | null = null;

const titulos = [
  '¿Cómo te pareció Porco?',
  '¿Qué mejorarías?',
  '¿Quieres colaborar?',
  'Revisa y envía',
];

const etiquetasDisponibles = [
  { id: 'claridad', texto: 'Claridad de los datos' },
  { id: 'diseno', texto: 'Diseño y legibilidad' },
  { id: 'velocidad', texto: 'Velocidad' },
  { id: 'datos', texto: 'Más datos o fuentes' },
  { id: 'mcp', texto: 'Conexión MCP' },
  { id: 'contenido', texto: 'Contenido y análisis' },
  { id: 'otro', texto: 'Otro' },
];

const roles = [
  { id: 'investigador', texto: 'Investigación' },
  { id: 'productor', texto: 'Producción porcina' },
  { id: 'periodista', texto: 'Periodismo' },
  { id: 'funcionario', texto: 'Sector público' },
  { id: 'desarrollador', texto: 'Desarrollo' },
  { id: 'docente', texto: 'Docencia' },
  { id: 'otro', texto: 'Otro' },
];

const ratingTexto = computed(
  () =>
    ({
      0: 'Elige una puntuación',
      1: 'No me sirvió',
      2: 'Faltó claridad',
      3: 'Correcta',
      4: 'Muy buena',
      5: 'Excelente',
    })[rating.value] ?? 'Elige una puntuación',
);

const resumenEtiquetas = computed(() =>
  etiquetas.value
    .map((id) => etiquetasDisponibles.find((item) => item.id === id)?.texto ?? id)
    .join(', '),
);

const resumenColaboracion = computed(
  () =>
    ({
      si: 'Sí, quiero colaborar',
      tal_vez: 'Tal vez, cuéntame más',
      no: 'Solo quería dejar mi opinión',
      '': 'Sin definir',
    })[colaboracion.value],
);

function reiniciar() {
  paso.value = 1;
  rating.value = 0;
  etiquetas.value = [];
  texto.value = '';
  colaboracion.value = '';
  rol.value = '';
  email.value = '';
  nombre.value = '';
  consentimiento.value = false;
  website.value = '';
  error.value = '';
  enviado.value = false;
}

function abrir() {
  if (enviado.value) reiniciar();
  focoAnterior = document.activeElement as HTMLElement | null;
  abierto.value = true;
  document.documentElement.style.overflow = 'hidden';
  nextTick(() => {
    panel.value?.querySelector<HTMLElement>('button, input, textarea, select')?.focus();
  });
}

function cerrar() {
  abierto.value = false;
  document.documentElement.style.overflow = '';
  focoAnterior?.focus();
}

function alClicDocumento(event: MouseEvent) {
  const objetivo = event.target as HTMLElement | null;
  if (objetivo?.closest('[data-feedback-open]')) {
    event.preventDefault();
    abrir();
  }
}

function alTeclaDocumento(event: KeyboardEvent) {
  if (!abierto.value) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    cerrar();
    return;
  }

  if (event.key !== 'Tab' || !panel.value) return;

  const enfocables = Array.from(
    panel.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), a[href]',
    ),
  ).filter((elemento) => elemento.offsetParent !== null);

  if (enfocables.length === 0) return;

  const primero = enfocables[0];
  const ultimo = enfocables[enfocables.length - 1];

  if (event.shiftKey && document.activeElement === primero) {
    event.preventDefault();
    ultimo.focus();
  } else if (!event.shiftKey && document.activeElement === ultimo) {
    event.preventDefault();
    primero.focus();
  }
}

function alternarEtiqueta(id: string) {
  etiquetas.value = etiquetas.value.includes(id)
    ? etiquetas.value.filter((item) => item !== id)
    : [...etiquetas.value, id];
}

function validarPaso() {
  error.value = '';

  if (paso.value === 1 && rating.value === 0) {
    error.value = 'Elige una puntuación para continuar.';
    return false;
  }

  if (paso.value === 3) {
    if (!colaboracion.value) {
      error.value = 'Dinos si te interesa colaborar o si solo querías dejar tu opinión.';
      return false;
    }

    if (colaboracion.value !== 'no' && !email.value.trim()) {
      error.value = 'Déjanos un correo para poder responderte.';
      return false;
    }

    if (
      colaboracion.value !== 'no' &&
      email.value.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
    ) {
      error.value = 'Revisa el correo: parece incompleto.';
      return false;
    }
  }

  if (paso.value === 4 && !consentimiento.value) {
    error.value = 'Necesitamos tu permiso para guardar la respuesta.';
    return false;
  }

  return true;
}

async function avanzar() {
  if (!validarPaso()) return;

  if (paso.value < 4) {
    paso.value += 1;
    nextTick(() => panel.value?.querySelector<HTMLElement>('h3, input, textarea')?.focus());
    return;
  }

  enviando.value = true;
  error.value = '';

  try {
    const respuesta = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: rating.value,
        improveTags: etiquetas.value,
        improveText: texto.value.trim() || undefined,
        collaboration: colaboracion.value,
        role: rol.value || undefined,
        email: email.value.trim() || undefined,
        name: nombre.value.trim() || undefined,
        page: window.location.pathname,
        consent: consentimiento.value,
        website: website.value,
      }),
    });

    const cuerpo = (await respuesta.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;

    if (!respuesta.ok || !cuerpo?.ok) {
      error.value = cuerpo?.error ?? 'No pudimos enviar tu respuesta. Inténtalo otra vez.';
      return;
    }

    enviado.value = true;
    await nextTick();
    panel.value?.querySelector<HTMLElement>('.fb-success .fb-next')?.focus();
  } catch {
    error.value = 'No hubo conexión con el servidor. Revisa tu red e inténtalo otra vez.';
  } finally {
    enviando.value = false;
  }
}

function atras() {
  error.value = '';
  if (paso.value > 1) paso.value -= 1;
}

onMounted(() => {
  document.addEventListener('click', alClicDocumento);
  document.addEventListener('keydown', alTeclaDocumento);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', alClicDocumento);
  document.removeEventListener('keydown', alTeclaDocumento);
  document.documentElement.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <div v-if="abierto" class="fb-overlay" @click.self="cerrar">
      <section
        ref="panel"
        class="fb-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fb-title"
      >
        <header class="fb-head">
          <div>
            <p class="fb-kicker">Comentarios</p>
            <h2 id="fb-title">{{ enviado ? 'Gracias por leer Porco.' : titulos[paso - 1] }}</h2>
          </div>
          <button type="button" class="fb-close" aria-label="Cerrar comentarios" @click="cerrar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <template v-if="!enviado">
          <div class="fb-progress">
            <span>Paso {{ paso }} de 4</span>
            <div class="fb-track" aria-hidden="true">
              <i :style="{ width: `${(paso / 4) * 100}%` }"></i>
            </div>
          </div>

          <form class="fb-form" novalidate @submit.prevent="avanzar">
            <div v-if="paso === 1" class="fb-step">
              <p class="fb-help">Una sola pregunta: elige del 1 al 5.</p>
              <div class="fb-rating" role="group" aria-label="Puntuación de 1 a 5">
                <button
                  v-for="valor in 5"
                  :key="valor"
                  type="button"
                  class="fb-score"
                  :class="{ 'fb-score--activo': rating === valor }"
                  :aria-label="`${valor} de 5`"
                  :aria-pressed="rating === valor"
                  @click="rating = valor"
                >
                  {{ valor }}
                </button>
              </div>
              <p class="fb-rating-label">{{ ratingTexto }}</p>
            </div>

            <div v-else-if="paso === 2" class="fb-step">
              <p class="fb-help">Marca todo lo que aplique. El detalle es opcional.</p>
              <div class="fb-chips">
                <button
                  v-for="etiqueta in etiquetasDisponibles"
                  :key="etiqueta.id"
                  type="button"
                  class="fb-chip"
                  :class="{ 'fb-chip--activo': etiquetas.includes(etiqueta.id) }"
                  :aria-pressed="etiquetas.includes(etiqueta.id)"
                  @click="alternarEtiqueta(etiqueta.id)"
                >
                  {{ etiqueta.texto }}
                </button>
              </div>
              <label class="fb-label" for="fb-mejora">¿Qué te gustaría ver distinto?</label>
              <textarea
                id="fb-mejora"
                v-model="texto"
                class="fb-input fb-textarea"
                maxlength="800"
                rows="4"
                placeholder="Un dato que falta, una tarjeta que no se entiende, una fuente que deberíamos citar…"
              ></textarea>
              <p class="fb-counter">{{ texto.length }}/800</p>
            </div>

            <div v-else-if="paso === 3" class="fb-step">
              <p class="fb-help">Si hay match, te escribimos. Sin spam y sin listas de correo.</p>
              <div class="fb-options" role="radiogroup" aria-label="Interés en colaborar">
                <label class="fb-radio">
                  <input v-model="colaboracion" type="radio" value="si" />
                  <span>Sí, quiero colaborar</span>
                </label>
                <label class="fb-radio">
                  <input v-model="colaboracion" type="radio" value="tal_vez" />
                  <span>Tal vez, cuéntame más</span>
                </label>
                <label class="fb-radio">
                  <input v-model="colaboracion" type="radio" value="no" />
                  <span>Solo quería dejar mi opinión</span>
                </label>
              </div>

              <template v-if="colaboracion !== 'no'">
                <label class="fb-label" for="fb-email">Correo</label>
                <input
                  id="fb-email"
                  v-model="email"
                  class="fb-input"
                  type="email"
                  autocomplete="email"
                  maxlength="160"
                  placeholder="tu@correo.com"
                />

                <label class="fb-label" for="fb-rol">¿Desde dónde nos lees?</label>
                <select id="fb-rol" v-model="rol" class="fb-input">
                  <option value="">Prefiero no decirlo</option>
                  <option v-for="opcion in roles" :key="opcion.id" :value="opcion.id">
                    {{ opcion.texto }}
                  </option>
                </select>
              </template>
            </div>

            <div v-else class="fb-step">
              <div class="fb-summary">
                <div>
                  <span>Puntuación</span>
                  <strong>{{ rating }}/5 · {{ ratingTexto }}</strong>
                </div>
                <div>
                  <span>Mejoras</span>
                  <strong>{{ resumenEtiquetas || 'Sin etiquetas' }}</strong>
                </div>
                <div v-if="texto.trim()">
                  <span>Detalle</span>
                  <strong>{{ texto.trim() }}</strong>
                </div>
                <div>
                  <span>Colaboración</span>
                  <strong>{{ resumenColaboracion }}</strong>
                </div>
                <div v-if="email.trim()">
                  <span>Contacto</span>
                  <strong>{{ email.trim() }}</strong>
                </div>
              </div>

              <label class="fb-label" for="fb-nombre">¿Cómo te llamas? (opcional)</label>
              <input
                id="fb-nombre"
                v-model="nombre"
                class="fb-input"
                type="text"
                autocomplete="name"
                maxlength="80"
                placeholder="Tu nombre"
              />

              <label class="fb-consent">
                <input v-model="consentimiento" type="checkbox" />
                <span>
                  Acepto que Porco guarde estas respuestas para mejorar el sitio. No se publican
                  ni se comparten.
                </span>
              </label>

              <div class="fb-honeypot" aria-hidden="true">
                <label for="fb-website">No rellenar</label>
                <input id="fb-website" v-model="website" type="text" tabindex="-1" autocomplete="off" />
              </div>
            </div>

            <p v-if="error" class="fb-error" role="alert">{{ error }}</p>

            <div class="fb-actions">
              <button v-if="paso > 1" type="button" class="fb-back" @click="atras">Atrás</button>
              <button type="submit" class="fb-next" :disabled="enviando">
                {{ paso === 4 ? (enviando ? 'Enviando…' : 'Enviar comentario') : 'Siguiente' }}
              </button>
            </div>
          </form>
        </template>

        <div v-else class="fb-success" role="status">
          <span class="fb-success__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m4.5 12.5 5 5 10-11" /></svg>
          </span>
          <p>Tu respuesta ya está guardada. Con esto podemos priorizar qué mejorar primero.</p>
          <p v-if="email.trim()" class="fb-success__note">
            Si dejaste correo, te escribimos cuando haya algo concreto que valga tu tiempo.
          </p>
          <div class="fb-success__links">
            <a href="/conectar">Conectar Porco a Claude</a>
            <a href="/llms.txt">Leer llms.txt</a>
          </div>
          <button type="button" class="fb-next" @click="cerrar">Volver a Porco</button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.fb-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(22, 21, 18, 0.58);
  backdrop-filter: blur(5px);
}

.fb-panel {
  width: min(580px, 100%);
  max-height: min(88vh, 780px);
  overflow-y: auto;
  padding: clamp(20px, 4vw, 32px);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.55);
}

.fb-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.fb-kicker {
  margin: 0 0 8px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--red-deep);
}

.fb-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 4vw, 2.15rem);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.04em;
}

.fb-close {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg);
  color: var(--ink);
  cursor: pointer;
}

.fb-close svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.fb-close:hover {
  background: var(--ink);
  color: var(--card);
}

.fb-progress {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 22px 0 8px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--muted);
}

.fb-track {
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: var(--bg-soft);
  overflow: hidden;
}

.fb-track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--red);
  transition: width 0.25s ease;
}

.fb-form {
  margin-top: 18px;
}

.fb-step {
  display: grid;
  gap: 14px;
}

.fb-help {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--muted);
}

.fb-rating {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.fb-score {
  padding: 16px 8px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.fb-score:hover {
  border-color: var(--red);
}

.fb-score--activo {
  border-color: var(--red);
  background: var(--red);
  color: #fff;
}

.fb-rating-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--red-deep);
}

.fb-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.fb-chip {
  padding: 9px 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.fb-chip:hover {
  border-color: var(--red);
}

.fb-chip--activo {
  border-color: var(--red);
  background: var(--red);
  color: #fff;
}

.fb-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ink);
}

.fb-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fffdf9;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.4;
}

.fb-input:focus-visible {
  outline: 3px solid var(--red);
  outline-offset: 2px;
}

.fb-textarea {
  min-height: 112px;
  resize: vertical;
}

.fb-counter {
  margin: -6px 0 0;
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--muted);
}

.fb-options {
  display: grid;
  gap: 8px;
}

.fb-radio {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.fb-radio:has(input:checked) {
  border-color: var(--red);
  background: var(--accent-wash, rgba(217, 58, 43, 0.1));
}

.fb-radio input,
.fb-consent input {
  width: 18px;
  height: 18px;
  accent-color: var(--red);
  flex: none;
}

.fb-summary {
  display: grid;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--bg);
}

.fb-summary div {
  display: grid;
  gap: 2px;
}

.fb-summary span {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.fb-summary strong {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.fb-consent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--muted);
  cursor: pointer;
}

.fb-consent input {
  margin-top: 2px;
}

.fb-honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.fb-error {
  margin: 14px 0 0;
  padding: 10px 12px;
  border: 1px solid rgba(163, 35, 24, 0.35);
  border-radius: 10px;
  background: rgba(217, 58, 43, 0.08);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--red-deep);
}

.fb-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.fb-next,
.fb-back {
  padding: 12px 18px;
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
}

.fb-next {
  margin-left: auto;
  border: 1px solid var(--red);
  background: var(--red);
  color: #fff;
}

.fb-next:hover {
  background: var(--red-deep);
  border-color: var(--red-deep);
}

.fb-next:disabled {
  opacity: 0.6;
  cursor: wait;
}

.fb-back {
  border: 1px solid var(--line);
  background: transparent;
  color: var(--ink);
}

.fb-back:hover {
  background: var(--bg-soft);
}

.fb-success {
  display: grid;
  gap: 14px;
  margin-top: 24px;
}

.fb-success__mark {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--green);
  color: #fff;
}

.fb-success__mark svg {
  width: 26px;
  height: 26px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.fb-success p {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.55;
}

.fb-success__note {
  color: var(--muted);
}

.fb-success__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.fb-success__links a {
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  text-decoration: none;
}

.fb-success__links a:hover {
  background: var(--ink);
  color: var(--card);
}

.fb-success .fb-next {
  justify-self: start;
  margin-left: 0;
}

@media (max-width: 520px) {
  .fb-overlay {
    padding: 10px;
    align-items: end;
  }

  .fb-panel {
    max-height: 92vh;
    border-radius: 22px;
  }

  .fb-score {
    padding: 13px 6px;
    font-size: 1.3rem;
  }
}
</style>
