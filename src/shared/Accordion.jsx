import React from 'react';
import { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import classNames from 'classnames';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import './Accordion.css';
import '../App.css'

export const AccordionComponent = ({color, placedBets, placeBet, isBettable, winColor}) => {

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1050);
  const [accordionOpener, setAccordionOpener] = useState(window.innerWidth <= 1050 ? 0 : 1)

  const handleChangeAccordionState = () =>{
    if(accordionOpener===0){

      setAccordionOpener(1)
    }
    else{
      setAccordionOpener(0)
    }
  }


  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1050);
    if(window.innerWidth <= 1050){
      setAccordionOpener(0)
    }
    else{
      setAccordionOpener(1)
    }
  };

  console.log(isMobile)

  window.addEventListener('resize', handleResize);


    placedBets.sort((a, b) => b.bets[color] - a.bets[color]);


    const betsPerColor = placedBets.filter(item => item.bets[color] > 0);

    const totalBetColorSum = placedBets.reduce((acc, item) => acc + item.bets[color], 0);

    const multiplier = (color===`Green` ? 14 : 2)




    const playersArray = [
      {
        nickName: 'Player 1',
        bets: { Red: 20, Green: 200, Black: 0 },
        color: 'Red'
      },
      {
        nickName: 'Player 2',
        bets: { Red: 0, Green: 30, Black: 0 },
        color: 'Green'
      },
      {
        nickName: 'Player 3',
        bets: { Red: 0, Green: 200, Black: 25 },
        color: 'Black'
      },
      {
        nickName: 'Player 4',
        bets: { Red: 15, Green: 200, Black: 0 },
        color: 'Red'
      },
      {
        nickName: 'Player 5',
        bets: { Red: 0, Green: 40, Black: 0 },
        color: 'Green'
      },
      {
        nickName: 'Player 6',
        bets: { Red: 0, Green: 200, Black: 30 },
        color: 'Black'
      },
      {
        nickName: 'Player 7',
        bets: { Red: 25, Green: 200, Black: 0 },
        color: 'Red'
      },
      {
        nickName: 'Player 8',
        bets: { Red: 0, Green: 35, Black: 0 },
        color: 'Green'
      },
      {
        nickName: 'Player 9',
        bets: { Red: 0, Green: 200, Black: 22 },
        color: 'Black'
      },
      {
        nickName: 'Player 10',
        bets: { Red: 18, Green: 200, Black: 0 },
        color: 'Red'
      },
      {
        nickName: 'Player 11',
        bets: { Red: 0, Green: 45, Black: 0 },
        color: 'Green'
      },
      {
        nickName: 'Player 12',
        bets: { Red: 0, Green: 200, Black: 27 },
        color: 'Black'
      },
      {
        nickName: 'Player 13',
        bets: { Red: 30, Green: 0, Black: 0 },
        color: 'Red'
      },
      {
        nickName: 'Player 14',
        bets: { Red: 0, Green: 50, Black: 0 },
        color: 'Green'
      },
      {
        nickName: 'Player 15',
        bets: { Red: 0, Green: 0, Black: 35 },
        color: 'Black'
      },
      {
        nickName: 'Player 16',
        bets: { Red: 28, Green: 0, Black: 0 },
        color: 'Red'
      },
      {
        nickName: 'Player 17',
        bets: { Red: 0, Green: 55, Black: 0 },
        color: 'Green'
      },
      {
        nickName: 'Player 18',
        bets: { Red: 0, Green: 0, Black: 40 },
        color: 'Black'
      },
      {
        nickName: 'Player 19',
        bets: { Red: 23, Green: 0, Black: 0 },
        color: 'Red'
      },
      {
        nickName: 'Player 20',
        bets: { Red: 0, Green: 60, Black: 0 },
        color: 'Green'
      }
    ];
    
    


    console.log(playersArray) //for testing more bets
    console.log(placedBets)

    return(  
    <Accordion.Root className={`AccordionRoot  ${!isBettable && 'bets-closed' }`} value={`item-${accordionOpener}`} type="single" disabled={isMobile ? false : true}>
        <Accordion.Item className="AccordionItem" value="item-1">
        <AccordionTrigger onClick={handleChangeAccordionState}>
          <div className="bet-summary-container">
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

        </AccordionTrigger>
        {
            placedBets?.slice(0,10).filter((player)=>player.bets[color]).map((player, index)=>(
                <AccordionContent>
                          <div className={`single-bet ${index===9 ? 'last-el': ''}`}>
                              <p>{player.nickName}</p>
                              <p>    
                                  {
                                      winColor === color ? `+${player.bets[color] * multiplier}$` :
                                      (winColor ? `-${player.bets[color]}$` :
                                      `${player.bets[color]}$`)
                                  }
                              </p>
                          </div>
              </AccordionContent> 
            ))
        }
        </Accordion.Item>
    </Accordion.Root>
    )
};

const AccordionTrigger = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="AccordionHeader">
    <Accordion.Trigger
      className={classNames('AccordionTrigger', className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon className="AccordionChevron" aria-hidden />
    </Accordion.Trigger>
  </Accordion.Header>
));

const AccordionContent = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={classNames('AccordionContent', className)}
    {...props}
    ref={forwardedRef}
  >
    <div className="AccordionContentText">{children}</div>
  </Accordion.Content>
));
