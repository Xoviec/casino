export const Chatbar = ({numberList, userID, ref, handleShareNumber}) =>{



    return(
        <div>
            <div className='chat'>
                {numberList.map((number) => (
                <div ref={ref} key={number} className={`${number.userID===userID ? 'user' : 'stranger'} single-message`}>
                    <p className='message-user-id'>{number.userID}</p>
                    <p className='message-content'>{number.number}</p>
                </div>
                ))}
            </div>
        <div className='chat-bottom'>
            <form onSubmit={handleShareNumber}>
                <input type="text" name='number' autoComplete="off" placeholder='...'/>
                <button type='submit' >Wyślij wiadomość</button>
            </form>
        </div>

        </div>
    )
}