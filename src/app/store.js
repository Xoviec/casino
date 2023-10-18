import { configureStore } from '@reduxjs/toolkit'
import balanceReducer from '../features/balance/balanceSlice'
import nicknameReducer from '../features/nickname/nicknameSlice'

export const store = configureStore({
  reducer: {
    balance: balanceReducer,
    nickname: nicknameReducer,
  },
})