import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef, Component } from 'react';
import React from 'react';
import { Bets } from './components/Bets';
import { Chatbar } from './components/Chatbar';
import { Login } from './components/Login';
import { useSelector, useDispatch } from 'react-redux'
import { incrementByAmount, setAmmount } from './features/balance/balanceSlice';
import { setNickname } from './features/nickname/nicknameSlice';

import { Nickname } from './features/nickname/nickname';
import { BalanceShow } from './features/balance/balanceShow';
const { io } = require("socket.io-client");
const socket = io("http://localhost:8000")


function App({client}) {


 


  const dispatch = useDispatch()

  const [numberList, setNumberList] = useState([])
  const [userID, setUserID] = useState()
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
  const [betHistoryList, setBetHistoryList] = useState([])
  const [isLogged, setIsLogged] = useState(false)
  const [localStorageInfo, setLocalStorageInfo] = useState({})
  const nick = useSelector((state) => state.nickname.value)



  // setter

  // getter



  const [playerBetObject, setPlayerBetObject] = useState({
    Red: 0,
    Black: 0,
    Green: 0
  })

  const [placedBets, setPlacedBets] = useState([])


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

console.log(betHistoryList)

  useEffect(() => {

    function onConnect(){
      !userID && setUserID(socket.id)
    }

    function handlePreviousBets(data) {
      setPlacedBets(data.placedBets);
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
      const index = data.findIndex(item => item[0] === socket.id);
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
  

      socket.on('connect', onConnect)
      socket.on('get_previous_bets', handlePreviousBets);
      socket.on('bet-reveal', handleBetReveal);
      socket.on('roulette-status', handleRouletteStatus);
      socket.on('prize-win', handlePrizeWin);
      socket.on('receive_player_bet', handleReceivePlayerBet);
      socket.on('receive_chat_message', handleReceiveChatMessage);
  
    return () => {
      socket.off('get_previous_bets', handlePreviousBets);
      socket.off('bet-reveal', handleBetReveal);
      socket.off('roulette-status', handleRouletteStatus);
      socket.off('prize-win', handlePrizeWin);
      socket.off('receive_player_bet', handleReceivePlayerBet);
      socket.off('receive_chat_message', handleReceiveChatMessage);
    };
  }, []);

  useEffect(()=>{
    const localStorageInfo = localStorage.getItem('roulette-user-info');

    if(localStorageInfo){
      setIsLogged(true)
      // console.log(JSON.parse(localStorageInfo).nickName)
      dispatch(setNickname(JSON.parse(localStorageInfo).nickName))
      dispatch(setAmmount(((JSON.parse(localStorageInfo).balance))))




    }
  }, [])
  



  useEffect(()=>{
    balanceRef.current = balance
  },[balance])



  const handleUpdatePlacedBets = (userID, bets, nick) => {
    const betObj = {
      userID: userID,
      bets: bets,
      nickName: nick
    };
  
    setPlacedBets((prevPlacedBets) => {
      const existingBetIndex = prevPlacedBets.findIndex(betDetails => betDetails.userID === userID);
  
      if (existingBetIndex !== -1) {
        const updatedBet = Object.assign({}, prevPlacedBets[existingBetIndex], betObj);
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


    const localStorageInfo = {
      nickName: e.target[0].value,
      balance: 1000
    };
    
    localStorage.setItem('roulette-user-info', JSON.stringify(localStorageInfo));
    

    setIsLogged(true)

  }

  return (
    <div className="App">
      {!isLogged && <Login handleStartGame={handleStartGame}/>}
      <div className='chat'>
        <Chatbar numberList={numberList} userID={userID} handleShareNumber={handleShareNumber}/>
      </div>
      <div className="main-container">
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

        <div className="bet-history-container">
          {
            betHistoryList.slice(-10).map((bet)=>(
                <div className={`bet-history ${bet.color}`}>
                  <p>{bet.number}</p>
                </div>
            ))
          }
          <p className='prev-rolls'>PREVIOUS ROLLS</p>
        </div>
   
        {/* <div className={`betting ${isBettable ? `bettable` : "bettablent"}`}></div> */}
        {/* <div className={`betting-status ${isBettable ? `Green` : "Red"}`}>{`${isBettable ? `Bets open` : "Bets closed"}`}</div> */}
        <div className="input-box">
          <div className="coins"></div>
          <input className='bet-input' type="number" placeholder='Enter bet ammount' onChange={getBetValue} value={betInputValue} min='1'/>
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
          <Bets color='Red' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
          <Bets color='Green' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
          <Bets color='Black' placeBet={placeBet} isBettable={isBettable} winColor={winColor} placedBets={placedBets}/>
        </div>
      </div>
    </div>
  );
}

export default App;
