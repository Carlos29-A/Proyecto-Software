"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calculator } from "lucide-react"
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

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
              <CardTitle>Modelo COCOMO-81</CardTitle>
              <CardDescription>
                Modelo Constructivo de Costos para estimación de software
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ecuaciones Básicas</h3>
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Ecuación de Esfuerzo:</p>
                    <BlockMath math={"MM = a \\times (KLOC)^b \\times EAF"} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Ecuación de Tiempo:</p>
                    <BlockMath math={"TDEV = c \\times (MM)^d"} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Ecuación de Personal:</p>
                    <BlockMath math={"Personas = \\frac{MM}{TDEV}"} />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Constantes por Tipo de Proyecto:</p>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li>
                        <span className="font-medium">Orgánico:</span>{" "}
                        <InlineMath math="a = 3.2, b = 1.05, c = 2.5, d = 0.38" />
                      </li>
                      <li>
                        <span className="font-medium">Semi-acoplado:</span>{" "}
                        <InlineMath math="a = 3.0, b = 1.12, c = 2.5, d = 0.35" />
                      </li>
                      <li>
                        <span className="font-medium">Empotrado:</span>{" "}
                        <InlineMath math="a = 2.8, b = 1.20, c = 2.5, d = 0.32" />
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Donde:</p>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li><InlineMath math="MM" /> = Esfuerzo en Meses-Hombre</li>
                      <li><InlineMath math="KLOC" /> = Miles de Líneas de Código</li>
                      <li><InlineMath math="EAF" /> = Factor de Ajuste del Esfuerzo</li>
                      <li><InlineMath math="TDEV" /> = Tiempo de Desarrollo en Meses</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tipos de Proyecto</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Orgánico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Proyectos pequeños con equipos experimentados y requisitos flexibles.
                        Típicamente proyectos de desarrollo interno.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Semi-acoplado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Proyectos medianos con equipos mixtos y requisitos moderados.
                        Proyectos típicos de desarrollo de software comercial.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Empotrado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Proyectos complejos con requisitos estrictos y restricciones de hardware.
                        Típicamente sistemas empotrados o críticos.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Conductores de Costo</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Los conductores de costo son factores que afectan el esfuerzo de desarrollo. Se organizan en cuatro
                    categorías:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Producto</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Confiabilidad requerida del software</li>
                        <li>• Tamaño de la base de datos</li>
                        <li>• Complejidad del producto</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Hardware</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Restricciones de tiempo de ejecución</li>
                        <li>• Restricciones de almacenamiento</li>
                        <li>• Volatilidad de la máquina virtual</li>
                        <li>• Tiempo de respuesta del computador</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Personal</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Capacidad del analista</li>
                        <li>• Experiencia en la aplicación</li>
                        <li>• Capacidad del programador</li>
                        <li>• Experiencia en máquina virtual</li>
                        <li>• Experiencia en lenguaje de programación</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Proyecto</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Uso de prácticas modernas de programación</li>
                        <li>• Uso de herramientas de software</li>
                        <li>• Restricciones de tiempo de desarrollo</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cocomo2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modelo COCOMO II</CardTitle>
              <CardDescription>
                Versión actualizada del modelo COCOMO con soporte para metodologías modernas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ecuaciones Básicas</h3>
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Ecuación de Esfuerzo:</p>
                    <BlockMath math={"MM = A \\times (Tama\\~no)^E \\times \\prod EM"} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Exponente de Escala:</p>
                    <BlockMath math={"E = B + 0.01 \\times \\sum SF"} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Ecuación de Tiempo:</p>
                    <BlockMath math={"TDEV = C \\times (MM)^F"} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Factor de Tiempo:</p>
                    <BlockMath math={"F = 0.28 + 0.2 \\times (E - B)"} />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Constantes:</p>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li><InlineMath math="A = 2.94" /></li>
                      <li><InlineMath math="B = 0.91" /></li>
                      <li><InlineMath math="C = 3.67" /></li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Donde:</p>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li><InlineMath math="MM" /> = Esfuerzo en Meses-Hombre</li>
                      <li><InlineMath math="Tama\\~no" /> = Tamaño del software en KLOC</li>
                      <li><InlineMath math="EM" /> = Multiplicadores de Esfuerzo</li>
                      <li><InlineMath math="SF" /> = Factores de Escala</li>
                      <li><InlineMath math="TDEV" /> = Tiempo de Desarrollo en Meses</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Factores de Escala</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Precedencia</h4>
                    <p className="text-sm text-gray-600">
                      Familiaridad con proyectos similares. Afecta la capacidad de reutilizar experiencia y componentes.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Flexibilidad de Desarrollo</h4>
                    <p className="text-sm text-gray-600">
                      Grado de flexibilidad en el proceso de desarrollo. Incluye restricciones de tiempo y flexibilidad de
                      requisitos.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Resolución de Arquitectura/Riesgo</h4>
                    <p className="text-sm text-gray-600">
                      Grado de resolución de la arquitectura y riesgos. Evalúa la claridad de la arquitectura y la
                      gestión de riesgos.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Cohesión del Equipo</h4>
                    <p className="text-sm text-gray-600">
                      Grado de cooperación entre stakeholders. Considera la comunicación y colaboración del equipo.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Madurez del Proceso</h4>
                    <p className="text-sm text-gray-600">
                      Nivel de madurez del proceso de desarrollo. Basado en el modelo CMMI y prácticas de desarrollo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Multiplicadores de Esfuerzo</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Producto</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Confiabilidad Requerida</li>
                      <li>• Tamaño de Base de Datos</li>
                      <li>• Complejidad del Producto</li>
                      <li>• Reutilización Requerida</li>
                      <li>• Documentación</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Plataforma</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Restricciones de Tiempo</li>
                      <li>• Restricciones de Almacenamiento</li>
                      <li>• Volatilidad de Plataforma</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Personal</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Capacidad del Analista</li>
                      <li>• Capacidad del Programador</li>
                      <li>• Continuidad del Personal</li>
                      <li>• Experiencia en Aplicación</li>
                      <li>• Experiencia en Plataforma</li>
                      <li>• Experiencia en Lenguaje</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Proyecto</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Uso de Herramientas</li>
                      <li>• Desarrollo Multi-sitio</li>
                      <li>• Cronograma de Desarrollo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ucp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Puntos de Caso de Uso (UCP)</CardTitle>
              <CardDescription>
                Método de estimación basado en casos de uso y factores técnicos y ambientales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ecuaciones Básicas</h3>
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Puntos de Caso de Uso Sin Ajustar (UUCP):</p>
                    <BlockMath math={"UUCP = \\sum (Peso \\times Cantidad)"} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Factor de Complejidad Técnica (TCF):</p>
                    <BlockMath math={"TCF = 0.6 + (0.01 \\times \\sum TF)"} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Factor Ambiental (EF):</p>
                    <BlockMath math={"EF = 1.4 + (-0.03 \\times \\sum EF)"} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Puntos de Caso de Uso Ajustados (UCP):</p>
                    <BlockMath math={"UCP = UUCP \\times TCF \\times EF"} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Esfuerzo Estimado (Horas):</p>
                    <BlockMath math={"Esfuerzo = UCP \\times Factor\\ de\\ Productividad"} />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Donde:</p>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li><InlineMath math="UUCP" /> = Puntos de Caso de Uso Sin Ajustar</li>
                      <li><InlineMath math="TCF" /> = Factor de Complejidad Técnica</li>
                      <li><InlineMath math="EF" /> = Factor Ambiental</li>
                      <li><InlineMath math="UCP" /> = Puntos de Caso de Uso Ajustados</li>
                      <li><InlineMath math="TF" /> = Factores Técnicos</li>
                      <li><InlineMath math="EF" /> = Factores Ambientales</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pesos de Casos de Uso</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Simple</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        <InlineMath math="Peso = 5" />
                        <br />
                        Casos de uso simples con 3 o menos transacciones.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Medio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        <InlineMath math="Peso = 10" />
                        <br />
                        Casos de uso con 4-7 transacciones.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Complejo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        <InlineMath math="Peso = 15" />
                        <br />
                        Casos de uso con más de 7 transacciones.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Factores Técnicos</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Distribución del Sistema</h4>
                    <p className="text-sm text-gray-600">
                      Evalúa la complejidad de la distribución del sistema y la comunicación entre componentes.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Rendimiento</h4>
                    <p className="text-sm text-gray-600">
                      Considera los requisitos de rendimiento y tiempo de respuesta del sistema.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Configuración</h4>
                    <p className="text-sm text-gray-600">
                      Evalúa la complejidad de la configuración y el entorno de ejecución.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Transacciones</h4>
                    <p className="text-sm text-gray-600">
                      Considera la frecuencia y complejidad de las transacciones del sistema.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Reutilización</h4>
                    <p className="text-sm text-gray-600">
                      Evalúa el nivel de reutilización de código y componentes.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Facilidad de Instalación</h4>
                    <p className="text-sm text-gray-600">
                      Considera la complejidad del proceso de instalación y despliegue.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Facilidad de Uso</h4>
                    <p className="text-sm text-gray-600">
                      Evalúa la facilidad de uso y la interfaz de usuario.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Portabilidad</h4>
                    <p className="text-sm text-gray-600">
                      Considera la facilidad de portar el sistema a diferentes plataformas.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Mantenibilidad</h4>
                    <p className="text-sm text-gray-600">
                      Evalúa la facilidad de mantenimiento y modificación del sistema.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Concurrencia</h4>
                    <p className="text-sm text-gray-600">
                      Considera la complejidad de la concurrencia y el manejo de múltiples usuarios.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Seguridad</h4>
                    <p className="text-sm text-gray-600">
                      Evalúa los requisitos de seguridad y control de acceso.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Acceso a Datos Externos</h4>
                    <p className="text-sm text-gray-600">
                      Considera la complejidad de la integración con sistemas externos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Factores Ambientales</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Familiaridad con el Proyecto</h4>
                    <p className="text-sm text-gray-600">
                      Evalúa la experiencia del equipo con el dominio del proyecto.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Experiencia en la Aplicación</h4>
                    <p className="text-sm text-gray-600">
                      Considera la experiencia del equipo con aplicaciones similares.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Experiencia en Orientación a Objetos</h4>
                    <p className="text-sm text-gray-600">
                      Evalúa la experiencia del equipo en programación orientada a objetos.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Capacidad del Analista</h4>
                    <p className="text-sm text-gray-600">
                      Considera la capacidad y experiencia de los analistas.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Motivación</h4>
                    <p className="text-sm text-gray-600">
                      Evalúa la motivación y el compromiso del equipo.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Estabilidad de Requisitos</h4>
                    <p className="text-sm text-gray-600">
                      Considera la estabilidad y claridad de los requisitos.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Personal Parcial</h4>
                    <p className="text-sm text-gray-600">
                      Evalúa el impacto de tener personal trabajando a tiempo parcial.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Dificultad del Lenguaje</h4>
                    <p className="text-sm text-gray-600">
                      Considera la complejidad del lenguaje de programación utilizado.
                    </p>
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
