import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, FormControl } from '@mui/material'
import axios from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import AuthFormField from '../../components/AuthFormFields'
import { registerSchema } from '../../schema/RegisterSchema'
import { registerUser } from '../../services/api'
import { OutletContextType } from '../../types/Context'
import { RegisterFormDataType, RoleEnum } from '../../types/Register'

const Register = () => {
	const {
		setNotificationMessage,
		username,
		errorMessage,
		setErrorMessage,
		isLoading,
		setIsLoading,
		isLoggedIn,
	} = useOutletContext<OutletContextType>()
	const navigate = useNavigate()
	// client sends http POST request to backend with json of username, email, role, password, ect
	// backend checks if existing user then saves user to database
	// backend returns a message of success or failed
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormDataType>({ resolver: zodResolver(registerSchema) })
	const onSubmit: SubmitHandler<RegisterFormDataType> = async (data) => {
		try {
			setIsLoading(true)
			const response = await registerUser(data)
			if (response.data.success) {
				setNotificationMessage('User registered')
			} else {
				setNotificationMessage('Problem registering user')
			}
			navigate('/authentication/login')
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				const errorMessage =
					error.response?.data.errors[0]?.message ||
					error.response?.data.message ||
					'An error occurred'
				setErrorMessage(errorMessage)
			} else {
				console.log('An error occurred', error)
				setErrorMessage('An error occurred')
			}
		} finally {
			setIsLoading(false)
		}
	}

	if (isLoading) {
		return <div>... Loading</div>
	}

	return (
		<>
			{isLoggedIn ? (
				<>
					<div>{username} already registered</div>
					<Link to={'/'}>Home</Link>
				</>
			) : (
				<>
					<h2>Register</h2>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl fullWidth>
							<Box width="100%" gap={4} display="flex" flexDirection="column">
								{errorMessage && (
									<div style={{ color: 'red' }}>{errorMessage}</div>
								)}
								<AuthFormField
									type="text"
									label="username"
									placeholder="username"
									name="username"
									error={errors.username}
									register={register}
									required
								></AuthFormField>
								<AuthFormField
									type="email"
									label="email"
									placeholder="email"
									name="email"
									error={errors.email}
									register={register}
									required
								></AuthFormField>
								<AuthFormField
									type="password"
									label="password"
									placeholder="password"
									name="password"
									error={errors.password}
									register={register}
									required
								></AuthFormField>
								<AuthFormField
									type="password"
									label="confirm password"
									placeholder="confirm password"
									name="confirmPassword"
									error={errors.confirmPassword}
									register={register}
									required
								></AuthFormField>
								<input
									type="hidden"
									{...register('role', {
										required: true,
										value: [RoleEnum.user],
									})}
								/>
								<Button type="submit">Submit</Button>
							</Box>
						</FormControl>
					</form>
				</>
			)}
		</>
	)
}
export default Register
