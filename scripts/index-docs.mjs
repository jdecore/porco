import fs from 'node:fs';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import { chunkMarkdown, createNeonStore } from '../../brain/tools/vita/src/neon-store.mjs';

const DOCS = ['README.md', 'design.md', 'public/data/colombia-andina-sanidad.md'];

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('Falta DATABASE_URL en el entorno.');
    process.exit(1);
  }

  const sql = neon(dbUrl);
  const store = createNeonStore(sql);

  let totalChunks = 0;
  for (const relPath of DOCS) {
    const fullPath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) continue;
    const text = fs.readFileSync(fullPath, 'utf8');
    const chunks = chunkMarkdown(text, relPath);
    const count = await store.upsertChunks(chunks);
    totalChunks += count;
    console.log(`[vita] ${relPath}: ${count} fragmentos procesados`);
  }

  console.log(`[vita] Indexación completa (${totalChunks} fragmentos).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
