import { createSlice } from '@reduxjs/toolkit'
type initialStateType = {
	user: string | null
	text: string
}

const user = localStorage.getItem('user')
const parsedUser = user ? JSON.parse(user) : null

const initialState: initialStateType = {}

export const messageSlice = createSlice({
	name: 'message',
	initialState,
	reducers: {
		reset: () => {},
	},
	extraReducers: (builder) => {
		builder
	},
})

export const { reset } = messageSlice.actions
export default messageSlice.reducer
