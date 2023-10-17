import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './balanceSlice'

export function BalanceShow() {
  const count = useSelector((state) => state.balance.value)

  return (
    <div className='balance-box'>
      <div className='coins'></div>
        <p className='balance'>{count}</p>
    </div>
  )
}