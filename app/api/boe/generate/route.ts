import { put, list } from "@vercel/blob";
import {
  fetchBoeSummary,
  classifyAndWriteArticles,
  buildBoeDay,
  getTodayMadrid,
} from "@/app/lib/boe";

export const maxDuration = 60;

export async function GET(request: Request) {
  // Verify cron secret (Vercel sends it automatically for cron jobs)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dateStr, fechaHumana } = getTodayMadrid();
  const blobPath = `boe/${dateStr}.json`;

  // Check if already generated today
  const existing = await list({ prefix: blobPath });
  if (existing.blobs.length > 0) {
    return Response.json({
      message: "Already generated",
      fecha: dateStr,
      url: existing.blobs[0].url,
    });
  }

  // Fetch BOE summary
  const items = await fetchBoeSummary(dateStr);

  if (items.length === 0) {
    // No BOE today (Sunday/holiday)
    const emptyDay = buildBoeDay(dateStr, fechaHumana, []);
    const blob = await put(blobPath, JSON.stringify(emptyDay), {
      contentType: "application/json",
      access: "public",
    });
    return Response.json({
      message: "No BOE published today",
      fecha: dateStr,
      url: blob.url,
    });
  }

  // Classify and write articles with Claude
  const articles = await classifyAndWriteArticles(items);
  const boeDay = buildBoeDay(dateStr, fechaHumana, articles);

  const blob = await put(blobPath, JSON.stringify(boeDay), {
    contentType: "application/json",
    access: "public",
  });

  return Response.json({
    message: "Generated successfully",
    fecha: dateStr,
    totalEntradas: articles.length,
    url: blob.url,
  });
}
