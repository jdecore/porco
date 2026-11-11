<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { CITAS_IEEE, type CitaIEEE } from '../../data/porco/citas';

const props = defineProps<{
  citaIdActiva?: number | null;
}>();

const emit = defineEmits<{
  (e: 'cerrar'): void;
  (e: 'seleccionar', id: number): void;
}>();

const citaSeleccionada = computed<CitaIEEE | undefined>(() => {
  if (!props.citaIdActiva) return undefined;
  return CITAS_IEEE.find((c) => c.id === props.citaIdActiva);
});

const copiado = ref(false);

function cerrarModal() {
  emit('cerrar');
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.citaIdActiva) {
    cerrarModal();
  }
}

async function copiarCita() {
  if (!citaSeleccionada.value) return;
  const c = citaSeleccionada.value;
  const texto = `[${c.id}] ${c.autores}, "${c.titulo}," ${c.publicacion}${c.detalle ? `, ${c.detalle}` : ''}, ${c.anio}. Disponible: ${c.url}`;
  try {
    await navigator.clipboard.writeText(texto);
    copiado.value = true;
    setTimeout(() => {
      copiado.value = false;
    }, 2000);
  } catch {
    // fallback
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div
    v-if="citaSeleccionada"
    class="cite-modal"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="'cite-title-' + citaSeleccionada.id"
    @click.self="cerrarModal"
  >
    <div class="cite-modal__panel">
      <header class="cite-modal__head">
        <div class="cite-modal__tag">
          <span class="cite-modal__num">[{{ citaSeleccionada.id }}]</span>
          <span class="cite-modal__badge">Referencia IEEE</span>
        </div>
        <button
          type="button"
          class="cite-modal__close"
          aria-label="Cerrar modal de cita"
          @click="cerrarModal"
        >
          ✕
        </button>
      </header>

      <div class="cite-modal__body">
        <h3 :id="'cite-title-' + citaSeleccionada.id" class="cite-modal__title">
          {{ citaSeleccionada.titulo }}
        </h3>

        <p class="cite-modal__authors">
          <strong>Autores:</strong> {{ citaSeleccionada.autores }}
        </p>

        <p class="cite-modal__source">
          <strong>Publicación:</strong> <em>{{ citaSeleccionada.publicacion }}</em>
          <span v-if="citaSeleccionada.detalle"> · {{ citaSeleccionada.detalle }}</span>
          ({{ citaSeleccionada.anio }})
        </p>

        <p v-if="citaSeleccionada.nota" class="cite-modal__note">
          <strong>Contexto en Porco:</strong> {{ citaSeleccionada.nota }}
        </p>
      </div>

      <footer class="cite-modal__foot">
        <a
          :href="citaSeleccionada.url"
          target="_blank"
          rel="noopener noreferrer"
          class="cite-modal__btn cite-modal__btn--primary"
        >
          Abrir fuente original ↗
        </a>
        <button
          type="button"
          class="cite-modal__btn cite-modal__btn--secondary"
          @click="copiarCita"
        >
          {{ copiado ? 'Copiado' : 'Copiar formato IEEE' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.cite-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(22, 21, 18, 0.65);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.cite-modal__panel {
  position: relative;
  width: min(540px, 100%);
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--card);
  box-shadow: 0 20px 48px -12px rgba(22, 21, 18, 0.28);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cite-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cite-modal__tag {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cite-modal__num {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--red);
}

.cite-modal__badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
  background: var(--bg);
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--line);
}

.cite-modal__close {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--ink);
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.15s, color 0.15s;
}

.cite-modal__close:hover {
  background: var(--ink);
  color: #fff;
}

.cite-modal__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cite-modal__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--ink);
}

.cite-modal__authors,
.cite-modal__source {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--ink);
}

.cite-modal__note {
  margin: 4px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--bg);
  border-left: 3px solid var(--red);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--ink);
}

.cite-modal__note strong,
.cite-modal__authors strong,
.cite-modal__source strong {
  font-weight: 600;
}

.cite-modal__foot {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}

.cite-modal__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 14px;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.cite-modal__btn--primary {
  background: var(--red);
  color: #ffffff;
  border: 1px solid transparent;
}

.cite-modal__btn--primary:hover {
  background: var(--red-deep);
}

.cite-modal__btn--secondary {
  background: var(--bg);
  color: var(--ink);
  border: 1px solid var(--line);
}

.cite-modal__btn--secondary:hover {
  background: var(--ink);
  color: #ffffff;
}
</style>
