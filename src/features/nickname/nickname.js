import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNickname } from './nicknameSlice'

export function Nickname() {
  const nick = useSelector((state) => state.nickname.value)

  // const [isActiveModal, setIsActiveModal] = useState(false)

  return (
    <button className='nick-box'>
      <p>{nick}</p>
    </button>
  )
}