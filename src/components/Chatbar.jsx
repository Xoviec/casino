export const Chatbar = ({numberList, userID, ref, handleShareNumber}) =>{



    return(
        <div className="chat-window">
            <div className='chat-messages'>
                {numberList.map((number) => (
                <div ref={ref} key={number} className={`${number.userID===userID ? 'user' : 'stranger'} single-message`}>
                    <p className='message-user-id'>{number.userID}</p>
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