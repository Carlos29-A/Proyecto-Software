"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Calculator, Users, Plus, Trash2, FileText } from "lucide-react"
import { EstimationResults } from "@/components/estimation-results"
import { TechnicalFactors } from "@/components/technical-factors"
import { EnvironmentalFactors } from "@/components/environmental-factors"
import Link from "next/link"
import { generateUCPPDF } from "@/utils/pdf-generator"
import { BlockMath, InlineMath } from "react-katex"
import 'katex/dist/katex.min.css'

interface UseCase {
  id: number
  name: string
  complexity: string
  weight: number
}

interface Actor {
  id: number
  name: string
  complexity: string
  weight: number
}

export default function UseCasePointsPage() {
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [useCases, setUseCases] = useState<UseCase[]>([])
  const [actors, setActors] = useState<Actor[]>([])
  const [tcf, setTcf] = useState<Record<string, number>>({})
  const [ecf, setEcf] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [currentTab, setCurrentTab] = useState("basic")

  const complexityWeights = {
    usecase: { simple: 5, average: 10, complex: 15 },
    actor: { simple: 1, average: 2, complex: 3 },
  }

  const tcfWeights = {
    T1: 2.0, T2: 1.0, T3: 1.0, T4: 1.0, T5: 1.0,
    T6: 0.5, T7: 0.5, T8: 2.0, T9: 1.0, T10: 1.0,
    T11: 1.0, T12: 1.0, T13: 1.0
  }

  const ecfWeights = {
    E1: 1.5, E2: 0.5, E3: 1.0, E4: 0.5, E5: 1.0,
    E6: 2.0, E7: -1.0, E8: -1.0
  }

  // Definición de factores técnicos
  const technicalFactors = [
    { id: "T1", weight: 2.0 },
    { id: "T2", weight: 1.0 },
    { id: "T3", weight: 1.0 },
    { id: "T4", weight: 1.0 },
    { id: "T5", weight: 1.0 },
    { id: "T6", weight: 0.5 },
    { id: "T7", weight: 0.5 },
    { id: "T8", weight: 2.0 },
    { id: "T9", weight: 1.0 },
    { id: "T10", weight: 1.0 },
    { id: "T11", weight: 1.0 },
    { id: "T12", weight: 1.0 },
    { id: "T13", weight: 1.0 }
  ]

  // Definición de factores ambientales
  const environmentalFactors = [
    { id: "F1", weight: 1.5 },
    { id: "F2", weight: 0.5 },
    { id: "F3", weight: 1.0 },
    { id: "F4", weight: 0.5 },
    { id: "F5", weight: 1.0 },
    { id: "F6", weight: 2.0 },
    { id: "F7", weight: -1.0 },
    { id: "F8", weight: -1.0 }
  ]

  const addUseCase = () => {
    setUseCases([...useCases, { id: Date.now(), name: "", complexity: "", weight: 0 }])
  }

  const addActor = () => {
    setActors([...actors, { id: Date.now(), name: "", complexity: "", weight: 0 }])
  }

  const removeUseCase = (id: number) => {
    setUseCases(useCases.filter((uc) => uc.id !== id))
  }

  const removeActor = (id: number) => {
    setActors(actors.filter((a) => a.id !== id))
  }

  const updateUseCase = (id: number, field: string, value: string) => {
    setUseCases(
      useCases.map((uc) => {
        if (uc.id === id) {
          const updated = { ...uc, [field]: value }
          if (field === "complexity") {
            updated.weight = complexityWeights.usecase[value as keyof typeof complexityWeights.usecase] || 0
          }
          return updated
        }
        return uc
      }),
    )
  }

  const updateActor = (id: number, field: string, value: string) => {
    setActors(
      actors.map((a) => {
        if (a.id === id) {
          const updated = { ...a, [field]: value }
          if (field === "complexity") {
            updated.weight = complexityWeights.actor[value as keyof typeof complexityWeights.actor] || 0
          }
          return updated
        }
        return a
      }),
    )
  }

  const updateTcf = (factor: string, value: string) => {
    setTcf({ ...tcf, [factor]: parseInt(value) || 0 })
  }

  const updateEcf = (factor: string, value: string) => {
    setEcf({ ...ecf, [factor]: parseInt(value) || 0 })
  }

  const calculateUCP = () => {
    // Validar que haya al menos un caso de uso y un actor
    if (useCases.length === 0 && actors.length === 0) {
      return {
        uaw: 0,
        uucw: 0,
        uucp: 0,
        tcfValue: 0.6,
        ecfValue: 1.4,
        ucp: 0,
        factorsBelow3: 0,
        factorsAbove3: 0,
        totalFactors: 0,
        productivityFactor: 20,
        effort: 0
      }
    }

    // Calcular UAW (Unadjusted Actor Weight)
    const uaw = actors.reduce((sum, a) => sum + (a.weight || 0), 0)
    // Calcular UUCW (Unadjusted Use Case Weight)
    const uucw = useCases.reduce((sum, uc) => sum + (uc.weight || 0), 0)
    // Calcular UUCP (Unadjusted Use Case Points)
    const uucp = uaw + uucw

    // Calcular TCF (Technical Complexity Factor)
    const tcfSum = Object.entries(tcf).reduce((sum, [factor, value]) => {
      const weight = technicalFactors.find(f => f.id === factor)?.weight || 0
      return sum + (weight * (value || 0))
    }, 0)
    const tcfValue = Math.max(0.6, 0.6 + (0.01 * tcfSum))

    // Calcular ECF (Environmental Complexity Factor)
    const ecfSum = Object.entries(ecf).reduce((sum, [factor, value]) => {
      const weight = environmentalFactors.find(f => f.id === factor)?.weight || 0
      return sum + (weight * (value || 0))
    }, 0)
    const ecfValue = Math.max(0.6, 1.4 + (-0.03 * ecfSum))

    // Calcular UCP (Use Case Points)
    const ucp = uucp * tcfValue * ecfValue

    // Calcular factores críticos
    let factorsBelow3 = 0
    let factorsAbove3 = 0
    for (let i = 1; i <= 6; i++) {
      const value = ecf[`F${i}`] || 0
      if (value < 3) factorsBelow3++
    }
    for (let i = 7; i <= 8; i++) {
      const value = ecf[`F${i}`] || 0
      if (value > 3) factorsAbove3++
    }
    const totalFactors = factorsBelow3 + factorsAbove3
    let productivityFactor = 20
    if (totalFactors <= 2) productivityFactor = 20
    else if (totalFactors <= 4) productivityFactor = 28
    else productivityFactor = 36
    // Calcular esfuerzo
    const effort = ucp * productivityFactor
    return {
      uaw,
      uucw,
      uucp,
      tcfValue,
      ecfValue,
      ucp,
      factorsBelow3,
      factorsAbove3,
      totalFactors,
      productivityFactor,
      effort
    }
  }

  const handleNext = () => {
    if (currentTab === "basic") {
      setCurrentTab("usecases")
    } else if (currentTab === "usecases") {
      setCurrentTab("actors")
    } else if (currentTab === "actors") {
      setCurrentTab("technical")
    } else if (currentTab === "technical") {
      setCurrentTab("environmental")
    } else if (currentTab === "environmental") {
      setCurrentTab("results")
      setShowResults(true)
    }
  }

  const getButtonText = () => {
    switch (currentTab) {
      case "basic":
        return "Siguiente: Casos de Uso"
      case "usecases":
        return "Siguiente: Actores"
      case "actors":
        return "Siguiente: Factores Técnicos"
      case "technical":
        return "Siguiente: Factores Ambientales"
      case "environmental":
        return "Calcular Estimación"
      default:
        return "Siguiente"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Puntos de Casos de Uso</h1>
          <p className="text-gray-600 mt-2">
            Estimación basada en casos de uso con factores de complejidad técnica y ambiente
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          UCP Method
        </Badge>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Datos Básicos</TabsTrigger>
          <TabsTrigger value="usecases">Casos de Uso</TabsTrigger>
          <TabsTrigger value="actors">Actores</TabsTrigger>
          <TabsTrigger value="technical">F. Técnicos</TabsTrigger>
          <TabsTrigger value="environmental">F. Ambientales</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Información del Proyecto
              </CardTitle>
              <CardDescription>Ingrese los datos básicos del proyecto para la estimación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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

              <div className="bg-green-50 p-4 rounded-lg mt-4 text-green-900">
                <div className="space-y-6">
                  <div>
                    <span className="font-bold text-base">Puntos de Casos de Uso (UCP):</span>
                    <div className="ml-4 mt-2 text-xl">
                      <BlockMath math={String.raw`\text{UCP} = (UUCW + UAW) \times TCF \times ECF`} />
                    </div>
                  </div>
                  <div className="text-sm mt-2 space-y-1">
                    <ul className="space-y-1">
                      <li><InlineMath math="UUCW" /> = Peso de Casos de Uso sin Ajustar</li>
                      <li><InlineMath math="UAW" /> = Peso de Actores sin Ajustar</li>
                      <li><InlineMath math="TCF" /> = Factor de Complejidad Técnica</li>
                      <li><InlineMath math="ECF" /> = Factor de Complejidad Ambiental</li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-green-200">
                    <span className="font-bold text-base">Factor de Complejidad Técnica (TCF):</span>
                    <div className="ml-4 mt-2 text-xl">
                      <BlockMath math={String.raw`TCF = 0.6 + (0.01 \times \sum_{i=1}^{13} w_i \times v_i)`} />
                    </div>
                    <p className="text-sm mt-2">
                      Donde:
                      <ul className="space-y-1 mt-1">
                        <li><InlineMath math="w_i" /> = Peso del factor técnico i (0.5 - 2.0)</li>
                        <li><InlineMath math="v_i" /> = Valor asignado al factor i (0 - 5)</li>
                      </ul>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-green-200">
                    <span className="font-bold text-base">Factor de Complejidad Ambiental (ECF):</span>
                    <div className="ml-4 mt-2 text-xl">
                      <BlockMath math={String.raw`ECF = 1.4 + (-0.03 \times \sum_{i=1}^{8} w_i \times v_i)`} />
                    </div>
                    <p className="text-sm mt-2">
                      Donde:
                      <ul className="space-y-1 mt-1">
                        <li><InlineMath math="w_i" /> = Peso del factor ambiental i (-1.0 - 2.0)</li>
                        <li><InlineMath math="v_i" /> = Valor asignado al factor i (0 - 5)</li>
                      </ul>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-green-200">
                    <span className="font-bold text-base">Esfuerzo Estimado:</span>
                    <div className="ml-4 mt-2 text-xl">
                      <BlockMath math={String.raw`\text{Esfuerzo} = \text{UCP} \times \text{PF}`} />
                    </div>
                    <div className="text-sm mt-2 space-y-2">
                      <p>Donde PF (Factor de Productividad) se determina según:</p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>Contar factores F1-F6 con valor &lt; 3</li>
                        <li>Contar factores F7-F8 con valor &gt; 3</li>
                        <li>Si total ≤ 2: PF = 20 horas/UCP</li>
                        <li>Si total = 3 o 4: PF = 28 horas/UCP</li>
                        <li>Si total ≥ 5: Se debe considerar hacer cambios al proyecto</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usecases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Casos de Uso del Sistema
              </CardTitle>
              <CardDescription>
                Defina los casos de uso y su complejidad para calcular el peso no ajustado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {useCases.map((useCase, index) => (
                <div key={useCase.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`usecase-${useCase.id}`}>Caso de Uso {index + 1}</Label>
                    <Input
                      id={`usecase-${useCase.id}`}
                      placeholder="Nombre del caso de uso"
                      value={useCase.name}
                      onChange={(e) => updateUseCase(useCase.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="w-48 space-y-2">
                    <Label>Complejidad</Label>
                    <Select
                      value={useCase.complexity}
                      onValueChange={(value) => updateUseCase(useCase.id, "complexity", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple (5 pts)</SelectItem>
                        <SelectItem value="average">Promedio (10 pts)</SelectItem>
                        <SelectItem value="complex">Complejo (15 pts)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-20 text-center">
                    <Label>Peso</Label>
                    <div className="text-lg font-semibold">{useCase.weight}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeUseCase(useCase.id)}
                    disabled={useCases.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button onClick={addUseCase} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Caso de Uso
              </Button>

              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-blue-900">Criterios de Complejidad para Casos de Uso</h4>
                
                <div>
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Por Número de Transacciones:</h5>
                  <div className="bg-white rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-blue-100">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-blue-900">Tipo de Caso de Uso</th>
                          <th className="px-4 py-2 text-left font-medium text-blue-900">Descripción</th>
                          <th className="px-4 py-2 text-center font-medium text-blue-900">Factor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-100">
                        <tr>
                          <td className="px-4 py-2 font-medium">Simple</td>
                          <td className="px-4 py-2">Menor o igual que 3 transacciones</td>
                          <td className="px-4 py-2 text-center">5</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-medium">Medio</td>
                          <td className="px-4 py-2">De 4 a 7 transacciones</td>
                          <td className="px-4 py-2 text-center">10</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-medium">Complejo</td>
                          <td className="px-4 py-2">Mayor que 7 transacciones</td>
                          <td className="px-4 py-2 text-center">15</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Por Clases de Análisis:</h5>
                  <div className="bg-white rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-blue-100">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-blue-900">Tipo de Caso de Uso</th>
                          <th className="px-4 py-2 text-left font-medium text-blue-900">Descripción</th>
                          <th className="px-4 py-2 text-center font-medium text-blue-900">Factor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-100">
                        <tr>
                          <td className="px-4 py-2 font-medium">Simple</td>
                          <td className="px-4 py-2">Menor que 5 clases de análisis</td>
                          <td className="px-4 py-2 text-center">5</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-medium">Medio</td>
                          <td className="px-4 py-2">De 5 a 10 clases de análisis</td>
                          <td className="px-4 py-2 text-center">10</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-medium">Complejo</td>
                          <td className="px-4 py-2">Mayor que 10 clases de análisis</td>
                          <td className="px-4 py-2 text-center">15</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="text-xs text-blue-700 mt-2">
                  * Seleccione el criterio más apropiado según el contexto de su proyecto: transacciones para enfoque funcional o clases de análisis para enfoque estructural.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actores del Sistema</CardTitle>
              <CardDescription>
                Identifique los actores y su complejidad para calcular el peso de los actores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {actors.map((actor, index) => (
                <div key={actor.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`actor-${actor.id}`}>Actor {index + 1}</Label>
                    <Input
                      id={`actor-${actor.id}`}
                      placeholder="Nombre del actor"
                      value={actor.name}
                      onChange={(e) => updateActor(actor.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="w-48 space-y-2">
                    <Label>Complejidad</Label>
                    <Select
                      value={actor.complexity}
                      onValueChange={(value) => updateActor(actor.id, "complexity", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple (1 pt)</SelectItem>
                        <SelectItem value="average">Promedio (2 pts)</SelectItem>
                        <SelectItem value="complex">Complejo (3 pts)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-20 text-center">
                    <Label>Peso</Label>
                    <div className="text-lg font-semibold">{actor.weight}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeActor(actor.id)}
                    disabled={actors.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button onClick={addActor} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Actor
              </Button>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Criterios de Complejidad para Actores</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Simple (1 pt):</strong> API o interfaz definida
                  </p>
                  <p>
                    <strong>Promedio (2 pts):</strong> Interacción a través de protocolo
                  </p>
                  <p>
                    <strong>Complejo (3 pts):</strong> Interfaz gráfica de usuario
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <TechnicalFactors 
            onFactorsChange={(factors) => setTcf(factors)}
            initialValues={tcf}
          />
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          <EnvironmentalFactors 
            onFactorsChange={(factors) => setEcf(factors)}
            initialValues={ecf}
          />
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Datos del Proyecto</CardTitle>
              <CardDescription>Características principales utilizadas en la estimación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Configuración Básica</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="font-medium">Nombre del proyecto:</span>
                      <Badge variant="default" className="max-w-[200px] truncate">{projectName || "Sin nombre"}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Descripción:</span>
                      <Badge variant="outline" className="max-w-[200px] truncate">{projectDescription || "Sin descripción"}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Casos de Uso y Actores</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Total de casos de uso:</span>
                      <Badge variant="outline">{useCases.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Total de actores:</span>
                      <Badge variant="outline">{actors.length}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Factores Técnicos</h3>
                <div className="grid md:grid-cols-4 gap-3">
                  {Object.entries(tcf).map(([factor, value]) => (
                    <div key={factor} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="font-mono text-sm">{factor}:</span>
                      <Badge variant="secondary" className="text-xs">{value}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Factores Ambientales</h3>
                <div className="grid md:grid-cols-4 gap-3">
                  {Object.entries(ecf).map(([factor, value]) => (
                    <div key={factor} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="font-mono text-sm">{factor}:</span>
                      <Badge variant="secondary" className="text-xs">{value}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultados de la Estimación</CardTitle>
              <CardDescription>Estimaciones calculadas usando el método de Puntos de Casos de Uso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900">Puntos de Caso de Uso</h3>
                  <p className="text-2xl font-bold text-blue-700">{calculateUCP().ucp.toFixed(2)}</p>
                  <p className="text-sm text-blue-600">UCP</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900">Esfuerzo Estimado</h3>
                  <p className="text-2xl font-bold text-green-700">{calculateUCP().effort.toFixed(2)}</p>
                  <p className="text-sm text-green-600">Horas</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-900">Factor de Productividad</h3>
                  <p className="text-2xl font-bold text-purple-700">{calculateUCP().productivityFactor}</p>
                  <p className="text-sm text-purple-600">Horas/UCP</p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-medium text-orange-900">Peso de Actores</h3>
                  <p className="text-2xl font-bold text-orange-700">{calculateUCP().uaw.toFixed(2)}</p>
                  <p className="text-sm text-orange-600">UAW</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <h3 className="font-medium text-teal-900">Peso de Casos de Uso</h3>
                  <p className="text-2xl font-bold text-teal-700">{calculateUCP().uucw.toFixed(2)}</p>
                  <p className="text-sm text-teal-600">UUCW</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-medium text-indigo-900">Factor Técnico</h3>
                  <p className="text-2xl font-bold text-indigo-700">{calculateUCP().tcfValue.toFixed(2)}</p>
                  <p className="text-sm text-indigo-600">TCF</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <h3 className="font-medium text-pink-900">Factor Ambiental</h3>
                  <p className="text-2xl font-bold text-pink-700">{calculateUCP().ecfValue.toFixed(2)}</p>
                  <p className="text-sm text-pink-600">ECF</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-900">Análisis de Factores Ambientales</h3>
                <div className="grid md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-2xl font-bold text-yellow-700">{calculateUCP().factorsBelow3}</p>
                    <p className="text-sm text-yellow-600">F1-F6 con valor &lt; 3</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-700">{calculateUCP().factorsAbove3}</p>
                    <p className="text-sm text-yellow-600">F7-F8 con valor &gt; 3</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-700">{calculateUCP().totalFactors}</p>
                    <p className="text-sm text-yellow-600">Total factores críticos</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-yellow-200">
                  {calculateUCP().totalFactors >= 5 ? (
                    <p className="text-sm text-yellow-800">Se recomienda hacer cambios en el proyecto para reducir los factores críticos.</p>
                  ) : calculateUCP().totalFactors >= 3 ? (
                    <p className="text-sm text-yellow-800">El proyecto tiene riesgos moderados. Considere acciones de mitigación.</p>
                  ) : (
                    <p className="text-sm text-yellow-800">El proyecto tiene un nivel de riesgo aceptable.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ecuaciones Utilizadas</CardTitle>
              <CardDescription>Fórmulas matemáticas aplicadas en la estimación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Puntos de Caso de Uso:</p>
                  <BlockMath math={String.raw`UCP = (UUCW + UAW) \times TCF \times ECF`} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Factor de Complejidad Técnica:</p>
                  <BlockMath math={String.raw`TCF = 0.6 + (0.01 \times \sum_{i=1}^{13} w_i \times v_i)`} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Factor de Complejidad Ambiental:</p>
                  <BlockMath math={String.raw`ECF = 1.4 + (-0.03 \times \sum_{i=1}^{8} w_i \times v_i)`} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Esfuerzo Estimado:</p>
                  <BlockMath math={String.raw`Esfuerzo = UCP \times PF`} />
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Donde:</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li><InlineMath math="UUCW" /> = Peso de Casos de Uso sin Ajustar</li>
                    <li><InlineMath math="UAW" /> = Peso de Actores sin Ajustar</li>
                    <li><InlineMath math="TCF" /> = Factor de Complejidad Técnica</li>
                    <li><InlineMath math="ECF" /> = Factor de Complejidad Ambiental</li>
                    <li><InlineMath math="PF" /> = Factor de Productividad (20-28 horas/UCP)</li>
                    <li><InlineMath math="w_i" /> = Peso del factor</li>
                    <li><InlineMath math="v_i" /> = Valor asignado (0-5)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button onClick={() => generateUCPPDF({ projectName, projectDescription, useCases, actors, tcf, ecf }, calculateUCP())}>
              <FileText className="w-4 h-4 mr-2" />
              Generar PDF
            </Button>
          </div>
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
