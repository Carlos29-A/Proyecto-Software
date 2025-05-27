"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Calculator, TrendingUp } from "lucide-react"
import { ScaleDrivers } from "@/components/scale-drivers"
import { EffortMultipliers } from "@/components/effort-multipliers"
import { EstimationResults } from "@/components/estimation-results"

export default function CocomoIIPage() {
  const [kloc, setKloc] = useState("")
  const [scaleDrivers, setScaleDrivers] = useState({})
  const [effortMultipliers, setEffortMultipliers] = useState({})
  const [stageCosts, setStageCosts] = useState({
    inception: "",
    elaboration: "",
    construction: "",
    transition: "",
  })

  const handleCalculate = () => {
    console.log("Calculando COCOMO II...", { kloc, scaleDrivers, effortMultipliers, stageCosts })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">COCOMO II Post-Arquitectura</h1>
          <p className="text-gray-600 mt-2">Modelo avanzado con conductores de escala y multiplicadores de esfuerzo</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Modelo Avanzado
        </Badge>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Datos Básicos</TabsTrigger>
          <TabsTrigger value="scale">Conductores de Escala</TabsTrigger>
          <TabsTrigger value="effort">Multiplicadores</TabsTrigger>
          <TabsTrigger value="costs">Costos por Fase</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Configuración del Proyecto
              </CardTitle>
              <CardDescription>Configure los parámetros básicos para COCOMO II Post-Arquitectura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="kloc-ii">Tamaño del Software (KLOC)</Label>
                <Input
                  id="kloc-ii"
                  type="number"
                  placeholder="Ej: 100"
                  value={kloc}
                  onChange={(e) => setKloc(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Miles de líneas de código estimadas (sin comentarios ni líneas en blanco)
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Ecuación COCOMO II Post-Arquitectura</h3>
                <div className="space-y-1 text-sm text-green-800">
                  <p className="font-mono">Esfuerzo = A × (Tamaño)^E × ∏EM</p>
                  <p className="font-mono">E = B + 0.01 × ∑SF</p>
                  <p className="font-mono">Tiempo = C × (Esfuerzo)^F</p>
                  <div className="text-xs mt-2 space-y-1">
                    <p>A = 2.94 (constante de calibración)</p>
                    <p>B = 0.91 (exponente base)</p>
                    <p>C = 3.67 (constante de tiempo)</p>
                    <p>F = 0.28 + 0.2 × (E - B) (exponente de tiempo)</p>
                    <p>SF = Factores de Escala, EM = Multiplicadores de Esfuerzo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scale">
          <ScaleDrivers onDriversChange={setScaleDrivers} />
        </TabsContent>

        <TabsContent value="effort">
          <EffortMultipliers onMultipliersChange={setEffortMultipliers} />
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Costo por Fases RUP</CardTitle>
              <CardDescription>
                Configure el costo por persona-mes para cada fase del Proceso Unificado Racional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inception">Inicio ($/mes)</Label>
                  <Input
                    id="inception"
                    type="number"
                    placeholder="6000"
                    value={stageCosts.inception}
                    onChange={(e) => setStageCosts((prev) => ({ ...prev, inception: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">Definición de alcance y viabilidad</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="elaboration">Elaboración ($/mes)</Label>
                  <Input
                    id="elaboration"
                    type="number"
                    placeholder="6500"
                    value={stageCosts.elaboration}
                    onChange={(e) => setStageCosts((prev) => ({ ...prev, elaboration: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">Arquitectura y planificación</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="construction">Construcción ($/mes)</Label>
                  <Input
                    id="construction"
                    type="number"
                    placeholder="5500"
                    value={stageCosts.construction}
                    onChange={(e) => setStageCosts((prev) => ({ ...prev, construction: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">Desarrollo e implementación</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transition">Transición ($/mes)</Label>
                  <Input
                    id="transition"
                    type="number"
                    placeholder="6000"
                    value={stageCosts.transition}
                    onChange={(e) => setStageCosts((prev) => ({ ...prev, transition: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">Despliegue y entrega</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <EstimationResults model="cocomo2" data={{ kloc, scaleDrivers, effortMultipliers, stageCosts }} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Ver Ayuda
        </Button>
        <Button onClick={handleCalculate} className="flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Calcular Estimación
        </Button>
      </div>
    </div>
  )
}
