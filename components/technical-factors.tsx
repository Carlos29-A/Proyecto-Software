"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface TechnicalFactorsProps {
  onFactorsChange: (factors: Record<string, number>) => void
  initialValues?: Record<string, number>
}

export function TechnicalFactors({ onFactorsChange, initialValues = {} }: TechnicalFactorsProps) {
  const technicalFactors = [
    {
      id: "T1",
      name: "Sistema Distribuido",
      weight: 2.0,
      description: "¿El sistema es distribuido?",
    },
    {
      id: "T2",
      name: "Objetivos de Performance",
      weight: 1.0,
      description: "¿Son importantes el tiempo de respuesta o el rendimiento?",
    },
    {
      id: "T3",
      name: "Eficiencia del Usuario Final",
      weight: 1.0,
      description: "¿Es importante la eficiencia del usuario final?",
    },
    {
      id: "T4",
      name: "Procesamiento Interno Complejo",
      weight: 1.0,
      description: "¿Hay cálculos complejos?",
    },
    {
      id: "T5",
      name: "Código Reutilizable",
      weight: 1.0,
      description: "¿El código debe ser reutilizable?",
    },
    {
      id: "T6",
      name: "Fácil de Instalar",
      weight: 0.5,
      description: "¿La instalación debe ser fácil?",
    },
    {
      id: "T7",
      name: "Fácil de Usar",
      weight: 0.5,
      description: "¿La usabilidad es importante?",
    },
    {
      id: "T8",
      name: "Portabilidad",
      weight: 2.0,
      description: "¿El sistema debe ser portable?",
    },
    {
      id: "T9",
      name: "Fácil de Cambiar",
      weight: 1.0,
      description: "¿Es importante la facilidad de cambio?",
    },
    {
      id: "T10",
      name: "Concurrencia",
      weight: 1.0,
      description: "¿El sistema debe manejar múltiples usuarios concurrentes?",
    },
    {
      id: "T11",
      name: "Características de Seguridad",
      weight: 1.0,
      description: "¿Son importantes las características de seguridad?",
    },
    {
      id: "T12",
      name: "Acceso Directo a Terceros",
      weight: 1.0,
      description: "¿Se requiere acceso directo para terceros?",
    },
    {
      id: "T13",
      name: "Facilidades Especiales de Entrenamiento",
      weight: 1.0,
      description: "¿Se requiere entrenamiento especial para los usuarios?",
    },
  ]

  // Crear valores por defecto (todos en 0)
  const getDefaultValues = () => {
    const defaults: Record<string, number> = {}
    technicalFactors.forEach(factor => {
      defaults[factor.id] = 0
    })
    return defaults
  }

  // Combinar valores por defecto con valores iniciales
  const currentValues = { ...getDefaultValues(), ...initialValues }

  // Notificar los valores por defecto al componente padre si no hay valores iniciales
  useEffect(() => {
    if (Object.keys(initialValues).length === 0) {
      onFactorsChange(getDefaultValues())
    }
  }, [])

  const handleFactorChange = (factorId: string, value: number) => {
    const newFactors = { ...currentValues, [factorId]: value }
    onFactorsChange(newFactors)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Factores Técnicos</CardTitle>
          <CardDescription>
            Evalúe cada factor técnico en una escala de 0 a 5:
            0 = Sin Influencia, 3 = Promedio, 5 = Alta Influencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {technicalFactors.map((factor) => (
            <div key={factor.id} className="space-y-3 border-b pb-4 last:border-b-0">
              <div className="space-y-1">
                <Label htmlFor={factor.id} className="text-base font-semibold text-gray-900">
                  {factor.id} - {factor.name}
                </Label>
                <p className="text-sm text-gray-600">{factor.description}</p>
                <p className="text-xs text-gray-500">Peso: {factor.weight}</p>
              </div>
              <div className="grid grid-cols-6 gap-3">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label
                    key={value}
                    htmlFor={`${factor.id}-${value}`}
                    className={`relative flex items-center justify-center rounded-lg border p-3 cursor-pointer transition-colors
                      ${currentValues[factor.id] === value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <input
                      type="radio"
                      name={factor.id}
                      id={`${factor.id}-${value}`}
                      value={value}
                      checked={currentValues[factor.id] === value}
                      onChange={() => handleFactorChange(factor.id, value)}
                      className="peer sr-only"
                    />
                    <div className="text-center">
                      <span className={`text-sm font-medium ${currentValues[factor.id] === value ? 'text-blue-700' : ''}`}>
                        {value}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
} 