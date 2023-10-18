import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 1000,
}

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    setAmmount: (state, action) => {
      state.value = action.payload
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, setAmmount, incrementByAmount } = balanceSlice.actions

export default balanceSlice.reducer