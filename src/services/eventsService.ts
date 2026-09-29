import { createServerFn } from "@tanstack/react-start";
import Papa from "papaparse";

// Tipagem baseada na planilha
export interface SheetEvent {
  slug: string;
  featured: boolean;
  status: "aberto" | "encerrado";
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  mapsUrl: string;
  formUrl: string;
  image: string;
  shortDescription: string;
  description: string;
  spots: string;
  price: string;
}

// URL da planilha publicada como CSV
// Link original: https://docs.google.com/spreadsheets/d/1os--AybmZh6xiclGfDtB5lqy2bPEQwDlrLDGwsQNQho/edit?usp=sharing
const GOOGLE_SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1os--AybmZh6xiclGfDtB5lqy2bPEQwDlrLDGwsQNQho/gviz/tq?tqx=out:csv";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

// Tempo em que a planilha fica em cache no servidor antes de ser buscada de novo
const CACHE_TTL_MS = 60_000;

// Aceita apenas links https. Bloqueia javascript:, data:, http: e valores inválidos.
function safeHttpsUrl(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

// Aceita nome de arquivo local (/public/imagens), caminho local, link do Drive ou URL https direta.
function formatImageUrl(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return PLACEHOLDER_IMAGE;

  // Apenas o nome do arquivo (ex: "brenda.jpg") aponta para /public/imagens
  if (/^[\w.-]+$/.test(raw)) return `/imagens/${raw}`;

  // Caminho local absoluto do próprio site (mas não "//host", que é URL externa)
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;

  // Links do Google Drive viram links diretos de imagem
  const driveMatch = raw.match(/\/(?:d|file\/d)\/([a-zA-Z0-9_-]+)/);
  if (driveMatch?.[1] && raw.includes("drive.google.com")) {
    return `https://lh3.googleusercontent.com/u/0/d/${driveMatch[1]}`;
  }

  return safeHttpsUrl(raw) || PLACEHOLDER_IMAGE;
}

// Linha bruta do CSV: todas as colunas chegam como texto e podem faltar
type SheetRow = Partial<Record<"slug" | "featured" | "status" | "title" | "category" | "date" | "time" | "location" | "mapsUrl" | "formUrl" | "image" | "shortDescription" | "description" | "spots" | "price" | "publicar", string>>;

function parseCsv(csvText: string): SheetEvent[] {
  const results = Papa.parse<SheetRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  // Se a planilha tiver a coluna "publicar", só aparecem as linhas com SIM.
  // Sem a coluna, todas as linhas são publicadas (comportamento anterior).
  const hasPublishColumn = (results.meta.fields ?? []).includes("publicar");
  const seen = new Set<string>();
  const events: SheetEvent[] = [];

  for (const row of results.data) {
    if (hasPublishColumn) {
      const publish = String(row.publicar ?? "").trim().toLowerCase();
      if (publish !== "sim" && publish !== "true") continue;
    }

    const slug = String(row.slug ?? "").trim();
    if (!slug) {
      console.warn("[eventos] linha ignorada: slug vazio", row.title);
      continue;
    }
    if (seen.has(slug)) {
      console.warn(`[eventos] linha ignorada: slug duplicado "${slug}"`);
      continue;
    }
    seen.add(slug);

    events.push({
      slug,
      featured: String(row.featured ?? "").trim().toLowerCase() === "true",
      // Só "aberto" abre inscrições; qualquer outro valor (inclusive erro de digitação) encerra
      status: String(row.status ?? "").trim().toLowerCase() === "aberto" ? "aberto" : "encerrado",
      title: (row.title ?? "").trim(),
      category: (row.category ?? "").trim(),
      date: (row.date ?? "").trim(),
      time: (row.time ?? "").trim(),
      location: (row.location ?? "").trim(),
      mapsUrl: safeHttpsUrl(row.mapsUrl),
      formUrl: safeHttpsUrl(row.formUrl),
      image: formatImageUrl(row.image),
      shortDescription: (row.shortDescription ?? "").trim(),
      description: (row.description ?? "").trim(),
      spots: (row.spots ?? "").trim(),
      price: (row.price ?? "").trim(),
    });
  }

  return events;
}

let cache: { events: SheetEvent[]; at: number } | undefined;

// Busca a planilha no servidor, com cache. Se o Google falhar, devolve a última
// versão em cache; sem cache, lança o erro para a página mostrar a tela de erro.
export const fetchEventsFromSheets = createServerFn({ method: "GET" }).handler(
  async (): Promise<SheetEvent[]> => {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.events;

    try {
      const response = await fetch(GOOGLE_SHEETS_CSV_URL);
      if (!response.ok) throw new Error(`Falha ao buscar a planilha (HTTP ${response.status})`);
      const events = parseCsv(await response.text());
      cache = { events, at: Date.now() };
      return events;
    } catch (error) {
      console.error("[eventos] erro ao buscar a planilha:", error);
      if (cache) return cache.events;
      throw error;
    }
  },
);

// Converte "DD/MM/YYYY" (aceita "9/8/2026") em um número YYYYMMDD comparável.
// Retorna null quando a data é inválida.
function dateKey(d: string): number | null {
  const m = d.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  return Number(m[3]) * 10000 + Number(m[2]) * 100 + Number(m[1]);
}

// Data de hoje em Brasília, no mesmo formato YYYYMMDD
function todayKey(): number {
  const iso = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  return Number(iso.replace(/-/g, ""));
}

// Evento cuja data já passou (o próprio dia do evento ainda conta como atual)
function isPast(e: SheetEvent, today: number) {
  const key = dateKey(e.date);
  return key !== null && key < today;
}

// Todos os eventos, com eventos passados forçados a "encerrado".
// Ordenação: próximos primeiro (destaque antes, depois por data),
// eventos passados por último, do mais recente ao mais antigo.
export async function getEvents() {
  const today = todayKey();
  const events = (await fetchEventsFromSheets()).map((e) =>
    isPast(e, today) ? { ...e, status: "encerrado" as const } : e,
  );

  const upcoming = events.filter((e) => !isPast(e, today));
  const past = events.filter((e) => isPast(e, today));

  const byDate = (a: SheetEvent, b: SheetEvent) =>
    (dateKey(a.date) ?? Infinity) - (dateKey(b.date) ?? Infinity);

  upcoming.sort((a, b) => Number(b.featured) - Number(a.featured) || byDate(a, b));
  past.sort((a, b) => byDate(b, a));

  return [...upcoming, ...past];
}

// Eventos futuros (inclui hoje), abertos ou encerrados manualmente
export async function getUpcomingEvents() {
  const today = todayKey();
  const events = await getEvents();
  return events.filter((e) => !isPast(e, today));
}

// Eventos futuros com inscrições abertas
export async function getActiveEvents() {
  const events = await getEvents();
  return events.filter((e) => e.status === "aberto");
}

export async function getEventBySlug(slug: string) {
  const events = await getEvents();
  return events.find((e) => e.slug === slug);
}
