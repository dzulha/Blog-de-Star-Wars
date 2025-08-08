# 🚀 StarWars Blog App

Aplicación web desarrollada con **React** que consume la API de [SWAPI.tech](https://www.swapi.tech/) y muestra información detallada sobre **personajes**, **planetas** y **vehículos** del universo de Star Wars.  
Incluye integración con **Wikipedia** para añadir descripciones enriquecidas, imágenes dinámicas y un sistema de favoritos persistente.

## ⭐ Características principales

- **Búsqueda unificada** de personajes, planetas y vehículos
- **Vista de detalles** en un layout de dos columnas con:
  - Imagen dinámica
  - Descripción obtenida de Wikipedia
  - Especificaciones técnicas según el tipo de elemento
- **Sistema de favoritos** persistente en localStorage
- **Manejo de errores y cargas** con `spinner` y mensajes claros
- **Diseño responsivo** con Bootstrap 5 y CSS personalizado
- **Arquitectura organizada** con uso de `utils` para código reutilizable

## 🗂️ Estructura del proyecto

```bash
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales (Home, Details, etc.)
├── utils/         # Funciones de utilidad
│   ├── useRotatingImageSrc.js  # Hook para imágenes con fallback
│   └── wikiExtract.js          # Función para extractos de Wikipedia
└── styles.css     # Estilos personalizados
```

## 🛠️ Tecnologías utilizadas

- React + React Router
- Bootstrap 5
- Fetch API
- Wikipedia REST API
- LocalStorage API
- CSS personalizado

## 🔧 Utils destacados

### useRotatingImageSrc.js
Hook personalizado que gestiona la carga de imágenes desde múltiples URLs con fallback automático en caso de error.

### wikiExtract.js
Función que consulta la API de Wikipedia y obtiene extractos limpios y formateados para enriquecer la experiencia del usuario.

### Beneficios del uso de utils:
- ♻️ Evita duplicación de código
- 📖 Mejora la legibilidad del código
- 🔄 Facilita la escalabilidad

## 💡 Aprendizajes clave

- Implementación de hooks personalizados
- Consumo de múltiples APIs REST
- Manejo de estados de carga y error
- Componentes reutilizables
- Diseño responsivo
- Arquitectura modular

## 📸 Capturas de pantalla


![Screenshot01](./src/img/Screenshot%202025-08-08%20at%2016-40-36%20Pablo%20Star%20Wars%20Blog.png)

![Screenshot02](./src/img/Screenshot%202025-08-08%20at%2016-41-04%20Pablo%20Star%20Wars%20Blog.png)