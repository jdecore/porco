<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

type Tarjeta = {
  id: string;
  numero: string;
  tag: string;
  titulo: string;
  cifra_principal?: string;
  cifra_subtitulo?: string;
  texto_corto?: string;
  boton_texto?: string;
  referencias?: string;
  candidatas?: Array<{ nombre: string; estado: string }>;
  comparativa?: Array<{ tipo: string; unidad: string; advertencia: string }>;
  discrepancias?: Array<{ fuente: string; linea_1: string; linea_2: string; badge: string }>;
  ficha_preview?: {
    id: string;
    fuente: string;
    pais: string;
    periodo: string;
    resultado: string;
    estado: string;
    ref: string;
  };
  planes?: string[];
  acciones?: Array<{ label: string; tipo: string; url: string }>;
};

const props = defineProps<{
  tarjetas: Tarjeta[];
}>();

const pais = ref<'col' | 'ecu'>('col');

onMounted(() => {
  window.addEventListener('porco:country-change', (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail === 'ecu' || detail === 'col') {
      pais.value = detail;
    }
  });
});

const tarjetasEcuador: Tarjeta[] = [
  {
    id: 'problema',
    numero: '01',
    tag: 'EL PROBLEMA',
    titulo: 'Dos cifras oficiales pueden contar historias opuestas.',
    cifra_principal: '2.49M → 0.9M',
    cifra_subtitulo: 'Caída interanual en inventario oficial INEC ESPAC (2021 vs. 2022)',
    texto_corto:
      'Un dato suelto sin su marco muestral induce a error. En Ecuador, el inventario oficial cae casi a un tercio de un año a otro y la inspección en camal deja fuera el faenamiento rural.',
    referencias: 'INEC (ESPAC 2021–2023) · PubMed (Loja y El Oro)',
  },
  {
    id: 'alcance',
    numero: '02',
    tag: 'ECUADOR V0.0.2',
    titulo: 'Ecuador en foco: del censo a la frontera sanitaria.',
    texto_corto:
      'Reunimos la evidencia verificada de inventario porcino, estatus PPC/PPA y cisticercosis en Ecuador. Cada registro incluye año, cobertura y fuente primaria.',
    candidatas: [
      { nombre: 'INEC (ESPAC)', estado: 'Evaluado (2021–2023)' },
      { nombre: 'Agrocalidad (PROZEC)', estado: 'Evaluado (PPC / PPA)' },
      { nombre: 'ASPE / PubMed', estado: 'Evaluado (Gremio y Loja/El Oro)' },
    ],
  },
  {
    id: 'unidades',
    numero: '03',
    tag: 'UNIDADES DE MEDIDA',
    titulo: 'El camal no mide el traspatio. La UPA no mide toda la industria.',
    texto_corto:
      'Comparar inspecciones de matadero con comunidades hiperendémicas o encuestas de fincas tradicionales con estimaciones gremiales de ASPE sesga cualquier análisis.',
    comparativa: [
      {
        tipo: 'Camales locales (Loja / El Oro)',
        unidad: 'Camal ≠ Traspatio',
        advertencia: 'La inspección visual en camal (3.9%–5.5%) excluye el faenamiento clandestino rural.',
      },
      {
        tipo: 'Encuesta INEC (ESPAC)',
        unidad: 'UPA tradicional ≠ Hato total',
        advertencia: 'Registra fincas tradicionales; el gremio (ASPE) estima ~100 mil productores y 220 mil t/año.',
      },
    ],
  },
  {
    id: 'verificacion',
    numero: '04',
    tag: 'EVIDENCIA COMPROBABLE',
    titulo: 'Tres fuentes clave, tres brechas documentadas.',
    discrepancias: [
      {
        fuente: 'INEC (ESPAC 2021–2022)',
        linea_1: 'ESPAC 2021: 2.49 millones de cabezas',
        linea_2: 'ESPAC 2022: 0.9 millones de cabezas',
        badge: 'Oscilación interanual',
      },
      {
        fuente: 'Agrocalidad (PROZEC / Res. 0323)',
        linea_1: 'PPA: País libre (vigilancia en fronteras)',
        linea_2: 'PPC: Control y erradicación (vacunación obligatoria)',
        badge: 'Doble estatus sanitario',
      },
      {
        fuente: 'Cisticercosis (Loja y El Oro)',
        linea_1: 'Camales locales: 3.9%–5.5% (PubMed)',
        linea_2: 'Faenamiento informal: sin registro oficial',
        badge: 'Punto ciego rural',
      },
    ],
  },
  {
    id: 'registro',
    numero: '05',
    tag: 'QUÉ APORTA PORCO',
    titulo: 'Del PDF disperso a una ficha trazable.',
    ficha_preview: {
      id: 'OBS-ECU-001',
      fuente: 'INEC ESPAC (2021–2023) & ASPE (2024)',
      pais: 'Ecuador',
      periodo: '2021 – 2024',
      resultado: '59.4% de raza (2023) · ~100 mil productores / 220 mil t/año',
      estado: 'Brecha de cobertura entre encuesta oficial y gremio',
      ref: 'INEC / Forbes Ecuador',
    },
    planes: ['Búsqueda estructurada', 'Citas IEEE verificadas', 'API / MCP para agentes'],
  },
  {
    id: 'acceso',
    numero: '06',
    tag: 'DATOS Y AGENTES',
    titulo: 'Lleva los datos de Ecuador a tu análisis o a tu IA.',
    texto_corto:
      'Descarga el CSV o Markdown exclusivo de Ecuador con citas IEEE, o consúltalo directo desde tu agente con la herramienta get_evidencia_ecuador.',
    acciones: [
      { label: 'Descargar CSV Ecuador', tipo: 'csv', url: '/data/ecuador-sanidad.csv' },
      { label: 'Conectar un agente', tipo: 'mcp', url: '/conectar' },
    ],
  },
];

const activeTarjetas = computed(() =>
  pais.value === 'ecu' ? tarjetasEcuador : props.tarjetas,
);

function notificarCita(id: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('porco:abrir-cita', { detail: { id } }));
  }
}
</script>

<template>
  <div class="cards-feed" id="feed-tarjetas" role="region" aria-label="Feed de evidencia sanitaria">
    <!-- Card 1: El problema -->
    <article v-if="activeTarjetas[0]" class="feed-card feed-card--problema" id="card-problema">
      <header class="feed-card__head">
        <span class="feed-card__num">{{ activeTarjetas[0].numero }}</span>

      </header>

      <h2 class="feed-card__title">{{ activeTarjetas[0].titulo }}</h2>

      <div class="feed-card__hero-metric">
        <div class="metric-struck">
          <span class="struck-value">{{ pais === 'ecu' ? '0.9M' : '9.7%' }}</span>
          <span class="struck-label">Titular sin contexto</span>
        </div>
        <div class="metric-arrow" aria-hidden="true">→</div>
        <div class="metric-verified">
          <strong class="verified-value">{{ activeTarjetas[0].cifra_principal }}</strong>
          <span class="verified-label">{{ activeTarjetas[0].cifra_subtitulo }}</span>
        </div>
      </div>

      <p class="feed-card__desc">{{ activeTarjetas[0].texto_corto }}</p>

      <footer class="feed-card__foot">
        <button
          type="button"
          class="feed-card__btn feed-card__btn--red"
          @click="notificarCita(1)"
        >
          {{ activeTarjetas[0].boton_texto }} [1]
        </button>
        <span class="feed-card__ref-note">{{ activeTarjetas[0].referencias }}</span>
      </footer>
    </article>

    <!-- Card 2: Alcance v0.0.1 -->
    <article v-if="activeTarjetas[1]" class="feed-card feed-card--alcance" id="card-alcance">
      <header class="feed-card__head">
        <span class="feed-card__num">{{ activeTarjetas[1].numero }}</span>

      </header>

      <h2 class="feed-card__title">{{ activeTarjetas[1].titulo }}</h2>

      <p class="feed-card__desc">{{ activeTarjetas[1].texto_corto }}</p>

      <div class="candidatas-list" v-if="activeTarjetas[1].candidatas">
        <div v-for="c in activeTarjetas[1].candidatas" :key="c.nombre" class="candidata-item">
          <span class="candidata-dot"></span>
          <span class="candidata-nombre">{{ c.nombre }}</span>
          <span class="candidata-badge">{{ c.estado }}</span>
        </div>
      </div>
    </article>

    <!-- Card 3: Unidades de medida -->
    <article v-if="activeTarjetas[2]" class="feed-card feed-card--unidades" id="card-unidades">
      <header class="feed-card__head">
        <span class="feed-card__num">{{ activeTarjetas[2].numero }}</span>

      </header>

      <h2 class="feed-card__title">{{ activeTarjetas[2].titulo }}</h2>

      <div class="split-units" v-if="activeTarjetas[2].comparativa">
        <div class="unit-box unit-box--admin">
          <span class="unit-kicker">Registros Oficiales (RIPS)</span>
          <strong class="unit-stat">Atención ≠ Persona</strong>
          <p class="unit-desc">Registra visitas médicas facturadas. Si un paciente consulta 5 veces, son 5 filas.</p>
        </div>
        <div class="unit-box unit-box--field">
          <span class="unit-kicker">{{ pais === 'ecu' ? 'Encuesta INEC (ESPAC)' : 'Estudio de Campo (Tuchín)' }}</span>
          <strong class="unit-stat">42 Comunidades ≠ País</strong>
          <p class="unit-desc">Muestra focal de cerdos en comunidades rurales Zenú con traspatio predominante.</p>
        </div>
      </div>

      <p class="feed-card__desc">{{ activeTarjetas[2].texto_corto }}</p>
    </article>

    <!-- Card 4: La Verificación -->
    <article v-if="activeTarjetas[3]" class="feed-card feed-card--verificacion" id="card-verificacion">
      <header class="feed-card__head">
        <span class="feed-card__num">{{ activeTarjetas[3].numero }}</span>

      </header>

      <h2 class="feed-card__title">{{ activeTarjetas[3].titulo }}</h2>

      <div class="discrepancias-list" v-if="activeTarjetas[3].discrepancias">
        <div v-for="d in activeTarjetas[3].discrepancias" :key="d.fuente" class="discrepancia-item">
          <div class="discrepancia-head">
            <strong>{{ d.fuente }}</strong>
            <span class="badge-alert">{{ d.badge }}</span>
          </div>
          <div class="discrepancia-lines">
            <span>• {{ d.linea_1 }}</span>
            <span>• {{ d.linea_2 }}</span>
          </div>
        </div>
      </div>

      <footer class="feed-card__foot">
        <button
          type="button"
          class="feed-card__btn feed-card__btn--secondary"
          @click="notificarCita(3)"
        >
          {{ activeTarjetas[3].boton_texto }} [3]
        </button>
      </footer>
    </article>

    <!-- Card 5: El Registro de Porco -->
    <article v-if="activeTarjetas[4]" class="feed-card feed-card--registro" id="card-registro">
      <header class="feed-card__head">
        <span class="feed-card__num">{{ activeTarjetas[4].numero }}</span>

      </header>

      <h2 class="feed-card__title">{{ activeTarjetas[4].titulo }}</h2>

      <div class="terminal-preview" v-if="activeTarjetas[4].ficha_preview">
        <div class="terminal-top">
          <span class="term-dot"></span><span class="term-dot"></span><span class="term-dot"></span>
          <span class="term-id">{{ activeTarjetas[4].ficha_preview.id }} · FICHA AUDITADA</span>
        </div>
        <div class="terminal-code">
          <div><span class="term-k">Fuente:</span> {{ activeTarjetas[4].ficha_preview.fuente }}</div>
          <div><span class="term-k">Periodo:</span> {{ activeTarjetas[4].ficha_preview.periodo }}</div>
          <div><span class="term-k">Resultado:</span> {{ activeTarjetas[4].ficha_preview.resultado }}</div>
          <div><span class="term-k">Estado:</span> <span class="term-warn">{{ activeTarjetas[4].ficha_preview.estado }}</span></div>
        </div>
      </div>

      <div class="plans-tags" v-if="activeTarjetas[4].planes">
        <span v-for="p in activeTarjetas[4].planes" :key="p" class="plan-tag">✓ {{ p }}</span>
      </div>
    </article>

    <!-- Card 6: Primero las personas, luego la IA -->
    <article v-if="activeTarjetas[5]" class="feed-card feed-card--acceso" id="card-acceso">
      <header class="feed-card__head">
        <span class="feed-card__num">{{ activeTarjetas[5].numero }}</span>

      </header>

      <h2 class="feed-card__title">{{ activeTarjetas[5].titulo }}</h2>

      <p class="feed-card__desc">{{ activeTarjetas[5].texto_corto }}</p>

      <div class="access-actions" v-if="activeTarjetas[5].acciones">
        <a
          :href="activeTarjetas[5].acciones[0].url"
          :download="pais === 'ecu' ? 'ecuador-sanidad.csv' : 'andina-porcinos.csv'"
          class="feed-card__btn feed-card__btn--red"
        >
          📥 {{ activeTarjetas[5].acciones[0].label }}
        </a>
        <a
          :href="activeTarjetas[5].acciones[1].url"
          class="feed-card__btn feed-card__btn--secondary"
        >
          🤖 {{ activeTarjetas[5].acciones[1].label }}
        </a>
      </div>

      <div class="download-matrix" aria-label="Descargas por país">
        <div class="download-col">
          <span class="download-col__title">🇨🇴 Solo Colombia</span>
          <div class="download-col__links">
            <a href="/data/andina-porcinos.csv" download="colombia-sanidad.csv" class="download-chip">.csv</a>
            <a href="/data/colombia-sanidad.md" download="colombia-sanidad.md" class="download-chip">.md</a>
          </div>
        </div>
        <div class="download-col">
          <span class="download-col__title">🇪🇨 Solo Ecuador</span>
          <div class="download-col__links">
            <a href="/data/ecuador-sanidad.csv" download="ecuador-sanidad.csv" class="download-chip">.csv</a>
            <a href="/data/ecuador-sanidad.md" download="ecuador-sanidad.md" class="download-chip">.md</a>
          </div>
        </div>
        <div class="download-col">
          <span class="download-col__title">🌎 Ambos países</span>
          <div class="download-col__links">
            <a href="/data/andina-porcinos.csv" download="andina-porcinos.csv" class="download-chip">.csv</a>
            <a href="/data/colombia-andina-sanidad.md" download="colombia-andina-sanidad.md" class="download-chip">.md</a>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
/* Tokens locales para alto contraste táctico */
:root {
  --terra-neon: #FF6B4A;
  --terra-bright: #FF8566;
}

.cards-feed {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(16px, 2.5vw, 24px);
  padding: clamp(20px, 3vw, 36px) 0;
}

.feed-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: clamp(22px, 3vw, 32px);
  border-radius: var(--radius);
  background: #111214;
  border: 1px solid rgba(255, 107, 74, 0.22);
  color: #FFFFFF;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px -8px rgba(255, 107, 74, 0.15);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.feed-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 107, 74, 0.45);
  box-shadow: 0 14px 38px -10px rgba(0, 0, 0, 0.7), 0 0 28px -6px rgba(255, 107, 74, 0.28);
}

.feed-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.feed-card__num {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
}

.feed-card__tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #111214;
  background: #FF6B4A;
  padding: 3px 10px;
  border-radius: 999px;
  border: none;
  box-shadow: 0 0 12px rgba(255, 107, 74, 0.4);
}

.feed-card__title {
  margin: 0 0 14px;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.2vw, 1.7rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #FFFFFF;
}

.feed-card__desc {
  margin: 0 0 18px;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.88);
}

/* Card 1 Metric */
.feed-card__hero-metric {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #18191D;
  border: 1px solid rgba(255, 107, 74, 0.2);
  padding: 14px 18px;
  border-radius: 18px;
  margin-bottom: 16px;
}

.metric-struck {
  display: flex;
  flex-direction: column;
}

.struck-value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: line-through;
}

.struck-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.5);
}

.metric-arrow {
  font-size: 1.25rem;
  color: #FF6B4A;
  font-weight: bold;
}

.metric-verified {
  display: flex;
  flex-direction: column;
}

.verified-value {
  font-family: var(--font-display);
  font-size: 1.85rem;
  font-weight: 800;
  color: #FF6B4A;
  text-shadow: 0 0 16px rgba(255, 107, 74, 0.35);
}

.verified-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #FFFFFF;
}

/* Card 2 Coverage */
.coverage-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.coverage-pill {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #18191D;
}

.coverage-pill strong {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: #FFFFFF;
}

.coverage-pill span {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.6);
}

.coverage-pill--active {
  background: rgba(255, 107, 74, 0.1);
  border-color: #FF6B4A;
}

.coverage-pill--active strong {
  color: #FF6B4A;
}

.coverage-pill--pending {
  background: #18191D;
}

.candidatas-list {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
}

.candidata-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 10px;
  background: #18191D;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.candidata-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #FF6B4A;
  box-shadow: 0 0 8px rgba(255, 107, 74, 0.7);
  margin-right: 8px;
}

.candidata-nombre {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #FFFFFF;
}

.candidata-badge {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Card 3 Units Split */
.split-units {
  display: grid;
  gap: 10px;
  margin-bottom: 16px;
}

.unit-box {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #18191D;
}

.unit-kicker {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  color: #FF6B4A;
  font-weight: 700;
  margin-bottom: 2px;
}

.unit-stat {
  display: block;
  font-size: 1.05rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 4px;
}

.unit-desc {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.7);
}

/* Card 4 Discrepancias */
.discrepancias-list {
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}

.discrepancia-item {
  padding: 10px 14px;
  border-radius: 12px;
  background: #18191D;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.discrepancia-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 6px;
}

.discrepancia-head strong {
  font-size: 0.8125rem;
  color: #FFFFFF;
}

.badge-alert {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: #111214;
  background: #FF6B4A;
  padding: 2px 7px;
  border-radius: 6px;
  font-weight: 700;
}

.discrepancia-lines {
  display: grid;
  gap: 2px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.75);
  font-family: var(--font-mono);
}

/* Card 5 Terminal */
.terminal-preview {
  border-radius: 14px;
  background: #0B0C0E;
  color: #FFFFFF;
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  margin-bottom: 14px;
  border: 1px solid rgba(255, 107, 74, 0.2);
}

.terminal-top {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.term-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
}

.term-dot:first-child {
  background: #FF6B4A;
}

.term-id {
  margin-left: auto;
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.7);
}

.terminal-code {
  display: grid;
  gap: 4px;
}

.term-k {
  color: rgba(255, 255, 255, 0.55);
}

.term-warn {
  color: #FF6B4A;
  font-weight: 700;
}

.plans-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.plan-tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #FFFFFF;
  background: #18191D;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Card 6 Actions */
.access-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
}

/* Buttons */
.feed-card__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 18px;
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.feed-card__btn--red {
  background: #FF6B4A;
  color: #111214;
  box-shadow: 0 0 16px rgba(255, 107, 74, 0.35);
}

.feed-card__btn--red:hover {
  background: #FF8566;
  transform: translateY(-1px);
  box-shadow: 0 0 22px rgba(255, 107, 74, 0.5);
}

.feed-card__btn--secondary {
  background: #18191D;
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.18);
}

.feed-card__btn--secondary:hover {
  background: #23252B;
  border-color: #FF6B4A;
  color: #FFFFFF;
}

.feed-card__foot {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}

.feed-card__ref-note {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Mobile: Feed de cartas individual y fluido */
@media (max-width: 860px) {
  .cards-feed {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .feed-card {
    border-radius: 24px;
  }
}
</style>

