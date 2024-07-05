import {
	Action,
	ThunkAction,
	combineSlices,
	configureStore,
} from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { messageSlice } from '../features/message/messageSlice'
import { MessageType } from '../features/message/messageTypes'
import { socketSlice } from '../features/socket/socketSlice'
import socketMiddleware from '../middleware/socketMiddleware'
import { authSlice } from './../features/auth/authSlice'

const middleware = [socketMiddleware]
const rootReducer = combineSlices(authSlice, messageSlice, socketSlice)

// Preload state from local storage
let preloadedState: Partial<RootState> | undefined
const persistedMessagesString = localStorage.getItem('messages')
if (persistedMessagesString) {
	preloadedState = {
		messages: {
			messages: JSON.parse(persistedMessagesString) as MessageType[],
			isSuccess: true,
			isLoading: false,
			isError: false,
			message: '',
		},
	}
} else {
	preloadedState = {
		messages: {
			messages: [],
			isSuccess: false,
			isLoading: false,
			isError: false,
			message: '',
		},
	}
}

export const makeStore = (preloadedState?: Partial<RootState>) => {
	const store = configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(middleware),
		preloadedState,
	})
	setupListeners(store.dispatch)
	return store
}

export const store = makeStore(preloadedState)

// Infer types
export type AppStore = typeof store
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ThunkReturnType = void> = ThunkAction<
	ThunkReturnType,
	RootState,
	unknown,
	Action
>
