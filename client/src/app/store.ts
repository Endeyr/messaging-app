import {
	type Action,
	type ThunkAction,
	combineSlices,
	configureStore,
} from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { messageSlice } from '../features/message/messageSlice'
import { type MessageType } from '../features/message/messageTypes'
import { profileSlice } from '../features/profile/profileSlice'
import { authSlice } from './../features/auth/authSlice'
import { listenerMiddleware } from './../middleware/listenerMiddleware'
import { socketMiddleware } from './../middleware/socketMiddleware'

const middleware = [listenerMiddleware.middleware, socketMiddleware]
const rootReducer = combineSlices(authSlice, messageSlice, profileSlice)

// Preload state from local storage
let preloadedState: Partial<RootState> | undefined
const persistedMessagesString = localStorage.getItem('messages')
const persistedUserDataString = localStorage.getItem('rooms')

if (persistedMessagesString || persistedUserDataString) {
	preloadedState = {
		messages: {
			messages: persistedMessagesString
				? (JSON.parse(persistedMessagesString) as MessageType[])
				: [],
			isSuccess: true,
			isLoading: false,
			isError: false,
			message: '',
		},
		profile: {
			userData: persistedUserDataString
				? JSON.parse(persistedUserDataString)
				: [],
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
			isLoading: true,
			isError: false,
			message: '',
		},
		profile: {
			userData: {
				userId: '',
				username: '',
				email: '',
				role: [],
			},
			isSuccess: true,
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
