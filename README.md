# 🎮 Clon de Steam - Frontend

## 📘 Descripción del Proyecto

Este proyecto es una implementación frontend de un clon de Steam, una popular plataforma de distribucion y venta de videojuegos. El sistema permite navegar por juegos, gestionar un carrito de compras y simular el proceso de compra de un juego.

## Tabla de contenidos
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Como Ejecutar](#como-ejecutar)

## Tecnologías Utilizadas

- **React** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite** - Herramienta de compilación que ofrece una experiencia de desarrollo más rápida
- **React Router** - Manejo de navegación y rutas en la aplicación
- **CSS Modules** - Estilizado modular y escalable

## Funcionalidades Principales

### 1. Navegación y Autenticación
- Sistema de login y registro de usuarios
- Navegación fluida entre diferentes secciones

### 2. Catálogo de Juegos
- Visualización de juegos destacados
- Imágenes y detalles de cada juego
- Precios y botones de acción

### 3. Carrito de Compras
- Agregar/eliminar juegos del carrito
- Cálculo automático del total
- Persistencia del carrito durante la navegación

### 4. Proceso de Checkout
- Múltiples métodos de pago:
  - Tarjeta de crédito
  - PayPal
  - Criptomonedas
- Formulario de datos de envío
- Confirmación de compra

## Estructura del Proyecto
```
proyecto-API-front/
├── public/                
├── src/                   
│   ├── assets/           # Imágenes y recursos
|   ├── components/       # Componentes de view reutilizables
|   |   ├── HeaderSteam.jsx
|   |   ├── NavBar.jsx
|   |   └── SteamCarousel.jsx
|   |
│   ├── pages/            # Componentes de página
|   |   ├── AcercaDe.jsx  # Informacion del sitio
│   │   ├── auth.css      # Estilos de autenticación
│   │   ├── cart.jsx      # Página de carrito
│   │   ├── checkout.jsx  # Página de compra
|   |   ├── comunidad,jsx 
|   |   ├── GameDetail.jsx #Informacion del juego
│   │   ├── home.jsx      # Página principal
│   │   ├── login.jsx     # Página de login
│   │   |── register.jsx  # Página de registro
|   |   └── Soporte.jsx   # Info y solicitudes de soporte
|   |
│   ├── App.jsx           # Componente principal
│   ├── App.css           # Estilos globales
|   ├── index.css         # Estilos base
│   └── main.jsx          
└── package.json          # Dependencias y scripts
```

## Requisitos

Para ejecutar el proyecto es necesario contar con:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- Un navegador web moderno (Chrome, Firefox, etc.)

## Como Ejecutar

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
```

2. Instalar dependencias:
```bash
cd proyecto-API-front
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Abrir [http://localhost:5173](http://localhost:5173) en el navegador

## Autores 👨‍💻👩‍💻

- Grupo 4

---

📌 Este proyecto fue desarrollado como **Trabajo Práctico Integrador** para la materia **Aplicaciones Interactivas**, dictada en la **Universidad Argentina de la Empresa (UADE)** durante el año 2025.
