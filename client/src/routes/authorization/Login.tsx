import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, FormControl } from '@mui/material'
import axios from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import LoginFormField from '../../components/LoginFormFields'
import { loginSchema } from '../../schema/LoginSchema'
import { loginUser } from '../../services/api'
import { LoginFormDataType } from '../../types/Login'

const Login = () => {
	// client sends http POST request to backend with json of username, and password
	// backend authenticates user and creates a JWT string with a secret
	// backend returns a json with token, user info, authorities
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormDataType>({ resolver: zodResolver(loginSchema) })
	// TODO send form to backend
	const onSubmit: SubmitHandler<LoginFormDataType> = async (data) => {
		try {
			const response = await loginUser(data)
			console.log(response)
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error(error.response?.data)
			} else {
				console.log('An error occurred', error)
			}
		}
	}

	return (
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
	)
}
export default Login
