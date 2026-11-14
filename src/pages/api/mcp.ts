import type { APIRoute } from 'astro';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { neon } from '@neondatabase/serverless';
import { z } from 'zod';
import riesgos from '../../data/porco/riesgos_sanitarios.json';
import { CITAS_IEEE } from '../../data/porco/citas';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version',
  'Access-Control-Max-Age': '86400',
} as const;

const json = (data: unknown) => ({
  content: [
    {
      type: 'text' as const,
      text: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
    },
  ],
});

const instrucciones =
  'Porco es un observatorio de evidencia, calidad de datos y auditoría sanitaria porcina en Colombia y la Región Andina con enfoque One Health. Muestra por qué sin datos limpios y auditados la IA no puede predecir riesgos biológicos. Conoce los registros del ICA (AnalítICA 2026: 241 episodios, 85% descartado PPC, 0% vigilancia de cisticercosis en granjas), el desfase del RIPS (congelado en 2021, cuenta atenciones no personas) y la discrepancia de Tuchín (442 vs 472). Cita siempre las fuentes oficiales y metodologías.';

function leerDatasetCsv(): string {
  try {
    const csvPath = path.resolve(process.cwd(), 'public/data/andina-porcinos.csv');
    return fs.readFileSync(csvPath, 'utf8');
  } catch {
    return 'id_observacion,pais,evento\nOBS-COL-001,Colombia,PPC';
  }
}

function leerDocumentoAndina(): string {
  try {
    const mdPath = path.resolve(process.cwd(), 'public/data/colombia-andina-sanidad.md');
    return fs.readFileSync(mdPath, 'utf8');
  } catch {
    return '# Evidencia Sanitaria Porco v0.0.2';
  }
}

function leerArchivoPublico(relPath: string, fallback: string): string {
  try {
    return fs.readFileSync(path.resolve(process.cwd(), relPath), 'utf8');
  } catch {
    return fallback;
  }
}

function crearServidor() {
  const server = new McpServer(
    { name: 'porco', version: '0.0.3.6' },
    { instructions: instrucciones },
  );

  server.registerTool(
    'get_riesgos_sanitarios',
    {
      title: 'Observatorio de Evidencia Porco (v0.0.3.6)',
      description:
        'Devuelve la estructura completa de Porco: tarjetas de auditoría, indicadores clave, inventario y referencias IEEE.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => json({ ...riesgos, citas_ieee: CITAS_IEEE }),
  );

  server.registerTool(
    'get_evidencia_ecuador',
    {
      title: 'Evidencia Sanitaria de Ecuador (CSV + Markdown + Citas IEEE)',
      description:
        'Devuelve los microdatos curados de Ecuador en CSV y el documento Markdown con citas IEEE verificadas (INEC ESPAC, ASPE, Agrocalidad PROZEC/PPA y estudios en Loja/El Oro).',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () =>
      json({
        pais: 'Ecuador',
        version: '0.0.3',
        csv: leerArchivoPublico('public/data/ecuador-sanidad.csv', ''),
        markdown: leerArchivoPublico('public/data/ecuador-sanidad.md', ''),
      }),
  );

  server.registerTool(
    'get_evidencia_peru',
    {
      title: 'Evidencia Sanitaria de Perú (CSV + Markdown)',
      description:
        'Devuelve los microdatos curados de Perú en CSV y el documento Markdown (MIDAGRI, SENASA PPC/camales, OMSA Res. 26 y estudios locales en Tumbes, Cusco y Piura).',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () =>
      json({
        pais: 'Perú',
        version: '0.0.3',
        csv: leerArchivoPublico('public/data/peru-sanidad.csv', ''),
        markdown: leerArchivoPublico('public/data/peru-sanidad.md', ''),
      }),
  );

  server.registerTool(
    'get_evidencia_colombia_csv',
    {
      title: 'Microdatos de Evidencia Colombia y Región Andina (CSV)',
      description:
        'Devuelve el dataset tabular curado en CSV con observaciones del ICA (AnalítICA 2026), Tuchín, Coyaima, RIPS y estatus OMSA de la Región Andina.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => json(leerDatasetCsv()),
  );

  server.registerTool(
    'get_documento_metodologia_andina',
    {
      title: 'Base de Conocimiento y Matriz Andina (Markdown)',
      description:
        'Devuelve el documento completo en Markdown con el análisis de enfermedades zoonóticas vs. exclusivas porcinas (PPC, PPA, PRRS, PEDv, Cisticercosis, Triquinelosis), análisis de AnalítICA y oportunidades B2B.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => json(leerDocumentoAndina()),
  );

  server.registerTool(
    'get_analitica_ica_2026',
    {
      title: 'Datos de Vigilancia ICA (AnalítICA 2026)',
      description:
        'Devuelve el resumen del tablero oficial AnalítICA: 241 episodios, 85% descartado PPC, cuadros respiratorios/digestivos, canales de notificación (propietario vs sensor) y la ausencia de cisticercosis predial.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () =>
      json({
        fuente: 'ICA - Tablero AnalítICA 2026',
        episodios_totales: 241,
        animales_afectados: 11000,
        diagnosticos_finales: {
          negativo_ppc: 205,
          en_proceso_cs: 26,
          en_proceso_respiratorio: 5,
          en_proceso_nervioso: 2,
          en_proceso_digestivo: 1,
          en_proceso_reproductivo: 1,
          negativo_brucelosis: 1,
        },
        notificaciones: {
          propietario: 112,
          sensor: 73,
          terceros: 50,
          vigilancia_activa: 5,
          vigilancia: 1,
        },
        cuadros_clinicos: {
          respiratorio_sistemico_pct: 61.0,
          digestivo_pct: 11.2,
          otros_pct: 27.8,
        },
        punto_ciego_documentado:
          'El ICA concentra esfuerzos en PPC y PPA. No realiza vigilancia activa predial de cisticercosis, dejando fuera al 78.4% de predios que son de traspatio informal.',
      }),
  );

  server.registerTool(
    'get_resumen_porco',
    {
      title: 'Resumen Ejecutivo de Auditoría y Discrepancias',
      description:
        'Cifras mínimas de discrepancias y calidad de datos para respuestas rápidas de agentes.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () =>
      json({
        proyecto: riesgos.meta.proyecto,
        version: riesgos.meta.version,
        actualizado: riesgos.meta.actualizado,
        enfoque: 'Calidad de datos y auditoría de fuentes para IA',
        rips_desfase: 'Metadatos 2026 pero datos congelados en 2021 (4 años de rezago)',
        rips_unidad: 'Registra atenciones médicas facturadas, no pacientes únicos ni prevalencia',
        tuchin_discrepancia: 'Abstract reporta n=442 evaluados pero calcula 46/472 (9.7%)',
        ica_analitica: '241 episodios; PPC 85% descartado; 0% vigilancia de cisticercosis predial',
        inventario_colombia: '10.67M cabezas, 189.198 predios (78.4% traspatio)',
      }),
  );

  server.registerTool(
    'search_docs',
    {
      title: 'Buscar en documentación y evidencia (.md)',
      description:
        'Busca fragmentos relevantes en los documentos Markdown indexados en Neon (búsqueda léxica en español sobre porco_docs_chunks).',
      inputSchema: {
        query: z.string().min(2).describe('Pregunta o términos clave a buscar'),
        archivo: z.string().optional().describe('Filtrar por nombre de archivo, ej. design.md'),
        pais: z.string().optional().describe('Filtrar por país, ej. col, ecu, per'),
        limit: z.number().int().min(1).max(10).default(5).describe('Máximo de resultados'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ query, archivo, pais, limit = 5 }) => {
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        return json({
          error: 'DATABASE_URL no configurada en el servidor.',
          sugerencia: 'Configura DATABASE_URL en .env o Vercel y ejecuta npm run db:init.',
        });
      }

      const sql = neon(dbUrl);
      const searchTerms = pais ? `${query} ${pais}` : query;
      const rows = archivo
        ? await sql`
            SELECT archivo, ruta_seccion, contenido,
                   ts_rank(tsv, plainto_tsquery('spanish', ${searchTerms})) AS score
            FROM porco_docs_chunks
            WHERE archivo = ${archivo}
              AND tsv @@ plainto_tsquery('spanish', ${searchTerms})
            ORDER BY score DESC
            LIMIT ${limit}
          `
        : await sql`
            SELECT archivo, ruta_seccion, contenido,
                   ts_rank(tsv, plainto_tsquery('spanish', ${searchTerms})) AS score
            FROM porco_docs_chunks
            WHERE tsv @@ plainto_tsquery('spanish', ${searchTerms})
            ORDER BY score DESC
            LIMIT ${limit}
          `;

      return json({
        query,
        pais: pais ?? null,
        total: rows.length,
        resultados: rows,
      });
    },
  );

  const PAISES_DATA = {
    col: {
      codigo: 'col',
      nombre: 'Colombia',
      traspatio_pct: 78.4,
      tecnificado_pct: 21.6,
      cabezas: '10.67M',
      predios: '189,198',
      estado_ppa: 'Libre de PPA (OMSA)',
      brecha_principal: 'RIPS congelado en 2021 y 0% vigilancia predial de cisticercosis documentada.',
      fortaleza_adoptable: 'AnalítICA 2026: tablero abierto de 241 episodios sanitarios georreferenciados.',
    },
    ecu: {
      codigo: 'ecu',
      nombre: 'Ecuador',
      traspatio_pct: 68.0,
      tecnificado_pct: 32.0,
      cabezas: '1.1M (ESPAC)',
      predios: 'N/D consolidado',
      estado_ppa: 'Libre de PPA (Agrocalidad)',
      brecha_principal: 'Subregistro en traspatio rural y dispersión entre INEC ESPAC y Agrocalidad.',
      fortaleza_adoptable: 'Programa PROZEC de erradicación de PPC con trazabilidad por zonas.',
    },
    per: {
      codigo: 'per',
      nombre: 'Perú',
      traspatio_pct: 72.0,
      tecnificado_pct: 28.0,
      cabezas: '3.2M',
      predios: 'N/D consolidado',
      estado_ppa: 'Libre de PPA (SENASA)',
      brecha_principal: 'Faenamiento informal sin inspección veterinaria en zonas rurales.',
      fortaleza_adoptable: '13 regiones internas declaradas libres de PPC por SENASA con control regional.',
    },
  } as const;

  server.registerTool(
    'get_pais',
    {
      title: 'Obtener evidencia unificada por país',
      description: 'Devuelve métricas, brecha sanitaria y fortaleza adoptable de un país (col, ecu, per).',
      inputSchema: {
        pais: z.enum(['col', 'ecu', 'per']).describe('Código de país: col, ecu o per'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ pais }) => json(PAISES_DATA[pais]),
  );

  server.registerTool(
    'comparar_paises',
    {
      title: 'Comparar dos países (Versus + Ecosistema Hispano)',
      description:
        'Compara métricas de traspatio, cobertura y fortalezas adoptables entre dos países.',
      inputSchema: {
        pais_a: z.enum(['col', 'ecu', 'per']).describe('Primer país'),
        pais_b: z.enum(['col', 'ecu', 'per']).describe('Segundo país'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ pais_a, pais_b }) => {
      const a = PAISES_DATA[pais_a];
      const b = PAISES_DATA[pais_b];
      return json({
        comparacion: [a, b],
        ecosistema_hispano: {
          de_a_para_b: `${a.nombre} aporta: ${a.fortaleza_adoptable}`,
          de_b_para_a: `${b.nombre} aporta: ${b.fortaleza_adoptable}`,
        },
      });
    },
  );

  return server;
}

async function manejar(request: Request) {
  const server = crearServidor();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);

  try {
    const respuesta = await transport.handleRequest(request);
    const headers = new Headers(respuesta.headers);

    for (const [clave, valor] of Object.entries(CORS)) {
      headers.set(clave, valor);
    }

    return new Response(respuesta.body, {
      status: respuesta.status,
      statusText: respuesta.statusText,
      headers,
    });
  } finally {
    void server.close();
  }
}

export const POST: APIRoute = ({ request }) => manejar(request);

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message:
          'Este servidor MCP es stateless. Usa POST para initialize, tools/list y tools/call.',
      },
      id: null,
    }),
    {
      status: 405,
      headers: {
        ...CORS,
        'Content-Type': 'application/json',
        Allow: 'POST, DELETE, OPTIONS',
      },
    },
  );

export const DELETE: APIRoute = () =>
  new Response(null, {
    status: 204,
    headers: { ...CORS, Allow: 'POST, DELETE, OPTIONS' },
  });

export const OPTIONS: APIRoute = () => new Response(null, { status: 204, headers: CORS });
