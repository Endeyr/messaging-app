import { Container } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Root = () => {
	const [username, setUsername] = useState('')
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [notificationMessage, setNotificationMessage] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	return (
		<>
			<Navbar />
			<Container
				maxWidth={'lg'}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					minHeight: '90dvh',
				}}
			>
				<Outlet
					context={{
						username,
						setUsername,
						isLoggedIn,
						setIsLoggedIn,
						notificationMessage,
						setNotificationMessage,
						isLoading,
						setIsLoading,
						errorMessage,
						setErrorMessage,
					}}
				/>
			</Container>
		</>
	)
}
export default Root
