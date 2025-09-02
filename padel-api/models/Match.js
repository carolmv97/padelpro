const mongoose = require("mongoose")

const matchSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  score: { type: String, required: true },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  ratings: [{
  player: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  remate: { type: Number, default: 0 },
  volea: { type: Number, default: 0 },
  defensa: { type: Number, default: 0 },
  saque: { type: Number, default: 0 },
  salidaPared: { type: Number, default: 0 },
  notes: { type: String }

}]

})

module.exports = mongoose.model("Match", matchSchema)

