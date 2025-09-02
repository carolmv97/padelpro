const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const profileRoutes = require("./routes/profile")
const matchRoutes = require("./routes/match")

const app = express()

app.options('*', cors());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error de conexión:", err))

app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/match", matchRoutes)

app.get("/", (req, res) => {
  res.send("Servidor de pádel funcionando ✅")
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
})

