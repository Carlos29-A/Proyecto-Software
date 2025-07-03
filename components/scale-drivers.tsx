"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ScaleDriversProps {
  onDriversChange: (drivers: Record<string, string>) => void
  initialValues?: Record<string, string>
}

export function ScaleDrivers({ onDriversChange, initialValues = {} }: ScaleDriversProps) {
  const scaleFactors = [
    {
      id: "PREC",
      name: "Precedencia",
      description: "Familiaridad con proyectos similares",
      values: {
        vh: { label: "Muy Alto", value: 6.2, desc: "Completamente familiar" },
        h: { label: "Alto", value: 4.96, desc: "Mayormente familiar" },
        n: { label: "Nominal", value: 3.72, desc: "Algo familiar" },
        l: { label: "Bajo", value: 2.48, desc: "Poco familiar" },
        vl: { label: "Muy Bajo", value: 1.24, desc: "Sin familiaridad" },
      },
    },
    {
      id: "FLEX",
      name: "Flexibilidad de Desarrollo",
      description: "Grado de flexibilidad en el proceso de desarrollo",
      values: {
        vh: { label: "Muy Alto", value: 5.07, desc: "Objetivos generales" },
        h: { label: "Alto", value: 4.05, desc: "Objetivos considerables" },
        n: { label: "Nominal", value: 3.04, desc: "Algunos objetivos" },
        l: { label: "Bajo", value: 2.03, desc: "Objetivos básicos" },
        vl: { label: "Muy Bajo", value: 1.01, desc: "Objetivos estrictos" },
      },
    },
    {
      id: "RESL",
      name: "Resolución de Arquitectura/Riesgo",
      description: "Grado de resolución de la arquitectura y riesgos",
      values: {
        vh: { label: "Muy Alto", value: 7.07, desc: "Completamente resuelto" },
        h: { label: "Alto", value: 5.65, desc: "Mayormente resuelto" },
        n: { label: "Nominal", value: 4.24, desc: "Algo resuelto" },
        l: { label: "Bajo", value: 2.83, desc: "Poco resuelto" },
        vl: { label: "Muy Bajo", value: 1.41, desc: "Sin resolver" },
      },
    },
    {
      id: "TEAM",
      name: "Cohesión del Equipo",
      description: "Grado de cooperación entre stakeholders",
      values: {
        vh: { label: "Muy Alto", value: 5.48, desc: "Interacciones sin problemas" },
        h: { label: "Alto", value: 4.38, desc: "Cooperación cooperativa" },
        n: { label: "Nominal", value: 3.29, desc: "Cooperación básica" },
        l: { label: "Bajo", value: 2.19, desc: "Dificultades ocasionales" },
        vl: { label: "Muy Bajo", value: 1.1, desc: "Dificultades difíciles" },
      },
    },
    {
      id: "PMAT",
      name: "Madurez del Proceso",
      description: "Nivel de madurez del proceso de desarrollo",
      values: {
        vh: { label: "Muy Alto", value: 7.8, desc: "Nivel 5 - Optimizado" },
        h: { label: "Alto", value: 6.24, desc: "Nivel 4 - Gestionado" },
        n: { label: "Nominal", value: 4.68, desc: "Nivel 3 - Definido" },
        l: { label: "Bajo", value: 3.12, desc: "Nivel 2 - Repetible" },
        vl: { label: "Muy Bajo", value: 1.56, desc: "Nivel 1 - Inicial" },
      },
    },
  ]

  // Crear valores por defecto con todos los factores en "nominal"
  const getDefaultValues = () => {
    const defaults: Record<string, string> = {}
    scaleFactors.forEach(factor => {
      if (factor.values.n !== undefined) {
        defaults[factor.id] = "n"
      }
    })
    return defaults
  }

  // Combinar valores por defecto con valores iniciales
  const currentValues = { ...getDefaultValues(), ...initialValues }

  // Notificar los valores por defecto al componente padre si no hay valores iniciales
  useEffect(() => {
    if (Object.keys(initialValues).length === 0) {
      onDriversChange(getDefaultValues())
    }
  }, [])

  const handleFactorChange = (factorId: string, value: string) => {
    const newDrivers = { ...currentValues, [factorId]: value }
    onDriversChange(newDrivers)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conductores de Escala COCOMO II</CardTitle>
          <CardDescription>Los factores de escala afectan el exponente de la ecuación de esfuerzo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {scaleFactors.map((factor) => (
            <div key={factor.id} className="space-y-3 border-b pb-4 last:border-b-0">
              <div className="space-y-1">
                <Label htmlFor={factor.id} className="text-base font-semibold text-gray-900">
                  {factor.id}
                </Label>
                <p className="text-sm text-gray-600">{factor.name}</p>
                <p className="text-xs text-gray-500">{factor.description}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(factor.values).map(([key, data]) => (
                  <label
                    key={key}
                    htmlFor={`${factor.id}-${key}`}
                    className={`relative flex items-center space-x-2 rounded-lg border p-3 cursor-pointer transition-colors
                      ${currentValues[factor.id] === key ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <input
                      type="radio"
                      name={factor.id}
                      id={`${factor.id}-${key}`}
                      value={key}
                      checked={currentValues[factor.id] === key}
                      onChange={() => handleFactorChange(factor.id, key)}
                      className="peer sr-only"
                    />
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${currentValues[factor.id] === key ? 'text-blue-700' : ''}`}>
                        {data.label}
                      </span>
                      <span className={`text-xs ${currentValues[factor.id] === key ? 'text-blue-600' : 'text-gray-500'}`}>
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

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium text-green-900 mb-2">Cálculo del Exponente de Escala</h3>
        <div className="text-sm text-green-800 space-y-1">
          <p className="font-mono">E = B + 0.01 × ∑SF</p>
          <p>Donde:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>B = 0.91 (exponente base)</li>
            <li>SF = Suma de todos los factores de escala</li>
            <li>E = Exponente final para la ecuación de esfuerzo</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
