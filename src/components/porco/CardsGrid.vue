<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CardProblema from './CardProblema.vue';
import CardAmenaza from './CardAmenaza.vue';
import CardAccion from './CardAccion.vue';
import CardDesarrolladores from './CardDesarrolladores.vue';
import CiteModal from './CiteModal.vue';

type InventarioItem = {
  region: string;
  codigo: string;
  cabezas: number;
  millones: number;
  periodo: string;
  fuente: string;
  fuente_detalle?: string;
  cita_id?: number;
  color: string;
};

defineProps<{
  inventario: InventarioItem[];
  territorios: number;
  desconocidos: number;
  microcopyProblema: string;
  prevalencia: number;
  resto: number;
  microcopyAmenaza: string;
  siteUrl: string;
  promptAccion: string;
  comandoDevs: string;
}>();

const citaActiva = ref<number | null>(null);

function abrirCita(id: number) {
  citaActiva.value = id;
}

function cerrarCita() {
  citaActiva.value = null;
}

onMounted(() => {
  // Escuchar si desde la página principal u otro elemento se quiere abrir una cita
  window.addEventListener('porco:abrir-cita', ((e: CustomEvent<{ id: number }>) => {
    if (e.detail?.id) {
      abrirCita(e.detail.id);
    }
  }) as EventListener);
});
</script>

<template>
  <div class="cards-interactive-wrapper">
    <section class="grid" id="tarjetas" aria-label="Cuatro tarjetas de datos">
      <CardProblema
        :inventario="inventario"
        :territorios="territorios"
        :desconocidos="desconocidos"
        :microcopy="microcopyProblema"
        @abrir-cita="abrirCita"
      />

      <CardAmenaza
        :prevalencia="prevalencia"
        :resto="resto"
        :microcopy="microcopyAmenaza"
        @abrir-cita="abrirCita"
      />

      <CardAccion
        :site-url="siteUrl"
        :prompt-plantilla="promptAccion"
        @abrir-cita="abrirCita"
      />

      <CardDesarrolladores
        :comando="comandoDevs"
        :site-url="siteUrl"
      />
    </section>

    <!-- Modal emergente para detalles de cita IEEE -->
    <CiteModal
      :cita-id-activa="citaActiva"
      @cerrar="cerrarCita"
    />
  </div>
</template>

<style scoped>
.cards-interactive-wrapper {
  display: contents;
}
</style>
