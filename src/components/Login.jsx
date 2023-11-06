
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

export const Login = ({handleStartGame}) =>{

    const [nick, setUserNick] = useState(useSelector((state) => state.nickname.value))

    const handleEditNick = (e) =>{
        setUserNick(e.target.value)
    }


    console.log(nick)

    return(
        <div className="login-dialog">
            <container>
                <h1 className="login-title">Input your nickname</h1>
                <form className="login-form" action="" onSubmit={handleStartGame}>
                    <input type="text" placeholder="Nickname" onChange={handleEditNick} value={nick} />
                    <button type="submit">Set nickname</button>
                </form>
            </container>
        </div>
    )

}