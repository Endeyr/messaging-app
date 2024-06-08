import { FieldError, UseFormRegister } from 'react-hook-form'

export enum RoleEnum {
	user = 'user',
	admin = 'admin',
	moderator = 'moderator',
}

export type RegisterFormDataType = {
	username: string
	email: string
	password: string
	confirmPassword: string
	role: RoleEnum
}

export type ValidFieldNamesType = keyof RegisterFormDataType

export type FormFieldPropsType = {
	type: string
	placeholder: string
	name: ValidFieldNamesType
	register: UseFormRegister<RegisterFormDataType>
	error: FieldError | undefined
	valueAsNumber?: boolean
	required?: boolean
	label: string
}
