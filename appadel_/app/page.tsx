"use client"

import { useState, useEffect } from "react"
import { registerUser, loginUser, getUserProfile, saveUserProfile } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Trophy,
  Target,
  Shield,
  Zap,
  Play,
  User,
  BarChart3,
  BookOpen,
  Star,
  TrendingUp,
  LogOut,
  UserPlus,
  LogIn,
} from "lucide-react"

interface PlayerProfile {
  id: string
  name: string
  email: string
  level: number
  playStyle: "drive" | "reves" | null
  matches: Match[]
  skillAverages: {
    remate: number
    volea: number
    defensa: number
    saque: number
    salidaPared: number
  }
  createdAt: string
}

interface Match {
  id: string
  date: string
  result: "win" | "loss"
  score: string
  opponentLevel: number
  notes: string
  skillRatings: {
    remate: number
    volea: number
    defensa: number
    saque: number
    salidaPared: number
  }
}

interface AuthUser {
  id: string
  name: string
  email: string
}

const skillConfig = {
  remate: { name: "Remate", color: "bg-green-500", icon: "🟢" },
  volea: { name: "Volea", color: "bg-red-500", icon: "🔴" },
  defensa: { name: "Defensa", color: "bg-blue-500", icon: "🔵" },
  saque: { name: "Saque", color: "bg-yellow-500", icon: "🟡" },
  salidaPared: { name: "Salida de Pared", color: "bg-purple-500", icon: "🟣" },
}

interface ImprovementVideo {
  id: string;
  category: 'Defensa' | 'Ataque';
  title: string;
  description: string;
  videoId: string; // YouTube video ID
}

const improvementVideos: ImprovementVideo[] = [
  {
    id: 'def-1',
    category: 'Defensa',
    title: 'Posición en Defensa',
    description: 'Aprende la postura correcta para defender',
    videoId: 'nREWxasJN70', // User's video
  },
  {
    id: 'def-2',
    category: 'Defensa',
    title: 'Globos Defensivos',
    description: 'Contenido próximamente disponible',
    videoId: '',
  },
  {
    id: 'def-3',
    category: 'Defensa',
    title: 'Movimiento en Pista',
    description: 'Contenido próximamente disponible',
    videoId: '',
  },
  {
    id: 'atk-1',
    category: 'Ataque',
    title: 'La Bandeja',
    description: 'Aprende a ejecutar la bandeja correctamente',
    videoId: '2JQhy3PjydQ', // User's video
  },
  {
    id: 'atk-2',
    category: 'Ataque',
    title: 'Remate Potente',
    description: 'Contenido próximamente disponible',
    videoId: '',
  },
  {
    id: 'atk-3',
    category: 'Ataque',
    title: 'Bajadas por 3',
    description: 'Contenido próximamente disponible',
    videoId: '',
  },
];

export default function PadelApp() {
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [currentSection, setCurrentSection] = useState<"survey" | "quiz" | "profile" | "improve">("survey")
  const [surveyStep, setSurveyStep] = useState(0)
  const [surveyAnswers, setSurveyAnswers] = useState<number[]>([])
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])
  const [player, setPlayer] = useState<PlayerProfile>({
    id: "",
    name: "",
    email: "",
    level: 0,
    playStyle: null,
    matches: [],
    skillAverages: {
      remate: 0,
      volea: 0,
      defensa: 0,
      saque: 0,
      salidaPared: 0,
    },
    createdAt: "",
  })
  const [showLevelResult, setShowLevelResult] = useState(false)
  const [newMatch, setNewMatch] = useState({
    date: "",
    result: "",
    score: "",
    opponentLevel: "",
    notes: "",
    skillRatings: {
      remate: 3,
      volea: 3,
      defensa: 3,
      saque: 3,
      salidaPared: 3,
    },
  })
  const [selectedVideo, setSelectedVideo] = useState<ImprovementVideo | null>(null);

  
useEffect(() => {
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthStatus('unauthenticated');
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        setAuthStatus('unauthenticated');
        return;
      }

      const user = await res.json();
      setCurrentUser(user);
      setAuthStatus('authenticated');

      const profile = await getUserProfile(user.userId);
      if (profile) {
        setPlayer({
          ...profile,
          playStyle: profile.style, // Mapear style a playStyle
          id: user.userId, // Asegurarse de que el ID se conserva
          matches: profile.matches ?? [], // fuerza array si viene undefined
        });
        if (profile.level > 0) {
          setCurrentSection("profile");
        }
      }
    } catch (err) {
      console.error("No hay sesión activa");
    }
  };

  checkAuth();
}, []);

const handleAuth = async () => {
  if (authMode === "register") {
    if (!authForm.name || !authForm.email || !authForm.password) {
      alert("Por favor completa todos los campos")
      return
    }

    try {
      const response = await registerUser({
        name: authForm.name,
        email: authForm.email,
        password: authForm.password,
      })

      // Guardar el token en localStorage
      if (response.token) {
        localStorage.setItem('token', response.token)
      } else {
        alert("Error: El backend no devolvió un token de autenticación.");
        return;
      }

      if (!response.userId) {
        alert("Error: El backend no devolvió el userId");
        return;
      }

      const user = {
        id: response.userId,
        name: response.name, // Leer el nombre desde la respuesta
        email: authForm.email,
      }

      let profile = await getUserProfile(user.id)

      // Si no existe el perfil, créalo vacío
      if (!profile) {
        profile = {
          id: user.id,
          name: user.name,
          email: user.email,
          level: 0,
          playStyle: null,
          matches: [],
          skillAverages: {
            remate: 0,
            volea: 0,
            defensa: 0,
            saque: 0,
            salidaPared: 0,
          },
          createdAt: new Date().toISOString(),
        }
        await saveUserProfile(profile)
      }

      setCurrentUser(user)
      setPlayer({
        ...profile,
        id: user.id, // Asegurarse de que el ID se conserva
        playStyle: profile.style, // Mapear style a playStyle
        matches: profile.matches ?? [], // fuerza array si viene undefined
      })
      setAuthStatus('authenticated');
      setCurrentSection(profile.level > 0 ? "profile" : "survey")
    } catch (error: any) {
      alert("Error al registrarse: " + error.message)
    }
  } else {
    if (!authForm.email || !authForm.password) {
      alert("Por favor completa todos los campos")
      return
    }

    try {
      const response = await loginUser({
        email: authForm.email,
        password: authForm.password,
      })

      // Guardar el token en localStorage
      if (response.token) {
        localStorage.setItem('token', response.token)
      }

      const user = {
        id: response.userId,
        name: response.name, // Leer el nombre desde la respuesta
        email: authForm.email,
      }

      let profile = await getUserProfile(user.id)

      if (!profile) {
        profile = {
          id: user.id,
          name: user.name,
          email: user.email,
          level: 0,
          playStyle: null,
          matches: [],
          skillAverages: {
            remate: 0,
            volea: 0,
            defensa: 0,
            saque: 0,
            salidaPared: 0,
          },
          createdAt: new Date().toISOString(),
        }
        await saveUserProfile(profile)
      }

      setCurrentUser(user)
      setPlayer({
        ...profile,
        id: user.id, // Asegurarse de que el ID se conserva
        playStyle: profile.style, // Mapear style a playStyle
        matches: profile.matches ?? [],
      })
      setAuthStatus('authenticated');
      setCurrentSection(profile.level > 0 ? "profile" : "survey")
    } catch (error: any) {
      alert("Error al iniciar sesión: " + error.message)
    }
  }

  setAuthForm({ name: "", email: "", password: "" })
}

const handleLogout = () => {
  setCurrentUser(null)
  setAuthStatus('unauthenticated');
  setPlayer({
    id: "",
    name: "",
    email: "",
    level: 0,
    playStyle: null,
    matches: [],
    skillAverages: {
      remate: 0,
      volea: 0,
      defensa: 0,
      saque: 0,
      salidaPared: 0,
    },
    createdAt: "",
  })
  setCurrentSection("survey")
  setSurveyStep(0)
  setSurveyAnswers([])
  setQuizAnswers([])
  setShowLevelResult(false)
  // Eliminar el token al cerrar sesión
  localStorage.removeItem('token')
}


  const surveyQuestions = [
    "¿Cuánto tiempo llevas jugando al pádel?",
    "¿Con qué frecuencia juegas?",
    "¿Cómo calificarías tu nivel de juego actual?",
    "¿Participas en torneos o competiciones?",
    "¿Qué tan cómodo te sientes con diferentes tipos de golpes?",
  ]

  const surveyOptions = [
    ["Menos de 6 meses", "6 meses - 1 año", "1-3 años", "3-5 años", "Más de 5 años"],
    ["1 vez por semana", "2-3 veces por semana", "4-5 veces por semana", "Casi todos los días"],
    ["Principiante", "Intermedio bajo", "Intermedio", "Intermedio alto", "Avanzado"],
    ["Nunca", "Ocasionalmente", "Regularmente", "Competidor activo"],
    ["Muy incómodo", "Algo incómodo", "Neutral", "Cómodo", "Muy cómodo"],
  ]

  const quizQuestions = [
    {
      question: "¿Cuál es tu posición preferida en la pista?",
      options: ["Lado derecho (drive)", "Lado izquierdo (revés)", "Me adapto a ambos"],
    },
    {
      question: "¿Qué golpe te resulta más natural?",
      options: ["Drive", "Revés", "Ambos por igual"],
    },
    {
      question: "En situaciones de presión, ¿qué haces?",
      options: ["Busco mi drive", "Confío en mi revés", "Depende de la situación"],
    },
    {
      question: "¿Cómo prefieres atacar?",
      options: ["Desde el lado derecho", "Desde el lado izquierdo", "Desde cualquier lado"],
    },
  ]

  const calculateLevel = (answers: number[]) => {
    const total = answers.reduce((sum, answer) => sum + answer, 0)
    const maxPossible = answers.length * 4
    const percentage = total / maxPossible

    if (percentage <= 0.2) return 1
    if (percentage <= 0.3) return 2
    if (percentage <= 0.4) return 3
    if (percentage <= 0.5) return 4
    if (percentage <= 0.6) return 5
    if (percentage <= 0.7) return 6
    if (percentage <= 0.8) return 7
    if (percentage <= 0.9) return 8
    if (percentage <= 0.95) return 9
    return 10
  }

  const calculateSkillAverages = (matches: Match[]) => {
    if (matches.length === 0) {
      return {
        remate: 0,
        volea: 0,
        defensa: 0,
        saque: 0,
        salidaPared: 0,
      }
    }

    const totals = matches.reduce(
      (acc, match) => ({
        remate: acc.remate + match.skillRatings.remate,
        volea: acc.volea + match.skillRatings.volea,
        defensa: acc.defensa + match.skillRatings.defensa,
        saque: acc.saque + match.skillRatings.saque,
        salidaPared: acc.salidaPared + match.skillRatings.salidaPared,
      }),
      { remate: 0, volea: 0, defensa: 0, saque: 0, salidaPared: 0 },
    )

    return {
      remate: Math.round((totals.remate / matches.length) * 10) / 10,
      volea: Math.round((totals.volea / matches.length) * 10) / 10,
      defensa: Math.round((totals.defensa / matches.length) * 10) / 10,
      saque: Math.round((totals.saque / matches.length) * 10) / 10,
      salidaPared: Math.round((totals.salidaPared / matches.length) * 10) / 10,
    }
  }

  const determinePlayStyle = (answers: string[]): "drive" | "reves" => {
    const driveCount = answers.filter(
      (answer) => answer && (answer.includes("derecho") || answer.includes("Drive") || answer.includes("drive")),
    ).length
    return driveCount >= 2 ? "drive" : "reves"
  }

  const handleSurveyNext = () => {
    if (surveyStep < surveyQuestions.length - 1) {
      const nextStep = surveyStep + 1;
      setSurveyStep(nextStep);

      // Pre-select the first answer for the next question if it's not already answered
      if (surveyAnswers[nextStep] === undefined) {
        const newAnswers = [...surveyAnswers];
        newAnswers[nextStep] = 0; // Default to the first option
        setSurveyAnswers(newAnswers);
      }
    } else {
      const level = calculateLevel(surveyAnswers);
      const updatedPlayer = { ...player, level };
      setPlayer(updatedPlayer);
      saveUserProfile(updatedPlayer);
      setShowLevelResult(true);
    }
  };

  const handleQuizComplete = () => {
    const playStyle = determinePlayStyle(quizAnswers)
    const updatedPlayer = { ...player, playStyle }
    setPlayer(updatedPlayer)
    saveUserProfile(updatedPlayer)
    setCurrentSection("profile")
  }

  const handleAddMatch = () => {
    if (newMatch.date && newMatch.result && newMatch.score && newMatch.opponentLevel) {
      const matchData: Match = {
        id: Date.now().toString(),
        date: newMatch.date,
        result: newMatch.result as "win" | "loss",
        score: newMatch.score,
        opponentLevel: Number.parseInt(newMatch.opponentLevel),
        notes: newMatch.notes,
        skillRatings: { ...newMatch.skillRatings },
      }

      const updatedMatches = [...player.matches, matchData]
      const newAverages = calculateSkillAverages(updatedMatches)
      const updatedPlayer = {
        ...player,
        matches: updatedMatches,
        skillAverages: newAverages,
      }

      setPlayer(updatedPlayer)
      saveUserProfile(updatedPlayer)

      setNewMatch({
        date: "",
        result: "",
        score: "",
        opponentLevel: "",
        notes: "",
        skillRatings: {
          remate: 3,
          volea: 3,
          defensa: 3,
          saque: 3,
          salidaPared: 3,
        },
      })
    }
  }

  const renderStarRating = (skill: keyof typeof skillConfig, value: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer transition-all duration-200 hover:scale-110 ${
              star <= value ? "fill-yellow-400 text-yellow-400 drop-shadow-sm" : "text-gray-300 hover:text-yellow-200"
            }`}
            onClick={() =>
              setNewMatch((prev) => ({
                ...prev,
                skillRatings: { ...prev.skillRatings, [skill]: star },
              }))
            }
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {value === 1 && "Mal"}
          {value === 2 && "Regular"}
          {value === 3 && "Bien"}
          {value === 4 && "Muy bien"}
          {value === 5 && "Excelente"}
        </span>
      </div>
    )
  }

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-emerald-700">Cargando...</div>
      </div>
    );
  }

  // Pantalla de autenticación
  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-emerald-200 shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Trophy className="w-8 h-8 text-yellow-300" />
              PadelPro
            </CardTitle>
            <CardDescription className="text-emerald-100">
              {authMode === "login" ? "Inicia sesión en tu cuenta" : "Crea tu cuenta de jugador"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-4">
              {authMode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={authForm.name}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="border-2 border-gray-200"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="border-2 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="border-2 border-gray-200"
                />
              </div>
            </div>

            <Button
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 text-lg"
            >
              {authMode === "login" ? (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Iniciar Sesión
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Crear Cuenta
                </>
              )}
            </Button>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="text-emerald-600 hover:text-emerald-700"
              >
                {authMode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentSection === "survey") {
    if (showLevelResult) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
          <div className="max-w-2xl mx-auto">
            <Card className="mt-8 border-2 border-emerald-200 shadow-xl">
              <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Trophy className="w-8 h-8 text-yellow-300" />
                  ¡Evaluación Completada!
                </CardTitle>
                <CardDescription className="text-emerald-100">
                  Hola {player.name}, aquí tienes tu nivel actual de pádel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-center p-8">
                <div className="space-y-4">
                  <div className="text-7xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {player.level}
                  </div>
                  <div className="text-xl text-gray-600">Tu Nivel de Pádel</div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${player.level * 10}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border">
                  <h3 className="font-semibold text-gray-800">Interpretación del nivel:</h3>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>1-3: Principiante - Enfócate en
                      fundamentos básicos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>4-6: Intermedio - Desarrolla técnicas
                      específicas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>7-8: Avanzado - Perfecciona estrategias
                      de juego
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>9-10: Experto - Compite a alto nivel
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => setCurrentSection("quiz")}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3"
                  >
                    Hacer Quiz Drive/Revés 🎾
                  </Button>
                  <Button
                    onClick={() => setCurrentSection("profile")}
                    variant="outline"
                    className="w-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 py-3"
                  >
                    Saltar Quiz e Ir al Perfil ⏭️
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="mt-8 border-2 border-emerald-200 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-300" />
                Evaluación Inicial de Nivel
              </CardTitle>
              <CardDescription className="text-emerald-100">
                Hola {player.name}, responde estas preguntas para determinar tu nivel actual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Pregunta {surveyStep + 1} de {surveyQuestions.length}
                  </span>
                  <span>{Math.round(((surveyStep + 1) / surveyQuestions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((surveyStep + 1) / surveyQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">{surveyQuestions[surveyStep]}</h3>
                <RadioGroup
                  value={surveyAnswers[surveyStep]?.toString()}
                  onValueChange={(value) => {
                    const newAnswers = [...surveyAnswers]
                    newAnswers[surveyStep] = Number.parseInt(value)
                    setSurveyAnswers(newAnswers)
                  }}
                >
                  {surveyOptions[surveyStep].map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                onClick={handleSurveyNext}
                disabled={surveyAnswers[surveyStep] === undefined}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3"
              >
                {surveyStep < surveyQuestions.length - 1 ? "Siguiente ➡️" : "Finalizar Evaluación 🎯"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentSection === "quiz") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="mt-8 border-2 border-blue-200 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-center gap-2">
                <Target className="w-6 h-6 text-yellow-300" />
                Quiz: ¿Eres Drive o Revés?
              </CardTitle>
              <CardDescription className="text-blue-100">Descubre tu estilo de juego natural</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {player.playStyle ? (
                <div className="text-center space-y-4">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {player.playStyle === "drive" ? "🎾 Drive" : "🎾 Revés"}
                  </div>
                  <p className="text-gray-600">
                    Tu estilo de juego es{" "}
                    <span className="font-bold">{player.playStyle === "drive" ? "Drive" : "Revés"}</span>.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => {
                        setQuizAnswers([])
                        const updatedPlayer = { ...player, playStyle: null }
                        setPlayer(updatedPlayer)
                        saveUserProfile(updatedPlayer)
                      }}
                      variant="outline"
                      className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      Repetir Quiz 🔄
                    </Button>
                    <Button
                      onClick={() => setCurrentSection("profile")}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      Ir al Perfil 👤
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {quizQuestions.map((q, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="font-medium text-gray-800">{q.question}</h3>
                      <RadioGroup
                        value={quizAnswers[index] || ""}
                        onValueChange={(value) => {
                          const newAnswers = [...quizAnswers]
                          newAnswers[index] = value
                          setQuizAnswers(newAnswers)
                        }}
                      >
                        {q.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border"
                          >
                            <RadioGroupItem value={option} id={`q${index}-${optIndex}`} />
                            <Label htmlFor={`q${index}-${optIndex}`} className="cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCurrentSection("profile")}
                      variant="outline"
                      className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Saltar Quiz ⏭️
                    </Button>
                    <Button
                      onClick={handleQuizComplete}
                      disabled={quizAnswers.filter(Boolean).length < quizQuestions.length}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      Ver Resultado 🎯
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white shadow-lg border-b-2 border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              PadelPro
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hola, {currentUser?.name}</span>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1">
                Nivel {player.level}
              </Badge>
              {player.playStyle && (
                <Badge
                  className={`px-3 py-1 ${
                    player.playStyle === "drive"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                  }`}
                >
                  {player.playStyle === "drive" ? "🎾 Drive" : "🎾 Revés"}
                </Badge>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white shadow-lg border-2 border-gray-200">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              <User className="w-4 h-4" />
              Mi Perfil
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Target className="w-4 h-4" />
              Quiz Drive/Revés
            </TabsTrigger>
            <TabsTrigger
              value="improve"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              <BookOpen className="w-4 h-4" />
              ¿Qué Mejorar Hoy?
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-2 border-emerald-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Nivel por Golpes
                  </CardTitle>
                  <CardDescription className="text-emerald-100">
                    Basado en tu autoevaluación en partidos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
{player.skillAverages &&
  Object.entries(player.skillAverages).map(([skill, average]) => {
                    const config = skillConfig[skill as keyof typeof skillConfig]
                    return (
                      <div key={skill} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2 font-medium">
                            <span className="text-lg">{config.icon}</span>
                            {config.name}
                          </span>
                          <span className="font-bold text-lg">{average}/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${config.color} h-3 rounded-full transition-all duration-1000`}
                            style={{ width: `${(average / 5) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Necesita trabajo</span>
                          <span>Excelente</span>
                        </div>
                      </div>
                    )
                  })}
{player.matches && player.matches.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Registra tu primer partido para ver tus estadísticas</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle>Agregar Partido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <Input
                    type="date"
                    value={newMatch.date}
                    onChange={(e) => setNewMatch((prev) => ({ ...prev, date: e.target.value }))}
                    className="border-2 border-gray-200"
                  />
                  <Select
                    value={newMatch.result}
                    onValueChange={(value) => setNewMatch((prev) => ({ ...prev, result: value }))}
                  >
                    <SelectTrigger className="border-2 border-gray-200">
                      <SelectValue placeholder="Resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="win">🏆 Victoria</SelectItem>
                      <SelectItem value="loss">😔 Derrota</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Marcador (ej: 6-4, 6-2)"
                    value={newMatch.score}
                    onChange={(e) => setNewMatch((prev) => ({ ...prev, score: e.target.value }))}
                    className="border-2 border-gray-200"
                  />
                  <Select
                    value={newMatch.opponentLevel}
                    onValueChange={(value) => setNewMatch((prev) => ({ ...prev, opponentLevel: value }))}
                  >
                    <SelectTrigger className="border-2 border-gray-200">
                      <SelectValue placeholder="Nivel oponentes" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          Nivel {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-semibold text-gray-800">¿Cómo jugaste hoy?</h4>
                    {Object.entries(skillConfig).map(([skill, config]) => (
                      <div key={skill} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <span>{config.icon}</span>
                            {config.name}
                          </span>
                          <span className="text-sm font-bold">
                            {newMatch.skillRatings[skill as keyof typeof newMatch.skillRatings]}/5
                          </span>
                        </div>
                        {renderStarRating(
                          skill as keyof typeof skillConfig,
                          newMatch.skillRatings[skill as keyof typeof newMatch.skillRatings],
                        )}
                      </div>
                    ))}
                  </div>

                  <Textarea
                    placeholder="Notas del partido"
                    value={newMatch.notes}
                    onChange={(e) => setNewMatch((prev) => ({ ...prev, notes: e.target.value }))}
                    className="border-2 border-gray-200"
                  />
                  <Button
                    onClick={handleAddMatch}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3"
                  >
                    Guardar Partido 💾
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
                <CardTitle>Historial de Partidos</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
{Array.isArray(player.matches) && player.matches.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No hay partidos registrados aún</p>
                    <p className="text-gray-400 text-sm mt-2">¡Registra tu primer partido para empezar!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {player.matches.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between p-4 border-2 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            className={
                              match.result === "win"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                            }
                          >
                            {match.result === "win" ? "🏆 Victoria" : "😔 Derrota"}
                          </Badge>
                          <span className="font-medium">{match.score}</span>
                          <span className="text-sm text-gray-500">vs Nivel {match.opponentLevel}</span>
                        </div>
                        <span className="text-sm text-gray-500">{match.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <Card className="max-w-2xl mx-auto border-2 border-blue-200 shadow-xl">
              <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Target className="w-6 h-6 text-yellow-300" />
                  Quiz: ¿Eres Drive o Revés?
                </CardTitle>
                <CardDescription className="text-blue-100">Descubre tu estilo de juego natural</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {player.playStyle ? (
                  <div className="text-center space-y-4">
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {player.playStyle === "drive" ? "🎾 Drive" : "🎾 Revés"}
                    </div>
                    <p className="text-gray-600">
                      Tu estilo de juego es{" "}
                      <span className="font-bold">{player.playStyle === "drive" ? "Drive" : "Revés"}</span>.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => {
                          setQuizAnswers([])
                          const updatedPlayer = { ...player, playStyle: null }
                          setPlayer(updatedPlayer)
                          saveUserProfile(updatedPlayer)
                        }}
                        variant="outline"
                        className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        Repetir Quiz 🔄
                      </Button>
                      <Button
                        onClick={() => setCurrentSection("profile")}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        Ir al Perfil 👤
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {quizQuestions.map((q, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="font-medium text-gray-800">{q.question}</h3>
                        <RadioGroup
                          value={quizAnswers[index] || ""}
                          onValueChange={(value) => {
                            const newAnswers = [...quizAnswers]
                            newAnswers[index] = value
                            setQuizAnswers(newAnswers)
                          }}
                        >
                          {q.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border"
                            >
                              <RadioGroupItem value={option} id={`q${index}-${optIndex}`} />
                              <Label htmlFor={`q${index}-${optIndex}`} className="cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setCurrentSection("profile")}
                        variant="outline"
                        className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        Saltar Quiz ⏭️
                      </Button>
                      <Button
                        onClick={handleQuizComplete}
                        disabled={quizAnswers.filter(Boolean).length < quizQuestions.length}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      >
                        Ver Resultado 🎯
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="improve" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Defensa
                  </CardTitle>
                  <CardDescription className="text-blue-100">Mejora tu juego defensivo y resistencia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-3">
                    {improvementVideos.filter(v => v.category === 'Defensa').map(video => (
                      <div key={video.id} onClick={() => video.videoId && setSelectedVideo(video)} className={`flex items-center gap-3 p-4 border-2 rounded-lg ${video.videoId ? 'hover:bg-blue-50 cursor-pointer transition-colors' : 'opacity-50 cursor-not-allowed'}`}>
                        <Play className={`w-5 h-5 ${video.videoId ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div>
                          <h4 className="font-medium">{video.title}</h4>
                          <p className="text-sm text-gray-600">{video.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Ataque
                  </CardTitle>
                  <CardDescription className="text-red-100">Potencia tu juego ofensivo y definición</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-3">
                    {improvementVideos.filter(v => v.category === 'Ataque').map(video => (
                      <div key={video.id} onClick={() => video.videoId && setSelectedVideo(video)} className={`flex items-center gap-3 p-4 border-2 rounded-lg ${video.videoId ? 'hover:bg-red-50 cursor-pointer transition-colors' : 'opacity-50 cursor-not-allowed'}`}>
                        <Play className={`w-5 h-5 ${video.videoId ? 'text-red-500' : 'text-gray-400'}`} />
                        <div>
                          <h4 className="font-medium">{video.title}</h4>
                          <p className="text-sm text-gray-600">{video.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {selectedVideo && (
          <Dialog open={selectedVideo !== null} onOpenChange={() => setSelectedVideo(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{selectedVideo.title}</DialogTitle>
              </DialogHeader>
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
