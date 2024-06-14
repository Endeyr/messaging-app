import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, FormControl } from '@mui/material'
import axios from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import LoginFormField from '../../components/LoginFormFields'
import { loginSchema } from '../../schema/LoginSchema'
import { loginUser } from '../../services/api'
import { OutletContextType } from '../../types/Context'
import { LoginFormDataType } from '../../types/Login'

const LoginPage = () => {
	const {
		setNotificationMessage,
		username,
		setUsername,
		errorMessage,
		setErrorMessage,
		isLoading,
		setIsLoading,
		isLoggedIn,
		setIsLoggedIn,
	} = useOutletContext<OutletContextType>()
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormDataType>({ resolver: zodResolver(loginSchema) })
	const onSubmit: SubmitHandler<LoginFormDataType> = async (data) => {
		let user
		try {
			setIsLoading(true)
			const response = await loginUser(data)
			user = response.data.data.username
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error(error.response?.data)
				setErrorMessage(error.response?.data)
			} else {
				console.log('An error occurred', error)
				setErrorMessage('An error occurred')
			}
		} finally {
			setIsLoading(false)
		}
		if (user) {
			setUsername(user)
			setNotificationMessage(`${username} has logged in!`)
			setIsLoggedIn(true)
			navigate('/')
		}
	}

	if (isLoading) {
		return <div>... Loading</div>
	}

	return (
		<>
			{isLoggedIn ? (
				<>
					<div>{username} already logged in</div>
					<Link to={'/'}>Home</Link>
				</>
			) : (
				<>
					<h2>Login</h2>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl fullWidth>
							<Box width="100%" gap={4} display="flex" flexDirection="column">
								{errorMessage && (
									<div style={{ color: 'red' }}>{errorMessage}</div>
								)}
								<LoginFormField
									type="email"
									label="email"
									placeholder="email"
									name="email"
									error={errors.email}
									register={register}
									required
								></LoginFormField>
								<LoginFormField
									type="password"
									label="password"
									placeholder="password"
									name="password"
									error={errors.password}
									register={register}
									required
								></LoginFormField>
								<Button type="submit">Submit</Button>
							</Box>
						</FormControl>
					</form>
				</>
			)}
		</>
	)
}
export default LoginPage
