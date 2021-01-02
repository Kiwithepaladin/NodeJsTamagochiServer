import mongoose from "mongoose"

const statsSchema = new mongoose.Schema({
  name: { type: String, index: true },
  education: Number,
  hunger: Number,
  happiness: Number,
  hygiene: Number,
  energy: Number,
})

export const Stats = mongoose.model("Stats", statsSchema)
