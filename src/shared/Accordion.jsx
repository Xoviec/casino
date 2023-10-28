import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import classNames from 'classnames';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import './Accordion.css';
import '../App.css'

export const AccordionComponent = ({color, placedBets, placeBet, isBettable, winColor}) => {


    placedBets.sort((a, b) => b.bets[color] - a.bets[color]);


    const betsPerColor = placedBets.filter(item => item.bets[color] > 0);

    const totalBetColorSum = placedBets.reduce((acc, item) => acc + item.bets[color], 0);

    const multiplier = (color===`Green` ? 14 : 2)

    return(  
    <Accordion.Root className="AccordionRoot " type="single" defaultValue="item-1" collapsible disabled='true'>
        <Accordion.Item className="AccordionItem" value="item-1">
        <AccordionTrigger>
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
        </AccordionTrigger>
        {
        placedBets?.length > 0 ?
            
        <AccordionContent>
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
        </AccordionContent> 
        :
        null
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
