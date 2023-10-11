import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef, Component } from 'react';
import React from 'react';
import { Bets } from './components/Bets';
import { Chatbar } from './components/Chatbar';
const { io } = require("socket.io-client");
const socket  = io("http://localhost:8000")


function App({client}) {


 

  const ref = useRef()


  const [numberList, setNumberList] = useState([])
  const [userID, setUserID] = useState('xd')
  const [isBettable, setIsBettable] = useState(true)
  const [rouletteStage, setRouletteStage] = useState(0)
  const [balance, setBalance] = useState(1000)
  const balanceRef = useRef(balance)
  const [betInputValue, setBetInputValue] = useState(0)
  const [bettedValue, setBettedValue] = useState(0)
  const [betedColor, setBetedColor] = useState('')
  const [spingDegree, setSpinDegree] = useState()
  const [bgPos, setBgPos] = useState(35)
  const [winNumber, setWinNumber] = useState()
  const [winColor, setWinColor] = useState('')

  const [playerBetObject, setPlayerBetObject] = useState({
    Red: 0,
    Black: 0,
    Green: 0
  })

  const [placedBets, setPlacedBets] = useState([])


  const handleShareNumber = (event) =>{


    const message = event.target.number.value

    socket.emit("send_message", {
      message: message,
      userID: userID
    })

    event.preventDefault()
    event.target.number.value = ''
  }


//odbieranie 

    
  socket.on("connect", () => {

    setUserID(socket.id)






    socket.on("get_previous_bets", (data) =>{
      setPlacedBets(data.placedBets)
      setIsBettable(data.isBettable)
    })


    socket.on("bet-reveal", (data)=>{
      console.log(data)

      setWinColor(data.color)
      setWinNumber(data.number)
    })

    socket.on("roulette-status", (data)=>{
      console.log(data)
      setRouletteStage(data.stage)

      switch(data.stage){
        default:setRouletteStage(0) 
                setIsBettable(true)
                break
        case 1: 
                setRouletteStage(1)
                setIsBettable(false) //false ma być
                setSpinDegree(data.spin)
                setBgPos((data.spin)+910*5)

                break
        case 2: 
                setRouletteStage(2)
                setSpinDegree(0)
                setWinNumber()
                setWinColor('')
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


    socket.on("prize-win", (data) =>{

      const index = data.findIndex(item => item[0] === socket.id);

      if(data[index]){
        setBalance(balanceRef.current + data[index][1])
      }

    })

    socket.on("receive_chat_message", (data) =>{
      console.log(data)
      handleAddNumber(data.message, data.userID)
    })

    socket.on("receive_player_bet", (data) =>{
      console.log('xdd')
      console.log(data)

      handleUpdatePlacedBets(data.userID, data.bets)
    })
  });

  
  // socket.on("disconnect", () => {
  //   console.log('Disconnected from server'); 
  // });




  useEffect(()=>{
    balanceRef.current = balance
  },[balance])



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

  return (
    <div className="App">
      <div className='chat'>
        <Chatbar numberList={numberList} userID={userID} ref={ref} handleShareNumber={handleShareNumber}/>
      </div>
      <div className="main-container">
        <p>{userID}</p>
        <div className="balance-box">
          <div className="coins"></div>
          <p className='balance'>{balance}</p>
        </div>

        <div className={`roulette-container ${!isBettable && `roulette-active`}`}>
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
        <div className="input-box">
          <div className="coins"></div>
          <input className='bet-input' type="number" placeholder='kwota' onChange={getBetValue} />
        </div>
        <div className='placed-bets-container'>
          <Bets color='Red' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
          <Bets color='Green' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
          <Bets color='Black' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
        </div>
      </div>
    </div>
  );
}

export default App;
