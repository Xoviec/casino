import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef, Component } from 'react';
import React from 'react';
import { Bets } from './components/Bets';
import { BetShow} from './components/BetShow';
import { Chatbar } from './components/Chatbar';
import { Login } from './components/Login';
import { useSelector, useDispatch } from 'react-redux'
import { incrementByAmount, setAmmount } from './features/balance/balanceSlice';
import { setNickname } from './features/nickname/nicknameSlice';
import { v4 as uuidv4 } from 'uuid';
import { Nickname } from './features/nickname/nickname';
import { BalanceShow } from './features/balance/balanceShow';
const { io } = require("socket.io-client");
// const socket = io("http://localhost:8000")
const URL = "http://localhost:8000";
const socket = io(URL, { autoConnect: false });

function App({client}) {

  const dispatch = useDispatch()

  const [numberList, setNumberList] = useState([])
  const [userID, setUserID] = useState()
  const [isBettable, setIsBettable] = useState(true)
  const [rouletteStage, setRouletteStage] = useState(0)
  const [balance, setBalance] = useState()
  const balanceRef = useRef(balance)
  const [betInputValue, setBetInputValue] = useState(0)
  const [bettedValue, setBettedValue] = useState(0)
  const [betedColor, setBetedColor] = useState('')
  const [spingDegree, setSpinDegree] = useState()
  const [bgPos, setBgPos] = useState(35)
  const [winNumber, setWinNumber] = useState()
  const [winColor, setWinColor] = useState('')
  const [betHistoryList, setBetHistoryList] = useState([])
  const [isLogged, setIsLogged] = useState(true)
  const [localStorageInfo, setLocalStorageInfo] = useState({})
  const [timer, setTimer] = useState()
  const nick = useSelector((state) => state.nickname.value)



  const [playerBetObject, setPlayerBetObject] = useState({
    Red: 0,
    Black: 0,
    Green: 0
  })

  const [placedBets, setPlacedBets] = useState([])

  const betTimer = () =>{
    while(timer>0){
      setTimer((prev)=>prev-1)
    }
  }


  const handleShareNumber = (event) =>{


    const message = event.target.number.value.trim();

    if (message.length > 0) {
      socket.emit("send_message", {

        message: message,
        userID: userID,
        nickName: nick,
      });
    }



    event.preventDefault()
    event.target.number.value = ''
  }

useEffect(()=>{

  
  const localStorageInfo = JSON.parse(localStorage.getItem('roulette-user-info')) 

  if(localStorageInfo?.userID){
    setIsLogged(true)
    setUserID((localStorageInfo).userID)
    dispatch(setNickname((localStorageInfo).nickName))
    dispatch(setAmmount((((localStorageInfo).balance))))
    

    setBalance((localStorageInfo).balance)
    socket.connect();

  }
  else{
    setIsLogged(false)
  }
}, [])

  useEffect(() => {

    const localStorageInfo = JSON.parse(localStorage.getItem('roulette-user-info')) 

    const userID = localStorageInfo?.userID

    function onConnect(){


    }

    function handlePreviousBets(data) {
      setPlacedBets(data.placedBets);

      

      const userBets = (data.placedBets.find((xd)=>xd.userID===userID))

      if(userBets){
        let updatedPlayerBetObj={
          Red: userBets?.bets.Red,
          Black: userBets?.bets.Black,
          Green: userBets?.bets.Green
        }
        
        console.log(updatedPlayerBetObj)
        setPlayerBetObject(updatedPlayerBetObj)
      }

      setIsBettable(data.isBettable);
    }
  
    
    function handleBetReveal(data) {

      setWinColor(data.color);
      setWinNumber(data.number);
      const latestBet = {
        color: data.color,
        number: data.number
      }
      setBetHistoryList(prevBetHistory => [...prevBetHistory, latestBet])
    }
  
    function handleRouletteStatus(data) {
      switch (data.stage) {
        default:
          setRouletteStage(0);
          setIsBettable(true);
          break;
        case 1:
          setRouletteStage(1);
          setIsBettable(false);
          setSpinDegree(data.spin);
          setBgPos(data.spin + 910 * 5);
          break;
        case 2:
          setRouletteStage(2);
          setSpinDegree(0);
          setWinNumber('');
          setWinColor('');
          setBetedColor('');
          setBettedValue(0);
          const updatePlayerBetObject = { ...playerBetObject, Red: 0, Black: 0, Green: 0 };
          setPlayerBetObject(updatePlayerBetObject);
          setPlacedBets([]);
          setBgPos(35);
          break;
      }
    }
  
    function handlePrizeWin(data) {

      const localStorageInfo = JSON.parse(localStorage.getItem('roulette-user-info')) 
      const index = data.findIndex(item => item[0] === localStorageInfo?.userID);
      if (data[index]) {
        setBalance(balanceRef.current + data[index][1])
        const storedUserInfo = JSON.parse(localStorage.getItem('roulette-user-info')) || {};
        storedUserInfo.balance = (balanceRef.current + data[index][1]); // Ustaw wartość początkową dla pola balance
        localStorage.setItem('roulette-user-info', JSON.stringify(storedUserInfo));
        dispatch(incrementByAmount(Number(data[index][1])))
      }
    }
  
    function handleReceivePlayerBet(data) {
      console.log('xdd');
      console.log(data);
      handleUpdatePlacedBets(data.userID, data.bets, data.nickName);
    }
  
    function handleReceiveChatMessage(data) {
      console.log(data);
      handleAddNumber(data.message, data.userID, data.nickName);
    }


    function handleGetRouletteStartingTime(data){
      const actualTimeStr = Date.now().toString()
      const actualTime = Number(actualTimeStr.slice(0, -3));
      let nextBetSecondsStr = data.toString()
      let nextBetSeconds = Number(nextBetSecondsStr.slice(0,-3))
      let remainingBetTime = (nextBetSeconds-actualTime)

      if(remainingBetTime>0){
        setTimer(remainingBetTime)
        const timeouter = setInterval((()=>{
          remainingBetTime--
          setTimer(remainingBetTime)
          if(remainingBetTime<=0){
            clearInterval(timeouter)
          }
          console.log(remainingBetTime)
        }), 1000)
        // betTimer
  
        
      }

      


    }
  
      socket.on("roulette-starting-time", handleGetRouletteStartingTime)
      socket.on('connect', onConnect)
      socket.on('get_previous_bets', handlePreviousBets);
      socket.on('bet-reveal', handleBetReveal);
      socket.on('roulette-status', handleRouletteStatus);
      socket.on('prize-win', handlePrizeWin);
      socket.on('receive_player_bet', handleReceivePlayerBet);
      socket.on('receive_chat_message', handleReceiveChatMessage);
  
    return () => {
      socket.off("roulette-starting-time", handleGetRouletteStartingTime)
      socket.off('get_previous_bets', handlePreviousBets);
      socket.off('bet-reveal', handleBetReveal);
      socket.off('roulette-status', handleRouletteStatus);
      socket.off('prize-win', handlePrizeWin);
      socket.off('receive_player_bet', handleReceivePlayerBet);
      socket.off('receive_chat_message', handleReceiveChatMessage);
    };
  }, []);

  useEffect(()=>{
    balanceRef.current = balance
  },[balance])

  const handleUpdatePlacedBets = (userID, bets, nick) => {
    const betObj = {
      userID: userID,
      nickName: nick,
      bets: bets,
    };

    setPlacedBets((prevPlacedBets) => {
      
      const existingBetIndex = prevPlacedBets.findIndex((betDetails) => betDetails.userID===userID);
  
      console.log(existingBetIndex)

      console.log(...prevPlacedBets)

      if (existingBetIndex !== -1) {
        const updatedBet = Object.assign(prevPlacedBets[existingBetIndex], betObj);
        console.log('moze tu bedzie', updatedBet)
        const updatedPlacedBets = [...prevPlacedBets];
        updatedPlacedBets[existingBetIndex] = updatedBet;
        return updatedPlacedBets;
      } else {
        return [...prevPlacedBets, betObj];
      }
    });
  };

  const handleAddNumber = (msg, id, nick) => {
    const newUserNumber = {
      number: msg,
      userID: id,
      nickName: nick
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
    
    if(isBettable && (betInputValue <= balance) && (betInputValue > 0)){
      setBettedValue((prev)=> prev + betInputValue)
      setBalance((prev)=>prev-betInputValue)

      const storedUserInfo = JSON.parse(localStorage.getItem('roulette-user-info')) || {};
      storedUserInfo.balance = balance-betInputValue; 
      localStorage.setItem('roulette-user-info', JSON.stringify(storedUserInfo));


      
      dispatch(incrementByAmount(Number(-betInputValue)))
      setBetedColor(e.target.name)
      const color = e.target.name
      console.log(playerBetObject)
      const updatePlayerBetObject = {...playerBetObject}
      updatePlayerBetObject[color] = updatePlayerBetObject[color] + betInputValue ;
  

      console.log('userid', userID)

      socket.emit('send_player_bet', {
        userID: userID,
        nickName: nick,
        bets:{
          ...updatePlayerBetObject
        }
      })
      setPlayerBetObject(updatePlayerBetObject)
    }
  }


  const handleStartGame = (e) =>{
    console.log(e.target[0].value)

    e.preventDefault()

    dispatch(setNickname(e.target[0].value))

    const newID = uuidv4()

    setUserID(newID)

    const localStorageInfo = {
      nickName: e.target[0].value,
      balance: 1000,
      userID: newID
    };

    setBalance(1000)
    
    localStorage.setItem('roulette-user-info', JSON.stringify(localStorageInfo));


    setIsLogged(true)
    socket.connect();

  }

  return (
    <div className="App">
      {!isLogged && <Login handleStartGame={handleStartGame}/>}
      <Chatbar numberList={numberList} userID={userID} handleShareNumber={handleShareNumber}/>
      <div className="main-container">
        <div className={`roulette-container `}>
          <div className={`controller ${isBettable && `hidden`}`}/>
          <div className={`timer ${!isBettable && `hidden`}`}>
            <p>Rolling</p>
            <span>{timer}</span>
          </div>

          <div
              style={{
                backgroundPosition: '-' + bgPos + 'px',
                transition: rouletteStage === 1 ? '5s' : '1s', // wcześniej zamiast 1s było 0.4s
              }}
              className={`roulette ${!isBettable && `roulette-active`}`}
            >
            </div>
        </div>

        <div className="previous-rolls">
          <p className='prev-rolls'>PREVIOUS ROLLS</p>
          <div className="bet-history-container">
            {
              betHistoryList.slice(-10).map((bet)=>(
                  <div className={`bet-history ${bet.color}`}>
                    <p>{bet.number}</p>
                  </div>
              ))
            }
          </div>
        </div>
      

        {/* <div className={`betting ${isBettable ? `bettable` : "bettablent"}`}></div> */}
        {/* <div className={`betting-status ${isBettable ? `Green` : "Red"}`}>{`${isBettable ? `Bets open` : "Bets closed"}`}</div> */}
        <div className="input-box">
          <div className="input-ammount">
            <div className="coins"></div>
            <input className='bet-input' type="number" placeholder='Enter bet ammount' onChange={getBetValue} value={betInputValue} min='0'/>
          </div>
          <div className="quick-bets">
            <button onClick={(()=>setBetInputValue(0))}>Clear</button>
            <button onClick={(()=>setBetInputValue((prev)=>prev+1))}>+1</button>
            <button onClick={(()=>setBetInputValue((prev)=>prev+10))}>+10</button>
            <button onClick={(()=>setBetInputValue((prev)=>prev+100))}>+100</button>
            <button onClick={(()=>setBetInputValue((prev)=>(Math.ceil(prev/2))))}>1/2</button>
            <button onClick={(()=>setBetInputValue((prev)=>prev*2))}>x 2</button>
            <button onClick={(()=>setBetInputValue(balance))}>Max</button>
          </div>
        </div>

        <div className='placed-bets-container'>
          <div className="bets">
            <Bets color='Red' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
            <Bets color='Green' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
            <Bets color='Black' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
          </div>
          <div className="bets-show">
            <BetShow color='Red' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
            <BetShow color='Green' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
            <BetShow color='Black' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
          </div>


        </div>
      </div>
    </div>
  );
}

export default App;
