"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calculator, HelpCircle } from "lucide-react"

export default function FunctionPointsPage() {
  const [functionTypes, setFunctionTypes] = useState({
    ei: { simple: 0, average: 0, complex: 0 },
    eo: { simple: 0, average: 0, complex: 0 },
    eq: { simple: 0, average: 0, complex: 0 },
    ilf: { simple: 0, average: 0, complex: 0 },
    eif: { simple: 0, average: 0, complex: 0 },
  })

  const [language, setLanguage] = useState("")

  const weights = {
    ei: { simple: 3, average: 4, complex: 6 },
    eo: { simple: 4, average: 5, complex: 7 },
    eq: { simple: 3, average: 4, complex: 6 },
    ilf: { simple: 7, average: 10, complex: 15 },
    eif: { simple: 5, average: 7, complex: 10 },
  }

  const languageConversion = {
    java: 53,
    csharp: 54,
    cpp: 53,
    python: 71,
    javascript: 47,
    php: 64,
    cobol: 91,
    assembly: 320,
  }

  const calculateUFP = () => {
    let total = 0
    Object.entries(functionTypes).forEach(([type, complexities]) => {
      Object.entries(complexities).forEach(([complexity, count]) => {
        total += count * weights[type as keyof typeof weights][complexity as keyof typeof weights.ei]
      })
    })
    return total
  }

  const convertToLOC = (ufp: number) => {
    if (!language || !languageConversion[language as keyof typeof languageConversion]) return 0
    return ufp * languageConversion[language as keyof typeof languageConversion]
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calculadora de Puntos de Función</h1>
          <p className="text-gray-600 mt-2">Calcule puntos de función sin ajustar y convierta a líneas de código</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Function Points
        </Badge>
      </div>

      <Tabs defaultValue="functions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="functions">Tipos de Función</TabsTrigger>
          <TabsTrigger value="conversion">Conversión a LOC</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="functions" className="space-y-6">
          <div className="grid gap-6">
            {[
              {
                key: "ei",
                name: "Entradas Externas (EI)",
                description: "Procesos que mantienen datos internos",
              },
              {
                key: "eo",
                name: "Salidas Externas (EO)",
                description: "Procesos que envían datos fuera del sistema",
              },
              {
                key: "eq",
                name: "Consultas Externas (EQ)",
                description: "Procesos que recuperan datos sin actualizar",
              },
              {
                key: "ilf",
                name: "Archivos Lógicos Internos (ILF)",
                description: "Grupos de datos mantenidos por el sistema",
              },
              {
                key: "eif",
                name: "Archivos de Interfaz Externa (EIF)",
                description: "Grupos de datos referenciados pero no mantenidos",
              },
            ].map((funcType) => (
              <Card key={funcType.key}>
                <CardHeader>
                  <CardTitle className="text-lg">{funcType.name}</CardTitle>
                  <CardDescription>{funcType.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Simple ({weights[funcType.key as keyof typeof weights].simple} pts)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={functionTypes[funcType.key as keyof typeof functionTypes].simple}
                        onChange={(e) =>
                          setFunctionTypes((prev) => ({
                            ...prev,
                            [funcType.key]: {
                              ...prev[funcType.key as keyof typeof prev],
                              simple: Number.parseInt(e.target.value) || 0,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Promedio ({weights[funcType.key as keyof typeof weights].average} pts)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={functionTypes[funcType.key as keyof typeof functionTypes].average}
                        onChange={(e) =>
                          setFunctionTypes((prev) => ({
                            ...prev,
                            [funcType.key]: {
                              ...prev[funcType.key as keyof typeof prev],
                              average: Number.parseInt(e.target.value) || 0,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Complejo ({weights[funcType.key as keyof typeof weights].complex} pts)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={functionTypes[funcType.key as keyof typeof functionTypes].complex}
                        onChange={(e) =>
                          setFunctionTypes((prev) => ({
                            ...prev,
                            [funcType.key]: {
                              ...prev[funcType.key as keyof typeof prev],
                              complex: Number.parseInt(e.target.value) || 0,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversión a Líneas de Código</CardTitle>
              <CardDescription>
                Seleccione el lenguaje de programación para convertir puntos de función a LOC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Lenguaje de Programación</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un lenguaje" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="java">Java ({languageConversion.java} LOC/FP)</SelectItem>
                    <SelectItem value="csharp">C# ({languageConversion.csharp} LOC/FP)</SelectItem>
                    <SelectItem value="cpp">C++ ({languageConversion.cpp} LOC/FP)</SelectItem>
                    <SelectItem value="python">Python ({languageConversion.python} LOC/FP)</SelectItem>
                    <SelectItem value="javascript">JavaScript ({languageConversion.javascript} LOC/FP)</SelectItem>
                    <SelectItem value="php">PHP ({languageConversion.php} LOC/FP)</SelectItem>
                    <SelectItem value="cobol">COBOL ({languageConversion.cobol} LOC/FP)</SelectItem>
                    <SelectItem value="assembly">Assembly ({languageConversion.assembly} LOC/FP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Factores de Conversión</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    Los factores de conversión representan el número promedio de líneas de código por punto de función
                    para cada lenguaje.
                  </p>
                  <p>Estos valores están basados en estudios empíricos de la industria del software.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados del Cálculo</CardTitle>
              <CardDescription>Resumen de puntos de función y conversión a líneas de código</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Puntos de Función Sin Ajustar</h4>
                    <div className="text-3xl font-bold text-green-700">{calculateUFP()}</div>
                    <div className="text-sm text-green-600">UFP Total</div>
                  </div>

                  {language && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Líneas de Código Estimadas</h4>
                      <div className="text-3xl font-bold text-blue-700">
                        {convertToLOC(calculateUFP()).toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">LOC en {language.toUpperCase()}</div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Desglose por Tipo de Función</h4>
                  <div className="space-y-2">
                    {Object.entries(functionTypes).map(([type, complexities]) => {
                      const total = Object.entries(complexities).reduce((sum, [complexity, count]) => {
                        return (
                          sum + count * weights[type as keyof typeof weights][complexity as keyof typeof weights.ei]
                        )
                      }, 0)

                      const typeNames = {
                        ei: "Entradas Externas",
                        eo: "Salidas Externas",
                        eq: "Consultas Externas",
                        ilf: "Archivos Lógicos Internos",
                        eif: "Archivos de Interfaz Externa",
                      }

                      return (
                        <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{typeNames[type as keyof typeof typeNames]}</span>
                          <Badge variant="secondary">{total} pts</Badge>
                        </div>
                      )
                    })}
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
          Exportar Resultados
        </Button>
      </div>
    </div>
  )
}
