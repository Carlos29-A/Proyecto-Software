# 📊 Sistema de Estimación de Software

Una aplicación web moderna para la estimación de proyectos de software utilizando los modelos **COCOMO-81** y **Puntos de Función**, desarrollada como proyecto final para el curso de Tópicos en Ingeniería de Software.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

## 🚀 Características Principales

### ✅ Funcionalidades Disponibles
- 🎯 **COCOMO-81 Intermedio Completo**
  - Configuración de conductores de costo (15 factores)
  - Distribución personalizable de esfuerzo por etapas
  - Cálculo de esfuerzo, tiempo y personal necesario
  - Soporte para proyectos orgánicos, semi-acoplados y empotrados

- 📐 **Calculadora de Puntos de Función**
  - Evaluación de 5 tipos de funciones (EI, EO, EQ, ILF, EIF)
  - Clasificación por complejidad (Baja, Media, Alta)
  - Conversión automática a KLOC
  - Integración con COCOMO-81

- 📄 **Exportación de Reportes**
  - Generación de PDFs profesionales
  - Reportes detallados con fórmulas y resultados
  - Diseño optimizado para presentaciones

- 🔄 **Integración Bidireccional**
  - Copia de valores KLOC entre modelos
  - Workflow fluido entre funcionalidades
  - Notificaciones visuales de valores importados

### 🚧 Características en Desarrollo
- COCOMO II (próximamente)
- Puntos de Casos de Uso (próximamente)

## 🛠️ Tecnologías Utilizadas

- **Frontend Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Styling:** Tailwind CSS
- **Componentes UI:** Shadcn/ui
- **Gestión de Estado:** React Hooks
- **Generación de PDFs:** jsPDF
- **Renderizado de Fórmulas:** react-katex
- **Gestión de Dependencias:** pnpm

## 📋 Requisitos Previos

- Node.js 18.0 o superior
- pnpm (recomendado) o npm

## ⚡ Instalación y Configuración

1. **Clonar el repositorio**
```bash
git clone https://github.com/Carlos29-A/Proyecto-Software.git
cd Proyecto-Software
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Ejecutar en modo desarrollo**
```bash
pnpm dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 🎯 Guía de Uso

### COCOMO-81

1. **Datos Básicos**
   - Ingrese el nombre del proyecto
   - Seleccione el tipo: Orgánico, Semi-acoplado o Empotrado
   - Especifique el tamaño en KLOC (o calcule desde Puntos de Función)

2. **Conductores de Costo**
   - Configure los 15 factores de costo
   - Valores por defecto en "Nominal"
   - Rangos desde "Muy Bajo" hasta "Extra Alto"

3. **Costos por Etapa**
   - Defina el costo por mes-hombre para cada etapa
   - Configure porcentajes de distribución del esfuerzo
   - Permite 0% para etapas que no aplican

4. **Resultados**
   - Visualice esfuerzo, tiempo y personal necesario
   - Desglose detallado por etapas
   - Exportación a PDF profesional

### Puntos de Función

1. **Conteo de Funciones**
   - EI (Entradas Externas)
   - EO (Salidas Externas) 
   - EQ (Consultas Externas)
   - ILF (Archivos Lógicos Internos)
   - EIF (Archivos de Interfaz Externa)

2. **Clasificación por Complejidad**
   - Baja, Media, Alta
   - Pesos automáticos según estándar IFPUG

3. **Conversión a KLOC**
   - Selección de lenguaje de programación
   - Ratios de conversión actualizados
   - Copia directa a COCOMO-81

## 📁 Estructura del Proyecto

```
Proyecto-Software/
├── app/                          # Páginas de la aplicación
│   ├── cocomo-81/               # Página de COCOMO-81
│   ├── function-points/         # Calculadora de Puntos de Función
│   ├── feature-unavailable/     # Página para funciones no disponibles
│   └── help/                    # Página de ayuda
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes base de UI
│   ├── cost-drivers.tsx         # Configuración de conductores
│   ├── estimation-results.tsx   # Visualización de resultados
│   └── navigation.tsx           # Navegación principal
├── utils/                       # Utilidades
│   └── pdf-generator.ts         # Generador de PDFs
├── lib/                         # Configuraciones
└── styles/                      # Estilos globales
```

## 👥 Autores

**Equipo de Desarrollo - Proyecto Final**

- **AGUILAR VILLANUEVA CARLOS VIDAL**
- **ARTEAGA RODRIGUEZ AARON KALEB**
- **GONZALEZ NEIRA ALAN GUSTAVO**
- **ROJAS SANCHEZ PAULO CESAR**
- **URBANO MANTILLA OSWALDO ELOY**

**Curso:** Tópicos en Ingeniería de Software  
**Institución:** Universidad Nacional de Trujillo

## 📚 Referencias Académicas

- Boehm, Barry W. (1981). *Software Engineering Economics*. Prentice Hall.
- International Function Point Users Group (IFPUG). *Function Point Counting Practices Manual*.
- Pressman, Roger S. *Ingeniería del Software: Un Enfoque Práctico*.

## 🎯 Objetivos Académicos

Este proyecto tiene como objetivos:

1. **Aplicar modelos de estimación de software** en un entorno práctico
2. **Desarrollar competencias en tecnologías web modernas**
3. **Implementar mejores prácticas de ingeniería de software**
4. **Crear herramientas útiles para la comunidad de desarrolladores**

## 📈 Fórmulas Implementadas

### COCOMO-81 Intermedio

**Esfuerzo:**
```
MM = a × (KLOC)^b × EAF
```

**Tiempo de Desarrollo:**
```
TDEV = c × (MM)^d
```

**Personal Promedio:**
```
Personal = MM / TDEV
```

Donde las constantes (a, b, c, d) varían según el tipo de proyecto.

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Construcción para producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Verificación de código
pnpm lint

# Verificación de tipos
pnpm type-check
```

## 📝 Notas de Implementación

- **Distribución por Etapas:** Los porcentajes se basan en prácticas de la industria y pueden configurarse según la metodología específica del proyecto.
- **Validaciones:** El sistema incluye validaciones para asegurar datos consistentes y resultados confiables.
- **Responsive Design:** Interfaz optimizada para dispositivos desktop y móviles.
- **Accesibilidad:** Implementación de mejores prácticas de accesibilidad web.

## 🚀 Despliegue

El proyecto está configurado para ser desplegado en plataformas como:
- Vercel (recomendado para Next.js)
- Netlify
- Railway
- Render

---

**📧 Contacto:** Para consultas académicas o técnicas, contactar a través del repositorio del proyecto.