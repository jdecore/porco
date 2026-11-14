<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';

const props = defineProps<{
  lang?: 'es' | 'en';
}>();

const paisA = ref<'col' | 'ecu' | 'per'>('col');
const paisB = ref<'col' | 'ecu' | 'per'>('ecu');
const ChartComponent = shallowRef<any>(null);

onMounted(async () => {
  const mod = await import('vue-data-ui');
  ChartComponent.value = mod.VueUiHorizontalBar;
});

const countries = {
  col: {
    name: 'Colombia',
    traspatio: 78.4,
    adoptEs: 'AnalítICA 2026: tablero abierto de 241 episodios sanitarios georreferenciados.',
    adoptEn: 'AnalítICA 2026: open dashboard of 241 georeferenced sanitary episodes.',
  },
  ecu: {
    name: 'Ecuador',
    traspatio: 68.0,
    adoptEs: 'Programa PROZEC de erradicación de PPC con trazabilidad por zonas.',
    adoptEn: 'PROZEC CSF eradication program with zone-based traceability.',
  },
  per: {
    name: 'Perú',
    traspatio: 72.0,
    adoptEs: '13 regiones internas declaradas libres de PPC por SENASA con control regional.',
    adoptEn: '13 internal regions declared CSF-free by SENASA with regional control.',
  },
};

const dataset = computed(() => [
  {
    name: `${countries[paisA.value].name} (${props.lang === 'en' ? 'Backyard %' : 'Traspatio %'})`,
    value: countries[paisA.value].traspatio,
    color: '#B8E3A0',
  },
  {
    name: `${countries[paisB.value].name} (${props.lang === 'en' ? 'Backyard %' : 'Traspatio %'})`,
    value: countries[paisB.value].traspatio,
    color: '#FBF9F4',
  },
]);

const config = computed(() => ({
  style: {
    chart: {
      backgroundColor: '#B8401F',
      color: '#FBF9F4',
      layout: {
        bars: {
          rowColor: '#9A3219',
          borderRadius: 8,
          dataLabels: { color: '#FBF9F4', percentage: { show: true }, value: { show: false } },
          nameLabels: { color: '#FBF9F4' },
        },
      },
      title: {
        text: props.lang === 'en' ? 'Country Versus · Backyard gap (%)' : 'Versus de países · Brecha traspatio (%)',
        color: '#FBF9F4',
        fontSize: 15,
      },
    },
  },
  userOptions: { show: false },
}));
</script>

<template>
  <section class="versus-card" aria-label="Comparador de países">
    <div class="versus-controls">
      <label class="versus-select-wrap">
        <span>{{ lang === 'en' ? 'Country A' : 'País A' }}</span>
        <select v-model="paisA" class="versus-select">
          <option value="col">Colombia</option>
          <option value="ecu">Ecuador</option>
          <option value="per">Perú</option>
        </select>
      </label>
      <span class="versus-vs">VS</span>
      <label class="versus-select-wrap">
        <span>{{ lang === 'en' ? 'Country B' : 'País B' }}</span>
        <select v-model="paisB" class="versus-select">
          <option value="col">Colombia</option>
          <option value="ecu">Ecuador</option>
          <option value="per">Perú</option>
        </select>
      </label>
    </div>

    <component :is="ChartComponent" v-if="ChartComponent" :dataset="dataset" :config="config" />

    <div class="ecosistema-grid">
      <div class="ecosistema-item">
        <strong>{{ lang === 'en' ? `Adopt from ${countries[paisA].name}` : `Adoptar de ${countries[paisA].name}` }}</strong>
        <p>{{ lang === 'en' ? countries[paisA].adoptEn : countries[paisA].adoptEs }}</p>
      </div>
      <div class="ecosistema-item">
        <strong>{{ lang === 'en' ? `Adopt from ${countries[paisB].name}` : `Adoptar de ${countries[paisB].name}` }}</strong>
        <p>{{ lang === 'en' ? countries[paisB].adoptEn : countries[paisB].adoptEs }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.versus-card {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  background: #b8401f;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 18px;
  color: #fbf9f4;
}

.versus-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.versus-select-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  flex: 1;
  min-width: 120px;
}

.versus-select {
  background: #9a3219;
  color: #fbf9f4;
  border: 1px solid rgba(251, 249, 244, 0.25);
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 14px;
}

.versus-vs {
  font-weight: 700;
  font-size: 13px;
  color: #b8e3a0;
  padding-top: 16px;
}

.ecosistema-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.ecosistema-item {
  background: #9a3219;
  border-radius: 12px;
  padding: 12px;
}

.ecosistema-item strong {
  display: block;
  font-size: 13px;
  color: #b8e3a0;
  margin-bottom: 4px;
}

.ecosistema-item p {
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .versus-card {
    padding: 12px;
    border-radius: 16px;
  }

  .ecosistema-grid {
    grid-template-columns: 1fr;
  }
}
</style>
