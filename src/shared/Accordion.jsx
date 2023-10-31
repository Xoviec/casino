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

    return(  
    <Accordion.Root className="AccordionRoot " value={`item-${accordionOpener}`} type="single" disabled={isMobile ? false : true}>
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
            placedBets?.map((player)=>(
              player.bets[color] > 0 &&
                <AccordionContent>
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
