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
          Herramienta para estimar esfuerzo, tiempo y costo de desarrollo de software utilizando COCOMO-81 
          y Puntos de Función
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-blue-800">
            🎓 <strong>Versión Proyecto Final:</strong> Funcionalidades principales habilitadas para demostración
          </p>
        </div>
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

        <Card className="hover:shadow-lg transition-shadow opacity-60 relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              COCOMO II Post-Arquitectura
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded ml-auto">
                Próximamente
              </span>
            </CardTitle>
            <CardDescription>Modelo avanzado con conductores de escala y factores de esfuerzo</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/feature-unavailable">
              <Button className="w-full" variant="outline" disabled>
                No Disponible
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow opacity-60 relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Puntos de Casos de Uso
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded ml-auto">
                Próximamente
              </span>
            </CardTitle>
            <CardDescription>Estimación basada en casos de uso con factores de complejidad</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/feature-unavailable">
              <Button className="w-full" variant="outline" disabled>
                No Disponible
              </Button>
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Características Principales</h2>
          <div className="grid gap-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Modelo COCOMO-81 Intermedio completo
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Calculadora de puntos de función
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Configuración de costos por etapas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Exportación de reportes en PDF
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Integración entre funcionalidades
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-500">COCOMO II (próximamente)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-500">Casos de uso (próximamente)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Autores del Proyecto</h2>
          <div className="space-y-3">
            {[
              "AGUILAR VILLANUEVA CARLOS VIDAL",
              "ARTEAGA RODRIGUEZ AARON KALEB", 
              "GONZALEZ NEIRA ALAN GUSTAVO",
              "ROJAS SANCHEZ PAULO CESAR",
              "URBANO MANTILLA OSWALDO ELOY"
            ].map((author, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {author.split(' ')[0][0]}{author.split(' ')[author.split(' ').length - 2][0]}
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {author}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              🎓 <strong>Proyecto Final</strong> - Tópicos en Ingeniería de Software
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
