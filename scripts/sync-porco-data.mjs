import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'src/data/porco/riesgos_sanitarios.json');
const publicDir = resolve(root, 'public/data');

const data = JSON.parse(await readFile(source, 'utf8'));

const sanidad = {
  proyecto: data.meta.proyecto,
  version: data.meta.version,
  descripcion: data.meta.descripcion,
  actualizado: data.meta.actualizado,
  enfoque: data.meta.enfoque,
  indicadores: data.indicadores_clave,
  inventario: data.inventario,
  tarjetas_feed: data.tarjetas_feed,
  csv_descarga: data.meta.csv_descarga,
  documento_metodologia: data.meta.documento_metodologia,
  fuentes: ['ICA (AnalítICA)', 'MinSalud (RIPS)', 'OMSA / WAHIS', 'PubMed / PMC', 'Eurostat', 'USDA NASS'],
};

await mkdir(publicDir, { recursive: true });
await writeFile(resolve(publicDir, 'riesgos_sanitarios.json'), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
await writeFile(resolve(publicDir, 'sanidad.json'), `${JSON.stringify(sanidad, null, 2)}\n`, 'utf8');

console.log('[porco] Datos sincronizados en public/data/');
