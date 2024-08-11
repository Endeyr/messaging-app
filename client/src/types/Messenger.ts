import { type FieldError, type UseFormRegister } from 'react-hook-form'
import type { MessageFormDataType } from '../features/message/messageTypes'

export type ValidFieldNamesType = keyof MessageFormDataType

export type FormFieldPropsType = {
	type: string
	placeholder: string
	name: ValidFieldNamesType
	register: UseFormRegister<MessageFormDataType>
	error: FieldError | undefined
	valueAsNumber?: boolean
	required?: boolean
	label: string
}
