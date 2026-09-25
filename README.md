# Chega Mais BSB 💜

Plataforma oficial do Chega Mais BSB, uma comunidade criada para conectar mulheres através de experiências presenciais, novas amizades e momentos significativos em Brasília.

## Sobre o projeto

O Chega Mais nasceu da ideia simples de que ninguém deveria precisar viver tudo sozinha.

O site permite que participantes descubram novas experiências, conheçam a comunidade e realizem inscrições para eventos de forma simples e intuitiva.

## Funcionalidades

- Página inicial institucional
- Listagem de experiências e eventos
- Página individual para cada experiência
- Integração com Google Forms para inscrições
- Integração com Google Sheets para gerenciamento de eventos
- Links diretos para localização via Google Maps
- Layout responsivo para desktop e mobile

## Gerenciamento de experiências

Todos os eventos e experiências são gerenciados através de uma planilha Google Sheets.

Ao adicionar uma nova linha na planilha:

- A experiência aparece automaticamente na página inicial
- A experiência aparece na página de eventos
- Uma página individual é criada automaticamente
- Os links de inscrição e localização são atualizados

Nenhuma alteração de código é necessária. A planilha é lida pelo servidor e fica em cache por até 1 minuto, então uma alteração pode levar cerca de 1 minuto para aparecer no site.

### Colunas da planilha

| Coluna | Como preencher |
| --- | --- |
| `publicar` | (opcional) `SIM` para aparecer no site. Se a coluna existir, linhas sem `SIM` ficam ocultas, o que serve como rascunho. Se a coluna não existir, todas as linhas aparecem. |
| `slug` | Identificador único do evento na URL, em minúsculas e sem espaços (ex: `cafe-e-pintura`). Linhas com `slug` vazio ou repetido são ignoradas. |
| `featured` | `TRUE` para destacar o evento. |
| `status` | `aberto` ou `encerrado`. Qualquer outro valor é tratado como `encerrado`. |
| `title`, `category`, `time`, `location` | Texto livre. |
| `date` | Formato `DD/MM/AAAA`. Eventos com data anterior a hoje são encerrados e escondidos das listas automaticamente. |
| `mapsUrl`, `formUrl` | Links começando com `https://`. Outros valores são ignorados. Sem `formUrl`, o botão mostra "Inscrições em breve". |
| `image` | Nome de um arquivo em `public/imagens` (ex: `brenda.jpg`), ou link `https://` da imagem, ou link de arquivo do Google Drive compartilhado como "qualquer pessoa com o link". Sem imagem, usa um placeholder. |
| `shortDescription`, `description` | Texto exibido nos cards e na página do evento. |
| `spots` | Número de vagas (ex: `20` aparece como "20 vagas") ou texto livre. |

### Segurança

- Só links `https://` são aceitos nos campos de link e imagem.
- Restrinja quem pode **editar** a planilha, e deixe o resto como leitor.
- Nenhuma chave secreta é usada. O projeto não tem variáveis de ambiente obrigatórias.

## Tecnologias utilizadas

- React 19 e TypeScript
- TanStack Start / TanStack Router (renderização no servidor)
- Vite
- Tailwind CSS
- Shadcn UI
- Framer Motion
- Google Sheets (CMS)
- Google Forms

## Estrutura do projeto

```bash
src/
├── components/     # layout (Navbar) e componentes de UI (shadcn)
├── routes/         # páginas: / , /experiencias e /experiencias/$slug
├── services/       # eventsService.ts: leitura, validação e cache da planilha
├── hooks/
├── lib/            # utilitários e páginas de erro
├── server.ts       # entrada do servidor (cabeçalhos de segurança, tratamento de erros)
└── start.ts        # middlewares do TanStack Start
public/
└── imagens/        # fotos usadas no site e na coluna `image` da planilha
```

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Objetivo

Criar um espaço digital acolhedor onde mulheres possam descobrir novas experiências, construir conexões reais e encontrar uma comunidade que as receba exatamente como são.

## Missão

Promover encontros que gerem conexões genuínas, novas amizades e experiências significativas para mulheres em Brasília.

## Visão

Ser a principal comunidade feminina de experiências presenciais e conexão humana do Distrito Federal.

## Valores

- Acolhimento
- Respeito
- Pertencimento
- Coragem para experimentar
- Conexões reais

---

© 2026 Chega Mais BSB.
Todos os direitos reservados.