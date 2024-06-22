import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/auth/authSlice'
import messageSlice from '../features/message/messageSlice'
import socketSlice from '../features/socket/socketSlice'
import socketMiddleware from '../middleware/socketMiddleware'

export const store = configureStore({
	reducer: {
		auth: authSlice,
		message: messageSlice,
		socket: socketSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(socketMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
