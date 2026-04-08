"use client";

import { useState, useEffect } from "react";
import type { BoeDay, BoeArticle } from "@/app/lib/boe";

const AREA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  sanidad:                 { bg: "#e8f5e9", text: "#2e7d32", border: "#66bb6a" },
  impuestos:               { bg: "#fff3e0", text: "#e65100", border: "#ffa726" },
  trafico:                 { bg: "#e3f2fd", text: "#1565c0", border: "#42a5f5" },
  "ayudas y subvenciones": { bg: "#f3e5f5", text: "#7b1fa2", border: "#ab47bc" },
  "empleo publico":        { bg: "#e0f7fa", text: "#00695c", border: "#26a69a" },
  "medio ambiente":        { bg: "#e8f5e9", text: "#1b5e20", border: "#4caf50" },
  educacion:               { bg: "#e8eaf6", text: "#283593", border: "#5c6bc0" },
  justicia:                { bg: "#fce4ec", text: "#b71c1c", border: "#ef5350" },
  defensa:                 { bg: "#eceff1", text: "#37474f", border: "#78909c" },
  economia:                { bg: "#fff8e1", text: "#f57f17", border: "#ffca28" },
  vivienda:                { bg: "#fbe9e7", text: "#bf360c", border: "#ff7043" },
  energia:                 { bg: "#fffde7", text: "#f9a825", border: "#ffee58" },
  otros:                   { bg: "#f5f5f5", text: "#616161", border: "#bdbdbd" },
};

function getAreaColor(area: string) {
  return AREA_COLORS[area.toLowerCase()] || AREA_COLORS.otros;
}

function capitalizeFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function BoePage() {
  const [data, setData] = useState<BoeDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
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

        const res = await fetch(`/api/boe/${dateStr}`);
        if (!res.ok) {
          // Try yesterday
          const yesterday = new Date(now.getTime() - 86400000);
          const yParts = new Intl.DateTimeFormat("es-ES", {
            timeZone: "Europe/Madrid",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).formatToParts(yesterday);
          const yDateStr = `${yParts.find((p) => p.type === "year")!.value}${yParts.find((p) => p.type === "month")!.value}${yParts.find((p) => p.type === "day")!.value}`;
          const res2 = await fetch(`/api/boe/${yDateStr}`);
          if (!res2.ok) throw new Error("No hay datos disponibles");
          setData(await res2.json());
        } else {
          setData(await res.json());
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const areas = data ? Object.keys(data.categorias).sort() : [];
  const filteredAreas = selectedArea
    ? areas.filter((a) => a === selectedArea)
    : areas;

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; color: #1a1a1a; }
        .boe-header { background: linear-gradient(135deg, #1a237e, #283593); color: white; padding: 24px 16px; text-align: center; }
        .boe-header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
        .boe-header .fecha { font-size: 16px; opacity: 0.9; }
        .boe-header .count { font-size: 13px; opacity: 0.7; margin-top: 4px; }
        .filters { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px; justify-content: center; background: white; border-bottom: 1px solid #e0e0e0; }
        .filter-btn { padding: 6px 14px; border-radius: 20px; border: 1.5px solid #ccc; background: white; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s; }
        .filter-btn:hover { background: #f0f0f0; }
        .filter-btn.active { background: #1a237e; color: white; border-color: #1a237e; }
        .content { max-width: 800px; margin: 0 auto; padding: 16px; }
        .category { margin-bottom: 24px; }
        .category-title { font-size: 18px; font-weight: 700; margin-bottom: 12px; padding: 8px 16px; border-radius: 8px; display: flex; align-items: center; gap: 8px; }
        .category-count { font-size: 12px; font-weight: 400; opacity: 0.7; }
        .article { background: white; border-radius: 10px; padding: 16px; margin-bottom: 12px; border: 1px solid #e8e8e8; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .article-titular { font-size: 16px; font-weight: 700; color: #1a237e; margin-bottom: 8px; line-height: 1.3; }
        .article-depto { font-size: 12px; color: #666; margin-bottom: 8px; }
        .article-resumen { font-size: 14px; line-height: 1.6; color: #333; white-space: pre-line; }
        .article-links { margin-top: 12px; display: flex; gap: 12px; }
        .article-links a { font-size: 13px; color: #1a237e; text-decoration: none; font-weight: 500; }
        .article-links a:hover { text-decoration: underline; }
        .loading { text-align: center; padding: 60px 20px; color: #666; font-size: 16px; }
        .empty { text-align: center; padding: 60px 20px; color: #999; }
        .footer { text-align: center; padding: 24px; color: #999; font-size: 12px; border-top: 1px solid #eee; margin-top: 32px; }
        @media (max-width: 600px) {
          .boe-header h1 { font-size: 22px; }
          .content { padding: 12px; }
          .article { padding: 12px; }
        }
      `}</style>

      <div className="boe-header">
        <h1>BOE del Dia</h1>
        {data && (
          <>
            <div className="fecha">{data.fechaHumana}</div>
            <div className="count">
              {data.totalEntradas} disposiciones analizadas
            </div>
          </>
        )}
      </div>

      {loading && <div className="loading">Cargando resumen del BOE...</div>}
      {error && <div className="loading">{error}</div>}

      {data && data.totalEntradas === 0 && (
        <div className="empty">
          No se ha publicado BOE hoy (domingo o festivo).
        </div>
      )}

      {data && data.totalEntradas > 0 && (
        <>
          <div className="filters">
            <button
              className={`filter-btn ${selectedArea === null ? "active" : ""}`}
              onClick={() => setSelectedArea(null)}
            >
              Todas ({data.totalEntradas})
            </button>
            {areas.map((area) => {
              const color = getAreaColor(area);
              const isActive = selectedArea === area;
              return (
                <button
                  key={area}
                  className={`filter-btn ${isActive ? "active" : ""}`}
                  style={
                    isActive
                      ? {}
                      : { borderColor: color.border, color: color.text }
                  }
                  onClick={() =>
                    setSelectedArea(isActive ? null : area)
                  }
                >
                  {capitalizeFirst(area)} ({data.categorias[area].length})
                </button>
              );
            })}
          </div>

          <div className="content">
            {filteredAreas.map((area) => {
              const color = getAreaColor(area);
              const articles = data.categorias[area];
              return (
                <div key={area} className="category">
                  <div
                    className="category-title"
                    style={{
                      background: color.bg,
                      color: color.text,
                      borderLeft: `4px solid ${color.border}`,
                    }}
                  >
                    {capitalizeFirst(area)}
                    <span className="category-count">
                      {articles.length}{" "}
                      {articles.length === 1 ? "noticia" : "noticias"}
                    </span>
                  </div>
                  {articles.map((art: BoeArticle) => (
                    <div key={art.id} className="article">
                      <div className="article-titular">{art.titular}</div>
                      <div className="article-depto">{art.departamento}</div>
                      <div className="article-resumen">{art.resumen}</div>
                      <div className="article-links">
                        {art.urlBoe && (
                          <a
                            href={art.urlBoe}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver en BOE
                          </a>
                        )}
                        {art.urlPdf && (
                          <a
                            href={art.urlPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Descargar PDF
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="footer">
        Datos obtenidos del Boletin Oficial del Estado (boe.es). Resumenes
        generados con IA.
      </div>
    </>
  );
}
