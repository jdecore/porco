<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';

type InventarioItem = {
  region: string;
  codigo: string;
  cabezas: number;
  millones: number;
  periodo: string;
  fuente: string;
  color: string;
};

const props = defineProps<{
  inventario: InventarioItem[];
  territorios: number;
  desconocidos: number;
  microcopy: string;
}>();

const montado = ref(false);
onMounted(() => {
  montado.value = true;
});

const VueUiVerticalBar = defineAsyncComponent(
  () => import('vue-data-ui').then((modulo) => modulo.VueUiVerticalBar),
);

const dataset = computed(() =>
  props.inventario.map((item) => ({
    name: item.region,
    value: item.millones,
    color: item.color,
  })),
);

const config = {
  responsive: true,
  useCssAnimation: false,
  customPalette: props.inventario.map((item) => item.color),
  style: {
    fontFamily: "'Inter', system-ui, sans-serif",
    chart: {
      backgroundColor: 'transparent',
      color: '#161512',
      padding: { top: 18, right: 6, bottom: 4, left: 6 },
      layout: {
        bars: {
          rowColor: '#EEE8DE',
          borderRadius: 8,
          gap: 24,
          useGradient: false,
          fillOpacity: 1,
          dataLabels: {
            color: '#161512',
            bold: true,
            fontSize: 16,
            value: { show: true, roundingValue: 1, suffix: ' M' },
            percentage: { show: false },
          },
          nameLabels: {
            show: false,
            color: '#726B5F',
            fontSize: 12,
            bold: false,
          },
        },
        separators: { show: false },
      },
      legend: { show: false },
      tooltip: { show: false },
    },
  },
  userOptions: { show: false },
  table: { show: false },
} as const;

const formatoCabezas = (valor: number) =>
  new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(valor);
</script>

<template>
  <article class="card card--problema">
    <header class="card__head">
      <span class="card__index">01</span>
      <span class="card__tag">El problema</span>
    </header>

    <h2 class="card__title">Producimos más. Sabemos menos.</h2>

    <div class="card__data">
      <strong class="giant">{{ desconocidos }} de {{ territorios }}</strong>
      <span class="data-unit">territorios sin datos de PPA</span>
    </div>

    <div class="chart-wrap chart-wrap--bars" aria-label="Inventario porcino comparado en millones de cabezas">
      <VueUiVerticalBar v-if="montado" :dataset="dataset" :config="config" />
      <div v-else class="chart-skeleton" aria-hidden="true"></div>
    </div>

    <ul class="mini-legend">
      <li v-for="item in inventario" :key="item.codigo">
        <span class="mini-legend__dot" :style="{ background: item.color }"></span>
        <span class="mini-legend__name">{{ item.region }}</span>
        <span class="mini-legend__value">{{ formatoCabezas(item.cabezas) }}</span>
      </li>
    </ul>

    <p class="card__copy">{{ microcopy }}</p>
  </article>
</template>
