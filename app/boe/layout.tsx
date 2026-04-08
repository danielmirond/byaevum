import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BOE del día — Resumen del Boletín Oficial del Estado",
  description:
    "Resumen diario del Boletín Oficial del Estado en lenguaje sencillo, organizado por categorías: sanidad, impuestos, ayudas, empleo público y más.",
};

export default function BoeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
