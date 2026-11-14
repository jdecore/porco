<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';

const props = defineProps<{
  pais: string;
  lang?: 'es' | 'en';
}>();

const ChartComponent = shallowRef<any>(null);

onMounted(async () => {
  const mod = await import('vue-data-ui');
  ChartComponent.value = mod.VueUiHorizontalBar;
});

const countryMetrics: Record<
  string,
  {
    titleEs: string;
    titleEn: string;
    series: { nameEs: string; nameEn: string; value: number; color: string }[];
  }
> = {
  col: {
    titleEs: 'Colombia · Distribución de predios porcinos (%)',
    titleEn: 'Colombia · Swine farm distribution (%)',
    series: [
      { nameEs: 'Traspatio (zona ciega)', nameEn: 'Backyard (blind spot)', value: 78.4, color: '#B8E3A0' },
      { nameEs: 'Tecnificado / comercial', nameEn: 'Commercial / tecnified', value: 21.6, color: '#FBF9F4' },
    ],
  },
  ecu: {
    titleEs: 'Ecuador · Cobertura de vigilancia sanitaria (%)',
    titleEn: 'Ecuador · Sanitary surveillance coverage (%)',
    series: [
      { nameEs: 'Traspatio / sin registro', nameEn: 'Backyard / unrecorded', value: 68.0, color: '#B8E3A0' },
      { nameEs: 'Granjas registradas', nameEn: 'Registered farms', value: 32.0, color: '#FBF9F4' },
    ],
  },
  per: {
    titleEs: 'Perú · Regiones internas vs. brecha rural (%)',
    titleEn: 'Peru · Internal regions vs. rural gap (%)',
    series: [
      { nameEs: 'Traspatio / sin inspección', nameEn: 'Backyard / uninspected', value: 72.0, color: '#B8E3A0' },
      { nameEs: 'Control oficial (SENASA)', nameEn: 'Official control (SENASA)', value: 28.0, color: '#FBF9F4' },
    ],
  },
};

const active = computed(() => countryMetrics[props.pais] || countryMetrics.col);

const dataset = computed(() =>
  active.value.series.map((s) => ({
    name: props.lang === 'en' ? s.nameEn : s.nameEs,
    value: s.value,
    color: s.color,
  })),
);

const config = computed(() => ({
  style: {
    chart: {
      backgroundColor: '#B8401F',
      color: '#FBF9F4',
      layout: {
        bars: {
          rowColor: '#9A3219',
          borderRadius: 8,
          dataLabels: {
            color: '#FBF9F4',
            percentage: { show: true },
            value: { show: false },
          },
          nameLabels: {
            color: '#FBF9F4',
          },
        },
      },
      title: {
        text: props.lang === 'en' ? active.value.titleEn : active.value.titleEs,
        color: '#FBF9F4',
        fontSize: 15,
      },
    },
  },
  userOptions: { show: false },
}));
</script>

<template>
  <div class="country-chart-card">
    <component :is="ChartComponent" v-if="ChartComponent" :dataset="dataset" :config="config" />
  </div>
</template>

<style scoped>
.country-chart-card {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  background: #b8401f;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 18px;
  overflow: hidden;
}

@media (max-width: 640px) {
  .country-chart-card {
    padding: 12px;
    border-radius: 16px;
  }
}
</style>
