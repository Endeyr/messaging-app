import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/auth/authSlice'
import messageSlice from './../features/messages/messageSlice'

export const store = configureStore({
	reducer: {
		auth: authSlice,
		message: messageSlice,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
