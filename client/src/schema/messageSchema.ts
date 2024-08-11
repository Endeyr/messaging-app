import { z, ZodType } from 'zod'
import type { MessageFormDataType } from '../features/message/messageTypes'

export const messageSchema: ZodType<MessageFormDataType> = z.object({
	text: z.string().min(1, 'Must be at least 1 character'),
	sent_to: z.string().min(1, 'Must be at least 1 character'),
})
