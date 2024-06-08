import { Box, Button, FormControl } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import AuthFormField from '../../components/AuthFormFields'
import { RegisterFormDataType } from '../../types/Register'

const Register = () => {
	// client sends http POST request to backend with json of username, email, role, password, ect
	// backend checks if existing user then saves user to database
	// backend returns a message of success or failed
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormDataType>()
	// TODO send form to backend
	const onSubmit: SubmitHandler<RegisterFormDataType> = (data) =>
		console.log(data)

	return (
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
						type="text"
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
					<input
						hidden
						defaultValue={'user'}
						{...register('role', { required: true })}
					/>
					<Button type="submit">Submit</Button>
				</Box>
			</FormControl>
		</form>
	)
}
export default Register
