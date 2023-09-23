export const Bets = ({color, placedBets, placeBet}) =>{



    placedBets.sort((a, b) => b.bets[color] - a.bets[color]);




    return(
        <div className="bet-container">
            <button name={color} onClick={placeBet} className={`bet-color-header bet-header-${color}`}>{color}</button>
            <div className="bet-section">
                {
                    placedBets?.map((player)=>(
                        player.bets[color] > 0 &&
                        <div className="single-bet">
                            <p>{player.userID}</p>
                            <p>{player.bets[color]}$</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}