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

let usersList = []

const bets=[
  {
    number: 9,
    color: 'Red',
  },
  {
    number: 6,
    color: 'Black',
  },
  {
    number: 7,
    color: 'Red',
  },
  {
    number: 8,
    color: 'Black',
  },
  {
    number: 5,
    color: 'Red',
  },
  {
    number: 10,
    color: 'Black',
  },
  {
    number: 3,
    color: 'Red',
  },
  {
    number: 12,
    color: 'Black',
  },
  {
    number: 1,
    color: 'Red',
  },
  {
    number: 13,
    color: 'Green',
  },
  {
    number: 2,
    color: 'Black',
  },
  {
    number: 11,
    color: 'Red',
  },
  {
    number: 4,
    color: 'Black',
  },
]

const dupa = bets[0]


const getRandomSpin = () =>{
  const spinVal = Math.floor(Math.random()*910) + 1


  switch (true) {
    case spinVal >= 0 && spinVal < 70:
      return([bets[1], spinVal]);
    case spinVal >= 70 && spinVal < 140:
      return([bets[2], spinVal]);
    case spinVal >= 140 && spinVal < 210:
      return([bets[3], spinVal]);
    case spinVal >= 210 && spinVal < 280:
      return([bets[4], spinVal]);
    case spinVal >= 280 && spinVal < 350:
      return([bets[5], spinVal]);
    case spinVal >= 350 && spinVal < 420:
      return([bets[6], spinVal]);
    case spinVal >= 420 && spinVal < 490:
      return([bets[7], spinVal]);
    case spinVal >= 490 && spinVal < 560:
      return([bets[8], spinVal]);
    case spinVal >= 560 && spinVal < 630:
      return([bets[9], spinVal]);
    case spinVal >= 630 && spinVal < 700:
      return([bets[10], spinVal]);
    case spinVal >= 700 && spinVal < 770:
      return([bets[11], spinVal]);
    case spinVal >= 770 && spinVal < 840:
      return([bets[12], spinVal]);
    case spinVal >= 840:
      return([bets[0], spinVal]);

  }
}



let placedBets = []


function updatePlacedBets(betObj) {
  const existingBetIndex = placedBets.findIndex(betDetails => betDetails.userID === betObj.userID);

  if (existingBetIndex !== -1) {
    // Jeśli użytkownik istnieje w placedBets, zaktualizuj jego bets za pomocą Object.assign()
    const updatedBet = Object.assign({}, placedBets[existingBetIndex], betObj);
    placedBets[existingBetIndex] = updatedBet;
  } else {
    // Jeśli użytkownik nie istnieje w placedBets, dodaj nowy obiekt
    placedBets.push(betObj);
  }
}



io.on("connection", (socket) => {

  usersList.push(socket.id)

  console.log(usersList)

  io.emit("get_previous_bets", { placedBets, isBettable }); // do każdego idzie


  socket.on("disconnect", () => {
    console.log('User', socket.id, 'has disconnected'); // false
  });



  console.log("user connected", socket.id)



  socket.on("send_message", (data)=>{
    console.log(data)
    io.emit("receive_chat_message", data) //wysyła do każdego
  })


  socket.on("send_player_bet", (data)=>{

    console.log(data)
    updatePlacedBets(data)
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
  setTimeout(betDisable, 15000)
}
const betDisable = () =>{ //stage 1
  isBettable = false
  const betVal = getRandomSpin()

  const spinColor = betVal[0].color
  const spinNumber = betVal[0].number
  const spinVal = betVal[1]

  console.log('Kolor:', spinColor)
  console.log('Number:', spinNumber)
  console.log('Obrót o:', spinVal)
  io.emit("roulette-status", {...betDisabledMessageObject, spin: spinVal, placedBets})
  setTimeout(betReveal, 5000, spinColor, spinNumber)
  setTimeout(betReset, 10000)
}
const betReveal = (color, number) =>{
  console.log(color, number)
  io.emit("bet-reveal", {color: color, number: number})
  getWinner(color)
}
const betReset = () =>{ //stage 2
  isBettable = false
  io.emit("roulette-status", betResetMessageObject)
  setTimeout(betReady, 1000)
  placedBets = []
}

const getWinner = (color) =>{
  console.log(placedBets)

  const winners = placedBets.filter((player)=>player.bets[color] > 0)



  const winnersID = winners.map((user) => {
    let multiplier = color === 'Green' ? 14 : 2;
    return [user.userID, user.bets[color] * multiplier];
  });


  io.emit("prize-win", winnersID)


}

betReady()




server.listen(8000, ()=>{
    console.log("server is running")
})