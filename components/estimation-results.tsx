"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, FileText } from "lucide-react"
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'
import { generateCOCOMO81PDF, generateCOCOMO2PDF } from '@/utils/pdf-generator'

interface EstimationResultsProps {
  model: "cocomo81" | "cocomo2" | "ucp"
  data: any
}

export function EstimationResults({ model, data }: EstimationResultsProps) {

  const calculateCocomo81 = () => {
    const { projectType, kloc, costDrivers, stageCosts, stagePercentages } = data;

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

    // Usar porcentajes personalizados del usuario
    const percentages = {
      requirements: (parseFloat(stagePercentages?.requirements || "8") / 100),
      analysis: (parseFloat(stagePercentages?.analysis || "18") / 100),
      design: (parseFloat(stagePercentages?.design || "25") / 100),
      coding: (parseFloat(stagePercentages?.coding || "26") / 100),
      testing: (parseFloat(stagePercentages?.testing || "31") / 100),
      integration: (parseFloat(stagePercentages?.integration || "28") / 100)
    };

    const costs = Object.entries(stageCosts).reduce((acc: Record<string, number>, [stage, cost]) => {
      const stageEffort = effort * percentages[stage as keyof typeof percentages];
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
      stageEfforts: Object.entries(percentages).reduce((acc: Record<string, number>, [stage, percentage]) => ({
        ...acc,
        [stage]: Math.round(effort * (percentage as number) * 100) / 100
      }), {})
    };
  };

  const calculateCocomo2 = () => {
    const { kloc, scaleDrivers, effortMultipliers, stageCosts, stagePercentages } = data;

    // Constantes COCOMO II Post-Arquitectura
    const A = 2.94; // Constante de calibración
    const B = 0.91; // Exponente base
    const C = 3.67; // Constante de tiempo

    // Valores de los factores de escala
    const scaleFactorValues = {
      PREC: { vl: 1.24, l: 2.48, n: 3.72, h: 4.96, vh: 6.2 },
      FLEX: { vl: 1.01, l: 2.03, n: 3.04, h: 4.05, vh: 5.07 },
      RESL: { vl: 1.41, l: 2.83, n: 4.24, h: 5.65, vh: 7.07 },
      TEAM: { vl: 1.1, l: 2.19, n: 3.29, h: 4.38, vh: 5.48 },
      PMAT: { vl: 1.56, l: 3.12, n: 4.68, h: 6.24, vh: 7.8 }
    };

    // Valores de los multiplicadores de esfuerzo
    const effortMultiplierValues = {
      RELY: { vl: 0.82, l: 0.92, n: 1.0, h: 1.1, vh: 1.26 },
      DATA: { l: 0.9, n: 1.0, h: 1.14, vh: 1.28 },
      CPLX: { vl: 0.73, l: 0.87, n: 1.0, h: 1.17, vh: 1.34, xh: 1.74 },
      RUSE: { l: 0.95, n: 1.0, h: 1.07, vh: 1.15, xh: 1.24 },
      DOCU: { vl: 0.81, l: 0.91, n: 1.0, h: 1.11, vh: 1.23 },
      TIME: { n: 1.0, h: 1.11, vh: 1.29, xh: 1.63 },
      STOR: { n: 1.0, h: 1.05, vh: 1.17, xh: 1.46 },
      PVOL: { l: 0.87, n: 1.0, h: 1.15, vh: 1.3 },
      ACAP: { vh: 0.71, h: 0.85, n: 1.0, l: 1.19, vl: 1.42 },
      PCAP: { vh: 0.7, h: 0.85, n: 1.0, l: 1.17, vl: 1.42 },
      PCON: { vh: 0.81, h: 0.9, n: 1.0, l: 1.12, vl: 1.29 },
      AEXP: { vh: 0.81, h: 0.91, n: 1.0, l: 1.13, vl: 1.22 },
      PEXP: { vh: 0.85, h: 0.91, n: 1.0, l: 1.09, vl: 1.19 },
      LTEX: { vh: 0.84, h: 0.91, n: 1.0, l: 1.09, vl: 1.2 },
      TOOL: { vh: 0.78, h: 0.85, n: 1.0, l: 1.17, vl: 1.48 },
      SITE: { vh: 0.8, h: 0.9, n: 1.0, l: 1.22, vl: 1.22 },
      SCED: { vh: 1.43, h: 1.14, n: 1.0, l: 1.0, vl: 1.0 }
    };

    // Calcular suma de factores de escala
    const scaleSum = Object.entries(scaleDrivers).reduce((acc: number, [factor, rating]) => {
      const factorValue = scaleFactorValues[factor as keyof typeof scaleFactorValues]?.[rating as keyof typeof scaleFactorValues[keyof typeof scaleFactorValues]];
      return acc + (factorValue || 0);
    }, 0);

    // Calcular exponente E
    const E = B + 0.01 * scaleSum;

    // Calcular multiplicador de esfuerzo (EM)
    const em = Object.entries(effortMultipliers).reduce((acc: number, [multiplier, rating]) => {
      const multiplierValue = effortMultiplierValues[multiplier as keyof typeof effortMultiplierValues]?.[rating as keyof typeof effortMultiplierValues[keyof typeof effortMultiplierValues]];
      return acc * (multiplierValue || 1);
    }, 1);

    // Calcular esfuerzo en meses-hombre
    const effort = A * Math.pow(parseFloat(kloc), E) * em;

    // Calcular exponente de tiempo F
    const F = 0.28 + 0.2 * (E - B);

    // Calcular tiempo de desarrollo en meses
    const time = C * Math.pow(effort, F);

    // Calcular número de personas necesarias
    const people = effort / time;

    // Usar porcentajes personalizados del usuario para las etapas
    const percentages = {
      requirements: (parseFloat(stagePercentages?.requirements || "8") / 100),
      analysis: (parseFloat(stagePercentages?.analysis || "18") / 100),
      design: (parseFloat(stagePercentages?.design || "25") / 100),
      coding: (parseFloat(stagePercentages?.coding || "26") / 100),
      testing: (parseFloat(stagePercentages?.testing || "31") / 100),
      integration: (parseFloat(stagePercentages?.integration || "28") / 100)
    };

    const costs = Object.entries(stageCosts).reduce((acc: Record<string, number>, [stage, cost]) => {
      const stageEffort = effort * (percentages[stage as keyof typeof percentages] || 0);
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
      eaf: Math.round(em * 100) / 100, // Usar EM como EAF para compatibilidad
      em: Math.round(em * 100) / 100,
      scaleSum: Math.round(scaleSum * 100) / 100,
      exponentE: Math.round(E * 1000) / 1000,
      exponentF: Math.round(F * 1000) / 1000,
      stageEfforts: Object.entries(percentages).reduce((acc: Record<string, number>, [stage, percentage]) => ({
        ...acc,
        [stage]: Math.round(effort * (percentage as number) * 100) / 100
      }), {})
    };
  };

  const results = model === "cocomo81" ? calculateCocomo81() : model === "cocomo2" ? calculateCocomo2() : null;

  const handleExportPDF = () => {
    if (!results) return;
    if (model === "cocomo81") {
    generateCOCOMO81PDF(data, results);
    } else if (model === "cocomo2") {
      generateCOCOMO2PDF(data, results);
    }
  };

  if (!results) return null;

  return (
    <div className="space-y-6">
      <div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Datos del Proyecto</CardTitle>
            <CardDescription>Características principales utilizadas en la estimación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {model === "cocomo81" && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración Básica</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="font-medium">Nombre del proyecto:</span>
                        <Badge variant="default" className="max-w-[200px] truncate">{data.projectName || "Sin nombre"}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">Tipo de proyecto:</span>
                        <Badge variant="outline" className="capitalize">
                          {(() => {
                            const projectTypeLabels = {
                              organic: "Orgánico",
                              semidetached: "Semi-acoplado", 
                              embedded: "Empotrado"
                            };
                            return projectTypeLabels[data.projectType as keyof typeof projectTypeLabels] || data.projectType;
                          })()}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">KLOC:</span>
                        <Badge variant="outline">{data.kloc}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Costos por Etapa</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(data.stageCosts).map(([stage, cost]) => {
                        const stageLabels = {
                          requirements: "Requerimientos",
                          analysis: "Análisis",
                          design: "Diseño", 
                          coding: "Codificación",
                          testing: "Pruebas",
                          integration: "Integración"
                        };
                        const displayStage = stageLabels[stage as keyof typeof stageLabels] || stage;
                        return (
                          <div key={stage} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                            <span>{displayStage}:</span>
                            <span className="font-medium">${String(cost)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Conductores de Costo</h3>
                  <div className="grid md:grid-cols-4 gap-3">
                    {Object.entries(data.costDrivers).map(([driver, value]) => {
                      const ratingLabels = {
                        vl: "Muy Bajo",
                        l: "Bajo", 
                        n: "Nominal",
                        h: "Alto",
                        vh: "Muy Alto",
                        xh: "Extra Alto"
                      };
                      const displayValue = ratingLabels[value as keyof typeof ratingLabels] || String(value);
                      return (
                        <div key={driver} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-mono text-sm">{driver}:</span>
                          <Badge variant="secondary" className="text-xs">{displayValue}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {model === "cocomo2" && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración Básica</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="font-medium">Nombre del proyecto:</span>
                        <Badge variant="default" className="max-w-[200px] truncate">{data.projectName || "Sin nombre"}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">Tamaño del software:</span>
                        <Badge variant="default">{data.kloc} KLOC</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">Modelo:</span>
                        <Badge variant="outline">COCOMO II Post-Arquitectura</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Costos por Etapa</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(data.stageCosts).map(([stage, cost]) => {
                        const stageLabels = {
                          requirements: "Requerimientos",
                          analysis: "Análisis",
                          design: "Diseño", 
                          coding: "Codificación",
                          testing: "Pruebas",
                          integration: "Integración"
                        };
                        const displayStage = stageLabels[stage as keyof typeof stageLabels] || stage;
                        return (
                          <div key={stage} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                            <span>{displayStage}:</span>
                            <span className="font-medium">${String(cost)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Factores de Escala</h3>
                  <div className="grid md:grid-cols-5 gap-3">
                    {Object.entries(data.scaleDrivers).map(([factor, value]) => {
                      const ratingLabels = {
                        vl: "Muy Bajo",
                        l: "Bajo", 
                        n: "Nominal",
                        h: "Alto",
                        vh: "Muy Alto"
                      };
                      const displayValue = ratingLabels[value as keyof typeof ratingLabels] || String(value);
                      return (
                        <div key={factor} className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <span className="font-mono text-sm">{factor}:</span>
                          <Badge variant="secondary" className="text-xs">{displayValue}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Multiplicadores de Esfuerzo</h3>
                  <div className="grid md:grid-cols-4 gap-3">
                    {Object.entries(data.effortMultipliers).map(([multiplier, value]) => {
                      const ratingLabels = {
                        vl: "Muy Bajo",
                        l: "Bajo", 
                        n: "Nominal",
                        h: "Alto",
                        vh: "Muy Alto",
                        xh: "Extra Alto"
                      };
                      const displayValue = ratingLabels[value as keyof typeof ratingLabels] || String(value);
                      return (
                        <div key={multiplier} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                          <span className="font-mono text-sm">{multiplier}:</span>
                          <Badge variant="secondary" className="text-xs">{displayValue}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Estimación</CardTitle>
            <CardDescription>
              {model === "cocomo81" 
                ? "Estimaciones calculadas usando el modelo COCOMO-81" 
                : "Estimaciones calculadas usando el modelo COCOMO II Post-Arquitectura"
              }
            </CardDescription>
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

            {model === "cocomo2" && 'em' in results && (
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-medium text-orange-900">Multiplicador EM</h3>
                  <p className="text-2xl font-bold text-orange-700">{(results as any).em}</p>
                  <p className="text-sm text-orange-600">Producto de multiplicadores</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <h3 className="font-medium text-teal-900">Suma SF</h3>
                  <p className="text-2xl font-bold text-teal-700">{(results as any).scaleSum}</p>
                  <p className="text-sm text-teal-600">Suma factores escala</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-medium text-indigo-900">Exponente E</h3>
                  <p className="text-2xl font-bold text-indigo-700">{(results as any).exponentE}</p>
                  <p className="text-sm text-indigo-600">Exponente esfuerzo</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <h3 className="font-medium text-pink-900">Exponente F</h3>
                  <p className="text-2xl font-bold text-pink-700">{(results as any).exponentF}</p>
                  <p className="text-sm text-pink-600">Exponente tiempo</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-medium">
                Desglose de Costos por Etapa
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(results.costs).map(([stage, cost]) => {
                  const stageLabels = {
                    requirements: "Requerimientos",
                    analysis: "Análisis",
                    design: "Diseño", 
                    coding: "Codificación",
                    testing: "Pruebas",
                    integration: "Integración"
                  };
                  const displayStage = stageLabels[stage as keyof typeof stageLabels] || stage;
                  return (
                  <div key={stage} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                        <span className="block">{displayStage}</span>
                      <span className="text-sm text-gray-500">
                        {results.stageEfforts[stage]} meses-hombre
                      </span>
                    </div>
                    <Badge variant="secondary">${Math.round(cost)}</Badge>
                  </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg mt-4">
                <span className="font-medium">Costo Total</span>
                <Badge variant="default" className="text-lg">${results.totalCost}</Badge>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900">
                {model === "cocomo81" ? "Factor de Ajuste del Esfuerzo (EAF)" : "Multiplicador de Esfuerzo (EM)"}
              </h3>
              <p className="text-2xl font-bold text-yellow-700">{results.eaf}</p>
              <p className="text-sm text-yellow-600">
                {model === "cocomo81" ? "Producto de los conductores de costo" : "Producto de los multiplicadores de esfuerzo"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ecuaciones Utilizadas</CardTitle>
            <CardDescription>Fórmulas matemáticas aplicadas en la estimación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {model === "cocomo81" && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Ecuación de Esfuerzo:</p>
                    <BlockMath math={`MM = ${data.projectType === "organic" ? "3.2" : data.projectType === "semidetached" ? "3.0" : "2.8"} \\times (${data.kloc})^{${data.projectType === "organic" ? "1.05" : data.projectType === "semidetached" ? "1.12" : "1.20"}} \\times ${results.eaf}`} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Ecuación de Tiempo:</p>
                    <BlockMath math={`TDEV = 2.5 \\times (${results.effort})^{${data.projectType === "organic" ? "0.38" : data.projectType === "semidetached" ? "0.35" : "0.32"}}`} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Ecuación de Personal:</p>
                    <BlockMath math={`Personas = \\frac{${results.effort}}{${results.time}} = ${results.people}`} />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Donde:</p>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li><InlineMath math="MM" /> = Esfuerzo en Meses-Hombre</li>
                      <li><InlineMath math="TDEV" /> = Tiempo de Desarrollo en Meses</li>
                      <li><InlineMath math="EAF" /> = Factor de Ajuste del Esfuerzo</li>
                      <li><InlineMath math="KLOC" /> = Miles de Líneas de Código</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {model === "cocomo2" && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Ecuación de Esfuerzo:</p>
                    <BlockMath math={String.raw`MM = A \times (\text{Tamaño})^E \times \prod EM`} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Exponente de Escala:</p>
                    <BlockMath math={String.raw`E = B + 0.01 \times \sum SF`} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Ecuación de Tiempo:</p>
                    <BlockMath math={String.raw`TDEV = C \times (MM)^F`} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Factor de Tiempo:</p>
                    <BlockMath math={String.raw`F = 0.28 + 0.2 \times (E - B)`} />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Donde:</p>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li><InlineMath math="A = 2.94, B = 0.91, C = 3.67" /></li>
                      <li><InlineMath math="EM" /> = Multiplicadores de Esfuerzo</li>
                      <li><InlineMath math="SF" /> = Factores de Escala</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4">
        <Button className="flex items-center gap-2" onClick={handleExportPDF}>
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
