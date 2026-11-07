import type { APIRoute } from 'astro';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { z } from 'zod';

export const prerender = false;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const;

const ETIQUETAS = [
  'claridad',
  'diseno',
  'velocidad',
  'datos',
  'mcp',
  'contenido',
  'otro',
] as const;

const ROLES = [
  'investigador',
  'productor',
  'periodista',
  'funcionario',
  'desarrollador',
  'docente',
  'otro',
] as const;

const esquema = z
  .object({
    rating: z
      .number()
      .int('La puntuación debe ser un número entero.')
      .min(1, 'La puntuación va de 1 a 5.')
      .max(5, 'La puntuación va de 1 a 5.'),
    improveTags: z.array(z.enum(ETIQUETAS)).max(7).default([]),
    improveText: z.string().trim().max(800).optional(),
    collaboration: z.enum(['si', 'tal_vez', 'no'], {
      message: 'Elige una opción de colaboración.',
    }),
    role: z.enum(ROLES, { message: 'Rol no válido.' }).optional(),
    email: z
      .string()
      .trim()
      .max(160)
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Correo inválido')
      .optional(),
    name: z.string().trim().max(80).optional(),
    page: z.string().trim().max(200).optional(),
    consent: z
      .boolean()
      .refine((valor) => valor === true, 'Necesitamos tu permiso para guardar la respuesta.'),
    website: z.string().max(0).optional(),
  })
  .refine((datos) => datos.collaboration === 'no' || Boolean(datos.email), {
    message: 'Déjanos un correo para poder responderte.',
    path: ['email'],
  });

let esquemaListo: Promise<unknown> | null = null;

function prepararEsquema(sql: NeonQueryFunction<false, false>) {
  if (!esquemaListo) {
    esquemaListo = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS porco_feedback (
          id BIGSERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
          improve_tags TEXT[] NOT NULL DEFAULT '{}',
          improve_text TEXT,
          collaboration TEXT NOT NULL CHECK (collaboration IN ('si', 'tal_vez', 'no')),
          role TEXT,
          email TEXT,
          name TEXT,
          page TEXT,
          consent BOOLEAN NOT NULL DEFAULT false,
          ip_hash TEXT,
          user_agent TEXT
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS porco_feedback_created_at_idx ON porco_feedback (created_at DESC)`;
    })().catch((error) => {
      esquemaListo = null;
      throw error;
    });
  }

  return esquemaListo;
}

async function hashIp(ip: string) {
  const datos = new TextEncoder().encode(`${ip}:${process.env.FEEDBACK_SALT ?? 'porco-salt'}`);
  const digest = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 40);
}

const responder = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request, url }) => {
  let crudo: unknown;

  try {
    crudo = await request.json();
  } catch {
    return responder({ ok: false, error: 'El cuerpo debe ser JSON válido.' }, 400);
  }

  const resultado = esquema.safeParse(crudo);

  if (!resultado.success) {
    const primerError = resultado.error.issues[0];
    return responder(
      {
        ok: false,
        error: primerError?.message ?? 'Revisa los datos del formulario.',
        campo: primerError?.path.join('.'),
      },
      400,
    );
  }

  const datos = resultado.data;

  // Honeypot: si un bot lo rellena, no guardamos nada y devolvemos éxito.
  if (datos.website) {
    return responder({ ok: true }, 201);
  }

  const connectionString = process.env.DATABASE_URL ?? import.meta.env.DATABASE_URL;

  if (!connectionString) {
    console.error('[feedback] Falta DATABASE_URL.');
    return responder(
      { ok: false, error: 'El formulario no está disponible en este entorno.' },
      503,
    );
  }

  const sql = neon(connectionString);

  try {
    await prepararEsquema(sql);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'desconocida';
    const ipHash = await hashIp(ip);

    const recientes = await sql`
      SELECT count(*)::int AS total
      FROM porco_feedback
      WHERE ip_hash = ${ipHash}
        AND created_at > now() - interval '10 minutes'
    `;

    if (Number(recientes[0]?.total ?? 0) >= 5) {
      return responder(
        { ok: false, error: 'Demasiados envíos seguidos. Inténtalo de nuevo en unos minutos.' },
        429,
      );
    }

    await sql`
      INSERT INTO porco_feedback (
        rating,
        improve_tags,
        improve_text,
        collaboration,
        role,
        email,
        name,
        page,
        consent,
        ip_hash,
        user_agent
      ) VALUES (
        ${datos.rating},
        ${datos.improveTags},
        ${datos.improveText ?? null},
        ${datos.collaboration},
        ${datos.role ?? null},
        ${datos.email ?? null},
        ${datos.name ?? null},
        ${datos.page ?? url.pathname},
        ${datos.consent},
        ${ipHash},
        ${request.headers.get('user-agent') ?? null}
      )
    `;

    return responder({ ok: true }, 201);
  } catch (error) {
    console.error('[feedback] Error al guardar:', error);
    return responder(
      { ok: false, error: 'No pudimos guardar tu respuesta. Inténtalo de nuevo.' },
      500,
    );
  }
};

export const OPTIONS: APIRoute = () => new Response(null, { status: 204, headers: CORS });
