const express = require("express")
const Match = require("../models/Match")

const router = express.Router()

// Crear nuevo partido
router.post("/", async (req, res) => {
  try {
    const { players, score, winner, date } = req.body

    const newMatch = new Match({
      players,
      score,
      winner,
      date: date || new Date()
    })

    await newMatch.save()
    res.status(201).json({ message: "Partido guardado correctamente" })
  } catch (err) {
    res.status(500).json({ error: "Error al guardar partido", details: err.message })
  }
})

// Obtener partidos de un usuario
router.get("/user/:userId", async (req, res) => {
  try {
    const matches = await Match.find({ players: req.params.userId }).sort({ date: -1 })
    res.json(matches)
  } catch (err) {
    res.status(500).json({ error: "Error al obtener partidos", details: err.message })
  }
})

module.exports = router

