import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, FormControl } from '@mui/material'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ZodError } from 'zod'
import { useAppDispatch } from '../app/hooks'
import { createMessage, getMessages } from '../features/message/messageSlice'
import type { MessageFormDataType } from '../features/message/messageTypes'
import { messageSchema } from '../schema/messageSchema'
import MessengerFormField from './MessengerFormField'

const Messenger = () => {
	const dispatch = useAppDispatch()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<MessageFormDataType>({ resolver: zodResolver(messageSchema) })

	const onSubmit: SubmitHandler<MessageFormDataType> = async (data) => {
		try {
			dispatch(createMessage(data))
		} catch (error: unknown) {
			if (error instanceof ZodError) {
				error.issues.map((issue) => {
					toast.error(issue.message)
				})
			}
		} finally {
			dispatch(getMessages())
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FormControl fullWidth>
					<Box width="100%" gap={4} display="flex" flexDirection="column">
						<MessengerFormField
							type="text"
							label="Text"
							placeholder="text"
							name="text"
							error={errors.text}
							register={register}
							required={true}
						></MessengerFormField>
						<MessengerFormField
							type="sent_to"
							label="To"
							placeholder="sent_to"
							name="sent_to"
							error={errors.sent_to}
							register={register}
							required={true}
						></MessengerFormField>
						<Button type="submit">Submit</Button>
					</Box>
				</FormControl>
			</form>
		</>
	)
}
export default Messenger
