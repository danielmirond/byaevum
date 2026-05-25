'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, MapPin, Anchor, DollarSign, AlertCircle } from 'lucide-react'

export interface LocalityPageProps {
  coast: string
  province: string
  locality: string
  slug: string
  description: string
  beaches: Array<{
    name: string
    distance: string
    type?: string
    description: string
  }>
  moorings: Array<{
    name: string
    depth: string | number
    protection: string
    description: string
  }>
  pricing: {
    small: { min: number; max: number }
    medium: { min: number; max: number }
    captain: { min: number; max: number }
  }
  regulations: string[]
  bestSeason: string
  insiderTip: string
  faq: Array<{
    question: string
    answer: string
  }>
  googleTrendsVolume: number
  samboatAwinUrl: string
  samboatDeeplink: string
  images: {
    hero: {
      unsplashUrl: string
      alt: string
    }
  }
}

export default function BoatRentalLocalityPage(props: LocalityPageProps) {
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null)

  const toggleFaq = (id: number) => {
    setExpandedFaqId(expandedFaqId === id ? null : id)
  }

  return (
    <article className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section
        className="relative py-16 px-4 md:py-24 overflow-hidden"
        style={{
          backgroundImage: `url('${props.images.hero.unsplashUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/75 via-blue-400/75 to-cyan-400/75" />

        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-white">
          <div className="mb-4 flex items-center gap-2 text-blue-100">
            <MapPin className="w-4 h-4" />
            <span>{props.coast} • {props.province}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Alquila Barcos en {props.locality}
          </h1>
          <p className="text-lg text-blue-50 mb-6 max-w-2xl leading-relaxed">
            {props.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={props.samboatAwinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explorar Ofertas en SamBoat
            </a>
            <button
              onClick={() => document.getElementById('s-barcos-faq')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Preguntas Frecuentes
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT CONTAINER */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* BEACHES SECTION */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-blue-500"></div>
            <h2 className="text-3xl font-bold text-gray-900">
              Playas Accesibles en Barco
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            Descubre las calas y playas más hermosas de {props.locality}, accesibles únicamente por mar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {props.beaches.map((beach, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{beach.name}</h3>
                    <p className="text-sm text-gray-500">{beach.distance}</p>
                  </div>
                  {beach.type && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {beach.type}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{beach.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MOORINGS SECTION */}
        <section className="mb-16 bg-gray-50 -mx-4 px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Anchor className="w-6 h-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                Fondeos Recomendados
              </h2>
            </div>
            <p className="text-gray-600 mb-8">
              Lugares seguros y protegidos para fondear tu barco en {props.locality}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {props.moorings.map((mooring, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <h3 className="font-bold text-lg text-gray-900 mb-3">
                    {mooring.name}
                  </h3>
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profundidad:</span>
                      <span className="font-semibold text-gray-900">{mooring.depth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Protección:</span>
                      <span className="font-semibold text-gray-900">{mooring.protection}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{mooring.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Precios en {props.locality}
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            Rango de precios aproximados por tipo de embarcación (varían según temporada y proveedor).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Tipo de Barco</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Rango de Precios</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-600 text-sm">Nota</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Barco &lt;5.5m (sin patrón)
                  </td>
                  <td className="px-6 py-4 text-green-600 font-bold">
                    €{props.pricing.small.min} - €{props.pricing.small.max}/día
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">Requiere licencia</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Barco 5.5-8m (sin patrón)
                  </td>
                  <td className="px-6 py-4 text-green-600 font-bold">
                    €{props.pricing.medium.min} - €{props.pricing.medium.max}/día
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">Requiere certificado</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Con Patrón Incluido
                  </td>
                  <td className="px-6 py-4 text-green-600 font-bold">
                    €{props.pricing.captain.min} - €{props.pricing.captain.max}/día
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">Sin requisitos</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 text-sm mt-6 p-4 bg-blue-50 rounded">
            💡 <strong>Consejo:</strong> Los precios son orientativos. Consulta las ofertas actuales en SamBoat para obtener tarifas exactas según fechas y disponibilidad.
          </p>
        </section>

        {/* REGULATIONS SECTION */}
        <section className="mb-16 bg-amber-50 -mx-4 px-4 py-12 border-l-4 border-amber-400">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                Legislación y Normativa Local
              </h2>
            </div>
            <p className="text-gray-700 mb-6">
              Es importante conocer las restricciones y regulaciones específicas de {props.locality}:
            </p>
            <ul className="space-y-3">
              {props.regulations.map((reg, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 text-gray-700"
                >
                  <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
                  <span>{reg}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 text-sm mt-6 pt-6 border-t border-amber-200">
              <strong>Mejor época para alquilar:</strong> {props.bestSeason}
            </p>
          </div>
        </section>

        {/* INSIDER TIP */}
        <section className="mb-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 border border-purple-200">
          <h3 className="text-xl font-bold text-purple-900 mb-3">💎 Consejo de Insider</h3>
          <p className="text-purple-800">{props.insiderTip}</p>
        </section>

        {/* FAQ SECTION */}
        <section id="s-barcos-faq" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-blue-500"></div>
            <h2 className="text-3xl font-bold text-gray-900">
              Preguntas Frecuentes
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            Respuestas a las dudas más comunes sobre alquilar barcos en {props.locality}.
          </p>
          <div className="space-y-3">
            {props.faq.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                >
                  <h3 className="font-semibold text-gray-900">{item.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedFaqId === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaqId === idx && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-blue-600 text-white rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Comienza tu Aventura en {props.locality}
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Explora cientos de ofertas de alquiler de barcos verificadas. Reserva seguro con SamBoat.
          </p>
          <a
            href={props.samboatAwinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Ver Barcos Disponibles en {props.locality}
          </a>
          <p className="text-blue-200 text-sm mt-6">
            Afiliado con SamBoat • Comisiones sin costo adicional para ti
          </p>
        </section>

        {/* SCHEMA.ORG MARKUP */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `Alquila Barcos en ${props.locality}`,
              description: props.description,
              url: `https://playasdeespana.es/alquiler-barco/costas/${props.coast.toLowerCase().replace(/\s+/g, '-')}/provincias/${props.province.toLowerCase()}/`,
              breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://playasdeespana.es',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Alquiler Barcos',
                    item: 'https://playasdeespana.es/alquiler-barco',
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: props.coast,
                    item: `https://playasdeespana.es/alquiler-barco/costas/${props.coast.toLowerCase().replace(/\s+/g, '-')}/`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 4,
                    name: props.locality,
                  },
                ],
              },
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'EUR',
                lowPrice: Math.min(
                  props.pricing.small.min,
                  props.pricing.medium.min,
                  props.pricing.captain.min
                ),
                highPrice: Math.max(
                  props.pricing.small.max,
                  props.pricing.medium.max,
                  props.pricing.captain.max
                ),
              },
              mainEntity: {
                '@type': 'FAQPage',
                mainEntity: props.faq.map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                  },
                })),
              },
            }),
          }}
        />
      </div>
    </article>
  )
}
