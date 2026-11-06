<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';

const props = defineProps<{
  prevalencia: number;
  resto: number;
  microcopy: string;
}>();

const montado = ref(false);
onMounted(() => {
  montado.value = true;
});

const VueUiDonut = defineAsyncComponent(
  () => import('vue-data-ui').then((modulo) => modulo.VueUiDonut),
);

const dataset = computed(() => [
  {
    name: 'Cisticercosis',
    values: [props.prevalencia],
    color: '#D93A2B',
    comment: 'Prevalencia en cerdos',
  },
  {
    name: 'Resto',
    values: [props.resto],
    color: '#E7E0D4',
    comment: 'Sin exposición reportada',
  },
]);

const config = {
  responsive: true,
  useCssAnimation: false,
  startAnimation: { show: false },
  style: {
    fontFamily: "'Inter', system-ui, sans-serif",
    chart: {
      backgroundColor: 'transparent',
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      layout: {
        labels: {
          dataLabels: { show: false },
          percentage: { show: false },
          name: { show: false },
          value: { show: false },
          hollow: {
            show: false,
            total: { show: false },
            average: { show: false },
          },
        },
        donut: {
          radiusRatio: 0.97,
          borderWidth: 0,
          strokeWidth: 0,
          useShadow: false,
        },
      },
      legend: { show: false },
      tooltip: { show: false },
    },
  },
  userOptions: { show: false },
  table: { show: false },
} as const;
</script>

<template>
  <article class="card card--amenaza">
    <header class="card__head">
      <span class="card__index">02</span>
      <span class="card__tag">La amenaza</span>
    </header>

    <h2 class="card__title">El ciclo oculto: Cerdos y humanos.</h2>

    <div class="amenaza__body">
      <div class="donut-wrap" aria-label="Prevalencia de cisticercosis en cerdos: 9.7 por ciento">
        <VueUiDonut v-if="montado" :dataset="dataset" :config="config" />
        <div v-else class="chart-skeleton chart-skeleton--round" aria-hidden="true"></div>
        <div class="donut-center">
          <strong class="giant">9.7%</strong>
          <span>en cerdos</span>
        </div>
      </div>

      <div class="amenaza__side">
        <div class="metric">
          <span class="metric__value">14%</span>
          <span class="metric__label">cerdos · Tolima</span>
        </div>
        <div class="metric">
          <span class="metric__value">8.5%</span>
          <span class="metric__label">humanos · Tolima</span>
        </div>
        <div class="metric metric--alert">
          <span class="metric__value">100%</span>
          <span class="metric__label">mortalidad PPA</span>
        </div>
      </div>
    </div>

    <p class="card__copy">{{ microcopy }}</p>
  </article>
</template>
