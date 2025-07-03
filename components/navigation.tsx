"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Calculator, HelpCircle, Home } from "lucide-react"

const navigation = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "COCOMO-81", href: "/cocomo-81", icon: Calculator },
  { name: "COCOMO II", href: "/cocomo-ii", icon: Calculator},
  { name: "Casos de Uso", href: "/feature-unavailable", icon: Calculator, disabled: true },
  { name: "Puntos de Función", href: "/function-points", icon: Calculator },
  { name: "Ayuda", href: "/help", icon: HelpCircle },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Calculator className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">EstimaSoft</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              const isDisabled = item.disabled
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : isDisabled
                      ? "text-gray-400 cursor-not-allowed opacity-60"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {isDisabled && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-1 rounded">
                      Próximamente
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isDisabled = item.disabled
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-blue-100 text-blue-700"
                          : isDisabled
                          ? "text-gray-400 cursor-not-allowed opacity-60"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {isDisabled && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-1 rounded ml-auto">
                          Próximamente
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
