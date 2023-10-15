import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef, Component } from 'react';
import React from 'react';
import { Bets } from './components/Bets';
import { Chatbar } from './components/Chatbar';
const { io } = require("socket.io-client");
const socket  = io.connect("http://localhost:8000")


function App({client}) {


 

  const ref = useRef()


  const [numberList, setNumberList] = useState([])
  const [userID, setUserID] = useState()
  const [isBettable, setIsBettable] = useState(true)
  const [rouletteStage, setRouletteStage] = useState(0)
  const [balance, setBalance] = useState(1000)
  const [betInputValue, setBetInputValue] = useState(0)
  const [bettedValue, setBettedValue] = useState(0)
  const [betedColor, setBetedColor] = useState('')
  const [spingDegree, setSpinDegree] = useState()
  const [bgPos, setBgPos] = useState(35)
  const [actuallBet, setActuallBet] = useState()

  const [playerBetObject, setPlayerBetObject] = useState({
    Red: 0,
    Black: 0,
    Green: 0
  })

  const [placedBets, setPlacedBets] = useState([])


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

  const handleShareNumber = (event) =>{

    const message = event.target.number.value

    socket.emit("send_message", {
      message: message,
      userID: userID
    })

    event.preventDefault()
    event.target.number.value = ''
  }

  // useEffect(()=>{
  //   console.log(actuallBet)

  //   const bet = bets.find(bet => bet.number === actuallBet)
    
  //   console.log(bet?.color)

  //   console.log(playerBetObject)

  //   console.log(playerBetObject[bet])
   




  //   if(bet && playerBetObject[bet.color] > 0){
  //     console.log('Gratulacje wygranej, wygrywasz',(playerBetObject[bet.color]*2))
  //     setBalance(balance+(playerBetObject[bet.color]*2))
  //   }

  //   console.log(bet?.color)
  // }, [actuallBet])




//odbieranie 

    
  socket.on("connect", () => {
    setUserID(socket.id)


    socket.on("get_previous_bets", (data) =>{
      // console.log(data)
      setPlacedBets(data.placedBets)
      setIsBettable(data.isBettable)
    })

    socket.on("roulette-status", (data)=>{
      console.log(data)
      setRouletteStage(data.stage)

      switch(data.stage){
        default:setRouletteStage(0) 
                setIsBettable(true)
                break
        case 1: setRouletteStage(1)
                setIsBettable(false) //false ma być
                setSpinDegree(data.spin)
                setBgPos((data.spin)+910*5)
                switch (true) {
                  case data.spin >= 0 && data.spin < 70:
                    setActuallBet(bets[1].number);
                    break;
                  case data.spin >= 70 && data.spin < 140:
                    setActuallBet(bets[2].number);
                    break;
                  case data.spin >= 140 && data.spin < 210:
                    setActuallBet(bets[3].number);
                    break;
                  case data.spin >= 210 && data.spin < 280:
                    setActuallBet(bets[4].number);
                    break;
                  case data.spin >= 280 && data.spin < 350:
                    setActuallBet(bets[5].number);
                    break;
                  case data.spin >= 350 && data.spin < 420:
                    setActuallBet(bets[6].number);
                    break;
                  case data.spin >= 420 && data.spin < 490:
                    setActuallBet(bets[7].number);
                    break;
                  case data.spin >= 490 && data.spin < 560:
                    setActuallBet(bets[8].number);
                    break;
                  case data.spin >= 560 && data.spin < 630:
                    setActuallBet(bets[9].number);
                    break;
                  case data.spin >= 630 && data.spin < 700:
                    setActuallBet(bets[10].number);
                    break;
                  case data.spin >= 700 && data.spin < 770:
                    setActuallBet(bets[11].number);
                    break;
                  case data.spin >= 770 && data.spin < 840:
                    setActuallBet(bets[12].number);
                    break;
                  case data.spin >= 840:
                    setActuallBet(bets[0].number);
                    break;
                  default:
                    setActuallBet(null); // Opcjonalnie, jeśli nie ma pasującego zakresu
                    break;
                }

                break
        case 2: 
                setRouletteStage(2)
                setSpinDegree(0)
                setBetedColor('')
                setBettedValue(0)
                const updatePlayerBetObject = {...playerBetObject}
                updatePlayerBetObject.Red = 0
                updatePlayerBetObject.Black = 0
                updatePlayerBetObject.Green = 0
                setPlayerBetObject(updatePlayerBetObject)
                setPlacedBets([])
                setBgPos(35)
                break
      }
    })


    socket.on("receive_chat_message", (data) =>{
      console.log(data)
      handleAddNumber(data.message, data.userID)
    })

    socket.on("receive_player_bet", (data) =>{
      console.log(data)
      handleUpdatePlacedBets(data.userID, data.bets)
    })
  });

  
  socket.on("disconnect", () => {
    console.log('Disconnected from server'); 
  });




  const handleUpdatePlacedBets = (userID, bets) => {
    const betObj = {
      userID: userID,
      bets: bets
    };
  
    setPlacedBets((prevPlacedBets) => {
      // Sprawdzenie czy użytkownik dał już jakieś bety
      const existingBetIndex = prevPlacedBets.findIndex(betDetails => betDetails.userID === userID);
  
      if (existingBetIndex !== -1) {
        // Jeśli użytkownik istnieje w placedBets, zaktualizuj jego bets za pomocą Object.assign()
        const updatedBet = Object.assign({}, prevPlacedBets[existingBetIndex], betObj);
        const updatedPlacedBets = [...prevPlacedBets];
        updatedPlacedBets[existingBetIndex] = updatedBet;
        return updatedPlacedBets;
      } else {
        // Jeśli użytkownik nie istnieje w placedBets, dodaj nowy obiekt
        return [...prevPlacedBets, betObj];
      }
    });
  };

  const handleAddNumber = (msg, id) => {
    const newUserNumber = {
      number: msg,
      userID: id,
    };
  
    setNumberList((prevNumberList) => {
      const newNumbers = [...prevNumberList, newUserNumber];
      console.log(newNumbers); // Wydrukuj nowy stan
      return newNumbers; // Zwróć nowy stan jako wynik funkcji setState
    });
  }


  const getBetValue = (e) =>{
    console.log(e.target.value)
    setBetInputValue(e.target.valueAsNumber)
  }

  const placeBet = (e) =>{
    
    if(isBettable && (betInputValue <= balance)){
      setBettedValue((prev)=> prev + betInputValue)
      setBalance((prev)=>prev-betInputValue)

      setBetedColor(e.target.name)
      const color = e.target.name
      console.log(playerBetObject)
      const updatePlayerBetObject = {...playerBetObject}
      updatePlayerBetObject[color] = updatePlayerBetObject[color] + betInputValue ;
  
      socket.emit('send_player_bet', {
        userID: userID,
        bets:{
          ...updatePlayerBetObject
        }
      })
  
  
      setPlayerBetObject(updatePlayerBetObject)
    }
  }

  // useEffect(()=>{
  //   setBalance((prev)=>prev-betInputValue)
  // }, [bettedValue])


  return (
    <div className="App">
      <div className='chat'>
        <Chatbar numberList={numberList} userID={userID} ref={ref} handleShareNumber={handleShareNumber}/>
      </div>
      <div className="main-container">
        {/* <button onClick={sendMessage}>Send message from {userID}</button> */}
        <p>Stan konta: {balance}</p>
        <p>{`${rouletteStage === 0 ? 'Betowanie włączone' : rouletteStage === 1 ? 'Bety wstrzymane' : 'Resetowanie...'} stage: ${rouletteStage}`}</p>
        <p>Obrót o: {spingDegree}</p>
        <p>Numerek: {actuallBet}</p>
        <div className="roulette-container">
          <div className="controller"/>
          <div
              style={{
                backgroundPosition: '-' + bgPos + 'px',
                transition: rouletteStage === 1 ? '5s' : '0.4s', // Używamy operatora trójargumentowego
              }}
              className="roulette"
            />
        </div>
   
        <div className={`betting ${isBettable ? `bettable` : "bettablent"}`}></div>
        <input type="number" placeholder='kwota' onChange={getBetValue} />
        <div className='placed-bets-container'>
          <Bets color='Red' placeBet={placeBet} isBettable={isBettable} placedBets={placedBets}/>
          <Bets color='Green' placeBet={placeBet} isBettable={isBettable} placedBets={placedBets}/>
          <Bets color='Black' placeBet={placeBet} isBettable={isBettable}  placedBets={placedBets}/>
        </div>
      </div>
    </div>
  );
}

export default App;