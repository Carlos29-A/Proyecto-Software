"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EffortMultipliersProps {
  onMultipliersChange: (multipliers: Record<string, string>) => void
  initialValues?: Record<string, string>
}

export function EffortMultipliers({ onMultipliersChange, initialValues = {} }: EffortMultipliersProps) {
  const multiplierCategories = [
    {
      category: "Producto",
      multipliers: [
        {
          id: "RELY",
          name: "Confiabilidad Requerida",
          values: {
            vl: { label: "Muy Bajo", value: 0.82, desc: "Efecto bajo si falla" },
            l: { label: "Bajo", value: 0.92, desc: "Pérdidas bajas" },
            n: { label: "Nominal", value: 1.0, desc: "Pérdidas moderadas" },
            h: { label: "Alto", value: 1.1, desc: "Pérdidas altas" },
            vh: { label: "Muy Alto", value: 1.26, desc: "Riesgo de vida" },
          },
        },
        {
          id: "DATA",
          name: "Tamaño de Base de Datos",
          values: {
            l: { label: "Bajo", value: 0.9, desc: "DB/Programa < 10" },
            n: { label: "Nominal", value: 1.0, desc: "10 ≤ DB/Programa < 100" },
            h: { label: "Alto", value: 1.14, desc: "100 ≤ DB/Programa < 1000" },
            vh: { label: "Muy Alto", value: 1.28, desc: "DB/Programa ≥ 1000" },
          },
        },
        {
          id: "CPLX",
          name: "Complejidad del Producto",
          values: {
            vl: { label: "Muy Bajo", value: 0.73, desc: "Principalmente E/S" },
            l: { label: "Bajo", value: 0.87, desc: "Evaluación simple" },
            n: { label: "Nominal", value: 1.0, desc: "Módulos estándar" },
            h: { label: "Alto", value: 1.17, desc: "Operaciones complejas" },
            vh: { label: "Muy Alto", value: 1.34, desc: "Algoritmos complejos" },
            xh: { label: "Extra Alto", value: 1.74, desc: "Muy complejo" },
          },
        },
        {
          id: "RUSE",
          name: "Reutilización Requerida",
          values: {
            l: { label: "Bajo", value: 0.95, desc: "Sin reutilización" },
            n: { label: "Nominal", value: 1.0, desc: "Reutilización local" },
            h: { label: "Alto", value: 1.07, desc: "Múltiples proyectos" },
            vh: { label: "Muy Alto", value: 1.15, desc: "Múltiples líneas" },
            xh: { label: "Extra Alto", value: 1.24, desc: "Múltiples sitios" },
          },
        },
        {
          id: "DOCU",
          name: "Documentación",
          values: {
            vl: { label: "Muy Bajo", value: 0.81, desc: "Muchos documentos faltantes" },
            l: { label: "Bajo", value: 0.91, desc: "Algunos documentos faltantes" },
            n: { label: "Nominal", value: 1.0, desc: "Documentación adecuada" },
            h: { label: "Alto", value: 1.11, desc: "Excesiva documentación" },
            vh: { label: "Muy Alto", value: 1.23, desc: "Documentación muy excesiva" },
          },
        },
      ],
    },
    {
      category: "Plataforma",
      multipliers: [
        {
          id: "TIME",
          name: "Restricciones de Tiempo",
          values: {
            n: { label: "Nominal", value: 1.0, desc: "≤ 50% uso de tiempo" },
            h: { label: "Alto", value: 1.11, desc: "70% uso de tiempo" },
            vh: { label: "Muy Alto", value: 1.29, desc: "85% uso de tiempo" },
            xh: { label: "Extra Alto", value: 1.63, desc: "95% uso de tiempo" },
          },
        },
        {
          id: "STOR",
          name: "Restricciones de Almacenamiento",
          values: {
            n: { label: "Nominal", value: 1.0, desc: "≤ 50% uso de memoria" },
            h: { label: "Alto", value: 1.05, desc: "70% uso de memoria" },
            vh: { label: "Muy Alto", value: 1.17, desc: "85% uso de memoria" },
            xh: { label: "Extra Alto", value: 1.46, desc: "95% uso de memoria" },
          },
        },
        {
          id: "PVOL",
          name: "Volatilidad de Plataforma",
          values: {
            l: { label: "Bajo", value: 0.87, desc: "Cambios cada 12 meses" },
            n: { label: "Nominal", value: 1.0, desc: "Cambios cada 6 meses" },
            h: { label: "Alto", value: 1.15, desc: "Cambios cada 2 meses" },
            vh: { label: "Muy Alto", value: 1.3, desc: "Cambios cada 2 semanas" },
          },
        },
      ],
    },
    {
      category: "Personal",
      multipliers: [
        {
          id: "ACAP",
          name: "Capacidad del Analista",
          values: {
            vh: { label: "Muy Alto", value: 0.71, desc: "Percentil 90" },
            h: { label: "Alto", value: 0.85, desc: "Percentil 75" },
            n: { label: "Nominal", value: 1.0, desc: "Percentil 55" },
            l: { label: "Bajo", value: 1.19, desc: "Percentil 35" },
            vl: { label: "Muy Bajo", value: 1.42, desc: "Percentil 15" },
          },
        },
        {
          id: "PCAP",
          name: "Capacidad del Programador",
          values: {
            vh: { label: "Muy Alto", value: 0.7, desc: "Percentil 90" },
            h: { label: "Alto", value: 0.85, desc: "Percentil 75" },
            n: { label: "Nominal", value: 1.0, desc: "Percentil 55" },
            l: { label: "Bajo", value: 1.17, desc: "Percentil 35" },
            vl: { label: "Muy Bajo", value: 1.42, desc: "Percentil 15" },
          },
        },
        {
          id: "PCON",
          name: "Continuidad del Personal",
          values: {
            vh: { label: "Muy Alto", value: 0.81, desc: "3% anual" },
            h: { label: "Alto", value: 0.9, desc: "12% anual" },
            n: { label: "Nominal", value: 1.0, desc: "25% anual" },
            l: { label: "Bajo", value: 1.12, desc: "48% anual" },
            vl: { label: "Muy Bajo", value: 1.29, desc: "78% anual" },
          },
        },
        {
          id: "AEXP",
          name: "Experiencia en Aplicación",
          values: {
            vh: { label: "Muy Alto", value: 0.81, desc: "≥ 6 años" },
            h: { label: "Alto", value: 0.91, desc: "3 años" },
            n: { label: "Nominal", value: 1.0, desc: "1 año" },
            l: { label: "Bajo", value: 1.13, desc: "6 meses" },
            vl: { label: "Muy Bajo", value: 1.22, desc: "≤ 2 meses" },
          },
        },
        {
          id: "PEXP",
          name: "Experiencia en Plataforma",
          values: {
            vh: { label: "Muy Alto", value: 0.85, desc: "≥ 3 años" },
            h: { label: "Alto", value: 0.91, desc: "1 año" },
            n: { label: "Nominal", value: 1.0, desc: "6 meses" },
            l: { label: "Bajo", value: 1.09, desc: "2 meses" },
            vl: { label: "Muy Bajo", value: 1.19, desc: "≤ 2 meses" },
          },
        },
        {
          id: "LTEX",
          name: "Experiencia en Lenguaje y Herramientas",
          values: {
            vh: { label: "Muy Alto", value: 0.84, desc: "≥ 3 años" },
            h: { label: "Alto", value: 0.91, desc: "1 año" },
            n: { label: "Nominal", value: 1.0, desc: "6 meses" },
            l: { label: "Bajo", value: 1.09, desc: "2 meses" },
            vl: { label: "Muy Bajo", value: 1.2, desc: "≤ 2 meses" },
          },
        },
      ],
    },
    {
      category: "Proyecto",
      multipliers: [
        {
          id: "TOOL",
          name: "Uso de Herramientas de Software",
          values: {
            vh: { label: "Muy Alto", value: 0.78, desc: "Herramientas integradas" },
            h: { label: "Alto", value: 0.85, desc: "Herramientas fuertes" },
            n: { label: "Nominal", value: 1.0, desc: "Herramientas básicas" },
            l: { label: "Bajo", value: 1.17, desc: "Herramientas mínimas" },
            vl: { label: "Muy Bajo", value: 1.48, desc: "Edición de texto" },
          },
        },
        {
          id: "SITE",
          name: "Desarrollo Multi-sitio",
          values: {
            vh: { label: "Muy Alto", value: 0.8, desc: "Completamente interactivo" },
            h: { label: "Alto", value: 0.9, desc: "Algo interactivo" },
            n: { label: "Nominal", value: 1.0, desc: "Interactivo individual" },
            l: { label: "Bajo", value: 1.22, desc: "Algo interactivo" },
            vl: { label: "Muy Bajo", value: 1.22, desc: "Sin interacción" },
          },
        },
        {
          id: "SCED",
          name: "Cronograma de Desarrollo",
          values: {
            vh: { label: "Muy Alto", value: 1.43, desc: "75% nominal" },
            h: { label: "Alto", value: 1.14, desc: "85% nominal" },
            n: { label: "Nominal", value: 1.0, desc: "100% nominal" },
            l: { label: "Bajo", value: 1.0, desc: "130% nominal" },
            vl: { label: "Muy Bajo", value: 1.0, desc: "160% nominal" },
          },
        },
      ],
    },
  ]

  // Crear valores por defecto con todos los multiplicadores en "nominal"
  const getDefaultValues = () => {
    const defaults: Record<string, string> = {}
    multiplierCategories.forEach(category => {
      category.multipliers.forEach(multiplier => {
        if (multiplier.values.n !== undefined) {
          defaults[multiplier.id] = "n"
        }
      })
    })
    return defaults
  }

  // Combinar valores por defecto con valores iniciales
  const currentValues = { ...getDefaultValues(), ...initialValues }

  // Notificar los valores por defecto al componente padre si no hay valores iniciales
  useEffect(() => {
    if (Object.keys(initialValues).length === 0) {
      onMultipliersChange(getDefaultValues())
    }
  }, [])

  const handleMultiplierChange = (multiplierId: string, value: string) => {
    const newMultipliers = { ...currentValues, [multiplierId]: value }
    onMultipliersChange(newMultipliers)
  }

  return (
    <div className="space-y-6">
      {multiplierCategories.map((category) => (
        <Card key={category.category}>
          <CardHeader>
            <CardTitle>Multiplicadores de Esfuerzo - {category.category}</CardTitle>
            <CardDescription>Seleccione el nivel apropiado para cada multiplicador de esfuerzo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {category.multipliers.map((multiplier) => (
              <div key={multiplier.id} className="space-y-3 border-b pb-4 last:border-b-0">
                <div className="space-y-1">
                  <Label htmlFor={multiplier.id} className="text-base font-semibold text-gray-900">
                    {multiplier.id}
                </Label>
                  <p className="text-sm text-gray-600">{multiplier.name}</p>
                  <p className="text-xs text-gray-500">{multiplier.values.n?.desc || ''}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {Object.entries(multiplier.values).map(([key, data]) => (
                    <label
                      key={key}
                      htmlFor={`${multiplier.id}-${key}`}
                      className={`relative flex items-center space-x-2 rounded-lg border p-3 cursor-pointer transition-colors
                        ${currentValues[multiplier.id] === key ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="radio"
                        name={multiplier.id}
                        id={`${multiplier.id}-${key}`}
                        value={key}
                        checked={currentValues[multiplier.id] === key}
                        onChange={() => handleMultiplierChange(multiplier.id, key)}
                        className="peer sr-only"
                      />
                        <div className="flex flex-col">
                        <span className={`text-sm font-medium ${currentValues[multiplier.id] === key ? 'text-blue-700' : ''}`}>
                          {data.label}
                        </span>
                        <span className={`text-xs ${currentValues[multiplier.id] === key ? 'text-blue-600' : 'text-gray-500'}`}>
                          ({data.value})
                          </span>
                        <span className="text-xs text-gray-400">{data.desc}</span>
                        </div>
                    </label>
                    ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
