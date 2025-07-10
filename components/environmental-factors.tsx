"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface EnvironmentalFactorsProps {
  onFactorsChange: (factors: Record<string, number>) => void
  initialValues?: Record<string, number>
}

export function EnvironmentalFactors({ onFactorsChange, initialValues = {} }: EnvironmentalFactorsProps) {
  const environmentalFactors = [
    {
      id: "F1",
      name: "Familiaridad con el Proceso",
      weight: 1.5,
      description: "¿El equipo está familiarizado con el proceso de desarrollo?",
    },
    {
      id: "F2",
      name: "Experiencia en la Aplicación",
      weight: 0.5,
      description: "¿El equipo tiene experiencia en el dominio de la aplicación?",
    },
    {
      id: "F3",
      name: "Experiencia en Orientación a Objetos",
      weight: 1.0,
      description: "¿El equipo tiene experiencia en programación orientada a objetos?",
    },
    {
      id: "F4",
      name: "Capacidad del Analista Líder",
      weight: 0.5,
      description: "¿Cuál es la capacidad del analista líder?",
    },
    {
      id: "F5",
      name: "Motivación",
      weight: 1.0,
      description: "¿Cuál es el nivel de motivación del equipo?",
    },
    {
      id: "F6",
      name: "Estabilidad de los Requerimientos",
      weight: 2.0,
      description: "¿Qué tan estables son los requerimientos?",
    },
    {
      id: "F7",
      name: "Personal Part-Time",
      weight: -1.0,
      description: "¿Hay personal trabajando tiempo parcial?",
    },
    {
      id: "F8",
      name: "Dificultad del Lenguaje de Programación",
      weight: -1.0,
      description: "¿Qué tan difícil es el lenguaje de programación?",
    },
  ]

  // Crear valores por defecto (todos en 0)
  const getDefaultValues = () => {
    const defaults: Record<string, number> = {}
    environmentalFactors.forEach(factor => {
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

  // Calcular factores críticos
  const calculateCriticalFactors = () => {
    let factorsBelow3 = 0
    let factorsAbove3 = 0

    Object.entries(currentValues).forEach(([factorId, value]) => {
      const factor = environmentalFactors.find(f => f.id === factorId)
      if (factor) {
        if (factorId.startsWith("E") && parseInt(factorId.slice(1)) <= 6) {
          // E1-E6: contar si valor < 3
          if (value < 3) factorsBelow3++
        } else {
          // E7-E8: contar si valor > 3
          if (value > 3) factorsAbove3++
        }
      }
    })

    return { factorsBelow3, factorsAbove3, total: factorsBelow3 + factorsAbove3 }
  }

  const criticalFactors = calculateCriticalFactors()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Factores Ambientales</CardTitle>
          <CardDescription>
            Evalúe cada factor ambiental en una escala de 0 a 5:
            0 = Sin Experiencia/Influencia, 3 = Promedio, 5 = Experto/Alta Influencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {environmentalFactors.map((factor) => (
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