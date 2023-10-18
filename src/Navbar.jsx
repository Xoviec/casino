import { BalanceShow } from "./features/balance/balanceShow"
import { Nickname } from "./features/nickname/nickname"

export const Navbar = () =>{

    return(
        <nav>
            <p className="nav-title">nazwa</p>
            <BalanceShow/>
            <Nickname/>
        </nav>
    )
}