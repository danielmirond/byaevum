import Anthropic from "@anthropic-ai/sdk";

export interface BoeItem {
  identificador: string;
  titulo: string;
  seccion: string;
  departamento: string;
  urlHtml: string;
  urlPdf: string;
}

export interface BoeArticle {
  id: string;
  tituloOriginal: string;
  titular: string;
  resumen: string;
  area: string;
  departamento: string;
  seccion: string;
  urlBoe: string;
  urlPdf: string;
}

export interface BoeDay {
  fecha: string;
  fechaHumana: string;
  generadoEn: string;
  totalEntradas: number;
  categorias: Record<string, BoeArticle[]>;
}

const AREAS = [
  "sanidad",
  "impuestos",
  "trafico",
  "ayudas y subvenciones",
  "empleo publico",
  "medio ambiente",
  "educacion",
  "justicia",
  "defensa",
  "economia",
  "vivienda",
  "energia",
  "otros",
] as const;

function asArray<T>(x: T | T[]): T[] {
  return Array.isArray(x) ? x : [x];
}

export async function fetchBoeSummary(dateStr: string): Promise<BoeItem[]> {
  const url = `https://boe.es/datosabiertos/api/boe/sumario/${dateStr}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });

  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`BOE API error: ${res.status}`);

  const json = await res.json();
  const items: BoeItem[] = [];

  const sumario = json?.data?.sumario;
  if (!sumario) return [];

  for (const diario of asArray(sumario.diario)) {
    if (!diario.seccion) continue;
    for (const seccion of asArray(diario.seccion)) {
      const seccionNombre = seccion?.nombre || "";
      if (!seccion.departamento) continue;
      for (const depto of asArray(seccion.departamento)) {
        const deptoNombre = depto?.nombre || "";
        const epigrafes = depto.epigrafe
          ? asArray(depto.epigrafe)
          : [depto];
        for (const epigrafe of epigrafes) {
          if (!epigrafe.item) continue;
          for (const item of asArray(epigrafe.item)) {
            items.push({
              identificador: item.identificador || "",
              titulo: item.titulo || "",
              seccion: seccionNombre,
              departamento: deptoNombre,
              urlHtml: item.url_html
                ? `https://boe.es${item.url_html}`
                : "",
              urlPdf: item.url_pdf
                ? `https://boe.es${item.url_pdf}`
                : "",
            });
          }
        }
      }
    }
  }

  return items;
}

export async function classifyAndWriteArticles(
  items: BoeItem[]
): Promise<BoeArticle[]> {
  if (items.length === 0) return [];

  const client = new Anthropic();
  const BATCH_SIZE = 40;
  const allArticles: BoeArticle[] = [];

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const inputData = batch.map((it) => ({
      id: it.identificador,
      titulo: it.titulo,
      seccion: it.seccion,
      departamento: it.departamento,
    }));

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Eres un periodista especializado en legislación española. A continuación tienes disposiciones publicadas hoy en el BOE.

Para cada disposición:
1. Clasifica en UNA de estas categorías: ${AREAS.join(", ")}
2. Escribe un titular periodístico claro (max 120 caracteres)
3. Escribe un resumen de 2-3 párrafos explicando qué significa para los ciudadanos, en lenguaje sencillo y accesible

Disposiciones:
${JSON.stringify(inputData, null, 2)}

Responde SOLO con un array JSON válido, sin markdown ni explicaciones:
[{"id": "...", "area": "...", "titular": "...", "resumen": "..."}]`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) continue;

    const parsed: { id: string; area: string; titular: string; resumen: string }[] =
      JSON.parse(jsonMatch[0]);

    for (const p of parsed) {
      const original = batch.find((it) => it.identificador === p.id);
      if (!original) continue;
      allArticles.push({
        id: p.id,
        tituloOriginal: original.titulo,
        titular: p.titular,
        resumen: p.resumen,
        area: p.area,
        departamento: original.departamento,
        seccion: original.seccion,
        urlBoe: original.urlHtml,
        urlPdf: original.urlPdf,
      });
    }
  }

  return allArticles;
}

export function buildBoeDay(
  fecha: string,
  fechaHumana: string,
  articles: BoeArticle[]
): BoeDay {
  const categorias: Record<string, BoeArticle[]> = {};
  for (const art of articles) {
    const area = art.area.toLowerCase();
    if (!categorias[area]) categorias[area] = [];
    categorias[area].push(art);
  }
  return {
    fecha,
    fechaHumana,
    generadoEn: new Date().toISOString(),
    totalEntradas: articles.length,
    categorias,
  };
}

export function getTodayMadrid(): { dateStr: string; fechaHumana: string } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((p) => p.type === "year")!.value;
  const month = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  const dateStr = `${year}${month}${day}`;

  const fechaHumana = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  return { dateStr, fechaHumana };
}
