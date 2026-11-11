import type { APIRoute } from 'astro';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { z } from 'zod';
import riesgos from '../../data/porco/riesgos_sanitarios.json';
import { CITAS_IEEE } from '../../data/porco/citas';

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
      text: JSON.stringify(data, null, 2),
    },
  ],
});

const instrucciones =
  'Porco es un observatorio de riesgos sanitarios en LatAm con enfoque One Health. Conecta saneamiento, cerdos y salud humana. Ten rigor con las citas: 24 de 40 territorios evaluados en ALyC tienen riesgo de introducción de PPA clasificado como desconocido por datos insuficientes (Castillo et al., 2025). La mortalidad por PPA puede alcanzar 100% en formas agudas (WOAH). Las cifras de cisticercosis (9.7% en Tuchín, 14% y 8.5% en Coyaima) son estimaciones locales, no nacionales ni regionales. La neurocisticercosis por Taenia solium es causa importante y prevenible de epilepsia.';

function crearServidor() {
  const server = new McpServer(
    { name: 'porco', version: '1.2.0' },
    { instructions: instrucciones },
  );

  server.registerTool(
    'get_riesgos_sanitarios',
    {
      title: 'Riesgos sanitarios de Porco',
      description:
        'Devuelve el observatorio completo: inventario porcino, acceso a datos, cisticercosis, PPA y referencias bibliográficas IEEE.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => json({ ...riesgos, citas_ieee: CITAS_IEEE }),
  );

  server.registerTool(
    'get_inventario_porcino',
    {
      title: 'Inventario porcino comparado',
      description:
        'Inventario de cabezas de cerdo en Colombia (2024), UE-27 (2025) y EE.UU. (septiembre 2026) con periodo y fuente oficial.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => json(riesgos.inventario),
  );

  server.registerTool(
    'get_cisticercosis',
    {
      title: 'Cisticercosis y salud humana',
      description:
        'Prevalencia local de Taenia solium en cerdos y exposición humana (Tuchín 2021/2024 y Coyaima 2025), ciclo biológico y epilepsia.',
      inputSchema: {
        incluir_contexto_one_health: z
          .boolean()
          .optional()
          .describe('Añade la explicación biológica completa del ciclo de Taenia solium y neurocisticercosis.'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ incluir_contexto_one_health }) => {
      const contexto = {
        enfoque: 'One Health',
        ciclo_biologico:
          'Huevos de T. solium en heces humanas → cerdos con cisticercosis → consumo de carne de cerdo poco cocida → teniasis humana; la cisticercosis humana ocurre por ingesta accidental de huevos.',
        consecuencia: 'La neurocisticercosis por Taenia solium es una causa importante y prevenible de epilepsia.',
        alcance: 'Las cifras corresponden a estudios locales en Tuchín (Córdoba) y Coyaima (Tolima), no a promedios nacionales.',
      };

      return json({
        ...riesgos.cisticercosis,
        ...(incluir_contexto_one_health ? { contexto_one_health: contexto } : {}),
      });
    },
  );

  server.registerTool(
    'get_estado_ppa',
    {
      title: 'Estado de la Peste Porcina Africana',
      description:
        'Riesgo de introducción clasificado como desconocido en 24 de 40 territorios evaluados en ALyC por datos insuficientes, riesgo en Colombia y mortalidad según WOAH.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () =>
      json({
        ...riesgos.ppa,
        acceso_datos: riesgos.acceso_datos,
        referencia_internacional: 'TRACES NT (UE)',
        fuente_estudio: 'Castillo et al., Front. Vet. Sci. 2025',
        fuente_mortalidad: 'WOAH Factsheet 2024',
      }),
  );

  server.registerTool(
    'get_resumen_porco',
    {
      title: 'Resumen ejecutivo de Porco',
      description:
        'Cifras mínimas verificadas para responder preguntas rápidas sobre la brecha de datos sanitarios en LatAm.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () =>
      json({
        proyecto: riesgos.meta.proyecto,
        actualizado: riesgos.meta.actualizado,
        territorios_evaluados: '40 territorios en América Latina y el Caribe',
        riesgo_desconocido_ppa: '24 de 40 territorios con riesgo clasificado como desconocido por datos insuficientes',
        cisticercosis_local: '9.7% en cerdos (Tuchín, Córdoba, 2021); 14% cerdos y 8.5% humanos en Coyaima, Tolima (2025)',
        mortalidad_ppa: 'Puede alcanzar el 100% en formas agudas (WOAH)',
        sistema_referencia: 'TRACES NT (UE)',
      }),
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
          'Este servidor MCP es stateless. Usa POST para initialize, tools/list y tools/call. GET solo se usa para streams SSE con sesión.',
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
