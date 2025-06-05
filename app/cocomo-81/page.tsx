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
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-800 mb-2">📊 Distribución del Esfuerzo</h4>
                <p className="text-sm text-amber-700">
                  Los porcentajes representan qué parte del esfuerzo total se asigna a cada etapa. 
                  Puede usar 0% para etapas que no aplican a su proyecto. La suma puede exceder 100% debido a superposición de actividades.
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  <strong>Total actual:</strong> {Object.values(stagePercentages).reduce((sum, value) => sum + parseFloat(value || "0"), 0).toFixed(1)}%
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  { key: "requirements", label: "Requerimientos", placeholder: "5000" },
                  { key: "analysis", label: "Análisis", placeholder: "5500" },
                  { key: "design", label: "Diseño", placeholder: "6000" },
                  { key: "coding", label: "Codificación", placeholder: "5000" },
                  { key: "testing", label: "Pruebas", placeholder: "5500" },
                  { key: "integration", label: "Integración", placeholder: "6000" }
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor={`cost-${key}`} className="text-sm font-medium">
                        {label} - Costo ($/mes-hombre)
                      </Label>
                      <Input
                        id={`cost-${key}`}
                        type="number"
                        placeholder={placeholder}
                        value={stageCosts[key as keyof typeof stageCosts]}
                        onChange={(e) => setStageCosts((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`percent-${key}`} className="text-sm font-medium">
                        {label} - Porcentaje del Esfuerzo (%)
                      </Label>
                      <Input
                        id={`percent-${key}`}
                        type="number"
                        step="0.1"
                        min="0"
                        max="200"
                        placeholder="0"
                        value={stagePercentages[key as keyof typeof stagePercentages]}
                        onChange={(e) => setStagePercentages((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">💡 Sugerencias Típicas</h4>
                <div className="grid md:grid-cols-3 gap-2 text-sm text-blue-700">
                  <div>• Requerimientos: 0-15%</div>
                  <div>• Análisis: 0-25%</div>
                  <div>• Diseño: 10-30%</div>
                  <div>• Codificación: 15-35%</div>
                  <div>• Pruebas: 20-40%</div>
                  <div>• Integración: 15-35%</div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Los valores pueden superponerse según la metodología. Use 0% para omitir etapas que no aplican.
                </p>
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
