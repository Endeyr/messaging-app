import { TextField } from '@mui/material'
import { type FormFieldPropsType } from '../types/Profile.ts'

const ProfileFormField: React.FC<FormFieldPropsType> = ({
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
			<p style={{ color: 'red' }}>
				{error.message ? error.message : 'This is a required field'}
			</p>
		)}
	</>
)
export default ProfileFormField
