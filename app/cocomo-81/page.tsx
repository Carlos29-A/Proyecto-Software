"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Calculator } from "lucide-react"
import { CostDrivers } from "@/components/cost-drivers"
import { EstimationResults } from "@/components/estimation-results"
import Link from "next/link"
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export default function Cocomo81Page() {
  const searchParams = useSearchParams()
  const [projectName, setProjectName] = useState("")
  const [projectType, setProjectType] = useState("")
  const [kloc, setKloc] = useState("")
  const [costDrivers, setCostDrivers] = useState({})
  const [fromFP, setFromFP] = useState(false)
  const [stageCosts, setStageCosts] = useState({
    requirements: "",
    analysis: "",
    design: "",
    coding: "",
    testing: "",
    integration: "",
  })
  const [stagePercentages, setStagePercentages] = useState({
    requirements: "8",
    analysis: "18", 
    design: "25",
    coding: "26",
    testing: "31",
    integration: "28",
  })
  const [showResults, setShowResults] = useState(false)
  const [currentTab, setCurrentTab] = useState("basic")

  // Efecto para manejar parámetros de URL
  useEffect(() => {
    const klocParam = searchParams.get('kloc')
    const fromParam = searchParams.get('from')
    
    if (klocParam) {
      setKloc(klocParam)
      setFromFP(fromParam === 'fp')
    }
  }, [searchParams])

  const projectTypes = [
    { value: "organic", label: "Orgánico", description: "Proyectos pequeños, equipos experimentados" },
    { value: "semidetached", label: "Semi-acoplado", description: "Proyectos medianos, equipos mixtos" },
    { value: "embedded", label: "Empotrado", description: "Proyectos complejos, restricciones estrictas" },
  ]

  const handleNext = () => {
    // Validar datos según la pestaña actual
    if (currentTab === "basic") {
      if (!projectName || !projectType || !kloc) {
        alert("Por favor, complete todos los datos básicos del proyecto");
        return;
      }
      setCurrentTab("drivers");
    } else if (currentTab === "drivers") {
      // No hay validación necesaria para los conductores
      setCurrentTab("costs");
    } else if (currentTab === "costs") {
      // Validar que todos los costos por etapa estén completos
      const missingCosts = Object.entries(stageCosts)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingCosts.length > 0) {
        alert(`Por favor, complete los costos para las siguientes etapas: ${missingCosts.join(", ")}`);
        return;
      }

      // Validar que todos los porcentajes estén completos y sean válidos (permite 0%)
      const invalidPercentages = Object.entries(stagePercentages)
        .filter(([_, value]) => !value && value !== "0" || parseFloat(value) < 0)
        .map(([key]) => key);

      if (invalidPercentages.length > 0) {
        alert(`Por favor, ingrese porcentajes válidos (≥ 0%) para las siguientes etapas: ${invalidPercentages.join(", ")}`);
        return;
      }

      // Validar que la suma de porcentajes sea razonable (mínimo 10% para evitar proyectos vacíos)
      const totalPercentage = Object.values(stagePercentages)
        .reduce((sum, value) => sum + parseFloat(value), 0);

      if (totalPercentage < 10 || totalPercentage > 300) {
        alert(`La suma de porcentajes (${totalPercentage.toFixed(1)}%) parece inusual. Se recomienda entre 10% y 300%`);
        return;
      }

      setCurrentTab("results");
      setShowResults(true);
    }
  }

  const handleDriversChange = (newDrivers: any) => {
    setCostDrivers(prev => ({ ...prev, ...newDrivers }));
  }

  const getButtonText = () => {
    switch (currentTab) {
      case "basic":
        return "Siguiente: Conductores de Costo";
      case "drivers":
        return "Siguiente: Costos por Etapa";
      case "costs":
        return "Calcular Estimación";
      default:
        return "Calcular Estimación";
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">COCOMO-81 Intermedio</h1>
          <p className="text-gray-600 mt-2">Modelo de estimación de esfuerzo basado en líneas de código</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Modelo Clásico
        </Badge>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Datos Básicos</TabsTrigger>
          <TabsTrigger value="drivers">Conductores de Costo</TabsTrigger>
          <TabsTrigger value="costs">Costos por Etapa</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Configuración del Proyecto
              </CardTitle>
              <CardDescription>Ingrese los datos básicos del proyecto para la estimación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Nombre del Proyecto</Label>
                  <Input
                    id="project-name"
                    type="text"
                    placeholder="Ej: Sistema de Gestión Empresarial"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">Nombre descriptivo para identificar el proyecto</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="project-type">Tipo de Proyecto</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kloc">Tamaño del Software (KLOC)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="kloc"
                      type="number"
                      placeholder="Ej: 50"
                      value={kloc}
                      onChange={(e) => setKloc(e.target.value)}
                      className="flex-1"
                    />
                    <Link href="/function-points" target="_blank">
                      <Button type="button" variant="outline" size="sm" className="whitespace-nowrap">
                        <Calculator className="w-4 h-4 mr-1" />
                        Calcular FP
                      </Button>
                    </Link>
                  </div>
                  {fromFP ? (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700">
                        Valor calculado desde Puntos de Función ({kloc} KLOC)
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setFromFP(false)}
                        className="ml-auto h-6 px-2 text-xs"
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Miles de líneas de código estimadas • 
                      <span className="text-600 ml-1">
                        ¿No conoces el tamaño? Calcula puntos de función y copia el valor KLOC
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {projectType && (
                <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                  <h3 className="font-medium text-blue-900 mb-4">
                    Ecuaciones COCOMO-81 - {projectTypes.find((t) => t.value === projectType)?.label}
                  </h3>
                  <div className="space-y-4 text-blue-800">
                    {projectType === "organic" && (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Ecuación de Esfuerzo:</p>
                          <BlockMath math="MM = 3.2 \times (KLOC)^{1.05} \times EAF" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Ecuación de Tiempo:</p>
                          <BlockMath math="TDEV = 2.5 \times (MM)^{0.38}" />
                        </div>
                      </>
                    )}
                    {projectType === "semidetached" && (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Ecuación de Esfuerzo:</p>
                          <BlockMath math="MM = 3.0 \times (KLOC)^{1.12} \times EAF" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Ecuación de Tiempo:</p>
                          <BlockMath math="TDEV = 2.5 \times (MM)^{0.35}" />
                        </div>
                      </>
                    )}
                    {projectType === "embedded" && (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Ecuación de Esfuerzo:</p>
                          <BlockMath math="MM = 2.8 \times (KLOC)^{1.20} \times EAF" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Ecuación de Tiempo:</p>
                          <BlockMath math="TDEV = 2.5 \times (MM)^{0.32}" />
                        </div>
                      </>
                    )}
                    <div className="pt-2 border-t border-blue-200">
                      <p className="text-sm">
                        Donde:
                      </p>
                      <ul className="text-sm space-y-1 mt-2">
                        <li><InlineMath math="MM" /> = Esfuerzo en Meses-Hombre</li>
                        <li><InlineMath math="KLOC" /> = Miles de Líneas de Código</li>
                        <li><InlineMath math="EAF" /> = Factor de Ajuste del Esfuerzo</li>
                        <li><InlineMath math="TDEV" /> = Tiempo de Desarrollo en Meses</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <CostDrivers
            model="cocomo81"
            onDriversChange={handleDriversChange}
            initialValues={costDrivers}
          />
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Costos y Distribución por Etapas</CardTitle>
              <CardDescription>Configure el costo por persona-mes y el porcentaje de distribución del esfuerzo para cada etapa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Presets de Configuración Rápida */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-medium text-indigo-800 mb-3 flex items-center gap-2">
                  Configuración Rápida
                </h4>
                <div className="grid md:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStagePercentages({
                        requirements: "8",
                        analysis: "18", 
                        design: "25",
                        coding: "26",
                        testing: "31",
                        integration: "28"
                      });
                      setStageCosts({
                        requirements: "5000",
                        analysis: "5500",
                        design: "6000", 
                        coding: "5000",
                        testing: "5500",
                        integration: "6000"
                      });
                    }}
                    className="text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium text-sm">Estándar</div>
                      <div className="text-xs text-gray-500">Distribución tradicional (136%)</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStagePercentages({
                        requirements: "15",
                        analysis: "20", 
                        design: "25",
                        coding: "25",
                        testing: "15",
                        integration: "0"
                      });
                      setStageCosts({
                        requirements: "4500",
                        analysis: "5000",
                        design: "5500", 
                        coding: "4800",
                        testing: "5200",
                        integration: "5000"
                      });
                    }}
                    className="text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium text-sm">Ágil</div>
                      <div className="text-xs text-gray-500">Metodología ágil (100%)</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStagePercentages({
                        requirements: "12",
                        analysis: "15", 
                        design: "20",
                        coding: "30",
                        testing: "20",
                        integration: "3"
                      });
                      setStageCosts({
                        requirements: "6000",
                        analysis: "6500",
                        design: "7000", 
                        coding: "5500",
                        testing: "6000",
                        integration: "6500"
                      });
                    }}
                    className="text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium text-sm">Enterprise</div>
                      <div className="text-xs text-gray-500">Proyecto corporativo (100%)</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Validación y Estado Actual */}
              <div className={`border rounded-lg p-4 transition-colors ${
                (() => {
                  const total = Object.values(stagePercentages).reduce((sum, value) => sum + parseFloat(value || "0"), 0);
                  if (total < 10) return "bg-red-50 border-red-200";
                  if (total > 300) return "bg-red-50 border-red-200";
                  if (total >= 90 && total <= 110) return "bg-green-50 border-green-200";
                  return "bg-amber-50 border-amber-200";
                })()
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    Estado de Distribución
                    {(() => {
                      const total = Object.values(stagePercentages).reduce((sum, value) => sum + parseFloat(value || "0"), 0);
                      if (total >= 90 && total <= 110) return <span className="text-green-600">✓</span>;
                      if (total < 10 || total > 300) return <span className="text-red-600">⚠</span>;
                      return <span className="text-amber-600">!</span>;
                    })()}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const total = Object.values(stagePercentages).reduce((sum, value) => sum + parseFloat(value || "0"), 0);
                      if (total === 0) return;
                      
                      const factor = 100 / total;
                      const normalized = Object.entries(stagePercentages).reduce((acc, [key, value]) => ({
                        ...acc,
                        [key]: (parseFloat(value || "0") * factor).toFixed(1)
                      }), {} as typeof stagePercentages);
                      
                      setStagePercentages(normalized);
                    }}
                    className="h-8 px-3 text-xs"
                  >
                    Normalizar a 100%
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total actual:</span>
                    <span className="font-medium">
                      {Object.values(stagePercentages).reduce((sum, value) => sum + parseFloat(value || "0"), 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (() => {
                          const total = Object.values(stagePercentages).reduce((sum, value) => sum + parseFloat(value || "0"), 0);
                          if (total >= 90 && total <= 110) return "bg-green-500";
                          if (total < 10 || total > 300) return "bg-red-500";
                          return "bg-amber-500";
                        })()
                      }`}
                      style={{ 
                        width: `${Math.min(100, (Object.values(stagePercentages).reduce((sum, value) => sum + parseFloat(value || "0"), 0) / 200) * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    {(() => {
                      const total = Object.values(stagePercentages).reduce((sum, value) => sum + parseFloat(value || "0"), 0);
                      if (total >= 90 && total <= 110) return "✅ Distribución equilibrada";
                      if (total < 10) return "⚠️ Muy poco esfuerzo asignado";
                      if (total > 300) return "⚠️ Distribución excesiva";
                      if (total > 150) return "ℹ️ Incluye superposición de actividades";
                      return "ℹ️ Revise la distribución";
                    })()}
                  </div>
                </div>
              </div>

              {/* Configuración de Etapas Mejorada */}
              <div className="grid gap-4">
                {[
                  { 
                    key: "requirements", 
                    label: "Requerimientos", 
                    placeholder: "5000", 
                    description: "Levantamiento y documentación de requisitos"
                  },
                  { 
                    key: "analysis", 
                    label: "Análisis", 
                    placeholder: "5500", 
                    description: "Análisis de requisitos y modelado del sistema"
                  },
                  { 
                    key: "design", 
                    label: "Diseño", 
                    placeholder: "6000", 
                    description: "Diseño arquitectónico y detallado"
                  },
                  { 
                    key: "coding", 
                    label: "Codificación", 
                    placeholder: "5000", 
                    description: "Implementación y desarrollo del código"
                  },
                  { 
                    key: "testing", 
                    label: "Pruebas", 
                    placeholder: "5500", 
                    description: "Pruebas unitarias, integración y sistema"
                  },
                  { 
                    key: "integration", 
                    label: "Integración", 
                    placeholder: "6000", 
                    description: "Integración y despliegue del sistema"
                  }
                ].map(({ key, label, placeholder, description }) => {
                  const currentPercentage = parseFloat(stagePercentages[key as keyof typeof stagePercentages] || "0");
                  const currentCost = stageCosts[key as keyof typeof stageCosts];
                  
                                     return (
                     <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                       <div className="flex items-center gap-3 mb-3">
                         <div className="flex-1">
                           <h5 className="font-medium text-gray-900">{label}</h5>
                           <p className="text-xs text-gray-500">{description}</p>
                         </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {currentPercentage}%
                          </div>
                          <div className="text-xs text-gray-500">
                            ${currentCost || "0"}/mes
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`cost-${key}`} className="text-sm font-medium text-gray-700">
                            Costo mensual por persona ($)
                          </Label>
                          <Input
                            id={`cost-${key}`}
                            type="number"
                            placeholder={placeholder}
                            value={currentCost}
                            onChange={(e) => setStageCosts((prev) => ({ ...prev, [key]: e.target.value }))}
                            className="bg-white transition-colors focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`percent-${key}`} className="text-sm font-medium text-gray-700">
                            Porcentaje del esfuerzo total (%)
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={`percent-${key}`}
                              type="number"
                              step="0.1"
                              min="0"
                              max="200"
                              placeholder="0"
                              value={stagePercentages[key as keyof typeof stagePercentages]}
                              onChange={(e) => setStagePercentages((prev) => ({ ...prev, [key]: e.target.value }))}
                              className="bg-white transition-colors focus:border-blue-500"
                            />
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const current = parseFloat(stagePercentages[key as keyof typeof stagePercentages] || "0");
                                  setStagePercentages((prev) => ({ ...prev, [key]: String(Math.max(0, current - 5)) }));
                                }}
                                className="h-10 w-10 p-0"
                              >
                                -
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const current = parseFloat(stagePercentages[key as keyof typeof stagePercentages] || "0");
                                  setStagePercentages((prev) => ({ ...prev, [key]: String(Math.min(200, current + 5)) }));
                                }}
                                className="h-10 w-10 p-0"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Barra de progreso individual */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-100 rounded-full h-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (currentPercentage / 50) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Guía de Rangos Típicos</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
                  <div className="space-y-1">
                    <div className="font-medium">Proyectos Ágiles:</div>
                    <div>• Requerimientos: 10-15%</div>
                    <div>• Análisis: 15-20%</div>
                    <div>• Diseño: 20-25%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Proyectos Tradicionales:</div>
                    <div>• Codificación: 25-35%</div>
                    <div>• Pruebas: 20-30%</div>
                    <div>• Integración: 5-15%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Proyectos Críticos:</div>
                    <div>• Análisis: 20-30%</div>
                    <div>• Pruebas: 30-45%</div>
                    <div>• Total: 120-180%</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-600">
                                         <strong>Tip:</strong> Use 0% para omitir etapas que no aplican. Los totales &gt;100% son normales en proyectos con actividades superpuestas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {showResults ? (
            <EstimationResults
              model="cocomo81"
              data={{ projectName, projectType, kloc, costDrivers, stageCosts, stagePercentages }}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Resultados de la Estimación</CardTitle>
                <CardDescription>
                  Complete los datos del proyecto y presione "Calcular Estimación" para ver los resultados
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Calculator className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Los resultados se mostrarán aquí después de calcular la estimación
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Link href="/help">
          <Button variant="outline" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Ver Ayuda
          </Button>
        </Link>
        {currentTab !== "results" && (
          <Button onClick={handleNext} className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            {getButtonText()}
          </Button>
        )}
      </div>
    </div>
  )
}
