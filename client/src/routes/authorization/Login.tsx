import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, FormControl } from '@mui/material'
import { useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ZodError } from 'zod'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import LoginFormField from '../../components/LoginFormFields'
import {
	login as userLogin,
	reset as userReset,
} from '../../features/auth/authSlice'
import { loginSchema } from '../../schema/LoginSchema'
import { type LoginFormDataType } from '../../types/Login'

const LoginPage = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const { user, isLoading, isError, isSuccess, message } = useAppSelector(
		(state) => state.auth
	)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormDataType>({ resolver: zodResolver(loginSchema) })
	const onSubmit: SubmitHandler<LoginFormDataType> = async (data) => {
		try {
			dispatch(userLogin(data))
		} catch (error: unknown) {
			if (error instanceof ZodError) {
				error.issues.map((issue) => {
					toast.error(issue.message)
				})
			}
		}
	}

	useEffect(() => {
		if (isError) {
			toast.error(message)
		}
		if (isSuccess || user) {
			navigate('/')
		}
		setTimeout(() => dispatch(userReset()), 10)
	}, [user, isError, isSuccess, message, navigate, dispatch])

	if (isLoading) {
		// TODO Loading spinner
		return <div>... Loading</div>
	}

	return (
		<>
			{user ? (
				<>
					<div>{user.username} already logged in</div>
					<Link to={'/'}>Home</Link>
				</>
			) : (
				<>
					<h2>Login</h2>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl fullWidth>
							<Box width="100%" gap={4} display="flex" flexDirection="column">
								<LoginFormField
									type="email"
									label="email"
									placeholder="email"
									name="email"
									error={errors.email}
									register={register}
									required={true}
								></LoginFormField>
								<LoginFormField
									type="password"
									label="password"
									placeholder="password"
									name="password"
									error={errors.password}
									register={register}
									required={true}
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
