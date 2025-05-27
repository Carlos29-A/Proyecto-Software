"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CostDriversProps {
  model: "cocomo81" | "cocomo2"
  onDriversChange: (drivers: any) => void
  initialValues?: Record<string, string>
}

export function CostDrivers({ model, onDriversChange, initialValues = {} }: CostDriversProps) {
  const cocomo81Drivers = [
    {
      category: "Producto",
      drivers: [
        {
          id: "RELY",
          name: "Confiabilidad requerida del software",
          values: { vl: 0.75, l: 0.88, n: 1.0, h: 1.15, vh: 1.4 },
        },
        { id: "DATA", name: "Tamaño de la base de datos", values: { l: 0.94, n: 1.0, h: 1.08, vh: 1.16 } },
        {
          id: "CPLX",
          name: "Complejidad del producto",
          values: { vl: 0.7, l: 0.85, n: 1.0, h: 1.15, vh: 1.3, xh: 1.65 },
        },
      ],
    },
    {
      category: "Hardware",
      drivers: [
        { id: "TIME", name: "Restricciones de tiempo de ejecución", values: { n: 1.0, h: 1.11, vh: 1.3, xh: 1.66 } },
        {
          id: "STOR",
          name: "Restricciones de almacenamiento principal",
          values: { n: 1.0, h: 1.06, vh: 1.21, xh: 1.56 },
        },
        { id: "VIRT", name: "Volatilidad de la máquina virtual", values: { l: 0.87, n: 1.0, h: 1.15, vh: 1.3 } },
        { id: "TURN", name: "Tiempo de respuesta del computador", values: { l: 0.87, n: 1.0, h: 1.07, vh: 1.15 } },
      ],
    },
    {
      category: "Personal",
      drivers: [
        { id: "ACAP", name: "Capacidad del analista", values: { vh: 0.71, h: 0.86, n: 1.0, l: 1.19, vl: 1.46 } },
        { id: "AEXP", name: "Experiencia en la aplicación", values: { vh: 0.82, h: 0.91, n: 1.0, l: 1.13, vl: 1.29 } },
        { id: "PCAP", name: "Capacidad del programador", values: { vh: 0.7, h: 0.86, n: 1.0, l: 1.17, vl: 1.42 } },
        { id: "VEXP", name: "Experiencia en máquina virtual", values: { vh: 0.9, h: 0.95, n: 1.0, l: 1.1, vl: 1.21 } },
        {
          id: "LEXP",
          name: "Experiencia en lenguaje de programación",
          values: { vh: 0.95, h: 0.95, n: 1.0, l: 1.09, vl: 1.14 },
        },
      ],
    },
    {
      category: "Proyecto",
      drivers: [
        {
          id: "MODP",
          name: "Uso de prácticas modernas de programación",
          values: { vh: 0.82, h: 0.91, n: 1.0, l: 1.07, vl: 1.15 },
        },
        {
          id: "TOOL",
          name: "Uso de herramientas de software",
          values: { vh: 0.83, h: 0.91, n: 1.0, l: 1.1, vl: 1.24 },
        },
        {
          id: "SCED",
          name: "Restricciones de tiempo de desarrollo",
          values: { vh: 1.23, h: 1.08, n: 1.0, l: 1.04, vl: 1.1 },
        },
      ],
    },
  ]

  const ratingLabels = {
    vl: "Muy Bajo",
    l: "Bajo",
    n: "Nominal",
    h: "Alto",
    vh: "Muy Alto",
    xh: "Extra Alto",
  }

  const handleDriverChange = (driverId: string, value: string) => {
    const newDrivers = { ...initialValues, [driverId]: value }
    onDriversChange(newDrivers)
  }

  return (
    <div className="space-y-6">
      {cocomo81Drivers.map((category) => (
        <Card key={category.category}>
          <CardHeader>
            <CardTitle>Conductores de Costo - {category.category}</CardTitle>
            <CardDescription>Seleccione el nivel apropiado para cada conductor de costo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {category.drivers.map((driver) => (
              <div key={driver.id} className="space-y-3 border-b pb-4 last:border-b-0">
                <div className="space-y-1">
                  <Label htmlFor={driver.id} className="text-base font-semibold text-gray-900">
                    {driver.id}
                  </Label>
                  <p className="text-sm text-gray-600">{driver.name}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {Object.entries(driver.values).map(([key, value]) => (
                    <label
                      key={key}
                      htmlFor={`${driver.id}-${key}`}
                      className={`relative flex items-center space-x-2 rounded-lg border p-3 cursor-pointer transition-colors
                        ${initialValues[driver.id] === key ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="radio"
                        name={driver.id}
                        id={`${driver.id}-${key}`}
                        value={key}
                        checked={initialValues[driver.id] === key}
                        onChange={() => handleDriverChange(driver.id, key)}
                        className="peer sr-only"
                      />
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${initialValues[driver.id] === key ? 'text-blue-700' : ''}`}>
                          {ratingLabels[key as keyof typeof ratingLabels]}
                        </span>
                        <span className={`text-xs ${initialValues[driver.id] === key ? 'text-blue-600' : 'text-gray-500'}`}>
                          ({value})
                        </span>
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
