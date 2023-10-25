export const BetShow = ({color, placedBets, placeBet, isBettable, winColor}) =>{



    placedBets.sort((a, b) => b.bets[color] - a.bets[color]);


    const betsPerColor = placedBets.filter(item => item.bets[color] > 0);

    const totalBetColorSum = placedBets.reduce((acc, item) => acc + item.bets[color], 0);

    const multiplier = (color===`Green` ? 14 : 2)

    return(
        <div className={`bet-container bet-container-bottom ${winColor === color && `bet-container-winning`} ${!isBettable && 'bets-closed' }`}>
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