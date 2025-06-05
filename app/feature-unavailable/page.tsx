"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, Calculator, FileText } from "lucide-react"
import Link from "next/link"

export default function FeatureUnavailablePage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl text-orange-900">
              Funcionalidad No Disponible
            </CardTitle>
            <CardDescription className="text-orange-700 text-base">
              Esta funcionalidad está temporalmente deshabilitada para la presentación del proyecto final
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">
                🎓 Presentación Proyecto Final
              </h3>
              <p className="text-sm text-orange-800">
                Para la demostración del proyecto final del curso, solo están habilitadas las funcionalidades 
                principales: <strong>COCOMO-81</strong> y <strong>Puntos de Función</strong>.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-orange-900">
                Funcionalidades Disponibles:
              </h4>
              <div className="grid gap-3">
                <Link href="/cocomo-81">
                  <div className="flex items-center gap-3 p-3 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">COCOMO-81 Intermedio</div>
                      <div className="text-sm text-gray-600">Estimación de esfuerzo basada en líneas de código</div>
                    </div>
                  </div>
                </Link>

                <Link href="/function-points">
                  <div className="flex items-center gap-3 p-3 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-gray-900">Puntos de Función</div>
                      <div className="text-sm text-gray-600">Cálculo de tamaño y conversión a KLOC</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Button>
              </Link>
              <Link href="/cocomo-81" className="flex-1">
                <Button className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  Ir a COCOMO-81
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 