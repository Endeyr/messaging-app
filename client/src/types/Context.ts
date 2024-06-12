import { Dispatch, SetStateAction } from 'react'

export type OutletContextType = {
	username: string
	setUsername: Dispatch<SetStateAction<string>>
	isLoading: boolean
	setIsLoading: Dispatch<SetStateAction<boolean>>
	errorMessage: string
	setErrorMessage: Dispatch<SetStateAction<string>>
	isLoggedIn: boolean
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>
	notificationMessage: string
	setNotificationMessage: Dispatch<SetStateAction<string>>
}
