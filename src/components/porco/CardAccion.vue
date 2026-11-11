<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  siteUrl: string;
  promptPlantilla: string;
}>();

const emit = defineEmits<{
  (e: 'abrir-cita', id: number): void;
}>();

function notificarCita(id: number) {
  emit('abrir-cita', id);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('porco:abrir-cita', { detail: { id } }));
  }
}

const copiado = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

const prompt = computed(() =>
  props.promptPlantilla.replace('{SITE_URL}', props.siteUrl.replace(/\/$/, '')),
);

async function copiarPrompt() {
  const texto = prompt.value;

  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
  }

  copiado.value = true;
  if (resetTimer) clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    copiado.value = false;
  }, 2200);
}
</script>

<template>
  <article class="card card--accion">
    <header class="card__head">
      <span class="card__index">03</span>
      <span class="card__tag">La acción</span>
    </header>

    <h2 class="card__title">Interroga a los datos.</h2>

    <div class="chat" role="group" aria-label="Ejemplo de conversación con un agente">
      <div class="chat__bar">
        <span class="chat__dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="chat__title">porco.agent</span>
        <span class="chat__status">en línea</span>
      </div>

      <div class="chat__body">
        <div class="bubble bubble--user">
          <span class="bubble__meta">Tú</span>
          <p>¿Cómo se conecta la falta de saneamiento en Colombia con la cisticercosis y la epilepsia?</p>
        </div>

        <div class="bubble bubble--agent">
          <span class="bubble__meta">Porco</span>
          <p>
            Poor sanitation can sustain the <em>Taenia solium</em> cycle. Humans with taeniasis shed eggs in feces; pigs ingest those eggs and develop porcine cysticercosis. Humans can develop cysticercosis after accidentally ingesting <em>T. solium</em> eggs, and neurocysticercosis can cause epilepsy. Eating undercooked pork can cause taeniasis, but it does not directly cause cysticercosis.
            <button
              type="button"
              class="cite-tag cite-tag--inline"
              aria-label="Ver citas IEEE [3], [5]"
              @click="notificarCita(5)"
            >
              [5]
            </button>
          </p>
          <p>Sin datos integrados, la alerta llega cuando el brote ya ocurrió.</p>
        </div>
      </div>

      <div class="chat__composer">
        <span class="chat__prompt">{{ prompt }}</span>
        <button type="button" class="copy-btn" :class="{ 'copy-btn--done': copiado }" @click="copiarPrompt">
          <svg v-if="!copiado" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2.5" />
            <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6.5A2.5 2.5 0 0 0 4 5.5v6A2.5 2.5 0 0 0 6.5 14" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="m4.5 12.5 5 5 10-11" />
          </svg>
          {{ copiado ? 'Copiado' : 'Copiar Prompt' }}
        </button>
      </div>
    </div>

    <p class="card__copy">Un prompt basta para conectar saneamiento, cerdos y salud humana.</p>
  </article>
</template>
