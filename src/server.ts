import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Cabeçalhos de segurança aplicados a todas as respostas do servidor.
// Não definimos frame-ancestors/X-Frame-Options para não quebrar o preview do Lovable.
//
// CSP: testada de verdade no navegador contra o build de produção antes de ir para o
// código. O TanStack Start injeta 2 <script> inline no HTML (restauração de scroll e
// o bootstrap de hidratação, que embute os dados da rota — por isso o conteúdo muda a
// cada página e não dá para travar por hash fixo). Essa versão não suporta nonce, então
// 'unsafe-inline' é necessário em script-src. O risco fica baixo porque o React escapa
// todo conteúdo vindo da planilha; não há HTML bruto de terceiros renderizado no site.
// O Framer Motion anima via atributo style="" inline (~24 elementos), daí o mesmo em
// style-src.
// - style-src/font-src liberam só os hosts reais usados (Google Fonts e Fontshare,
//   confirmados lendo o CSS deles: fonts.gstatic.com e cdn.fontshare.com).
// - img-src libera qualquer https, porque a planilha aceita imagem de qualquer link
//   https (Drive, ou qualquer outra origem que alguém cole na coluna "image").
const CSP =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline'; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com; " +
  "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com; " +
  "img-src 'self' https: data:; " +
  "connect-src 'self'; " +
  "object-src 'none'; " +
  "base-uri 'self'; " +
  "form-action 'self'";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=15552000",
  "Content-Security-Policy": CSP,
};

function withSecurityHeaders(response: Response): Response {
  // Respostas de fetch() podem ter headers imutáveis, então copiamos antes de alterar.
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    secured.headers.set(name, value);
  }
  return secured;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withSecurityHeaders(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return withSecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
