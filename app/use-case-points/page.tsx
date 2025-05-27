"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Calculator, Users, Plus, Trash2 } from "lucide-react"

export default function UseCasePointsPage() {
  const [useCases, setUseCases] = useState([{ id: 1, name: "", complexity: "", weight: 0 }])
  const [actors, setActors] = useState([{ id: 1, name: "", complexity: "", weight: 0 }])
  const [tcf, setTcf] = useState({})
  const [ecf, setEcf] = useState({})

  const complexityWeights = {
    usecase: { simple: 5, average: 10, complex: 15 },
    actor: { simple: 1, average: 2, complex: 3 },
  }

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

  const calculateUCP = () => {
    const uaw = useCases.reduce((sum, uc) => sum + uc.weight, 0)
    const uucw = actors.reduce((sum, a) => sum + a.weight, 0)
    const uucp = uaw + uucw

    // TCF y ECF calculations would go here
    const tcfValue = 1.0 // Placeholder
    const ecfValue = 1.0 // Placeholder

    const ucp = uucp * tcfValue * ecfValue
    return { uaw, uucw, uucp, tcfValue, ecfValue, ucp }
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

      <Tabs defaultValue="usecases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usecases">Casos de Uso</TabsTrigger>
          <TabsTrigger value="actors">Actores</TabsTrigger>
          <TabsTrigger value="factors">Factores</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

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

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Criterios de Complejidad para Casos de Uso</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Simple (5 pts):</strong> 3 o menos transacciones, interfaz simple
                  </p>
                  <p>
                    <strong>Promedio (10 pts):</strong> 4-7 transacciones, interfaz moderada
                  </p>
                  <p>
                    <strong>Complejo (15 pts):</strong> 8+ transacciones, interfaz compleja
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actores del Sistema</CardTitle>
              <CardDescription>Defina los actores que interactúan con el sistema y su complejidad</CardDescription>
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

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Criterios de Complejidad para Actores</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <p>
                    <strong>Simple (1 pt):</strong> API definida, interacción programática
                  </p>
                  <p>
                    <strong>Promedio (2 pts):</strong> Protocolo o interfaz interactiva
                  </p>
                  <p>
                    <strong>Complejo (3 pts):</strong> Interfaz gráfica de usuario
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factors" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Factores de Complejidad Técnica (TCF)</CardTitle>
                <CardDescription>Evalúe los factores técnicos del proyecto (0-5 escala)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "T1", name: "Sistema distribuido", weight: 2 },
                  { id: "T2", name: "Objetivos de rendimiento", weight: 1 },
                  { id: "T3", name: "Eficiencia del usuario final", weight: 1 },
                  { id: "T4", name: "Procesamiento interno complejo", weight: 1 },
                  { id: "T5", name: "Código reutilizable", weight: 1 },
                  { id: "T6", name: "Facilidad de instalación", weight: 0.5 },
                  { id: "T7", name: "Facilidad de uso", weight: 0.5 },
                  { id: "T8", name: "Portabilidad", weight: 2 },
                  { id: "T9", name: "Facilidad de cambio", weight: 1 },
                  { id: "T10", name: "Concurrencia", weight: 1 },
                  { id: "T11", name: "Características de seguridad", weight: 1 },
                  { id: "T12", name: "Acceso directo a terceros", weight: 1 },
                  { id: "T13", name: "Facilidades de entrenamiento", weight: 1 },
                ].map((factor) => (
                  <div key={factor.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-sm">
                        {factor.id}. {factor.name}
                      </Label>
                      <p className="text-xs text-gray-500">Peso: {factor.weight}</p>
                    </div>
                    <Select>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="0" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5].map((val) => (
                          <SelectItem key={val} value={val.toString()}>
                            {val}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Factores de Ambiente (ECF)</CardTitle>
                <CardDescription>Evalúe los factores del equipo y ambiente (0-5 escala)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "E1", name: "Familiaridad con el modelo de proceso", weight: 1.5 },
                  { id: "E2", name: "Experiencia en la aplicación", weight: 0.5 },
                  { id: "E3", name: "Experiencia en orientación a objetos", weight: 1 },
                  { id: "E4", name: "Capacidad del analista líder", weight: 0.5 },
                  { id: "E5", name: "Motivación", weight: 1 },
                  { id: "E6", name: "Estabilidad de requerimientos", weight: 2 },
                  { id: "E7", name: "Personal de tiempo parcial", weight: -1 },
                  { id: "E8", name: "Dificultad del lenguaje de programación", weight: -1 },
                ].map((factor) => (
                  <div key={factor.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-sm">
                        {factor.id}. {factor.name}
                      </Label>
                      <p className="text-xs text-gray-500">Peso: {factor.weight}</p>
                    </div>
                    <Select>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="0" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5].map((val) => (
                          <SelectItem key={val} value={val.toString()}>
                            {val}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados de la Estimación</CardTitle>
              <CardDescription>Cálculo de Puntos de Casos de Uso y estimación de esfuerzo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Cálculos Intermedios</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Peso de Casos de Uso (UAW):</span>
                        <span className="font-semibold">{useCases.reduce((sum, uc) => sum + uc.weight, 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Peso de Actores (UUCW):</span>
                        <span className="font-semibold">{actors.reduce((sum, a) => sum + a.weight, 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Puntos No Ajustados (UUCP):</span>
                        <span className="font-semibold">
                          {useCases.reduce((sum, uc) => sum + uc.weight, 0) +
                            actors.reduce((sum, a) => sum + a.weight, 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Factores de Ajuste</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>TCF (Factor Técnico):</span>
                        <span className="font-semibold">1.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ECF (Factor Ambiente):</span>
                        <span className="font-semibold">1.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Resultado Final</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-lg">
                        <span>Puntos de Casos de Uso (UCP):</span>
                        <span className="font-bold">{calculateUCP().ucp.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-green-800">UCP = UUCP × TCF × ECF</div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Estimación de Esfuerzo</h4>
                    <div className="space-y-2 text-sm text-orange-800">
                      <p>Esfuerzo = UCP × Factor de Productividad</p>
                      <p>Factor típico: 20-28 horas/UCP</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span>Estimación conservadora (28h/UCP):</span>
                          <span className="font-semibold">{(calculateUCP().ucp * 28).toFixed(0)} horas</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimación optimista (20h/UCP):</span>
                          <span className="font-semibold">{(calculateUCP().ucp * 20).toFixed(0)} horas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Ver Ayuda
        </Button>
        <Button className="flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Generar Reporte
        </Button>
      </div>
    </div>
  )
}
