"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calculator } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Centro de Ayuda</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Documentación completa y guías de uso para los modelos de estimación de software
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="cocomo81">COCOMO-81</TabsTrigger>
          <TabsTrigger value="cocomo2">COCOMO II</TabsTrigger>
          <TabsTrigger value="ucp">Casos de Uso</TabsTrigger>
          <TabsTrigger value="fp">Puntos de Función</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  ¿Qué es la Estimación de Software?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  La estimación de software es el proceso de predecir el esfuerzo, tiempo y recursos necesarios para
                  desarrollar un sistema de software.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">Beneficios:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Planificación de proyectos más precisa</li>
                    <li>• Mejor asignación de recursos</li>
                    <li>• Control de costos y cronogramas</li>
                    <li>• Toma de decisiones informada</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-600" />
                  Modelos Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">COCOMO-81</span>
                    <Badge variant="secondary">Clásico</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">COCOMO II</span>
                    <Badge variant="secondary">Avanzado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Puntos de Casos de Uso</span>
                    <Badge variant="secondary">UML</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Puntos de Función</span>
                    <Badge variant="secondary">Funcional</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Flujo de Trabajo Recomendado</CardTitle>
              <CardDescription>Pasos sugeridos para realizar una estimación efectiva</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    1
                  </div>
                  <h4 className="font-medium mb-1">Análisis de Requisitos</h4>
                  <p className="text-xs text-gray-600">Definir alcance y funcionalidades</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    2
                  </div>
                  <h4 className="font-medium mb-1">Selección de Modelo</h4>
                  <p className="text-xs text-gray-600">Elegir el modelo más apropiado</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    3
                  </div>
                  <h4 className="font-medium mb-1">Configuración</h4>
                  <p className="text-xs text-gray-600">Ajustar parámetros y factores</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    4
                  </div>
                  <h4 className="font-medium mb-1">Análisis</h4>
                  <p className="text-xs text-gray-600">Revisar y validar resultados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cocomo81" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>COCOMO-81 Intermedio</CardTitle>
              <CardDescription>
                Modelo clásico de estimación basado en líneas de código y conductores de costo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Ecuaciones Básicas</h4>
                <div className="space-y-1 text-sm text-blue-800 font-mono">
                  <p>Esfuerzo (MM) = a × (KLOC)^b × EAF</p>
                  <p>Tiempo (TDEV) = c × (MM)^d</p>
                  <p>Personas = MM / TDEV</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Orgánico</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>a = 3.2, b = 1.05</p>
                    <p>c = 2.5, d = 0.38</p>
                    <p>Proyectos pequeños, equipos experimentados</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Semi-acoplado</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>a = 3.0, b = 1.12</p>
                    <p>c = 2.5, d = 0.35</p>
                    <p>Proyectos medianos, equipos mixtos</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Empotrado</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>a = 2.8, b = 1.20</p>
                    <p>c = 2.5, d = 0.32</p>
                    <p>Proyectos complejos, restricciones estrictas</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Conductores de Costo</h4>
                <p className="text-sm text-gray-600">
                  Los conductores de costo son factores que afectan el esfuerzo de desarrollo. Se organizan en cuatro
                  categorías:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>
                    • <strong>Producto:</strong> Confiabilidad, complejidad, tamaño de BD
                  </li>
                  <li>
                    • <strong>Hardware:</strong> Restricciones de tiempo y memoria
                  </li>
                  <li>
                    • <strong>Personal:</strong> Capacidad y experiencia del equipo
                  </li>
                  <li>
                    • <strong>Proyecto:</strong> Herramientas, prácticas, cronograma
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cocomo2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>COCOMO II Post-Arquitectura</CardTitle>
              <CardDescription>Modelo avanzado con conductores de escala y multiplicadores de esfuerzo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Ecuaciones COCOMO II</h4>
                <div className="space-y-1 text-sm text-green-800 font-mono">
                  <p>Esfuerzo = A × (Tamaño)^E × ∏EM</p>
                  <p>E = B + 0.01 × ∑SF</p>
                  <p>Tiempo = C × (Esfuerzo)^F</p>
                  <p>F = 0.28 + 0.2 × (E - B)</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Conductores de Escala (SF)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Precedencia (PREC)</li>
                    <li>• Flexibilidad de Desarrollo (FLEX)</li>
                    <li>• Resolución de Arquitectura/Riesgo (RESL)</li>
                    <li>• Cohesión del Equipo (TEAM)</li>
                    <li>• Madurez del Proceso (PMAT)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Multiplicadores de Esfuerzo (EM)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Factores de Producto (7 factores)</li>
                    <li>• Factores de Plataforma (3 factores)</li>
                    <li>• Factores de Personal (6 factores)</li>
                    <li>• Factores de Proyecto (3 factores)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Ventajas de COCOMO II</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Mayor precisión en proyectos modernos</li>
                  <li>• Considera metodologías ágiles y orientadas a objetos</li>
                  <li>• Factores de escala para proyectos grandes</li>
                  <li>• Calibrado con datos de proyectos recientes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ucp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Puntos de Casos de Uso (UCP)</CardTitle>
              <CardDescription>Método de estimación basado en casos de uso y factores de complejidad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Fórmula UCP</h4>
                <div className="space-y-1 text-sm text-purple-800 font-mono">
                  <p>UCP = UUCP × TCF × ECF</p>
                  <p>UUCP = UAW + UUCW</p>
                  <p>Esfuerzo = UCP × Factor de Productividad</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Casos de Uso</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Simple:</span>
                      <Badge variant="secondary">5 puntos</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Promedio:</span>
                      <Badge variant="secondary">10 puntos</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Complejo:</span>
                      <Badge variant="secondary">15 puntos</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Actores</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Simple:</span>
                      <Badge variant="secondary">1 punto</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Promedio:</span>
                      <Badge variant="secondary">2 puntos</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Complejo:</span>
                      <Badge variant="secondary">3 puntos</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Factores de Ajuste</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">TCF (Factores Técnicos):</p>
                    <p className="text-gray-600">13 factores que evalúan la complejidad técnica del sistema</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">ECF (Factores de Ambiente):</p>
                    <p className="text-gray-600">8 factores que evalúan la experiencia y motivación del equipo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Puntos de Función</CardTitle>
              <CardDescription>Método de medición funcional independiente de la tecnología</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Tipos de Función</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-orange-800">
                  <div>
                    <p>
                      <strong>Transacciones:</strong>
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Entradas Externas (EI)</li>
                      <li>• Salidas Externas (EO)</li>
                      <li>• Consultas Externas (EQ)</li>
                    </ul>
                  </div>
                  <div>
                    <p>
                      <strong>Datos:</strong>
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Archivos Lógicos Internos (ILF)</li>
                      <li>• Archivos de Interfaz Externa (EIF)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Pesos por Complejidad</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Tipo</th>
                        <th className="text-center p-2">Simple</th>
                        <th className="text-center p-2">Promedio</th>
                        <th className="text-center p-2">Complejo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">EI</td>
                        <td className="text-center p-2">3</td>
                        <td className="text-center p-2">4</td>
                        <td className="text-center p-2">6</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">EO</td>
                        <td className="text-center p-2">4</td>
                        <td className="text-center p-2">5</td>
                        <td className="text-center p-2">7</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">EQ</td>
                        <td className="text-center p-2">3</td>
                        <td className="text-center p-2">4</td>
                        <td className="text-center p-2">6</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">ILF</td>
                        <td className="text-center p-2">7</td>
                        <td className="text-center p-2">10</td>
                        <td className="text-center p-2">15</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">EIF</td>
                        <td className="text-center p-2">5</td>
                        <td className="text-center p-2">7</td>
                        <td className="text-center p-2">10</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Conversión a LOC</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Los puntos de función pueden convertirse a líneas de código usando factores específicos por lenguaje:
                </p>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-800">
                  <div>Java: 53 LOC/FP</div>
                  <div>C#: 54 LOC/FP</div>
                  <div>Python: 71 LOC/FP</div>
                  <div>JavaScript: 47 LOC/FP</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
