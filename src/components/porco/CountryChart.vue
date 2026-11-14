<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  pais: string;
  lang?: 'es' | 'en';
}>();

type CountryProfile = {
  nameEs: string;
  nameEn: string;
  hatoEs: string;
  hatoEn: string;
  backyardPct: number;
  techPct: number;
  backyardLabelEs: string;
  backyardLabelEn: string;
  techLabelEs: string;
  techLabelEn: string;
  ppaEs: string;
  ppaEn: string;
  ppcEs: string;
  ppcEn: string;
  cistiEs: string;
  cistiEn: string;
  fronteraEs: string;
  fronteraEn: string;
  citas: number[];
};

const profiles: Record<string, CountryProfile> = {
  col: {
    nameEs: 'Colombia',
    nameEn: 'Colombia',
    hatoEs: '10.67M cabezas (2024)',
    hatoEn: '10.67M pigs (2024)',
    backyardPct: 78.4,
    techPct: 21.6,
    backyardLabelEs: 'Traspatio (zona ciega)',
    backyardLabelEn: 'Backyard (blind spot)',
    techLabelEs: 'Tecnificado / comercial',
    techLabelEn: 'Commercial / technified',
    ppaEs: 'Libre · riesgo fronterizo por ingreso informal',
    ppaEn: 'Free · border risk from informal imports',
    ppcEs: '3 zonas libres (OMSA) · control en frontera',
    ppcEn: '3 free zones (WOAH) · border control',
    cistiEs: '9.7% Tuchín · 14% Coyaima · 0% vigilancia en granjas',
    cistiEn: '9.7% Tuchín · 14% Coyaima · 0% farm surveillance',
    fronteraEs: 'Corredores críticos: frontera con Venezuela (Norte de Santander/Arauca) y Ecuador (Nariño/Putumayo).',
    fronteraEn: 'Critical corridors: border with Venezuela (Norte de Santander/Arauca) and Ecuador (Nariño/Putumayo).',
    citas: [1, 3, 4, 10],
  },
  ecu: {
    nameEs: 'Ecuador',
    nameEn: 'Ecuador',
    hatoEs: '0.90M–2.49M cabezas (ESPAC)',
    hatoEn: '0.90M–2.49M pigs (ESPAC)',
    backyardPct: 68.0,
    techPct: 32.0,
    backyardLabelEs: 'Traspatio / sin registro',
    backyardLabelEn: 'Backyard / unrecorded',
    techLabelEs: 'Granjas registradas',
    techLabelEn: 'Registered farms',
    ppaEs: 'Libre · vigilancia Agrocalidad en fronteras',
    ppaEn: 'Free · Agrocalidad border surveillance',
    ppcEs: 'En erradicación (PROZEC · 1.34M vacunados)',
    ppcEn: 'Under eradication (PROZEC · 1.34M vaccinated)',
    cistiEs: '3.9%–5.5% en camales (Loja y El Oro)',
    cistiEn: '3.9%–5.5% in slaughterhouses (Loja & El Oro)',
    fronteraEs: 'Corredor sur (Loja / El Oro) conectado con Tumbes (Perú) y corredor norte con Colombia.',
    fronteraEn: 'Southern corridor (Loja / El Oro) linked to Tumbes (Peru) and northern border with Colombia.',
    citas: [11, 12, 13],
  },
  per: {
    nameEs: 'Perú',
    nameEn: 'Peru',
    hatoEs: '3.70M cabezas (MIDAGRI 2025)',
    hatoEn: '3.70M pigs (MIDAGRI 2025)',
    backyardPct: 72.0,
    techPct: 28.0,
    backyardLabelEs: 'Traspatio / sin inspección',
    backyardLabelEn: 'Backyard / uninspected',
    techLabelEs: 'Control oficial (SENASA)',
    techLabelEn: 'Official control (SENASA)',
    ppaEs: 'Libre · control en puertos y fronteras',
    ppaEn: 'Free · port and border control',
    ppcEs: '13 regiones libres internas · endémico ante OMSA',
    ppcEn: '13 internal free regions · endemic at WOAH',
    cistiEs: '45.0% EITB en Tumbes · 0% tamizaje oficial en granjas',
    cistiEn: '45.0% EITB in Tumbes · 0% official farm screening',
    fronteraEs: 'Foco fronterizo en Tumbes (límite con Ecuador) con alta circulación rural de traspatio.',
    fronteraEn: 'Border hotspot in Tumbes (bordering Ecuador) with high rural backyard circulation.',
    citas: [14, 15, 16],
  },
  ven: {
    nameEs: 'Venezuela',
    nameEn: 'Venezuela',
    hatoEs: '2.31M cabezas (FAOSTAT 2024)',
    hatoEn: '2.31M pigs (FAOSTAT 2024)',
    backyardPct: 24.0,
    techPct: 76.0,
    backyardLabelEs: 'Independiente / traspatio',
    backyardLabelEn: 'Independent / backyard',
    techLabelEs: 'Tecnificado (PROCERDO)',
    techLabelEn: 'Commercial (PROCERDO)',
    ppaEs: 'Libre · alerta Caribe Mem. 031 (INSAI)',
    ppaEn: 'Free · Caribbean alert Mem. 031 (INSAI)',
    ppcEs: 'Endémico (vacuna SIGMAV) · retraso en WAHIS',
    ppcEn: 'Endemic (SIGMAV vaccine) · WAHIS reporting lag',
    cistiEs: '19.2% Ag-ELISA HP10 (Yaracuy) · 0 boletines oficiales',
    cistiEn: '19.2% Ag-ELISA HP10 (Yaracuy) · 0 official bulletins',
    fronteraEs: 'Corredor occidental hacia Colombia y vigilancia portuaria Caribe tras focos de PPA en 2021.',
    fronteraEn: 'Western corridor toward Colombia and Caribbean port surveillance following 2021 ASF outbreaks.',
    citas: [17, 18, 19, 20, 21],
  },
};

const active = computed(() => profiles[props.pais] || profiles.col);

function abrirCita(id: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('porco:abrir-cita', { detail: { id } }));
  }
}
</script>

<template>
  <section class="country-profile-card" :aria-label="lang === 'en' ? 'Country sanitary profile' : 'Perfil sanitario del país'">
    <header class="cp-head">
      <div>
        <span class="cp-kicker">{{ lang === 'en' ? 'ACTIVE COUNTRY PROFILE' : 'PERFIL SANITARIO ACTIVO' }}</span>
        <h3 class="cp-title">{{ lang === 'en' ? active.nameEn : active.nameEs }}</h3>
      </div>
      <span class="cp-hato">{{ lang === 'en' ? active.hatoEn : active.hatoEs }}</span>
    </header>

    <div class="cp-bar-block">
      <div class="cp-bar-labels">
        <span class="cp-lbl cp-lbl--lime">
          {{ active.backyardPct.toFixed(1) }}% {{ lang === 'en' ? active.backyardLabelEn : active.backyardLabelEs }}
        </span>
        <span class="cp-lbl">
          {{ active.techPct.toFixed(1) }}% {{ lang === 'en' ? active.techLabelEn : active.techLabelEs }}
        </span>
      </div>
      <div class="cp-bar-track" role="img" :aria-label="`${active.backyardPct}% / ${active.techPct}%`">
        <div class="cp-bar-fill cp-bar-fill--lime" :style="{ width: `${active.backyardPct}%` }"></div>
        <div class="cp-bar-fill cp-bar-fill--cream" :style="{ width: `${active.techPct}%` }"></div>
      </div>
    </div>

    <dl class="cp-signals">
      <div class="cp-signal">
        <dt>PPA</dt>
        <dd>{{ lang === 'en' ? active.ppaEn : active.ppaEs }}</dd>
      </div>
      <div class="cp-signal">
        <dt>PPC</dt>
        <dd>{{ lang === 'en' ? active.ppcEn : active.ppcEs }}</dd>
      </div>
      <div class="cp-signal">
        <dt>{{ lang === 'en' ? 'Cysticercosis' : 'Cisticercosis' }}</dt>
        <dd>{{ lang === 'en' ? active.cistiEn : active.cistiEs }}</dd>
      </div>
    </dl>

    <div class="cp-border-note">
      <strong>{{ lang === 'en' ? 'Border corridor:' : 'Corredor fronterizo:' }}</strong>
      <span>{{ lang === 'en' ? active.fronteraEn : active.fronteraEs }}</span>
    </div>

    <footer class="cp-citas">
      <span class="cp-citas__lbl">{{ lang === 'en' ? 'Citations:' : 'Citas:' }}</span>
      <button
        v-for="cid in active.citas"
        :key="cid"
        type="button"
        class="cp-cite-chip"
        @click="abrirCita(cid)"
      >[{{ cid }}]</button>
    </footer>
  </section>
</template>

<style scoped>
.country-profile-card {
  grid-column: 1 / -1;
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

.cp-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.cp-kicker {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #b8e3a0;
}

.cp-title {
  margin: 2px 0 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.05;
  color: #fbf9f4;
}

.cp-hato {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
  background: #9a3219;
  color: #fbf9f4;
  border: 1px solid rgba(251, 249, 244, 0.2);
}

.cp-bar-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cp-bar-labels {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 0.8125rem;
  font-weight: 600;
}

.cp-lbl--lime {
  color: #b8e3a0;
}

.cp-bar-track {
  display: flex;
  width: 100%;
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
  background: #9a3219;
  border: 1px solid rgba(251, 249, 244, 0.2);
}

.cp-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.cp-bar-fill--lime {
  background: #b8e3a0;
}

.cp-bar-fill--cream {
  background: #fbf9f4;
}

.cp-signals {
  margin: 0;
  display: grid;
  gap: 8px;
}

.cp-signal {
  display: grid;
  grid-template-columns: 106px minmax(0, 1fr);
  gap: 8px;
  align-items: baseline;
  background: #9a3219;
  border-radius: 12px;
  padding: 9px 12px;
}

.cp-signal dt {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: #b8e3a0;
}

.cp-signal dd {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.35;
  color: #fbf9f4;
}

.cp-border-note {
  background: rgba(22, 21, 18, 0.22);
  border: 1px solid rgba(184, 227, 160, 0.35);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.875rem;
  line-height: 1.4;
}

.cp-border-note strong {
  color: #b8e3a0;
  margin-right: 6px;
}

.cp-citas {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}

.cp-citas__lbl {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(251, 249, 244, 0.85);
}

.cp-cite-chip {
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

.cp-cite-chip:hover {
  background: #b8e3a0;
  color: #161512;
}

@media (max-width: 640px) {
  .country-profile-card {
    padding: 14px;
  }

  .cp-signal {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}
</style>
