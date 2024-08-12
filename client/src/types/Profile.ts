import { type FieldError, type UseFormRegister } from 'react-hook-form'

export type ProfileFormDataType = {
	userId?: string
	username: string
	email: string
}

export type ValidFieldNamesType = keyof ProfileFormDataType

export type FormFieldPropsType = {
	type: string
	placeholder: string
	name: ValidFieldNamesType
	register: UseFormRegister<ProfileFormDataType>
	error: FieldError | undefined
	valueAsNumber?: boolean
	required?: boolean
	label: string
	hidden?: boolean
	value?: string | number | boolean
}
