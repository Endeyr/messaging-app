import { TextField } from '@mui/material'
import { FormFieldPropsType } from '../types/Register'

const AuthFormField: React.FC<FormFieldPropsType> = ({
	type,
	placeholder,
	name,
	register,
	error,
	valueAsNumber,
	label,
	required,
}) => (
	<>
		<TextField
			label={label}
			variant="outlined"
			type={type}
			fullWidth
			placeholder={placeholder}
			{...register(name, { valueAsNumber, required })}
		></TextField>
		{error && (
			<span style={{ color: 'red' }}>
				{error.message ? error.message : 'This is a required field'}
			</span>
		)}
	</>
)
export default AuthFormField
