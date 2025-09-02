const mongoose = require("mongoose")

const skillRatingSchema = new mongoose.Schema({
  remate: Number,
  volea: Number,
  defensa: Number,
  saque: Number,
  salidaPared: Number,
}, { _id: false });

const matchSchema = new mongoose.Schema({
  id: String,
  date: String,
  result: String,
  score: String,
  opponentLevel: Number,
  notes: String,
  skillRatings: skillRatingSchema
}, { _id: false });

const profileSchema = new mongoose.Schema({
  level: { type: Number, default: 0, min: 0, max: 10 },
  style: { type: String, enum: ["drive", "reves"] },
  matches: [matchSchema],
  skillAverages: {
    remate: { type: Number, default: 0 },
    volea: { type: Number, default: 0 },
    defensa: { type: Number, default: 0 },
    saque: { type: Number, default: 0 },
    salidaPared: { type: Number, default: 0 },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Profile", profileSchema)
