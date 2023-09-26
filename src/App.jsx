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

//
// const handleShareNumber = (event) =>{

//   const number = event.target.number.value
//   client.send(JSON.stringify({
//     type: 'share-number',
//     msg: number,
//     userID: userID
//   }))  
//   event.preventDefault()
//   event.target.number.value = ''
// }

//

  // useEffect(()=>{



    
    socket.on("connect", () => {
      setUserID(socket.id)


      socket.on("roulette-status", (data)=>{
        console.log(data)
        setRouletteStage(data.stage)
      })


      socket.on("receive_chat_message", (data) =>{
        console.log(data)
        handleAddNumber(data.message, data.userID)
      })
   
    });
  // }, [socket])


  useEffect(()=>{
    if(rouletteStage === 1){
      setIsBettable(false)
    }
    else{
      setIsBettable(true)
    }
  },[rouletteStage])
  // client.onopen = () =>{
  //   console.log(client)
  // }

  // useEffect(()=>{
  //   ref.current?.scrollIntoView({block:"nearest", behavior:"smooth"})
  // }, [numberList])


  

  // useEffect(() => {


  //   client.onmessage = (message) =>{

  //     const dataFromServer = JSON.parse(message.data)
  //     // console.log(dataFromServer)
  //     console.log('Typ:', dataFromServer.type)
  //     console.log('odpowiedz:', dataFromServer.msg)
  
  
  //     if(dataFromServer.type==='roulette-message-object'){
  //       switch(dataFromServer.stage){
  //         default:setRouletteStage(0) 
  //                 setIsBettable(true)
  //                 break
  //         case 1: setRouletteStage(1)
  //                 setIsBettable(false) //false ma być
  //                 break
  //         case 2: setRouletteStage(2)
  //                 setBetedColor('')
  //                 setBettedValue(0)
  //                 const updatePlayerBetObject = {...playerBetObject}
  //                 updatePlayerBetObject.Red = 0
  //                 updatePlayerBetObject.Black = 0
  //                 updatePlayerBetObject.Green = 0
  //                 setPlayerBetObject(updatePlayerBetObject)
  //                 setPlacedBets([])
  //                 break
  //       }
  //     }

  //     if(dataFromServer.type === 'share-number'){
  //       handleAddNumber(dataFromServer.msg, dataFromServer.userID)
  //     }
  
  //     if(dataFromServer.type === 'setUserID'){
  //       setUserID(dataFromServer.msg)
  //     }
  //     if(dataFromServer.type === 'send-player-bet'){
  //       handleUpdatePlacedBets(dataFromServer.userID, dataFromServer.bets)
  //     }

  //   }
  
  // }, []);


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

  const handleSendProba = () =>{
    client.send(JSON.stringify({
      type: 'proba',
      msg: 'worczy?'
    }))  
  }

  // const handleShareNumber = (event) =>{

  //   const number = event.target.number.value
  //   client.send(JSON.stringify({
  //     type: 'share-number',
  //     msg: number,
  //     userID: userID
  //   }))  
  //   event.preventDefault()
  //   event.target.number.value = ''
  // }

  const increaseID = () =>{
    let x = userID + 1
    setUserID(x)
  }


  const getBetValue = (e) =>{
    console.log(e.target.value)
    setBetInputValue(e.target.valueAsNumber)
  }

  const placeBet = (e) =>{
    
    setBettedValue((prev)=> prev + betInputValue)
    setBetedColor(e.target.name)
    const color = e.target.name
    console.log(playerBetObject)
    const updatePlayerBetObject = {...playerBetObject}
    updatePlayerBetObject[color] = updatePlayerBetObject[color] + betInputValue ;


    client.send(JSON.stringify({
      type: 'send-player-bet',
      userID: userID,
      bets:{
        ...updatePlayerBetObject
      }
    }))  

    setPlayerBetObject(updatePlayerBetObject)

  }


  useEffect(()=>{
    setBalance((prev)=>prev-betInputValue)
  }, [bettedValue])


  return (
    <div className="App">
      <div className='chat'>
        <Chatbar numberList={numberList} userID={userID} ref={ref} handleShareNumber={handleShareNumber}/>
      </div>
      <div className="main-container">
        {/* <button onClick={sendMessage}>Send message from {userID}</button> */}
        <p>Stan konta: {balance}</p>
        <p>{`${rouletteStage === 0 ? 'Betowanie włączone' : rouletteStage === 1 ? 'Bety wstrzymane' : 'Resetowanie...'} stage: ${rouletteStage}`}</p>
        <div className={`betting ${isBettable ? `bettable` : "bettablent"}`}></div>
        <input type="number" placeholder='kwota' onChange={getBetValue} />
        <div className='placed-bets-container'>
          <Bets color='Red' placeBet={placeBet} placedBets={placedBets}/>
          <Bets color='Green' placeBet={placeBet} placedBets={placedBets}/>
          <Bets color='Black' placeBet={placeBet}  placedBets={placedBets}/>
        </div>
      </div>
    </div>
  );
}

export default App;
