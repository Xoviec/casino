export const Bets = ({color, placedBets, placeBet, isBettable, winColor}) =>{



    placedBets.sort((a, b) => b.bets[color] - a.bets[color]);


    const betsPerColor = placedBets.filter(item => item.bets[color] > 0);

    const totalBetColorSum = placedBets.reduce((acc, item) => acc + item.bets[color], 0);


    return(
        <div className={`bet-container ${winColor === color && `bet-container-winning`}`}>
            <button name={color} id={color} onClick={placeBet} className={`btn-hidden bet-color-header bet-header-${color} `}>{color}</button>
            <label htmlFor={color} name={color}>
                <div className={`bet-btn-main bet-header-${color} ${!isBettable && 'bets-closed' } ${winColor === color && `win-effect`}`}>
                    <p className="bet-place">
                        Place Bet
                    </p>
                    <p className="bet-multiplier">
                        {`${color === 'Green' ? '14x' : '2x'}`}
                    </p>
                </div>
            </label>
            <div className="bet-bottom-border">
                <div className="bet-info ">
                    <p>
                        {betsPerColor.length} Bets Total
                    </p>
                    <p>
                    {
                        winColor === `Green` ? `+${totalBetColorSum * 14}$` :
                        winColor === color ? `+${totalBetColorSum * 2}$` :
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
                                        winColor === `Green` ? `+${player.bets[color] * 14}$` :
                                        winColor === color ? `+${player.bets[color] * 2}$` :
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