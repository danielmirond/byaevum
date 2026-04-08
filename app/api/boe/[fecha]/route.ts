import { list } from "@vercel/blob";

export async function GET(
  _request: Request,
  { params }: { params: { fecha: string } }
) {
  const { fecha } = params;

  // Validate format YYYYMMDD
  if (!/^\d{8}$/.test(fecha)) {
    return Response.json(
      { error: "Formato de fecha inválido. Usar YYYYMMDD" },
      { status: 400 }
    );
  }

  const blobPath = `boe/${fecha}.json`;
  const result = await list({ prefix: blobPath });

  if (result.blobs.length === 0) {
    return Response.json(
      { error: "No hay datos para esta fecha" },
      { status: 404 }
    );
  }

  const blobUrl = result.blobs[0].url;
  const res = await fetch(blobUrl);
  const data = await res.json();

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
