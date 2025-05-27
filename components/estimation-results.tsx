"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, FileText } from "lucide-react"

interface EstimationResultsProps {
  model: "cocomo81" | "cocomo2" | "ucp"
  data: any
}

export function EstimationResults({ model, data }: EstimationResultsProps) {
  const calculateCocomo81 = () => {
    const { projectType, kloc, costDrivers, stageCosts } = data;

    // Constantes según el tipo de proyecto
    const constants = {
      organic: { a: 3.2, b: 1.05, c: 2.5, d: 0.38 },
      semidetached: { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
      embedded: { a: 2.8, b: 1.20, c: 2.5, d: 0.32 }
    };

    // Mapeo de valores de conductores a sus valores numéricos
    const driverValues = {
      RELY: { vl: 0.75, l: 0.88, n: 1.0, h: 1.15, vh: 1.4 },
      DATA: { l: 0.94, n: 1.0, h: 1.08, vh: 1.16 },
      CPLX: { vl: 0.7, l: 0.85, n: 1.0, h: 1.15, vh: 1.3, xh: 1.65 },
      TIME: { n: 1.0, h: 1.11, vh: 1.3, xh: 1.66 },
      STOR: { n: 1.0, h: 1.06, vh: 1.21, xh: 1.56 },
      VIRT: { l: 0.87, n: 1.0, h: 1.15, vh: 1.3 },
      TURN: { l: 0.87, n: 1.0, h: 1.07, vh: 1.15 },
      ACAP: { vh: 0.71, h: 0.86, n: 1.0, l: 1.19, vl: 1.46 },
      AEXP: { vh: 0.82, h: 0.91, n: 1.0, l: 1.13, vl: 1.29 },
      PCAP: { vh: 0.7, h: 0.86, n: 1.0, l: 1.17, vl: 1.42 },
      VEXP: { vh: 0.9, h: 0.95, n: 1.0, l: 1.1, vl: 1.21 },
      LEXP: { vh: 0.95, h: 0.95, n: 1.0, l: 1.09, vl: 1.14 },
      MODP: { vh: 0.82, h: 0.91, n: 1.0, l: 1.07, vl: 1.15 },
      TOOL: { vh: 0.83, h: 0.91, n: 1.0, l: 1.1, vl: 1.24 },
      SCED: { vh: 1.23, h: 1.08, n: 1.0, l: 1.04, vl: 1.1 }
    };

    // Calcular EAF (Factor de Ajuste del Esfuerzo)
    const eaf = Object.entries(costDrivers).reduce((acc: number, [driverId, rating]) => {
      const driverValue = driverValues[driverId as keyof typeof driverValues]?.[rating as keyof typeof driverValues[keyof typeof driverValues]];
      return acc * (driverValue || 1);
    }, 1);

    // Obtener constantes según el tipo de proyecto
    const { a, b, c, d } = constants[projectType as keyof typeof constants] || constants.organic;

    // Calcular esfuerzo en meses-hombre
    const effort = a * Math.pow(parseFloat(kloc), b) * eaf;

    // Calcular tiempo de desarrollo en meses
    const time = c * Math.pow(effort, d);

    // Calcular número de personas necesarias
    const people = effort / time;

    // Calcular costos por etapa
    const stagePercentages = {
      requirements: 0.08,
      analysis: 0.18,
      design: 0.25,
      coding: 0.26,
      testing: 0.31,
      integration: 0.28
    };

    const costs = Object.entries(stageCosts).reduce((acc: Record<string, number>, [stage, cost]) => {
      const stageEffort = effort * stagePercentages[stage as keyof typeof stagePercentages];
      const stageCost = stageEffort * parseFloat(cost as string);
      return { ...acc, [stage]: stageCost };
    }, {});

    const totalCost = Object.values(costs).reduce((sum: number, cost: number) => sum + cost, 0);

    return {
      effort: Math.round(effort * 100) / 100,
      time: Math.round(time * 100) / 100,
      people: Math.round(people * 100) / 100,
      costs,
      totalCost: Math.round(totalCost * 100) / 100,
      eaf: Math.round(eaf * 100) / 100,
      stageEfforts: Object.entries(stagePercentages).reduce((acc: Record<string, number>, [stage, percentage]) => ({
        ...acc,
        [stage]: Math.round(effort * percentage * 100) / 100
      }), {})
    };
  };

  const results = model === "cocomo81" ? calculateCocomo81() : null;

  if (!results) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resultados de la Estimación</CardTitle>
          <CardDescription>Estimaciones calculadas usando el modelo COCOMO-81</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Esfuerzo</h3>
              <p className="text-2xl font-bold text-blue-700">{results.effort}</p>
              <p className="text-sm text-blue-600">Meses-Hombre</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">Tiempo</h3>
              <p className="text-2xl font-bold text-green-700">{results.time}</p>
              <p className="text-sm text-green-600">Meses</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900">Personal</h3>
              <p className="text-2xl font-bold text-purple-700">{results.people}</p>
              <p className="text-sm text-purple-600">Personas</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Desglose de Costos por Etapa</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(results.costs).map(([stage, cost]) => (
                <div key={stage} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="capitalize block">{stage}</span>
                    <span className="text-sm text-gray-500">
                      {results.stageEfforts[stage]} meses-hombre
                    </span>
                  </div>
                  <Badge variant="secondary">${Math.round(cost)}</Badge>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg mt-4">
              <span className="font-medium">Costo Total</span>
              <Badge variant="default" className="text-lg">${results.totalCost}</Badge>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-900">Factor de Ajuste del Esfuerzo (EAF)</h3>
            <p className="text-2xl font-bold text-yellow-700">{results.eaf}</p>
            <p className="text-sm text-yellow-600">Producto de los conductores de costo</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ecuaciones Utilizadas</CardTitle>
          <CardDescription>Fórmulas matemáticas aplicadas en la estimación</CardDescription>
        </CardHeader>
        <CardContent>
          {model === "cocomo81" && (
            <div className="space-y-3 font-mono text-sm bg-gray-50 p-4 rounded-lg">
              <div>Esfuerzo (MM) = a × (KLOC)^b × EAF</div>
              <div>Tiempo (TDEV) = c × (MM)^d</div>
              <div>Personas = MM / TDEV</div>
              <div className="text-xs text-gray-600 mt-2">
                Donde: a=3.2, b=1.05, c=2.5, d=0.38 para proyectos orgánicos
              </div>
            </div>
          )}
          {model === "cocomo2" && (
            <div className="space-y-3 font-mono text-sm bg-gray-50 p-4 rounded-lg">
              <div>Esfuerzo = A × (Tamaño)^E × ∏EM</div>
              <div>E = B + 0.01 × ∑SF</div>
              <div>Tiempo = C × (Esfuerzo)^F</div>
              <div>F = 0.28 + 0.2 × (E - B)</div>
              <div className="text-xs text-gray-600 mt-2">Donde: A=2.94, B=0.91, C=3.67</div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generar Reporte
        </Button>
        <Button variant="outline">Guardar Proyecto</Button>
      </div>
    </div>
  )
}
