import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {},
  admin: {},
  adminloggedin: false,
  userloggedin: false,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    dispatchUser: (state, action) => {
      state.user = action.payload
    },
    dispatchAdminLoggedIn: (state, action) => {
      state.adminloggedin = action.payload
    },
    dispatchLoggedIn: (state, action) => {
      state.userloggedin = action.payload
    },
    dispatchAdmin: (state, action) => {
      state.admin = action.payload
    },
  },
})

export const { dispatchUser, dispatchAdmin, dispatchLoggedIn, dispatchAdminLoggedIn } = counterSlice.actions

export default counterSlice.reducer