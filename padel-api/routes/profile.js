const express = require("express")
const Profile = require("../models/Profile")

const router = express.Router()

// Crear perfil
router.post("/", async (req, res) => {
  try {
    const { level, style, skillAverages, userId } = req.body

    const newProfile = new Profile({
      level,
      style,
      skillAverages,
      user: userId
    })

    await newProfile.save()
    res.status(201).json({ message: "Perfil creado correctamente" })
  } catch (err) {
    res.status(500).json({ error: "Error al crear perfil", details: err.message })
  }
})

// Obtener perfil por ID de usuario
router.get("/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId })
    if (!profile) return res.status(404).json({ error: "Perfil no encontrado" })
    res.json(profile)
  } catch (err) {
    res.status(500).json({ error: "Error al buscar perfil", details: err.message })
  }
})

// Actualizar perfil por ID de usuario
router.put("/:userId", async (req, res) => {
  try {
    const { level, playStyle, matches, skillAverages } = req.body;

    const updateData = {};

    if (level !== undefined) updateData.level = level;
    if (playStyle) updateData.style = playStyle;
    if (matches) updateData.matches = matches;
    if (skillAverages) updateData.skillAverages = skillAverages;

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.params.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: "Perfil no encontrado para actualizar" });
    }

    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar perfil", details: err.message });
  }
});

module.exports = router

