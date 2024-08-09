import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, FormControl } from '@mui/material'
import { useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ZodError } from 'zod'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import AuthFormField from '../../components/AuthFormFields'
import {
	register as userRegister,
	reset as userReset,
} from '../../features/auth/authSlice'
import { registerSchema } from '../../schema/RegisterSchema'
import { type RegisterFormDataType, RoleEnum } from '../../types/Register'

const RegisterPage = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const { user, isLoading, isError, isSuccess, message } = useAppSelector(
		(state) => state.auth
	)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormDataType>({ resolver: zodResolver(registerSchema) })
	const onSubmit: SubmitHandler<RegisterFormDataType> = async (data) => {
		try {
			dispatch(userRegister(data))
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
		// TODO loading spinner / page
		return <div>... Loading</div>
	}

	return (
		<>
			{user ? (
				<>
					<div>{user.username} already registered</div>
					<Link to={'/'}>Home</Link>
				</>
			) : (
				<>
					<h2>Register</h2>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl fullWidth>
							<Box width="100%" gap={4} display="flex" flexDirection="column">
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
export default RegisterPage
