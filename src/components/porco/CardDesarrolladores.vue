<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  comando: string;
  base: string;
}>();

const conBase = (ruta: string) => `${props.base.replace(/\/$/, '')}/${ruta.replace(/^\//, '')}`;

const copiado = ref(false);

async function copiarComando(comando: string) {
  try {
    await navigator.clipboard.writeText(comando);
    copiado.value = true;
    setTimeout(() => {
      copiado.value = false;
    }, 1800);
  } catch {
    copiado.value = false;
  }
}
</script>

<template>
  <article class="card card--devs">
    <header class="card__head card__head--dark">
      <span class="card__index">04</span>
      <span class="card__tag">Desarrolladores</span>
    </header>

    <h2 class="card__title card__title--light">Conecta tu Agente.</h2>

    <div class="terminal">
      <div class="terminal__bar">
        <span class="chat__dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="terminal__file">~/porco</span>
      </div>
      <div class="terminal__body">
        <code><span class="terminal__prompt">$</span> {{ comando }}</code>
        <button type="button" class="terminal__copy" :aria-label="copiado ? 'Comando copiado' : 'Copiar comando'" @click="copiarComando(comando)">
          <span v-if="!copiado">copiar</span>
          <span v-else>ok</span>
        </button>
      </div>
    </div>

    <div class="devs__links">
      <span class="devs__pill"><i></i> MCP endpoint</span>
      <a class="devs__link" :href="conBase('api/mcp')">/api/mcp →</a>
      <a class="devs__link" :href="conBase('llms.txt')">/llms.txt →</a>
    </div>

    <ul class="devs__tools" aria-label="Herramientas MCP disponibles">
      <li><code>get_cisticercosis</code><span>One Health</span></li>
      <li><code>get_estado_ppa</code><span>Riesgo</span></li>
      <li><code>get_inventario_porcino</code><span>Datos</span></li>
    </ul>

    <p class="card__copy card__copy--light">Tus agentes leen los mismos datos que ves aquí, sin scraping.</p>
  </article>
</template>
