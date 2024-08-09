import { addListener, createListenerMiddleware } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '../app/store'

// create middleware instance
export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<
	RootState,
	AppDispatch
>()

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()
