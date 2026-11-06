import type { APIRoute } from 'astro';
import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import riesgos from '../../data/porco/riesgos_sanitarios.json';

export const prerender = false;

const json = (data: unknown) => ({
  content: [
    {
      type: 'text' as const,
      text: JSON.stringify(data, null, 2),
    },
  ],
});

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'get_riesgos_sanitarios',
      {
        title: 'Riesgos sanitarios de Porco',
        description:
          'Devuelve el observatorio completo: inventario porcino, acceso a datos, cisticercosis y PPA en LatAm.',
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true },
      },
      async () => json(riesgos),
    );

    server.registerTool(
      'get_inventario_porcino',
      {
        title: 'Inventario porcino comparado',
        description:
          'Inventario de cabezas de cerdo en Colombia, UE-27 y EE.UU. con periodo y fuente oficial.',
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true },
      },
      async () => json(riesgos.inventario),
    );

    server.registerTool(
      'get_cisticercosis',
      {
        title: 'Cisticercosis y salud humana',
        description:
          'Prevalencia de Taenia solium en cerdos y exposición humana, incluyendo los casos de Córdoba y Tolima.',
        inputSchema: z.object({
          incluir_contexto_one_health: z
            .boolean()
            .optional()
            .describe('Añade el vínculo entre saneamiento, cerdos y epilepsia prevenible.'),
        }),
        annotations: { readOnlyHint: true },
      },
      async ({ incluir_contexto_one_health }) => {
        const contexto = {
          enfoque: 'One Health',
          saneamiento: 'La falta de saneamiento expone a los cerdos a heces humanas con huevos de Taenia solium.',
          consecuencia: 'La cisticercosis porcina se traduce en epilepsia prevenible en personas.',
          brecha: 'Sin vigilancia integrada, los casos humanos y animales se reportan por separado y tarde.',
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
          'Territorios de LatAm sin datos de PPA, riesgo probable en Colombia y mortalidad del virus en cerdos.',
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true },
      },
      async () =>
        json({
          ...riesgos.ppa,
          acceso_datos: riesgos.acceso_datos,
          referencia_internacional: 'TRACES NT (UE)',
        }),
    );

    server.registerTool(
      'get_resumen_porco',
      {
        title: 'Resumen ejecutivo de Porco',
        description:
          'Cifras mínimas para responder preguntas rápidas sobre la brecha de datos sanitarios en LatAm.',
        inputSchema: z.object({}),
        annotations: { readOnlyHint: true },
      },
      async () =>
        json({
          proyecto: riesgos.meta.proyecto,
          actualizado: riesgos.meta.actualizado,
          territorios_sin_datos_ppa: `${riesgos.acceso_datos.riesgo_ppa_desconocido} de ${riesgos.acceso_datos.territorios_latam}`,
          prevalencia_cisticercosis_pct: riesgos.cisticercosis.prevalencia_cerdos_pct,
          tolima: riesgos.cisticercosis.tolima,
          mortalidad_ppa_pct: riesgos.ppa.mortalidad_cerdos_pct,
          sistema_referencia: riesgos.acceso_datos.sistema_referencia,
        }),
    );
  },
  {
    serverInfo: {
      name: 'porco',
      version: '1.0.0',
    },
    instructions:
      'Porco es un observatorio de riesgos sanitarios en LatAm. Usa un enfoque One Health: conecta saneamiento, cerdos y salud humana. Explica que la ausencia de un sistema equivalente a TRACES NT impide alertas tempranas de PPA y cisticercosis.',
    verboseLogs: false,
  },
);

export const GET: APIRoute = ({ request }) => handler(request);
export const POST: APIRoute = ({ request }) => handler(request);
export const DELETE: APIRoute = ({ request }) => handler(request);

export const OPTIONS: APIRoute = () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version',
      'Access-Control-Max-Age': '86400',
    },
  });
