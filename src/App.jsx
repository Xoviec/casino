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
      color: 'red',
    },
    {
      number: 6,
      color: 'black',
    },
    {
      number: 7,
      color: 'red',
    },
    {
      number: 8,
      color: 'black',
    },
    {
      number: 5,
      color: 'red',
    },
    {
      number: 10,
      color: 'black',
    },
    {
      number: 3,
      color: 'red',
    },
    {
      number: 12,
      color: 'black',
    },
    {
      number: 1,
      color: 'red',
    },
    {
      number: 13,
      color: 'green',
    },
    {
      number: 2,
      color: 'black',
    },
    {
      number: 11,
      color: 'red',
    },
    {
      number: 4,
      color: 'black',
    },
  ]


  const spin = () =>{


    // const spin = value

    console.log('obrót:', spin)

    let newBet;

    switch (true) {
      case spin >= 0 && spin < 70:
        setActuallBet(bets[1].number);
        break;
      case spin >= 70 && spin < 140:
        setActuallBet(bets[2].number);
        break;
      case spin >= 140 && spin < 210:
        setActuallBet(bets[3].number);
        break;
      case spin >= 210 && spin < 280:
        setActuallBet(bets[4].number);
        break;
      case spin >= 280 && spin < 350:
        setActuallBet(bets[5].number);
        break;
      case spin >= 350 && spin < 420:
        setActuallBet(bets[6].number);
        break;
      case spin >= 420 && spin < 490:
        setActuallBet(bets[7].number);
        break;
      case spin >= 490 && spin < 560:
        setActuallBet(bets[8].number);
        break;
      case spin >= 560 && spin < 630:
        setActuallBet(bets[9].number);
        break;
      case spin >= 630 && spin < 700:
        setActuallBet(bets[10].number);
        break;
      case spin >= 700 && spin < 770:
        setActuallBet(bets[11].number);
        break;
      case spin >= 770 && spin < 840:
        setActuallBet(bets[12].number);
        break;
      case spin >= 840:
        setActuallBet(bets[0].number);
        break;
      default:
        setActuallBet(null); // Opcjo)nalnie, jeśli nie ma pasującego zakresu
        break;
    }
  }


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
                      setActuallBet(null); // Opcjo)nalnie, jeśli nie ma pasującego zakresu
                      break;
                  }
                  break
          case 2: setRouletteStage(2)
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


  // useEffect(()=>{

  //   // 0 -> można betować
  //   // 1 -> losowanie
  //   // 2 -> resetowanie

  //   if(rouletteStage === 1){
  //     setIsBettable(false)
  //   }
  //   if(rouletteStage === 2){
  //     setIsBettable(false)
  //     setRouletteStage(2)
  //     setBetedColor('')
  //     setBettedValue(0)
  //     const updatePlayerBetObject = {...playerBetObject}
  //     updatePlayerBetObject.Red = 0
  //     updatePlayerBetObject.Black = 0
  //     updatePlayerBetObject.Green = 0
  //     setPlayerBetObject(updatePlayerBetObject)
  //     setPlacedBets([])

  //   }
  //   else{
  //     setIsBettable(true)
  //   }


  //   console.log(isBettable)
  // },[rouletteStage])
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
    
    if(isBettable){
      setBettedValue((prev)=> prev + betInputValue)
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
          <Bets color='Red' placeBet={placeBet} placedBets={placedBets}/>
          <Bets color='Green' placeBet={placeBet} placedBets={placedBets}/>
          <Bets color='Black' placeBet={placeBet}  placedBets={placedBets}/>
        </div>
      </div>
    </div>
  );
}

export default App;
