import { useState } from "react"
import { Login } from "./components/Login"
import { BalanceShow } from "./features/balance/balanceShow"
import { Nickname } from "./features/nickname/nickname"

export const Navbar = () =>{

    const [isModalActive, setIsModalActive] = useState(false)


    console.log('kurwa xd', isModalActive)
    return(
        <nav>
            <p className="nav-title">Xoviec-Roll</p>
            <div className="user-dock">
                <BalanceShow/>
                <button onClick={(()=>setIsModalActive(!isModalActive))}>
                    <Nickname />
                </button>
            </div>
            {
                isModalActive && <Login/>
 
            }
            
        </nav>
    )
}