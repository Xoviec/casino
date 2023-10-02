export const Bets = ({color, placedBets, placeBet, isBettable}) =>{



    placedBets.sort((a, b) => b.bets[color] - a.bets[color]);


    const betsPerColor = placedBets.filter(item => item.bets[color] > 0);

    const totalBetColorSum = placedBets.reduce((acc, item) => acc + item.bets[color], 0);


    // Używamy pętli forEach do wypisania wartości bets[color] dla każdego obiektu spełniającego warunek
    // filteredData.forEach(item => {
    //     console.log(item.bets[color]);
    // });

    return(
        <div className="bet-container">
            <button name={color} id={color} onClick={placeBet} className={`btn-hidden bet-color-header bet-header-${color}`}>{color}</button>
            <label htmlFor={color} name={color}>
                <div  className={`bet-btn-main bet-header-${color} ${!isBettable && 'bets-closed' }`}>
                    <p className="bet-place">
                        Place Bet
                    </p>
                    <p>
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
                        {totalBetColorSum}$
                    </p>
                </div>
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

    
        </div>
    )
}