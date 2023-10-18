import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNickname } from './nicknameSlice'

export function Nickname() {
  const nick = useSelector((state) => state.nickname.value)

  return (
    <div className='balance-box'>
      <p>{nick}</p>
    </div>
  )
}