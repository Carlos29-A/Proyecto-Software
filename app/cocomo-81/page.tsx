"use client"

import { useState } from "react"
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

export default function Cocomo81Page() {
  const [projectType, setProjectType] = useState("")
  const [kloc, setKloc] = useState("")
  const [costDrivers, setCostDrivers] = useState({})
  const [stageCosts, setStageCosts] = useState({
    requirements: "",
    analysis: "",
    design: "",
    coding: "",
    testing: "",
    integration: "",
  })
  const [showResults, setShowResults] = useState(false)
  const [currentTab, setCurrentTab] = useState("basic")

  const projectTypes = [
    { value: "organic", label: "Orgánico", description: "Proyectos pequeños, equipos experimentados" },
    { value: "semidetached", label: "Semi-acoplado", description: "Proyectos medianos, equipos mixtos" },
    { value: "embedded", label: "Empotrado", description: "Proyectos complejos, restricciones estrictas" },
  ]

  const handleNext = () => {
    // Validar datos según la pestaña actual
    if (currentTab === "basic") {
      if (!projectType || !kloc) {
        alert("Por favor, complete los datos básicos del proyecto (Tipo de Proyecto y KLOC)");
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
                  <Input
                    id="kloc"
                    type="number"
                    placeholder="Ej: 50"
                    value={kloc}
                    onChange={(e) => setKloc(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">Miles de líneas de código estimadas</p>
                </div>
              </div>

              {projectType && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">
                    Ecuaciones COCOMO-81 - {projectTypes.find((t) => t.value === projectType)?.label}
                  </h3>
                  <div className="space-y-1 text-sm text-blue-800">
                    {projectType === "organic" && (
                      <>
                        <p>Esfuerzo (MM) = 3.2 × (KLOC)^1.05 × EAF</p>
                        <p>Tiempo (TDEV) = 2.5 × (MM)^0.38</p>
                      </>
                    )}
                    {projectType === "semidetached" && (
                      <>
                        <p>Esfuerzo (MM) = 3.0 × (KLOC)^1.12 × EAF</p>
                        <p>Tiempo (TDEV) = 2.5 × (MM)^0.35</p>
                      </>
                    )}
                    {projectType === "embedded" && (
                      <>
                        <p>Esfuerzo (MM) = 2.8 × (KLOC)^1.20 × EAF</p>
                        <p>Tiempo (TDEV) = 2.5 × (MM)^0.32</p>
                      </>
                    )}
                    <p className="text-xs mt-2">
                      EAF = Factor de Ajuste del Esfuerzo (producto de conductores de costo)
                    </p>
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
              <CardTitle>Costo Hombre-Mes por Etapas</CardTitle>
              <CardDescription>Configure el costo por persona-mes para cada etapa del desarrollo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requerimientos ($/mes)</Label>
                  <Input
                    id="requirements"
                    type="number"
                    placeholder="5000"
                    value={stageCosts.requirements}
                    onChange={(e) => setStageCosts((prev) => ({ ...prev, requirements: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="analysis">Análisis ($/mes)</Label>
                  <Input
                    id="analysis"
                    type="number"
                    placeholder="5500"
                    value={stageCosts.analysis}
                    onChange={(e) => setStageCosts((prev) => ({ ...prev, analysis: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="design">Diseño ($/mes)</Label>
                  <Input
                    id="design"
                    type="number"
                    placeholder="6000"
                    value={stageCosts.design}
                    onChange={(e) => setStageCosts((prev) => ({ ...prev, design: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coding">Codificación ($/mes)</Label>
                  <Input
                    id="coding"
                    type="number"
                    placeholder="5000"
                    value={stageCosts.coding}
                    onChange={(e) => setStageCosts((prev) => ({ ...prev, coding: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testing">Pruebas ($/mes)</Label>
                  <Input
                    id="testing"
                    type="number"
                    placeholder="5500"
                    value={stageCosts.testing}
                    onChange={(e) => setStageCosts((prev) => ({ ...prev, testing: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="integration">Integración ($/mes)</Label>
                  <Input
                    id="integration"
                    type="number"
                    placeholder="6000"
                    value={stageCosts.integration}
                    onChange={(e) => setStageCosts((prev) => ({ ...prev, integration: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {showResults ? (
            <EstimationResults
              model="cocomo81"
              data={{ projectType, kloc, costDrivers, stageCosts }}
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
        <Button variant="outline" className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Ver Ayuda
        </Button>
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
