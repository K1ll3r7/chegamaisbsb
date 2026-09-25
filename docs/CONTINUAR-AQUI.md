# Chega Mais BSB: onde paramos e o que falta

Documento de passagem de bastão, escrito em 25/09/2026. Serve para você e para o Claude retomarem de outro computador sem perder contexto.

> **Para o Claude que vai ler isto:** leia o documento inteiro antes de mexer em qualquer coisa. Confira o estado real com `git status` e `git log --oneline -6`, porque este texto pode estar desatualizado.

## 1. O projeto em uma frase

Site da comunidade feminina **Chega Mais BSB** (Brasília) para divulgar o projeto e as experiências/eventos. As meninas cadastram os eventos numa **planilha do Google Sheets**, e o site lê essa planilha. Não existe painel administrativo.

- Planilha: `1os--AybmZh6xiclGfDtB5lqy2bPEQwDlrLDGwsQNQho` (aba `gid=0`, lida como CSV pelo endpoint `gviz`).
- Repositório (privado): `github.com/mxverst1-rbr/chega-mais-bsb`.
- Site publicado: o endereço antigo `chega-mais-bsb-mu.vercel.app` retorna **404 DEPLOYMENT_NOT_FOUND**. A URL atual precisa ser conferida no painel da Vercel.
- O projeto foi gerado no **Lovable** e sincroniza com o GitHub. Um push no `main` publica direto. Por isso todo o trabalho foi feito em um branch separado.

**Stack:** TanStack Start + TanStack Router (SSR), React 19, TypeScript, Vite 8, Tailwind 4, Shadcn UI, Framer Motion, Papaparse.

## 2. Estado atual do Git

- Branch de trabalho: **`melhorias-seguranca-usabilidade`** (4 commits sobre o `main`, todos **locais, sem push**).
- O `main` não foi alterado.
- Pasta no PC do trabalho: `C:\Dados\Desktop\Chega mais\chega-mais-bsb`.

```
142097b Fase 3: limpeza e documentacao
0fc5819 Fase 2: usabilidade e acessibilidade
3ff372e Fase 1: seguranca (Supabase, .env, dependencias e cabecalhos)
046acf6 Fase 0: eventos via loader, cache e validacao da planilha
599f959 Fix package lock   <- main
```

**Para levar isto para o computador de casa** é preciso enviar o branch ao GitHub (ainda não foi feito). Não é o `main`, então não publica pelo Lovable, mas confirme que o Lovable está sincronizando só o `main`:

```bash
git push -u origin melhorias-seguranca-usabilidade
```

Em casa:

```bash
git clone https://github.com/mxverst1-rbr/chega-mais-bsb
cd chega-mais-bsb
git checkout melhorias-seguranca-usabilidade
npm install
npm run dev
```

O site sobe em `http://localhost:8080`. O projeto não precisa de nenhuma variável de ambiente.

## 3. O que foi feito

### Análise inicial (problemas encontrados)
- Eventos passados continuavam "abertos" (o site só olhava o `status`, nunca a data).
- Ordenação errada (destaque antes de tudo, inclusive eventos velhos).
- Links da planilha usados sem validação (risco de `javascript:`).
- Eventos carregados só no navegador (HTML inicial vazio, sem SEO, título igual em todas as páginas).
- Sem cache; se o Google falhasse, o site mostrava lista vazia sem aviso.
- Supabase configurado mas não usado, `.env` versionado, `js-yaml` vulnerável.
- 404 e erro em inglês, `lang="en"`, imagens sem `alt` e pesadas.

### Fase 0: dados da planilha (`046acf6`)
Arquivo principal: `src/services/eventsService.ts`.
- Eventos com data anterior a hoje (fuso de Brasília) viram `encerrado` e somem das listas. O evento do dia ainda conta como atual.
- Ordenação: próximos primeiro (destaque antes, depois por data). Passados por último.
- Leitura da data em `DD/MM/AAAA` (aceita `9/8/2026`).
- Só links `https://` em `mapsUrl`, `formUrl` e `image`.
- `slug` vazio ou duplicado: a linha é ignorada, com aviso no log.
- `status`: só o valor exato `aberto` abre inscrições; qualquer outro vira `encerrado`.
- **Coluna opcional `publicar`:** se existir, só aparecem linhas com `SIM`. Se não existir, tudo aparece (compatível com a planilha de hoje).
- Cache de 60 s no servidor, com fallback para a última versão se o Google falhar.
- Rotas usam `loader` (SSR) em vez de `useEffect`. Cada evento tem título e OG próprios.
- `getUpcomingEvents()` alimenta `/experiencias`; `getActiveEvents()` alimenta a home.

### Fase 1: segurança (`3ff372e`)
- Removido o Supabase inteiro: `src/integrations/supabase/`, pasta `supabase/`, middleware no `src/start.ts` e a dependência `@supabase/supabase-js`. O banco em si **não foi tocado**.
- `.env` saiu do Git e entrou no `.gitignore`.
- `npm audit fix`: 0 vulnerabilidades.
- Cabeçalhos de segurança em `src/server.ts`: `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS e uma CSP mínima (`object-src`, `base-uri`, `form-action`).

### Fase 2: usabilidade e acessibilidade (`0fc5819`)
- `alt` descritivo, `loading="lazy"`, `decoding="async"`, dimensões e `fetchPriority` no hero.
- `community_group.jpg` e `workshop_table.jpg` comprimidas (cerca de 45% menores).
- Mensagem amigável quando não há eventos (home e `/experiencias`).
- "Inscrições em breve" quando o evento está `aberto` mas sem `formUrl`.
- Vagas exibidas como "20 vagas".
- Navbar: usa a rota do roteador, `aria-label`, links de texto escondidos no celular.
- `MotionConfig reducedMotion="user"`.
- 404, tela de erro e `lang` em português. Criado `public/placeholder.svg`.

### Fase 3: limpeza (`142097b`)
- Removido `src/data/events.ts` (dados fixos sem uso).
- README com as colunas da planilha, regras, cache, segurança e estrutura de pastas.

## 4. O que falta fazer

### A. Você precisa fazer (Google Sheets)
1. **Preencher os links das linhas de exemplo.** As 5 primeiras linhas (Cerâmica, Café & Pintura, Clube do Livro, Trilha, Degustação) têm `mapsUrl`, `formUrl` e `image` inválidos (texto `[link removed]` ou vazio). Sem `formUrl`, ninguém consegue se inscrever, e sem `image` aparece o placeholder.
2. **Apagar ou ocultar as linhas de teste:** `evento-max` ("Max Kart", "Teste do Max") e `babymetal` ("Show das Meninas", "Minha casa"). A data delas já passou, então hoje ficam escondidas, mas continuam na planilha.
3. **Validação na planilha:** menu suspenso para `status` (`aberto`/`encerrado`) e `category`; caixa de seleção para `featured`; data em formato fixo; regra que só aceita links `https`.
4. **Criar a coluna `publicar`** com menu suspenso `SIM`/`NÃO`. Depois de criada, só o que estiver `SIM` aparece no site. É o mecanismo de rascunho e aprovação.
5. **Restringir quem edita:** só quem cadastra tem permissão de edição, todos os outros ficam como leitor. Ligar o histórico de versões.
6. (Opcional) Um **Google Forms** que alimenta uma aba de rascunhos, para as meninas cadastrarem por formulário. Alguém revisa e copia para a aba pública.

### B. Depende de você decidir
1. **Publicar as mudanças:** conferir o site no navegador (`npm run dev`, tela cheia e celular). Se estiver bom, fazer o merge de `melhorias-seguranca-usabilidade` no `main`. Isso publica pelo Lovable.
2. **Descobrir a URL atual do site** na Vercel (o domínio antigo deu 404).
3. Se preferir, testar antes com `npm run build` e `npm run preview`.

### C. Pendências técnicas (Claude pode fazer)
1. **Testar o build de produção** (`npm run build`). Não foi rodado; só o `dev` foi testado. O target padrão do Nitro no template é Cloudflare, mas o site estava na Vercel, então vale confirmar como o deploy é feito.
2. **Verificar visualmente** home, `/experiencias` e a página de evento em desktop e celular. Nada disso foi visto em tela, porque o navegador embutido recusou o `localhost`. O que foi checado: `tsc` sem erros, ESLint sem problemas reais e páginas respondendo 200 com o HTML esperado.
3. **CSP completa.** Hoje só há uma CSP mínima. Uma política com `script-src`, `img-src` e `font-src` exige testar no navegador, porque o site usa Google Fonts, Fontshare, Drive e imagens de qualquer link `https` da planilha. Não colocar `frame-ancestors`/`X-Frame-Options` sem antes checar o preview do Lovable.
4. **`bun.lock`:** ainda lista o Supabase e o `js-yaml` vulnerável. Para regenerar, precisa do `bun` instalado (`bun install`). A dependência vulnerável é só de desenvolvimento. Decidir se o projeto usa `bun` ou `npm` e manter só um lockfile.
5. **Mais acessibilidade:** os cards de evento ainda não têm um landmark `<main>` nem "skip link". A página do evento repete a mesma imagem duas vezes.
6. **Imagens restantes:** `ana_lu.jpg`, `hannah.jpg`, `clara.jpg` ficam em cerca de 180-240 KB. Dá para converter tudo para WebP.
7. **Pasta `src/assets/*.asset.json`:** descritores do Lovable, sem uso no código. Remover só depois de confirmar que o editor do Lovable não precisa deles.
8. **Cache em produção:** o cache de 60 s vive na memória do processo. Em ambiente serverless cada instância tem o seu, o que é aceitável, mas dá para trocar por cache HTTP (`Cache-Control`) se quiser.

## 5. Cuidados e armadilhas

- **Nunca faça push no `main` sem conferir:** ele sincroniza com o Lovable e publica. O `AGENTS.md` pede para não reescrever o histórico (nada de force push, rebase ou amend em commits já enviados).
- **Aviso de CRLF do Git** ("LF will be replaced by CRLF"): é só configuração do Windows. O ESLint acusa milhares de erros de `prettier/prettier` por causa disso. Use `npx eslint src --quiet --rule "prettier/prettier: off"` para ver os problemas reais.
- Os arquivos `src/routeTree.gen.ts` e `src/components/ui/*` são gerados. Não editar à mão.
- `.env` está no `.gitignore` agora. Se o Lovable recriar um `.env` no Git, é sinal de que ele religou o Supabase.
- No computador do trabalho não havia `python`, `bun` nem `gh`. O `npm` funciona. A porta do dev server é **8080**.
- Ao alterar a planilha, o site pode levar até 1 minuto para refletir (cache).

## 6. Como testar rapidamente

```bash
npm run dev
npx tsc --noEmit
npx eslint src --quiet --rule "prettier/prettier: off" --ignore-pattern "src/components/ui/**"
```

Depois de subir o dev, confira:
- `/` e `/experiencias` mostram só eventos de hoje em diante.
- `/experiencias/<slug>` mostra o título do evento na aba. Um evento passado abre, mas com o botão desativado.
- Um `slug` inexistente mostra "Experiência não encontrada". Uma rota inexistente mostra a 404 em português.
- Resposta com cabeçalhos: `curl -sI http://localhost:8080/experiencias`.

## 7. Prompt sugerido para colar no Claude em casa

> Leia `docs/CONTINUAR-AQUI.md` neste repositório e confira o estado do Git. Estamos no branch `melhorias-seguranca-usabilidade`. Comece pelo item C.1 (rodar `npm run build` e conferir se passa) e depois me diga o que você recomenda fazer primeiro. Não faça push no `main`.
