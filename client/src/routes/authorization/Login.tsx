import { Box, Button, FormControl } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import LoginFormField from '../../components/LoginFormFields'
import { LoginFormDataType } from '../../types/Login'

const Login = () => {
	// client sends http POST request to backend with json of username, and password
	// backend authenticates user and creates a JWT string with a secret
	// backend returns a json with token, user info, authorities
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormDataType>()
	// TODO send form to backend
	const onSubmit: SubmitHandler<LoginFormDataType> = (data) => console.log(data)

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FormControl fullWidth>
				<Box width="100%" gap={4} display="flex" flexDirection="column">
					<LoginFormField
						type="text"
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
	)
}
export default Login
