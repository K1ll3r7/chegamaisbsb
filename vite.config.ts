// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Sem isso, o preset da Vercel detecta a versao do Node da maquina que roda o build
  // (ex: nodejs24.x) em vez de uma versao com suporte garantido na Vercel.
  // `as any`: a tipagem do wrapper so expoe preset/output/cloudflare de proposito
  // (opcao "vercel" nao é tipada, mas o Nitro aceita normalmente em tempo de execucao).
  nitro: {
    vercel: { functions: { runtime: "nodejs22.x" } },
  } as any,
});
