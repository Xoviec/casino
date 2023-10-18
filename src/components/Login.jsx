

export const Login = ({handleSetNickname}) =>{

    return(
        <div className="login-dialog">
            <container>
                <h1 className="login-title">Input your nickname</h1>
                <form className="login-form" action="" onSubmit={handleSetNickname}>
                    <input type="text" placeholder="Nickname" />
                    <button type="submit">Set nickname</button>
                </form>
            </container>
        </div>
    )

}