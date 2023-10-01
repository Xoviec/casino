const express = require("express")
const app = express()
const http = require("http")
const { Server } = require("socket.io");
const cors = require("cors")

app.use(cors())



const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

let isBettable = true


const getRandomSpin = () =>{
  return Math.floor(Math.random()*910) + 1
}



io.on("connection", (socket) => {


  // const betReady = () =>{
  //   isBettable = true
  //   socket.broadcast.emit("roulette-status", "Włączenie betowania na 5 sekund")
  //   setTimeout(betDisable, 5000)
  // }
  // const betDisable = () =>{
  //   isBettable = false
  //   socket.broadcast.emit("roulette-status", "Zablokowanie betów na 5 sekund")
  //   setTimeout(betReset, 5000)
  // }
  // const betReset = () =>{
  //   isBettable = false
  //   socket.broadcast.emit("roulette-status", "Resetowanie...")
  //   setTimeout(betReady, 5000)
  // }

  



  console.log("user connected", socket.id)

  // const interval = setInterval(() => {
  //   socket.emit('receive_message', 'To jest wiadomość co 5 sekund dla gracza: ' );
  // }, 1000);


  socket.on("send_message", (data)=>{
    console.log(data)
    io.emit("receive_chat_message", data) //wysyła do każdego
  })


  socket.on("send_player_bet", (data)=>{
    console.log(data)
    io.emit("receive_player_bet", data) //wysyła do każdego
  })

  
});


const betReadyMessageObject = {
  msg: 'Betowanie włączone',
  stage: 0
}

const betDisabledMessageObject = {
  msg: 'Betowanie wyłączone',
  stage: 1
}

const betResetMessageObject = {
  msg: 'Resetowanie...',
  stage: 2
}


const betReady = () =>{ //stage 0
  isBettable = true
  io.emit("roulette-status", betReadyMessageObject)
  setTimeout(betDisable, 5000)
}
const betDisable = () =>{ //stage 1
  isBettable = false
  const spinVal = getRandomSpin()
  io.emit("roulette-status", {...betDisabledMessageObject, spin: spinVal})
  setTimeout(betReset, 10000)
}
const betReset = () =>{ //stage 2
  isBettable = false
  io.emit("roulette-status", betResetMessageObject)
  setTimeout(betReady, 5000)
}

betReady()

server.listen(8000, ()=>{
    console.log("server is running")
})