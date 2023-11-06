import { useState } from "react"
import { Login } from "./components/Login"
import { BalanceShow } from "./features/balance/balanceShow"
import { Nickname } from "./features/nickname/nickname"
import { useSelector, useDispatch } from 'react-redux'
import { setNickname } from './features/nickname/nicknameSlice';


export const Navbar = () =>{

    const dispatch = useDispatch()


    const [isModalActive, setIsModalActive] = useState(false)

    const handleToggleModal = () =>{
        setIsModalActive(!isModalActive)
    }


    const handleStartGame = (e) =>{

        const newNick = e.target[0].value

        e.preventDefault()

        let localStorageInfo = JSON.parse(localStorage.getItem('roulette-user-info')) 
        localStorageInfo.nickName = newNick

        if(newNick.length > 0){
            localStorage.setItem('roulette-user-info', JSON.stringify(localStorageInfo));
            dispatch(setNickname(newNick))
        }

        setIsModalActive(false)



    }


    console.log('kurwa xd', isModalActive)
    return(
        <nav>
            <p className="nav-title">Xoviec-Roll</p>
            <div className="user-dock">
                <BalanceShow/>
                <button onClick={handleToggleModal}>
                    <Nickname />
                </button>
            </div>
            {
                isModalActive && <Login handleStartGame={handleStartGame}/>
            }
            
        </nav>
    )
}