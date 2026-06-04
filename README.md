# Nodus 🏢

Sistema de gestión integral para propiedades residenciales. Una aplicación moderna y eficiente para administrar habitaciones, inquilinos, cuotas mensuales, tareas de mantenimiento e inventario.

## 📋 Descripción

**Nodus** es una plataforma web diseñada para simplificar la administración de edificios y propiedades residenciales. Proporciona herramientas intuitivas para:

- 📊 **Dashboard**: Vista general del estado de la propiedad
- 🏠 **Gestión de Habitaciones**: Monitoreo del estado de cada unidad (disponible, ocupada, en limpieza, mantenimiento)
- 👥 **Inquilinos**: Registro y seguimiento de inquilinos y sus datos de contacto
- 💰 **Cuotas Mensuales**: Control de pagos, cargos extras y vencimientos
- 🔧 **Tareas de Mantenimiento**: Registro y seguimiento de reparaciones y mejoras
- 📦 **Inventario**: Gestión de equipos, materiales y bienes del edificio

## 🚀 Inicio Rápido

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16.0 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (generalmente viene con Node.js)

Puedes verificar tus versiones ejecutando:

```bash
node --version
npm --version
```

### Instalación

1. **Clona o descarga el proyecto**:
   ```bash
   cd Nodus
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

   Este comando instalará todos los paquetes necesarios incluyendo React, Vite, Recharts y Lucide Icons.

### Ejecución del Proyecto

#### Modo Desarrollo

Para ejecutar el servidor de desarrollo con hot-reload:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto indicado en terminal).

#### Compilación para Producción

Para crear una versión optimizada lista para desplegar:

```bash
npm run build
```

Los archivos compilados se guardarán en la carpeta `dist/`.

#### Previsualización de la Build

Para probar la versión compilada localmente:

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
Nodus/
├── src/
│   ├── main.jsx              # Punto de entrada de la aplicación
│   ├── app/
│   │   ├── App.jsx           # Componente principal
│   │   └── components/
│   │       ├── Dashboard.jsx           # Panel de control general
│   │       ├── RoomGrid.jsx            # Cuadrícula de habitaciones
│   │       ├── RoomDetailModal.jsx     # Modal detalle de habitación
│   │       ├── MonthlyFees.jsx         # Gestión de cuotas mensuales
│   │       ├── MaintenanceTasks.jsx    # Tareas de mantenimiento
│   │       └── Inventory.jsx           # Inventario
│   └── styles/
│       └── nodus.css         # Estilos personalizados
├── index.html                # Archivo HTML principal
├── vite.config.js            # Configuración de Vite
├── package.json              # Dependencias y scripts
└── README.md                 # Este archivo

```

## 🛠️ Tecnologías Utilizadas

- **React 18.3**: Librería de interfaz de usuario
- **Vite 8.0**: Herramienta de construcción y desarrollo rápido
- **Recharts 2.12**: Librería para gráficos y visualizaciones
- **Lucide React**: Iconografía moderna y limpia
- **CSS3**: Estilos personalizados y responsive

## 📦 Dependencias Principales

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "recharts": "^2.12.7",
  "lucide-react": "^0.383.0"
}
```

## 🎯 Características Principales

### Dashboard
Visualización rápida del estado general del edificio con gráficos y estadísticas clave.

### Gestión de Habitaciones
- Vista en cuadrícula de todas las unidades
- Códigos de color para estados (disponible, ocupada, limpieza, mantenimiento)
- Información detallada de cada habitación
- Datos del inquilino y fecha de ocupación

### Control de Cuotas
- Registro de pagos mensuales
- Seguimiento de cargos extras
- Control de vencimientos
- Historial de transacciones

### Mantenimiento
- Registro de tareas pendientes
- Seguimiento de reparaciones
- Asignación de prioridades
- Historial de completadas

### Inventario
- Registro de bienes y equipos
- Control de existencias
- Categorización de items

## 🔄 Flujo de Trabajo

1. Inicia el servidor de desarrollo (`npm run dev`)
2. Accede a la aplicación desde tu navegador
3. Navega entre las secciones usando el menú lateral
4. Los datos mostrados son de prueba y permiten explorar todas las funcionalidades

## 💡 Notas Importantes

- Los datos mostrados en la aplicación son **datos simulados** para demostración
- La aplicación usa componentes React con estado local
- El diseño es **responsive** y se adapta a diferentes tamaños de pantalla
- Los cambios se guardan en memoria (se pierden al recargar)

---

**Última actualización**: Junio 2026
