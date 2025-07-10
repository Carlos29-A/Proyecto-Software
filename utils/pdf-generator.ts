import { jsPDF } from 'jspdf'
import { UCPData, UCPResults } from '../types/ucp'

interface EstimationData {
  projectName?: string
  projectType: string
  kloc: string | number
  costDrivers: Record<string, string>
  stageCosts: Record<string, string | number>
  stagePercentages?: Record<string, string | number>
}

interface EstimationResults {
  effort: number
  time: number
  people: number
  costs: Record<string, number>
  totalCost: number
  eaf: number
  stageEfforts: Record<string, number>
}

export function generateCOCOMO81PDF(data: EstimationData, results: EstimationResults) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = 210
  const pageHeight = 297
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let currentY = margin

  // Colores
  const primaryColor = [41, 98, 255] // Azul
  const secondaryColor = [248, 250, 252] // Gris claro
  const accentColor = [16, 185, 129] // Verde
  const textDark = [31, 41, 55] // Gris oscuro

  // Header con fondo azul
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.rect(0, 0, pageWidth, 50, 'F')

  // Título en blanco
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ESTIMACIÓN COCOMO-81', margin, 25)

  // Subtítulo con nombre del proyecto
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  const subtitle = data.projectName ? `Proyecto: ${data.projectName}` : 'Reporte de Estimación de Software'
  pdf.text(subtitle, margin, 35)

  // Fecha en la esquina superior derecha
  pdf.setFontSize(10)
  const dateText = `Fecha: ${new Date().toLocaleDateString('es-ES')}`
  const dateWidth = pdf.getTextWidth(dateText)
  pdf.text(dateText, pageWidth - margin - dateWidth, 35)

  currentY = 65

  // Función para crear secciones con fondo
  const createSection = (title: string, bgColor = secondaryColor, icon = '') => {
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2])
    pdf.rect(margin, currentY - 3, contentWidth, 12, 'F')
    
    pdf.setTextColor(textDark[0], textDark[1], textDark[2])
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    
    // Agregar un símbolo simple si se proporciona
    const displayTitle = icon ? `${icon} ${title}` : title
    pdf.text(displayTitle, margin + 3, currentY + 5)
    currentY += 15
  }

    // Función para crear tabla
    const createTable = (headers: string[], rows: string[][], startY: number) => {
      const colWidth = contentWidth / headers.length
      let tableY = startY
  
      // Headers
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.rect(margin, tableY, contentWidth, 8, 'F')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      
      headers.forEach((header, i) => {
        pdf.text(header, margin + (i * colWidth) + 2, tableY + 5)
      })
      
      tableY += 8
  
      // Rows
      pdf.setTextColor(textDark[0], textDark[1], textDark[2])
      pdf.setFont('helvetica', 'normal')
      
      rows.forEach((row, rowIndex) => {
        const bgColor = rowIndex % 2 === 0 ? [255, 255, 255] : [248, 250, 252]
        pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2])
        pdf.rect(margin, tableY, contentWidth, 6, 'F')
        
        row.forEach((cell, colIndex) => {
          pdf.text(cell, margin + (colIndex * colWidth) + 2, tableY + 4)
        })
        tableY += 6
      })
  
      return tableY + 5
    }
  

  // DATOS DEL PROYECTO
  createSection('DATOS DEL PROYECTO', secondaryColor, '>')

  const projectTypeLabels = {
    organic: "Orgánico",
    semidetached: "Semi-acoplado", 
    embedded: "Empotrado"
  }
  const projectTypeDisplay = projectTypeLabels[data.projectType as keyof typeof projectTypeLabels] || data.projectType

  // Información básica en recuadros
  if (data.projectName) {
    pdf.setFillColor(220, 240, 255)
    pdf.rect(margin, currentY, contentWidth, 15, 'F')
    
    pdf.setTextColor(textDark[0], textDark[1], textDark[2])
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Nombre del Proyecto:', margin + 3, currentY + 6)
    pdf.setFont('helvetica', 'normal')
    pdf.text(data.projectName, margin + 3, currentY + 12)
    currentY += 20
  }

  pdf.setFillColor(240, 249, 255)
  pdf.rect(margin, currentY, contentWidth/2 - 5, 20, 'F')
  pdf.rect(margin + contentWidth/2 + 5, currentY, contentWidth/2 - 5, 20, 'F')

  pdf.setTextColor(textDark[0], textDark[1], textDark[2])
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Tipo de Proyecto:', margin + 3, currentY + 8)
  pdf.setFont('helvetica', 'normal')
  pdf.text(projectTypeDisplay, margin + 3, currentY + 15)

  pdf.setFont('helvetica', 'bold')
  pdf.text('Tamaño (KLOC):', margin + contentWidth/2 + 8, currentY + 8)
  pdf.setFont('helvetica', 'normal')
  pdf.text(String(data.kloc), margin + contentWidth/2 + 8, currentY + 15)

  currentY += 35

  // RESULTADOS PRINCIPALES
  createSection('RESULTADOS PRINCIPALES', [220, 252, 231], '*')

  // Crear tabla de resultados
  const resultHeaders = ['Métrica', 'Valor', 'Unidad']
  const resultRows = [
    ['Esfuerzo', String(results.effort), 'Meses-Hombre'],
    ['Tiempo', String(results.time), 'Meses'],
    ['Personal', String(results.people), 'Personas'],
    ['Factor EAF', String(results.eaf), 'Multiplicador']
  ]

  currentY = createTable(resultHeaders, resultRows, currentY)

  // COSTOS POR ETAPA
  createSection('COSTOS POR ETAPA', secondaryColor, '$')

  const stageLabels = {
    requirements: "Requerimientos",
    analysis: "Análisis",
    design: "Diseño", 
    coding: "Codificación",
    testing: "Pruebas",
    integration: "Integración"
  }

  const costHeaders = ['Etapa', 'Porcentaje (%)', 'Esfuerzo (MM)', 'Costo ($)']
  const costRows = Object.entries(results.costs).map(([stage, cost]) => {
    const displayStage = stageLabels[stage as keyof typeof stageLabels] || stage
    const stageEffort = results.stageEfforts[stage]
    const percentage = data.stagePercentages?.[stage] || '0'
    return [displayStage, String(percentage), String(stageEffort), `$${Math.round(cost).toLocaleString()}`]
  })

  currentY = createTable(costHeaders, costRows, currentY)

  // Información sobre distribución personalizada
  if (data.stagePercentages) {
    const stagePercentages = data.stagePercentages as Record<string, number | string>;
    let totalPercentage = 0;
    for (const key in stagePercentages) {
      const value = stagePercentages[key];
      if (typeof value === 'number') totalPercentage += value;
      else if (typeof value === 'string') totalPercentage += parseFloat(value);
    }
    pdf.setFillColor(255, 243, 205) // Fondo amarillo claro
    pdf.rect(margin, currentY, contentWidth, 15, 'F')
    
    pdf.setTextColor(textDark[0], textDark[1], textDark[2])
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Distribución Personalizada:', margin + 3, currentY + 6)
    pdf.text(`Total de porcentajes: ${totalPercentage.toFixed(1)}%`, margin + 3, currentY + 12)
    currentY += 20
  }

  // Costo total destacado
  pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2])
  pdf.rect(margin, currentY, contentWidth, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`COSTO TOTAL: $${results.totalCost.toLocaleString()}`, margin + 5, currentY + 7)
  currentY += 20

  pdf.setTextColor(textDark[0], textDark[1], textDark[2])

  // CONDUCTORES DE COSTO
  if (currentY > 230) {
    pdf.addPage()
    currentY = margin
  }

  createSection('CONDUCTORES DE COSTO', secondaryColor, '+')

  const ratingLabels = {
    vl: "Muy Bajo",
    l: "Bajo", 
    n: "Nominal",
    h: "Alto",
    vh: "Muy Alto",
    xh: "Extra Alto"
  }

  // Organizar conductores por categoría
  const driverCategories = {
    'Producto': ['RELY', 'DATA', 'CPLX'],
    'Hardware': ['TIME', 'STOR', 'VIRT', 'TURN'],
    'Personal': ['ACAP', 'AEXP', 'PCAP', 'VEXP', 'LEXP'],
    'Proyecto': ['MODP', 'TOOL', 'SCED']
  }

  Object.entries(driverCategories).forEach(([category, drivers]) => {
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${category}:`, margin, currentY)
    currentY += 7

    drivers.forEach(driver => {
      if (data.costDrivers[driver]) {
        const value = data.costDrivers[driver]
        const displayValue = ratingLabels[value as keyof typeof ratingLabels] || String(value)
        
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`- ${driver}: ${displayValue}`, margin + 5, currentY)
        currentY += 5
      }
    })
    currentY += 3
  })

  // ECUACIONES UTILIZADAS
  if (currentY > 250) {
    pdf.addPage()
    currentY = margin
  }

  createSection('ECUACIONES UTILIZADAS', secondaryColor, '=')

  const constants = {
    organic: { a: 3.2, b: 1.05, c: 2.5, d: 0.38 },
    semidetached: { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
    embedded: { a: 2.8, b: 1.20, c: 2.5, d: 0.32 }
  }

  const { a, b, c, d } = constants[data.projectType as keyof typeof constants] || constants.organic

  pdf.setFillColor(250, 250, 250)
  pdf.rect(margin, currentY, contentWidth, 25, 'F')

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Esfuerzo (MM) = ${a} × (${data.kloc})^${b} × ${results.eaf} = ${results.effort}`, margin + 3, currentY + 7)
  pdf.text(`Tiempo (TDEV) = ${c} × (${results.effort})^${d} = ${results.time}`, margin + 3, currentY + 14)
  pdf.text(`Personal = ${results.effort} / ${results.time} = ${results.people} personas`, margin + 3, currentY + 21)

  // Footer
  const footerY = pageHeight - 15
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.rect(0, footerY - 5, pageWidth, 10, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Generado por Sistema de Estimación COCOMO-81', margin, footerY)
  
  const pageNumber = `Página 1`
  const pageNumberWidth = pdf.getTextWidth(pageNumber)
  pdf.text(pageNumber, pageWidth - margin - pageNumberWidth, footerY)

  // Guardar PDF
  const sanitizedProjectName = data.projectName 
    ? data.projectName.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '-').toLowerCase()
    : 'proyecto'
  const fileName = `estimacion-cocomo-${sanitizedProjectName}-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}

export function generateCOCOMO2PDF(data: any, results: any) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = 210
  const pageHeight = 297
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let currentY = margin

  // Colores
  const primaryColor = [16, 185, 129] // Verde
  const secondaryColor = [248, 250, 252] // Gris claro
  const accentColor = [59, 130, 246] // Azul
  const textDark = [31, 41, 55] // Gris oscuro

  // Header con fondo verde
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.rect(0, 0, pageWidth, 50, 'F')

  // Título en blanco
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ESTIMACIÓN COCOMO II', margin, 25)

  // Subtítulo con nombre del proyecto
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  const subtitle = data.projectName ? `Proyecto: ${data.projectName}` : 'Modelo Post-Arquitectura'
  pdf.text(subtitle, margin, 35)

  // Fecha en la esquina superior derecha
  pdf.setFontSize(10)
  const dateText = `Fecha: ${new Date().toLocaleDateString('es-ES')}`
  const dateWidth = pdf.getTextWidth(dateText)
  pdf.text(dateText, pageWidth - margin - dateWidth, 35)

  currentY = 65

  // Función para crear secciones con fondo
  const createSection = (title: string, bgColor = secondaryColor, icon = '') => {
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2])
    pdf.rect(margin, currentY - 3, contentWidth, 12, 'F')
    pdf.setTextColor(textDark[0], textDark[1], textDark[2])
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    const displayTitle = icon ? `${icon} ${title}` : title
    pdf.text(displayTitle, margin + 3, currentY + 5)
    currentY += 15
  }

  // Función para crear tabla
  const createTable = (headers: string[], rows: string[][], startY: number) => {
    const colWidth = contentWidth / headers.length
    let tableY = startY
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.rect(margin, tableY, contentWidth, 8, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    headers.forEach((header, i) => {
      pdf.text(header, margin + (i * colWidth) + 2, tableY + 5)
    })
    tableY += 8
    pdf.setTextColor(textDark[0], textDark[1], textDark[2])
    pdf.setFont('helvetica', 'normal')
    rows.forEach((row, rowIndex) => {
      const bgColor = rowIndex % 2 === 0 ? [255, 255, 255] : [248, 250, 252]
      pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2])
      pdf.rect(margin, tableY, contentWidth, 6, 'F')
      row.forEach((cell, colIndex) => {
        pdf.text(cell, margin + (colIndex * colWidth) + 2, tableY + 4)
      })
      tableY += 6
    })
    return tableY + 5
  }

  // DATOS DEL PROYECTO
  createSection('DATOS DEL PROYECTO', secondaryColor, '>')

  // Información básica en recuadros
  if (data.projectName) {
    pdf.setFillColor(220, 252, 231)
    pdf.rect(margin, currentY, contentWidth, 15, 'F')
    pdf.setTextColor(textDark[0], textDark[1], textDark[2])
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Nombre del Proyecto:', margin + 3, currentY + 6)
    pdf.setFont('helvetica', 'normal')
    pdf.text(data.projectName, margin + 3, currentY + 12)
    currentY += 20
  }

  pdf.setFillColor(240, 249, 255)
  pdf.rect(margin, currentY, contentWidth, 15, 'F')
  pdf.setTextColor(textDark[0], textDark[1], textDark[2])
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Tamaño del Software:', margin + 3, currentY + 6)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`${data.kloc} KLOC`, margin + 3, currentY + 12)
  currentY += 20

  // RESULTADOS PRINCIPALES
  createSection('RESULTADOS PRINCIPALES', [220, 252, 231], '*')
  const resultHeaders = ['Métrica', 'Valor', 'Unidad']
  const resultRows = [
    ['Esfuerzo', String(results.effort), 'Meses-Hombre'],
    ['Tiempo', String(results.time), 'Meses'],
    ['Personal', String(results.people), 'Personas'],
    ['Multiplicador EM', String(results.em), 'Multiplicador'],
    ['Suma SF', String(results.scaleSum), 'Puntos'],
    ['Exponente E', String(results.exponentE), 'Adimensional'],
    ['Exponente F', String(results.exponentF), 'Adimensional']
  ]
  currentY = createTable(resultHeaders, resultRows, currentY)

  // COSTOS POR ETAPA
  createSection('COSTOS POR ETAPA', secondaryColor, '$')
  const stageLabels = {
    requirements: "Requerimientos",
    analysis: "Análisis",
    design: "Diseño",
    coding: "Codificación",
    testing: "Pruebas",
    integration: "Integración"
  }
  const costHeaders = ['Etapa', 'Porcentaje (%)', 'Esfuerzo (MM)', 'Costo ($)']
  const costRows = Object.entries(results.costs).map(([stage, cost]) => {
    const displayStage = stageLabels[stage as keyof typeof stageLabels] || stage
    const stageEffort = results.stageEfforts[stage]
    const percentage = data.stagePercentages?.[stage] || '0'
    return [displayStage, String(percentage), String(stageEffort), `$${Math.round(cost).toLocaleString()}`]
  })
  currentY = createTable(costHeaders, costRows, currentY)

  // Información sobre distribución personalizada
  if (data.stagePercentages) {
    const stagePercentages = data.stagePercentages as Record<string, number | string>;
    let totalPercentage = 0;
    for (const key in stagePercentages) {
      const value = stagePercentages[key];
      if (typeof value === 'number') totalPercentage += value;
      else if (typeof value === 'string') totalPercentage += parseFloat(value);
    }
    pdf.setFillColor(255, 243, 205) // Fondo amarillo claro
    pdf.rect(margin, currentY, contentWidth, 15, 'F')
    pdf.setTextColor(textDark[0], textDark[1], textDark[2])
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Distribución Personalizada:', margin + 3, currentY + 6)
    pdf.text(`Total de porcentajes: ${totalPercentage.toFixed(1)}%`, margin + 3, currentY + 12)
    currentY += 20
  }

  // Costo total destacado
  pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2])
  pdf.rect(margin, currentY, contentWidth, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`COSTO TOTAL: $${results.totalCost.toLocaleString()}`, margin + 5, currentY + 7)
  currentY += 20

  pdf.setTextColor(textDark[0], textDark[1], textDark[2])

  // FACTORES DE ESCALA
  if (currentY > 230) {
    pdf.addPage()
    currentY = margin
  }
  createSection('FACTORES DE ESCALA', secondaryColor, '+')
  const ratingLabels = {
    vl: "Muy Bajo",
    l: "Bajo",
    n: "Nominal",
    h: "Alto",
    vh: "Muy Alto"
  }
  const scaleFactorNames = {
    PREC: "Precedencia",
    FLEX: "Flexibilidad de Desarrollo",
    RESL: "Resolución de Arquitectura/Riesgo",
    TEAM: "Cohesión del Equipo",
    PMAT: "Madurez del Proceso"
  }
  Object.entries(data.scaleDrivers).forEach(([factor, value]) => {
    const displayValue = ratingLabels[value as keyof typeof ratingLabels] || String(value)
    const factorName = scaleFactorNames[factor as keyof typeof scaleFactorNames] || factor
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${factor} - ${factorName}:`, margin, currentY)
    currentY += 5
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Nivel: ${displayValue}`, margin + 5, currentY)
    currentY += 5
  })

  // MULTIPLICADORES DE ESFUERZO
  if (currentY > 250) {
    pdf.addPage()
    currentY = margin
  }
  createSection('MULTIPLICADORES DE ESFUERZO', secondaryColor, '=')
  const multiplierCategories = {
    'Producto': ['RELY', 'DATA', 'CPLX', 'RUSE', 'DOCU'],
    'Plataforma': ['TIME', 'STOR', 'PVOL'],
    'Personal': ['ACAP', 'PCAP', 'PCON', 'AEXP', 'PEXP', 'LTEX'],
    'Proyecto': ['TOOL', 'SITE', 'SCED']
  }
  Object.entries(multiplierCategories).forEach(([category, multipliers]) => {
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${category}:`, margin, currentY)
    currentY += 5
    multipliers.forEach(multiplier => {
      if (data.effortMultipliers[multiplier]) {
        const value = data.effortMultipliers[multiplier]
        const displayValue = ratingLabels[value as keyof typeof ratingLabels] || String(value)
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`- ${multiplier}: ${displayValue}`, margin + 5, currentY)
        currentY += 4
      }
    })
    currentY += 3
  })

  // ECUACIONES UTILIZADAS
  if (currentY > 250) {
    pdf.addPage()
    currentY = margin
  }
  createSection('ECUACIONES UTILIZADAS', secondaryColor, '=')
  pdf.setFillColor(250, 250, 250)
  pdf.rect(margin, currentY, contentWidth, 30, 'F')
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Esfuerzo = 2.94 × (${data.kloc})^${results.exponentE} × ${results.em} = ${results.effort}`, margin + 3, currentY + 7)
  pdf.text(`E = 0.91 + 0.01 × ${results.scaleSum} = ${results.exponentE}`, margin + 3, currentY + 14)
  pdf.text(`Tiempo = 3.67 × (${results.effort})^${results.exponentF} = ${results.time}`, margin + 3, currentY + 21)
  pdf.text(`F = 0.28 + 0.2 × (${results.exponentE} - 0.91) = ${results.exponentF}`, margin + 3, currentY + 28)

  // Footer
  const footerY = pageHeight - 15
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.rect(0, footerY - 5, pageWidth, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Generado por Sistema de Estimación COCOMO II', margin, footerY)
  const pageNumber = `Página 1`
  const pageNumberWidth = pdf.getTextWidth(pageNumber)
  pdf.text(pageNumber, pageWidth - margin - pageNumberWidth, footerY)

  // Guardar PDF
  const sanitizedProjectName = data.projectName 
    ? data.projectName.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '-').toLowerCase()
    : 'proyecto'
  const fileName = `estimacion-cocomo2-${sanitizedProjectName}-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
} 

export const generateUCPPDF = (data: UCPData, results: UCPResults) => {
  const pdf = new jsPDF({ 
    orientation: 'portrait', 
    unit: 'mm', 
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16
  })

  const pageWidth = 210
  const pageHeight = 297
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let currentY = margin

  // Colores
  const primaryColor = [147, 51, 234] // Púrpura
  const secondaryColor = [248, 250, 252] // Gris claro
  const accentColor = [79, 70, 229] // Índigo
  const textDark = [31, 41, 55] // Gris oscuro

  // Header con fondo púrpura
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.rect(0, 0, pageWidth, 50, 'F')

  // Título en blanco
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('PUNTOS DE CASOS DE USO', margin, 25)

  // Subtítulo con nombre del proyecto
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  const subtitle = data.projectName ? `Proyecto: ${data.projectName}` : 'Reporte de Estimación'
  pdf.text(subtitle, margin, 35)

  // Fecha en la esquina superior derecha
  pdf.setFontSize(10)
  const dateText = `Fecha: ${new Date().toLocaleDateString('es-ES')}`
  const dateWidth = pdf.getTextWidth(dateText)
  pdf.text(dateText, pageWidth - margin - dateWidth, 35)

  currentY = 65

  // Función para crear secciones con fondo
  const createSection = (title: string, bgColor = secondaryColor, icon = '') => {
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2])
    pdf.rect(margin, currentY - 3, contentWidth, 12, 'F')
    pdf.setTextColor(textDark[0], textDark[1], textDark[2])
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    const displayTitle = icon ? `${icon} ${title}` : title
    pdf.text(displayTitle, margin + 3, currentY + 5)
    currentY += 15
  }

  // Función para crear tabla
  const createTable = (headers: string[], rows: string[][], startY: number) => {
    const colWidth = contentWidth / headers.length
    let tableY = startY

    // Headers
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.rect(margin, tableY, contentWidth, 8, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    
    headers.forEach((header, i) => {
      pdf.text(header, margin + (i * colWidth) + 2, tableY + 5)
    })
    
    tableY += 8

    // Rows
    pdf.setTextColor(textDark[0], textDark[1], textDark[2])
    pdf.setFont('helvetica', 'normal')
    
    rows.forEach((row, rowIndex) => {
      const bgColor = rowIndex % 2 === 0 ? [255, 255, 255] : [248, 250, 252]
      pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2])
      pdf.rect(margin, tableY, contentWidth, 6, 'F')
      
      row.forEach((cell, colIndex) => {
        pdf.text(cell, margin + (colIndex * colWidth) + 2, tableY + 4)
      })
      tableY += 6
    })

    return tableY + 5
  }

  // Función para verificar y crear nueva página si es necesario
  const checkNewPage = (requiredSpace: number = 30) => {
    if (currentY + requiredSpace > pageHeight - 30) {
      // Footer de la página actual
      const footerY = pageHeight - 15
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.rect(0, footerY - 5, pageWidth, 10, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Generado por Sistema de Estimación de Puntos de Casos de Uso', margin, footerY)
      const pageNumber = `Página ${pdf.getNumberOfPages()}`
      const pageNumberWidth = pdf.getTextWidth(pageNumber)
      pdf.text(pageNumber, pageWidth - margin - pageNumberWidth, footerY)

      pdf.addPage()
      currentY = margin
      // Header en cada nueva página
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.rect(0, 0, pageWidth, 30, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('PUNTOS DE CASOS DE USO (continuación)', margin, 20)
      currentY += 30
    }
  }

  // DATOS DEL PROYECTO
  createSection('DATOS DEL PROYECTO', secondaryColor, '>')

  // Información básica en recuadros
  if (data.projectName || data.projectDescription) {
    checkNewPage(30)
    pdf.setFillColor(220, 240, 255)
    pdf.rect(margin, currentY, contentWidth, data.projectDescription ? 30 : 15, 'F')
    
    pdf.setTextColor(textDark[0], textDark[1], textDark[2])
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Nombre del Proyecto:', margin + 3, currentY + 6)
    pdf.setFont('helvetica', 'normal')
    pdf.text(data.projectName || 'Sin nombre', margin + 3, currentY + 12)

    if (data.projectDescription) {
      pdf.setFont('helvetica', 'bold')
      pdf.text('Descripción:', margin + 3, currentY + 18)
      pdf.setFont('helvetica', 'normal')
      pdf.text(data.projectDescription, margin + 3, currentY + 24)
      currentY += 35
    } else {
      currentY += 20
    }
  }

  // RESULTADOS PRINCIPALES
  createSection('RESULTADOS PRINCIPALES', [220, 252, 231], '*')

  const resultHeaders = ['Métrica', 'Valor', 'Descripción']
  const resultRows = [
    ['UAW (Peso de Actores)', results.uaw.toFixed(2), 'Puntos de Actor sin Ajustar'],
    ['UUCW (Peso de Casos de Uso)', results.uucw.toFixed(2), 'Puntos de Caso de Uso sin Ajustar'],
    ['UUCP (Puntos sin Ajustar)', results.uucp.toFixed(2), 'UAW + UUCW'],
    ['TCF (Factor Técnico)', results.tcfValue.toFixed(2), 'Factor de Complejidad Técnica'],
    ['ECF (Factor Ambiental)', results.ecfValue.toFixed(2), 'Factor de Complejidad Ambiental'],
    ['UCP (Puntos de Casos de Uso)', results.ucp.toFixed(2), 'UUCP × TCF × ECF']
  ]

  currentY = createTable(resultHeaders, resultRows, currentY)
  currentY += 15

  // DETALLES DE CASOS DE USO
  createSection('DETALLES DE CASOS DE USO', secondaryColor, '>')

  const useCaseHeaders = ['Complejidad', 'Cantidad', 'Peso', 'Total']
  const useCaseComplexity = data.useCases.reduce((acc: Record<string, number>, uc) => {
    acc[uc.complexity] = (acc[uc.complexity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const useCaseRows = Object.entries(useCaseComplexity).map(([complexity, count]) => {
    const weight = complexity === "simple" ? 5 : complexity === "average" ? 10 : 15
    const total = weight * count
    return [
      complexity.charAt(0).toUpperCase() + complexity.slice(1),
      count.toString(),
      weight.toString(),
      total.toString()
    ]
  })

  currentY = createTable(useCaseHeaders, useCaseRows, currentY)
  currentY += 15

  // DETALLES DE ACTORES
  createSection('DETALLES DE ACTORES', secondaryColor, '>')

  const actorHeaders = ['Complejidad', 'Cantidad', 'Peso', 'Total']
  const actorComplexity = data.actors.reduce((acc: Record<string, number>, actor) => {
    acc[actor.complexity] = (acc[actor.complexity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const actorRows = Object.entries(actorComplexity).map(([complexity, count]) => {
    const weight = complexity === "simple" ? 1 : complexity === "average" ? 2 : 3
    const total = weight * Number(count)
    return [
      complexity.charAt(0).toUpperCase() + complexity.slice(1),
      String(count),
      String(weight),
      String(total)
    ]
  })

  currentY = createTable(actorHeaders, actorRows, currentY)
  currentY += 15

  // ESTIMACIÓN DE ESFUERZO
  createSection('ESTIMACIÓN DE ESFUERZO', [220, 252, 231], '=')

  // Análisis de factores críticos
  checkNewPage(40)
  pdf.setFillColor(240, 249, 255)
  pdf.rect(margin, currentY, contentWidth, 40, 'F')

  pdf.setTextColor(textDark[0], textDark[1], textDark[2])
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Análisis de Factores Críticos:', margin + 3, currentY + 7)

  pdf.setFont('helvetica', 'normal')
  pdf.text(`• Factores F1-F6 con valor < 3: ${results.factorsBelow3}`, margin + 10, currentY + 14)
  pdf.text(`• Factores F7-F8 con valor > 3: ${results.factorsAbove3}`, margin + 10, currentY + 21)
  pdf.text(`• Total de factores críticos: ${results.totalFactors}`, margin + 10, currentY + 28)
  pdf.text(`• Factor de productividad: ${results.productivityFactor} horas/UCP`, margin + 10, currentY + 35)

  currentY += 45

  // Resultado del esfuerzo
  pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2])
  pdf.rect(margin, currentY, contentWidth, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`ESFUERZO TOTAL ESTIMADO: ${results.effort} horas`, margin + 5, currentY + 7)

  currentY += 15

  // Advertencia si hay muchos factores críticos
  if (results.totalFactors >= 5) {
    pdf.setFillColor(255, 235, 235)
    pdf.rect(margin, currentY, contentWidth, 25, 'F')
    pdf.setTextColor(180, 0, 0)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text('⚠️ Advertencia:', margin + 3, currentY + 7)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`El número total de factores críticos (${results.totalFactors}) indica un alto riesgo.`, margin + 3, currentY + 14)
    pdf.text('Se recomienda revisar el proyecto y hacer los ajustes necesarios.', margin + 3, currentY + 21)
  }

  // Footer
  const footerY = pageHeight - 15
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.rect(0, footerY - 5, pageWidth, 10, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Generado por Sistema de Estimación de Puntos de Casos de Uso', margin, footerY)
  
  const pageNumber = `Página ${pdf.getNumberOfPages()}`
  const pageNumberWidth = pdf.getTextWidth(pageNumber)
  pdf.text(pageNumber, pageWidth - margin - pageNumberWidth, footerY)

  // Guardar PDF
  const sanitizedProjectName = data.projectName 
    ? data.projectName.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '-').toLowerCase()
    : 'proyecto'
  const fileName = `estimacion-ucp-${sanitizedProjectName}-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
} 