import "make-promises-safe"
import "dotenv/config"
import { logger } from "./logger"
import Net from "net"
import express from "express"
import mongoose from "mongoose"
import { Server } from "http"
import { broadcastAllStats, getAllStats } from "./StatsController"
import { Stats } from "./Stats"
import { statToChange, SetStat } from "./StatsController"
import { setSyntheticTrailingComments } from "typescript"

const TCP_PORT = process.env.TCP_PORT
const HTTP_PORT = process.env.HTTP_PORT
const httpServer = express()
const tcp = new Net.Server()
const sockets: any[] = []
mongoose.connect(
  `mongodb+srv://Nanol:mahakam@cluster0.lwjpj.mongodb.net/Multiplayer_Tamagochi`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
)
const db = mongoose.connection
db.on("error", err => {
  console.log(err)
})

Stats.watch().on("change", data => {
  SendDataToAllUsers(sockets)
})

httpServer.listen(HTTP_PORT, () => {
  console.log("listening to HTTP on " + HTTP_PORT)
})

httpServer.get("/all-stats", getAllStats)
tcp.listen(TCP_PORT, () => {
  console.log(`TCP Server listening on port ${TCP_PORT}`)
})
tcp.on("connection", async socket => {
  console.log("connection established")
  sockets.push(socket)
  socket.on("data", chunk => {
    if (chunk.toString() in statToChange) {
      SetStat(statToChange[chunk.toString()] || statToChange.education, 1)
    }
  })
  socket.on("end", function() {
    console.log("Closing connection with the client")
    sockets.splice(sockets.indexOf(socket), 1)
  })
})
tcp.on("close", function(socket: any) {
  console.log("server is closed now")
})

function broadcast(message: any, sender: any) {
  sockets.forEach(function(socket) {
    socket.write(message)
  })
}
function SendDataToAllUsers(socket: any) {
  broadcastAllStats().then((stats: any) => {
    broadcast(stats, socket)
  })
}
