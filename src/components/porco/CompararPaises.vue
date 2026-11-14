<script setup lang="ts">
import { computed, ref } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent]);

type CountryCode = 'col' | 'ecu' | 'per' | 'ven';

const paisA = ref<CountryCode>('col');
const paisB = ref<CountryCode>('ven');

const countries: Record<
  CountryCode,
  {
    code: CountryCode;
    name: string;
    hatoM: number;
    hatoLabel: string;
    traspatio: number;
    ppa: string;
    ppc: string;
    cisticercosis: string;
    adoptar: string;
    citas: number[];
  }
> = {
  col: {
    code: 'col',
    name: 'Colombia',
    hatoM: 10.67,
    hatoLabel: '10.67M (2024)',
    traspatio: 78.4,
    ppa: 'Libre · riesgo por ingreso informal',
    ppc: '3 zonas libres OMSA · control fronterizo',
    cisticercosis: '9.7% Tuchín · 14% Coyaima · 0% granjas',
    adoptar: 'AnalítICA 2026: tablero abierto de 241 episodios sanitarios georreferenciados.',
    citas: [1, 3, 4, 10],
  },
  ecu: {
    code: 'ecu',
    name: 'Ecuador',
    hatoM: 1.7,
    hatoLabel: '0.90M–2.49M (ESPAC)',
    traspatio: 68.0,
    ppa: 'Libre · vigilancia Agrocalidad',
    ppc: 'En erradicación (PROZEC · 1.34M vac.)',
    cisticercosis: '3.9%–5.5% camales Loja/El Oro',
    adoptar: 'Programa PROZEC de vacunación PPC con trazabilidad por zonas.',
    citas: [11, 12, 13],
  },
  per: {
    code: 'per',
    name: 'Perú',
    hatoM: 3.7,
    hatoLabel: '3.70M (MIDAGRI 2025)',
    traspatio: 72.0,
    ppa: 'Libre · control puertos/fronteras',
    ppc: '13 reg. internas libres · endémico OMSA',
    cisticercosis: '45.0% EITB Tumbes · 0% tamizaje oficial',
    adoptar: '13 regiones internas declaradas libres de PPC por SENASA.',
    citas: [14, 15, 16],
  },
  ven: {
    code: 'ven',
    name: 'Venezuela',
    hatoM: 2.31,
    hatoLabel: '2.31M (FAOSTAT 2024)',
    traspatio: 24.0,
    ppa: 'Libre · alerta Caribe Mem. 031 (INSAI)',
    ppc: 'Endémico (SIGMAV) · retraso WAHIS',
    cisticercosis: '19.2% Ag-ELISA HP10 Yaracuy · 0 boletines',
    adoptar: '76% agremiado en PROCERDO y alerta fronteriza PPA (Mem. 031).',
    citas: [17, 18, 19, 20, 21],
  },
};

const borderCorridors = [
  {
    pair: 'col-ven',
    titulo: 'Colombia ↔ Venezuela',
    zona: 'Norte de Santander / Arauca · Zulia / Táchira',
    riesgo: 'Movimiento informal de cerdos vivos y brecha de notificación semestral WAHIS/INSAI frente al control fronterizo ICA.',
    citas: [1, 19, 20],
  },
  {
    pair: 'col-ecu',
    titulo: 'Colombia ↔ Ecuador',
    zona: 'Nariño / Putumayo · Carchi / Sucumbíos',
    riesgo: 'Ambos países ejecutan vacunación PPC (ICA / PROZEC), pero persiste traspatio rural sin vigilancia activa de cisticercosis.',
    citas: [10, 11, 12],
  },
  {
    pair: 'ecu-per',
    titulo: 'Ecuador ↔ Perú',
    zona: 'El Oro / Loja · Tumbes / Piura',
    riesgo: 'Corredor endémico de Taenia solium: 3.9%–5.5% en camales del sur de Ecuador frente a 45.0% EITB en comunidades de Tumbes.',
    citas: [13, 15, 16],
  },
];

const orderedCodes: CountryCode[] = ['col', 'per', 'ven', 'ecu'];

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: '#161512',
    borderColor: 'rgba(251, 249, 244, 0.25)',
    textStyle: { color: '#FBF9F4', fontFamily: 'Inter, sans-serif', fontSize: 13 },
  },
  legend: {
    top: 4,
    textStyle: { color: '#FBF9F4', fontFamily: 'Inter, sans-serif', fontSize: 13 },
  },
  grid: {
    left: 48,
    right: 52,
    top: 48,
    bottom: 34,
  },
  xAxis: {
    type: 'category',
    data: orderedCodes.map((c) => countries[c].name),
    axisLine: { lineStyle: { color: 'rgba(251,249,244,0.35)' } },
    axisLabel: { color: '#FBF9F4', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600 },
  },
  yAxis: [
    {
      type: 'value',
      name: 'Traspatio (%)',
      max: 100,
      nameTextStyle: { color: '#B8E3A0', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' },
      axisLabel: { color: '#B8E3A0', formatter: '{value}%', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(251,249,244,0.12)' } },
    },
    {
      type: 'value',
      name: 'Hato (M)',
      max: 12,
      nameTextStyle: { color: '#FBF9F4', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' },
      axisLabel: { color: '#FBF9F4', formatter: '{value}M', fontSize: 12 },
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: 'Traspatio / sin registro (%)',
      type: 'bar',
      yAxisIndex: 0,
      barMaxWidth: 36,
      itemStyle: { color: '#B8E3A0', borderRadius: [8, 8, 0, 0] },
      data: orderedCodes.map((c) => countries[c].traspatio),
    },
    {
      name: 'Hato porcino (M cabezas)',
      type: 'bar',
      yAxisIndex: 1,
      barMaxWidth: 36,
      itemStyle: { color: '#FBF9F4', borderRadius: [8, 8, 0, 0] },
      data: orderedCodes.map((c) => countries[c].hatoM),
    },
  ],
}));

const a = computed(() => countries[paisA.value]);
const b = computed(() => countries[paisB.value]);

const activeCorridor = computed(() => {
  const key = [paisA.value, paisB.value].sort().join('-');
  return borderCorridors.find((c) => c.pair === key) || null;
});

function abrirCita(id: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('porco:abrir-cita', { detail: { id } }));
  }
}
</script>

<template>
  <div class="comparar-wrap">
    <!-- Bloque 1: Gráfica ECharts multi-país -->
    <section class="cmp-panel cmp-panel--chart" aria-label="Comparativa regional de hato porcino y traspatio">
      <header class="cmp-head">
        <div>
          <span class="cmp-kicker">PANORAMA REGIONAL · VUE-ECHARTS</span>
          <h2 class="cmp-title">Hato porcino vs. brecha de traspatio en 4 países</h2>
        </div>
        <div class="cmp-citas">
          <span class="cmp-citas__lbl">Citas:</span>
          <button
            v-for="cid in [10, 11, 14, 17, 18]"
            :key="cid"
            type="button"
            class="cmp-cite-chip"
            @click="abrirCita(cid)"
          >[{{ cid }}]</button>
        </div>
      </header>

      <div class="echart-box">
        <VChart class="echart-canvas" :option="chartOption" autoresize />
      </div>
    </section>

    <!-- Bloque 2: Cara a cara País A vs País B -->
    <section class="cmp-panel" aria-label="Comparador cara a cara entre dos países">
      <header class="cmp-head">
        <div>
          <span class="cmp-kicker">COMPARADOR DIRECTO</span>
          <h2 class="cmp-title">País A vs. País B y frontera compartida</h2>
        </div>

        <div class="versus-controls">
          <label class="versus-select-wrap">
            <span>País A</span>
            <select v-model="paisA" class="versus-select">
              <option value="col">Colombia</option>
              <option value="ecu">Ecuador</option>
              <option value="per">Perú</option>
              <option value="ven">Venezuela</option>
            </select>
          </label>
          <span class="versus-vs">VS</span>
          <label class="versus-select-wrap">
            <span>País B</span>
            <select v-model="paisB" class="versus-select">
              <option value="col">Colombia</option>
              <option value="ecu">Ecuador</option>
              <option value="per">Perú</option>
              <option value="ven">Venezuela</option>
            </select>
          </label>
        </div>
      </header>

      <div class="duel-grid">
        <article class="duel-card">
          <h3>{{ a.name }}</h3>
          <dl>
            <div><dt>Hato</dt><dd>{{ a.hatoLabel }}</dd></div>
            <div><dt>Traspatio</dt><dd>{{ a.traspatio.toFixed(1) }}%</dd></div>
            <div><dt>PPA</dt><dd>{{ a.ppa }}</dd></div>
            <div><dt>PPC</dt><dd>{{ a.ppc }}</dd></div>
            <div><dt>Cisticercosis</dt><dd>{{ a.cisticercosis }}</dd></div>
          </dl>
          <p class="duel-adopt"><strong>Qué adoptar:</strong> {{ a.adoptar }}</p>
          <div class="cmp-citas">
            <span class="cmp-citas__lbl">Citas:</span>
            <button v-for="cid in a.citas" :key="cid" type="button" class="cmp-cite-chip" @click="abrirCita(cid)">[{{ cid }}]</button>
          </div>
        </article>

        <article class="duel-card">
          <h3>{{ b.name }}</h3>
          <dl>
            <div><dt>Hato</dt><dd>{{ b.hatoLabel }}</dd></div>
            <div><dt>Traspatio</dt><dd>{{ b.traspatio.toFixed(1) }}%</dd></div>
            <div><dt>PPA</dt><dd>{{ b.ppa }}</dd></div>
            <div><dt>PPC</dt><dd>{{ b.ppc }}</dd></div>
            <div><dt>Cisticercosis</dt><dd>{{ b.cisticercosis }}</dd></div>
          </dl>
          <p class="duel-adopt"><strong>Qué adoptar:</strong> {{ b.adoptar }}</p>
          <div class="cmp-citas">
            <span class="cmp-citas__lbl">Citas:</span>
            <button v-for="cid in b.citas" :key="cid" type="button" class="cmp-cite-chip" @click="abrirCita(cid)">[{{ cid }}]</button>
          </div>
        </article>
      </div>

      <div v-if="activeCorridor" class="border-banner">
        <div class="border-banner__head">
          <strong>Frontera compartida: {{ activeCorridor.titulo }}</strong>
          <span>{{ activeCorridor.zona }}</span>
        </div>
        <p>{{ activeCorridor.riesgo }}</p>
        <div class="cmp-citas">
          <span class="cmp-citas__lbl">Citas de frontera:</span>
          <button v-for="cid in activeCorridor.citas" :key="cid" type="button" class="cmp-cite-chip" @click="abrirCita(cid)">[{{ cid }}]</button>
        </div>
      </div>
    </section>

    <!-- Bloque 3: Los 3 corredores fronterizos -->
    <section class="cmp-panel" aria-label="Corredores fronterizos sanitarios">
      <header class="cmp-head">
        <div>
          <span class="cmp-kicker">CORREDORES FRONTERIZOS</span>
          <h2 class="cmp-title">Puntos críticos en fronteras terrestres</h2>
        </div>
      </header>

      <div class="corridors-grid">
        <article v-for="cor in borderCorridors" :key="cor.pair" class="corridor-card">
          <h3>{{ cor.titulo }}</h3>
          <span class="corridor-zone">{{ cor.zona }}</span>
          <p>{{ cor.riesgo }}</p>
          <div class="cmp-citas">
            <span class="cmp-citas__lbl">Citas:</span>
            <button v-for="cid in cor.citas" :key="cid" type="button" class="cmp-cite-chip" @click="abrirCita(cid)">[{{ cid }}]</button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.comparar-wrap {
  display: grid;
  gap: 20px;
  padding: 20px 0 36px;
}

.cmp-panel {
  background: #b8401f;
  border: 1px solid rgba(251, 249, 244, 0.18);
  border-radius: 28px;
  padding: clamp(18px, 3vw, 28px);
  color: #fbf9f4;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cmp-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.cmp-kicker {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: #b8e3a0;
  letter-spacing: 0.04em;
}

.cmp-title {
  margin: 4px 0 0;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.2vw, 1.85rem);
  font-weight: 800;
  line-height: 1.08;
}

.echart-box {
  background: #9a3219;
  border-radius: 20px;
  padding: 14px;
  border: 1px solid rgba(251, 249, 244, 0.14);
}

.echart-canvas {
  width: 100%;
  height: 340px;
}

.versus-controls {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.versus-select-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.versus-select {
  background: #9a3219;
  color: #fbf9f4;
  border: 1px solid rgba(251, 249, 244, 0.3);
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.versus-vs {
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 0.875rem;
  color: #b8e3a0;
  padding-bottom: 9px;
}

.duel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.duel-card {
  background: #9a3219;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.duel-card h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  color: #b8e3a0;
}

.duel-card dl {
  margin: 0;
  display: grid;
  gap: 7px;
}

.duel-card dl > div {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  gap: 8px;
  font-size: 0.875rem;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(251, 249, 244, 0.14);
}

.duel-card dt {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: rgba(251, 249, 244, 0.78);
}

.duel-card dd {
  margin: 0;
}

.duel-adopt {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.45;
  background: rgba(22, 21, 18, 0.22);
  padding: 10px 12px;
  border-radius: 12px;
}

.duel-adopt strong {
  color: #b8e3a0;
}

.border-banner {
  background: rgba(22, 21, 18, 0.28);
  border: 1px solid rgba(184, 227, 160, 0.45);
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.border-banner__head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.border-banner__head strong {
  color: #b8e3a0;
}

.border-banner__head span {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.border-banner p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.45;
}

.corridors-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.corridor-card {
  background: #9a3219;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.corridor-card h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 800;
  color: #b8e3a0;
}

.corridor-zone {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: rgba(251, 249, 244, 0.82);
}

.corridor-card p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.45;
}

.cmp-citas {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}

.cmp-citas__lbl {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(251, 249, 244, 0.85);
}

.cmp-cite-chip {
  padding: 2px 9px;
  border-radius: 999px;
  border: 1px solid rgba(184, 227, 160, 0.55);
  background: rgba(184, 227, 160, 0.16);
  color: #b8e3a0;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.cmp-cite-chip:hover {
  background: #b8e3a0;
  color: #161512;
}

@media (max-width: 900px) {
  .duel-grid,
  .corridors-grid {
    grid-template-columns: 1fr;
  }
}
</style>
