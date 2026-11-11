import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'src/data/porco/riesgos_sanitarios.json');
const publicDir = resolve(root, 'public/data');

const data = JSON.parse(await readFile(source, 'utf8'));

const totalTerritorios = data.acceso_datos.territorios_evaluados ?? data.acceso_datos.territorios_latam ?? 40;

const sanidad = {
  proyecto: data.meta.proyecto,
  descripcion: data.meta.descripcion,
  actualizado: data.meta.actualizado,
  enfoque: data.meta.enfoque,
  indicadores: {
    territorios_evaluados: totalTerritorios,
    riesgo_ppa_desconocido: data.acceso_datos.riesgo_ppa_desconocido,
    prevalencia_cisticercosis_pct: data.cisticercosis.prevalencia_cerdos_pct,
    mortalidad_ppa_nota: data.ppa.mortalidad_nota,
  },
  inventario: data.inventario,
  prevalencias: {
    cisticercosis: data.cisticercosis,
    ppa: data.ppa,
  },
  fuentes: [...new Set(data.inventario.map((item) => item.fuente))],
};

await mkdir(publicDir, { recursive: true });
await writeFile(resolve(publicDir, 'riesgos_sanitarios.json'), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
await writeFile(resolve(publicDir, 'sanidad.json'), `${JSON.stringify(sanidad, null, 2)}\n`, 'utf8');

console.log('[porco] Datos sincronizados en public/data/');
