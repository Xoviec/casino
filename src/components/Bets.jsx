export const Bets = ({color, placedBets, placeBet, isBettable, winColor}) =>{



    placedBets.sort((a, b) => b.bets[color] - a.bets[color]);


    const betsPerColor = placedBets.filter(item => item.bets[color] > 0);

    const totalBetColorSum = placedBets.reduce((acc, item) => acc + item.bets[color], 0);

    const multiplier = (color===`Green` ? 14 : 2)

    return(
        <div className={`bet-container ${winColor === color && `bet-container-winning`} ${!isBettable && 'bets-closed' }`}>
            <button name={color} id={color} onClick={placeBet} className={`btn-hidden bet-color-header bet-header-${color} `}>{color}</button>
            <label htmlFor={color} name={color}>
                <div className={`bet-btn-main bet-header-${color}/  ${winColor === color && `win-effect`}`}>
                    <div className={`color-circle bet-header-${color} `}/>
                    <div className="bet-place-text">
                        <p className="bet-place">{isBettable ? 'Place bet' : 'Bets closed'}</p> 
                        <p className="bet-multiplier">
                            Win {`${color === 'Green' ? '14x' : '2x'}`}
                        </p>
                    </div>
    
                </div>
            </label>
            <div className="bet-bottom-border">
                <div className="bet-info ">
                    <p>
                        {betsPerColor.length} Bets Total
                    </p>
                    <p>
                    {
                        winColor === color ? `+${totalBetColorSum * multiplier}$` :
                        (winColor ? `-${totalBetColorSum}$` :
                        `${totalBetColorSum}$`)
                    }
                    </p>
                </div>
                <div className="bet-section">
                    {
                        placedBets?.map((player)=>(
                            player.bets[color] > 0 &&
                            <div className="single-bet">
                                <p>{player.nickName}</p>
                                <p>    
                                    {
                                        winColor === color ? `+${player.bets[color] * multiplier}$` :
                                        (winColor ? `-${player.bets[color]}$` :
                                        `${player.bets[color]}$`)
                                    }
                                </p>
                            </div>
                        ))
                    }
                </div>
            </div>

    
        </div>
    )
}