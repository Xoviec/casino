import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 'User',
}

export const nicknameSlice = createSlice({
  name: 'nickname',
  initialState,
  reducers: {

    setNickname: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setNickname } = nicknameSlice.actions

export default nicknameSlice.reducer