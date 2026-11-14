<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  lang?: 'es' | 'en';
}>();

type CountryCode = 'col' | 'ecu' | 'per' | 'ven';

const paisA = ref<CountryCode>('col');
const paisB = ref<CountryCode>('ven');

const countries: Record<
  CountryCode,
  {
    nameEs: string;
    nameEn: string;
    traspatio: number;
    hatoM: number;
    hatoLabel: string;
    ppcEs: string;
    ppcEn: string;
    adoptEs: string;
    adoptEn: string;
    citas: number[];
  }
> = {
  col: {
    nameEs: 'Colombia',
    nameEn: 'Colombia',
    traspatio: 78.4,
    hatoM: 10.67,
    hatoLabel: '10.67M',
    ppcEs: '3 zonas libres OMSA',
    ppcEn: '3 WOAH free zones',
    adoptEs: 'AnalítICA 2026: tablero abierto de 241 episodios georreferenciados.',
    adoptEn: 'AnalítICA 2026: open dashboard of 241 georeferenced episodes.',
    citas: [1, 10],
  },
  ecu: {
    nameEs: 'Ecuador',
    nameEn: 'Ecuador',
    traspatio: 68.0,
    hatoM: 1.7,
    hatoLabel: '0.90–2.49M',
    ppcEs: 'En erradicación (PROZEC)',
    ppcEn: 'Eradication (PROZEC)',
    adoptEs: 'Programa PROZEC de vacunación PPC con trazabilidad por zonas.',
    adoptEn: 'PROZEC CSF vaccination program with zone-based traceability.',
    citas: [11, 12],
  },
  per: {
    nameEs: 'Perú',
    nameEn: 'Peru',
    traspatio: 72.0,
    hatoM: 3.7,
    hatoLabel: '3.70M',
    ppcEs: '13 reg. internas / endémico OMSA',
    ppcEn: '13 internal reg. / WOAH endemic',
    adoptEs: '13 regiones internas declaradas libres de PPC por SENASA.',
    adoptEn: '13 internal regions declared CSF-free by SENASA.',
    citas: [14, 15],
  },
  ven: {
    nameEs: 'Venezuela',
    nameEn: 'Venezuela',
    traspatio: 24.0,
    hatoM: 2.31,
    hatoLabel: '2.31M',
    ppcEs: 'Endémico (SIGMAV) · lag WAHIS',
    ppcEn: 'Endemic (SIGMAV) · WAHIS lag',
    adoptEs: '76% agremiado en PROCERDO y alerta fronteriza PPA (Mem. 031).',
    adoptEn: '76% in PROCERDO and ASF border alert protocol (Mem. 031).',
    citas: [17, 18, 20],
  },
};

const borderLinks: Record<string, { titleEs: string; titleEn: string; textEs: string; textEn: string }> = {
  'col-ven': {
    titleEs: 'Frontera compartida · Colombia ↔ Venezuela',
    titleEn: 'Shared border · Colombia ↔ Venezuela',
    textEs: 'Corredor Norte de Santander / Arauca: movimiento informal de cerdos y brecha de reportes WAHIS/INSAI frente al control fronterizo ICA.',
    textEn: 'Norte de Santander / Arauca corridor: informal pig movement and WAHIS/INSAI reporting gap vs. ICA border control.',
  },
  'col-ecu': {
    titleEs: 'Frontera compartida · Colombia ↔ Ecuador',
    titleEn: 'Shared border · Colombia ↔ Ecuador',
    textEs: 'Corredor Nariño / Putumayo: ambos países operan vacunación PPC (ICA / PROZEC), pero persiste traspatio sin tamizaje de cisticercosis.',
    textEn: 'Nariño / Putumayo corridor: both run CSF vaccination (ICA / PROZEC), while backyard cysticercosis screening remains absent.',
  },
  'ecu-per': {
    titleEs: 'Frontera compartida · Ecuador ↔ Perú',
    titleEn: 'Shared border · Ecuador ↔ Peru',
    textEs: 'Corredor El Oro / Loja – Tumbes: foco documentado de cisticercosis rural (3.9%–5.5% camal EC vs. 45.0% EITB en Tumbes, PE).',
    textEn: 'El Oro / Loja – Tumbes corridor: documented rural cysticercosis hotspot (3.9%–5.5% EC slaughterhouses vs. 45.0% EITB in Tumbes, PE).',
  },
};

const a = computed(() => countries[paisA.value]);
const b = computed(() => countries[paisB.value]);

const maxHato = computed(() => Math.max(a.value.hatoM, b.value.hatoM, 1));

const sharedBorder = computed(() => {
  const key = [paisA.value, paisB.value].sort().join('-');
  return borderLinks[key] || null;
});

const combinedCitas = computed(() => {
  const set = new Set([...a.value.citas, ...b.value.citas]);
  return Array.from(set);
});

function abrirCita(id: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('porco:abrir-cita', { detail: { id } }));
  }
}
</script>

<template>
  <section class="versus-card" :aria-label="lang === 'en' ? 'Country comparator' : 'Comparador de países'">
    <header class="versus-head">
      <span class="versus-kicker">{{ lang === 'en' ? 'COUNTRY VS. COUNTRY · BORDERS' : 'PAÍS VS. PAÍS · FRONTERAS' }}</span>
      <div class="versus-controls">
        <label class="versus-select-wrap">
          <span>{{ lang === 'en' ? 'Country A' : 'País A' }}</span>
          <select v-model="paisA" class="versus-select">
            <option value="col">Colombia</option>
            <option value="ecu">Ecuador</option>
            <option value="per">Perú</option>
            <option value="ven">Venezuela</option>
          </select>
        </label>
        <span class="versus-vs">VS</span>
        <label class="versus-select-wrap">
          <span>{{ lang === 'en' ? 'Country B' : 'País B' }}</span>
          <select v-model="paisB" class="versus-select">
            <option value="col">Colombia</option>
            <option value="ecu">Ecuador</option>
            <option value="per">Perú</option>
            <option value="ven">Venezuela</option>
          </select>
        </label>
      </div>
    </header>

    <div class="versus-metrics">
      <div class="vm-group">
        <div class="vm-title">{{ lang === 'en' ? 'Backyard / unrecorded share (%)' : 'Brecha de traspatio / sin registro (%)' }}</div>
        <div class="vm-row">
          <span class="vm-name">{{ lang === 'en' ? a.nameEn : a.nameEs }}</span>
          <div class="vm-track">
            <div class="vm-fill vm-fill--lime" :style="{ width: `${a.traspatio}%` }"></div>
          </div>
          <strong class="vm-val vm-val--lime">{{ a.traspatio.toFixed(1) }}%</strong>
        </div>
        <div class="vm-row">
          <span class="vm-name">{{ lang === 'en' ? b.nameEn : b.nameEs }}</span>
          <div class="vm-track">
            <div class="vm-fill vm-fill--cream" :style="{ width: `${b.traspatio}%` }"></div>
          </div>
          <strong class="vm-val">{{ b.traspatio.toFixed(1) }}%</strong>
        </div>
      </div>

      <div class="vm-group">
        <div class="vm-title">{{ lang === 'en' ? 'Swine inventory (heads)' : 'Hato porcino (cabezas)' }}</div>
        <div class="vm-row">
          <span class="vm-name">{{ lang === 'en' ? a.nameEn : a.nameEs }}</span>
          <div class="vm-track">
            <div class="vm-fill vm-fill--lime" :style="{ width: `${Math.round((a.hatoM / maxHato) * 100)}%` }"></div>
          </div>
          <strong class="vm-val vm-val--lime">{{ a.hatoLabel }}</strong>
        </div>
        <div class="vm-row">
          <span class="vm-name">{{ lang === 'en' ? b.nameEn : b.nameEs }}</span>
          <div class="vm-track">
            <div class="vm-fill vm-fill--cream" :style="{ width: `${Math.round((b.hatoM / maxHato) * 100)}%` }"></div>
          </div>
          <strong class="vm-val">{{ b.hatoLabel }}</strong>
        </div>
      </div>
    </div>

    <div v-if="sharedBorder" class="border-alert">
      <strong>{{ lang === 'en' ? sharedBorder.titleEn : sharedBorder.titleEs }}</strong>
      <p>{{ lang === 'en' ? sharedBorder.textEn : sharedBorder.textEs }}</p>
    </div>
    <div v-else class="border-alert border-alert--neutral">
      <strong>{{ lang === 'en' ? 'CSF status contrast' : 'Contraste sanitario PPC' }}</strong>
      <p>
        {{ lang === 'en' ? a.nameEn : a.nameEs }}: {{ lang === 'en' ? a.ppcEn : a.ppcEs }} ·
        {{ lang === 'en' ? b.nameEn : b.nameEs }}: {{ lang === 'en' ? b.ppcEn : b.ppcEs }}.
      </p>
    </div>

    <div class="ecosistema-grid">
      <div class="ecosistema-item">
        <strong>{{ lang === 'en' ? `Adopt from ${a.nameEn}` : `Adoptar de ${a.nameEs}` }}</strong>
        <p>{{ lang === 'en' ? a.adoptEn : a.adoptEs }}</p>
      </div>
      <div class="ecosistema-item">
        <strong>{{ lang === 'en' ? `Adopt from ${b.nameEn}` : `Adoptar de ${b.nameEs}` }}</strong>
        <p>{{ lang === 'en' ? b.adoptEn : b.adoptEs }}</p>
      </div>
    </div>

    <footer class="versus-citas">
      <span class="versus-citas__lbl">{{ lang === 'en' ? 'Citations:' : 'Citas:' }}</span>
      <button
        v-for="cid in combinedCitas"
        :key="cid"
        type="button"
        class="versus-cite-chip"
        @click="abrirCita(cid)"
      >[{{ cid }}]</button>
    </footer>
  </section>
</template>

<style scoped>
.versus-card {
  width: 100%;
  min-width: 0;
  background: #b8401f;
  border: 1px solid rgba(251, 249, 244, 0.16);
  border-radius: 20px;
  padding: 18px;
  color: #fbf9f4;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.versus-head {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.versus-kicker {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #b8e3a0;
}

.versus-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.versus-select-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8125rem;
  font-weight: 600;
  flex: 1;
  min-width: 110px;
}

.versus-select {
  background: #9a3219;
  color: #fbf9f4;
  border: 1px solid rgba(251, 249, 244, 0.28);
  border-radius: 12px;
  padding: 8px 10px;
  font-size: 0.875rem;
  font-weight: 600;
}

.versus-vs {
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 0.875rem;
  color: #b8e3a0;
  padding-top: 18px;
}

.versus-metrics {
  display: grid;
  gap: 12px;
}

.vm-group {
  background: #9a3219;
  border-radius: 14px;
  padding: 11px 12px;
  display: grid;
  gap: 7px;
}

.vm-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: rgba(251, 249, 244, 0.9);
}

.vm-row {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr) 76px;
  align-items: center;
  gap: 8px;
}

.vm-name {
  font-size: 0.8125rem;
  font-weight: 600;
}

.vm-track {
  height: 10px;
  border-radius: 999px;
  background: rgba(22, 21, 18, 0.3);
  overflow: hidden;
}

.vm-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.vm-fill--lime {
  background: #b8e3a0;
}

.vm-fill--cream {
  background: #fbf9f4;
}

.vm-val {
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
}

.vm-val--lime {
  color: #b8e3a0;
}

.border-alert {
  background: rgba(22, 21, 18, 0.24);
  border: 1px solid rgba(184, 227, 160, 0.4);
  border-radius: 12px;
  padding: 10px 12px;
}

.border-alert--neutral {
  border-color: rgba(251, 249, 244, 0.22);
}

.border-alert strong {
  display: block;
  font-size: 0.8125rem;
  color: #b8e3a0;
  margin-bottom: 3px;
}

.border-alert p {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.ecosistema-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ecosistema-item {
  background: #9a3219;
  border-radius: 12px;
  padding: 11px 12px;
}

.ecosistema-item strong {
  display: block;
  font-size: 0.8125rem;
  color: #b8e3a0;
  margin-bottom: 4px;
}

.ecosistema-item p {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.versus-citas {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}

.versus-citas__lbl {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(251, 249, 244, 0.85);
}

.versus-cite-chip {
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

.versus-cite-chip:hover {
  background: #b8e3a0;
  color: #161512;
}

@media (max-width: 640px) {
  .versus-card {
    padding: 14px;
  }

  .ecosistema-grid {
    grid-template-columns: 1fr;
  }
}
</style>
