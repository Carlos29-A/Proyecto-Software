"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, FileText, Users, HelpCircle, BarChart3, Clock } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Software de Estimación de Proyectos</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Herramienta completa para estimar esfuerzo, tiempo y costo de desarrollo de software utilizando modelos COCOMO
          y Puntos de Casos de Uso
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              COCOMO-81 Intermedio
            </CardTitle>
            <CardDescription>Modelo clásico para estimación de esfuerzo basado en líneas de código</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/cocomo-81">
              <Button className="w-full">Iniciar Estimación</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              COCOMO II Post-Arquitectura
            </CardTitle>
            <CardDescription>Modelo avanzado con conductores de escala y factores de esfuerzo</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/cocomo-ii">
              <Button className="w-full">Iniciar Estimación</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Puntos de Casos de Uso
            </CardTitle>
            <CardDescription>Estimación basada en casos de uso con factores de complejidad</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/use-case-points">
              <Button className="w-full">Iniciar Estimación</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Puntos de Función
            </CardTitle>
            <CardDescription>Calculadora de puntos de función y conversión a líneas de código</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/function-points">
              <Button className="w-full">Calcular Puntos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              Historial de Proyectos
            </CardTitle>
            <CardDescription>Revisa estimaciones anteriores y compara resultados</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/history">
              <Button className="w-full" variant="outline">
                Ver Historial
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              Ayuda y Documentación
            </CardTitle>
            <CardDescription>Guías de uso y documentación de los modelos de estimación</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/help">
              <Button className="w-full" variant="outline">
                Ver Ayuda
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Características Principales</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Soporte completo para COCOMO-81 y COCOMO II
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Estimación por puntos de casos de uso
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Calculadora de puntos de función
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Configuración de costos por etapas
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Reportes detallados con ecuaciones
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Ayuda en línea integrada
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
