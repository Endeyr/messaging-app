import { type FieldError, type UseFormRegister } from 'react-hook-form'

export type LoginFormDataType = {
	email: string
	password: string
}

export type ValidFieldNamesType = keyof LoginFormDataType

export type FormFieldPropsType = {
	type: string
	placeholder: string
	name: ValidFieldNamesType
	register: UseFormRegister<LoginFormDataType>
	error: FieldError | undefined
	valueAsNumber?: boolean
	required?: boolean
	label: string
}
