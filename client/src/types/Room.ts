import { type UserType } from '../features/auth/authTypes'

export type RoomType = {
	users: UserType[]
	name: string
	createdAt?: Date
	updatedAt?: Date
}
