import {useRef, useEffect} from 'react';


export const Chatbar = ({numberList, userID, handleShareNumber}) =>{

    const ref = useRef()

    useEffect(() => {
        ref.current.scrollTop = ref.current.scrollHeight;
      }, [numberList]);
    
    return(
        <div className="chat-window">
            <div ref={ref} className='chat-messages'>
                {numberList.map((number) => (
                <div  key={number.userID} className={`${number.userID===userID ? 'user' : 'stranger'} single-message`}>
                    <p className='message-user-id'>{number.nickName}</p>
                    <p className='message-content'>{number.number}</p>
                </div>
                ))}
            </div>
            <div className='chat-bottom'>
                <form onSubmit={handleShareNumber}>
                    <input type="text" name='number' autoComplete="off" placeholder='...' />
                    <button type='submit' >Send</button>
                </form>
            </div>

        </div>
    )
}