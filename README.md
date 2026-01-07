# PadelPro - Tu App Personal para Mejorar en el Pádel

PadelPro es una aplicación web full-stack diseñada para ayudar a los jugadores de pádel a registrar su progreso, analizar sus habilidades y mejorar su juego. Los usuarios pueden registrarse, realizar una evaluación inicial de su nivel, registrar sus partidos y obtener feedback personalizado y tutoriales en vídeo para trabajar en áreas específicas de su juego.

## ✨ Características

- **Autenticación de Usuarios:** Sistema seguro de registro e inicio de sesión usando JWT.
- **Evaluación de Nivel:** Un cuestionario inicial para determinar el nivel del jugador (del 1 al 10).
- **Quiz de Estilo de Juego:** Un test para identificar el estilo natural del jugador (Drive o Revés).
- **Perfil Personalizado:** Un panel de control que muestra el nivel, estilo y estadísticas detalladas de las habilidades del jugador.
- **Registro de Partidos:** Un formulario para añadir los resultados de nuevos partidos, incluyendo el nivel del oponente, el marcador y una autoevaluación de las habilidades en ese partido.
- **Análisis de Habilidades:** Cálculo automático del promedio de habilidades (remate, volea, defensa, etc.) basado en los partidos registrados.
- **Tutoriales en Vídeo:** Una sección con tutoriales en vídeo profesionales para mejorar habilidades específicas como la defensa y el ataque.
- **Diseño Responsivo:** Una interfaz de usuario moderna y limpia construida con Next.js, TypeScript y Tailwind CSS.

## 🚀 Tech Stack

**Frontend:**
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend:**
- Node.js
- Express.js
- MongoDB (con Mongoose)
- JWT (para la autenticación)
- bcryptjs (para el hasheo de contraseñas)

## ⚙️ Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

### Prerrequisitos

- Node.js (v18.x o superior)
- npm
- Una cuenta de MongoDB Atlas (o una instancia local de MongoDB)

### Instalación y Configuración

1.  **Clona el repositorio:**
    ```bash
    git clone <URL-del-repositorio>
    cd mejorversionapp
    ```

2.  **Configuración del Backend (`padel-api`):**
    - Navega al directorio del backend:
      ```bash
      cd padel-api
      ```
    - Instala las dependencias:
      ```bash
      npm install
      ```
    - Crea un archivo `.env` en el directorio `padel-api` y añade las siguientes variables:
      ```env
      MONGO_URI=tu_string_de_conexion_a_mongodb
      PORT=4000
      JWT_SECRET=tu_clave_secreta_para_jwt
      ```
    - Inicia el servidor del backend:
      ```bash
      node server.js
      ```
    - El servidor estará funcionando en `http://localhost:4000`.

3.  **Configuración del Frontend (`appadel_`):**
    - Desde el directorio raíz, navega al directorio del frontend:
      ```bash
      cd appadel_
      ```
    - Instala las dependencias:
      ```bash
      npm install
      ```
    - Crea un archivo `.env.local` en el directorio `appadel_` y añade la siguiente variable, apuntando a tu API de backend:
      ```env
      NEXT_PUBLIC_API_URL=http://localhost:4000/api
      ```
    - Inicia el servidor de desarrollo del frontend:
      ```bash
      npm run dev
      ```
    - Abre tu navegador y visita `http://localhost:3000`.

## 📂 Estructura del Proyecto

```
mejorversionapp/
├── appadel_/         # Frontend (Next.js)
│   ├── app/          # App Router, páginas y layouts
│   ├── components/   # Componentes de React reutilizables (shadcn/ui)
│   ├── lib/          # Funciones de utilidad y llamadas a la API
│   └── ...
└── padel-api/        # Backend (Node.js/Express)
    ├── controllers/  # Lógica para manejar las peticiones
    ├── models/       # Esquemas de Mongoose para la base de datos
    ├── routes/       # Definición de los endpoints de la API
    ├── .env          # Variables de entorno
    └── server.js     # Punto de entrada principal del servidor
```
