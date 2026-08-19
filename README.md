# 🏎️ F1 Bet - Frontend Web App

> **La plataforma web definitiva para competir con amigos pronosticando podios de Fórmula 1 y llevar la emoción de cada Gran Premio al siguiente nivel.**

---

## 📌 Descripción

**F1 Bet** es una aplicación web moderna, dinámica e intuitiva creada para hacer la temporada de Fórmula 1 mucho más entretenida. Permite a grupos de amigos y fanáticos de las carreras:
- Pronosticar el podio (1º, 2º y 3º puesto) antes del inicio de cada Gran Premio.
- Visualizar en tiempo real el podio armado con colores metálicos.
- Seguir la cuenta regresiva en vivo hacia la siguiente carrera.
- Competir en el Ranking General de la temporada con medallas y estadísticas.
- Personalizar la interfaz gráfica según su escudería favorita de F1 (Ferrari, Red Bull, Mercedes, Aston Martin, McLaren, etc.).

---

## ✨ Características de la Interfaz (UI/UX)

- 🔴 **F1 Dark Mode & Glassmorphism**: Estética nocturna de competición con tarjetas traslúcidas de cristal esmerilado y luces neón.
- 🎨 **Temas Dinámicos por Escudería**: Cambia la paleta de colores de toda la aplicación al seleccionar tu equipo preferido en tu perfil.
- ⏱️ **Countdown Timer**: Reloj con cuenta regresiva en tiempo real para el cierre de predicciones.
- 🏆 **Podio Visual Interactivo**: Componente interactivo que refleja al instante los pilotos elegidos para 1º, 2º y 3º lugar.
- 📱 **Diseño 100% Responsive**: Optimizado para teléfonos móviles, tablets y ordenadores con menú drawer deslizable.
- 🥇 **Ranking General**: Clasificación con insignias doradas, plateadas y de bronce para el Top 3 y destaque visual del usuario logueado.

---

## 🛠️ Tecnologías Utilizadas

- **Framework Frontend**: React 18
- **Librería de Componentes UI**: Material UI (MUI v5)
- **Tipografías**: Google Fonts (*Orbitron* para títulos de carreras y *Outfit* para lectura)
- **Peticiones HTTP**: Axios
- **Enrutamiento**: React Router DOM v6
- **Estilos**: Vanilla CSS con variables personalizadas & Glassmorphism

---

## ⚙️ Configuración e Instalación

### 1. Requisitos Previos
- Node.js (v16 o superior)
- Servidor Backend de F1 Bet corriendo (repositorio [F1-BET-BACK](https://github.com/NahuelBOR/F1-BET-BACK))

### 2. Pasos de Instalación

```bash
# Clonar el repositorio
git clone https://github.com/NahuelBOR/F1-BET-FRONT.git
cd F1-BET-FRONT

# Instalar dependencias
npm install
```

### 3. Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto para conectar la aplicación con la API Backend:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Para producción, reemplaza la URL por la de tu servidor remoto (ej: Render, Vercel, Railway).

### 4. Ejecutar la Aplicación

```bash
# Servidor de Desarrollo
npm start

# Compilación para Producción (Build)
npm run build
```

---

## 📸 Estructura de Páginas

- 🏠 **Inicio (`/`)**: Hero banner de bienvenida, cuenta regresiva al siguiente GP y explicación del juego.
- 🏁 **Calendario de Carreras (`/races`)**: Listado completo de Grandes Premios con filtros por estado.
- 🗳️ **Hacer Predicción (`/predict/:raceId`)**: Selector de pilotos con vista previa del podio en vivo.
- 🏆 **Ranking General (`/ranking`)**: Tabla de clasificación del campeonato de predicciones.
- 👤 **Perfil de Piloto (`/profile/:id`)**: Avatar personalizable, estadísticas, selección de tema de escudería e historial de predicciones.
- ⚙️ **Torre de Control (`/admin`)**: Panel exclusivo de administración para dar de alta carreras y calcular puntos.

---

## 🤝 Créditos

Creado para llevar la pasión del Paddock de la Fórmula 1 a cada Gran Premio en compañía de amigos. 🏁
