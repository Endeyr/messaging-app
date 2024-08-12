import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, FormControl } from '@mui/material'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ZodError } from 'zod'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { getUserData, updateUserData } from '../features/profile/profileSlice'
import { profileSchema } from '../schema/ProfileSchema'
import type { ProfileFormDataType } from '../types/Profile'
import ProfileFormField from './ProfileFormFields'

const UserProfileForm = ({
	setIsEditing,
}: {
	setIsEditing: (arg0: boolean) => void
}) => {
	const dispatch = useAppDispatch()
	const { user } = useAppSelector((state) => state.auth)
	const { isLoading, isError, message } = useAppSelector(
		(state) => state.profile
	)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileFormDataType>({ resolver: zodResolver(profileSchema) })
	const onSubmit: SubmitHandler<ProfileFormDataType> = async (data) => {
		try {
			if (!user?.userId) {
				throw new Error('User id is missing')
			}
			const userData = { ...data, userId: user!.userId }
			const resultAction = await dispatch(updateUserData(userData))
			if (updateUserData.fulfilled.match(resultAction)) {
				toast.success('Profile updated successfully')
				setIsEditing(false)
				dispatch(getUserData(user.userId))
			} else if (updateUserData.rejected.match(resultAction)) {
				toast.error(resultAction.payload || 'Failed to update profile')
			}
		} catch (error: unknown) {
			if (error instanceof ZodError) {
				error.issues.map((issue) => {
					toast.error(issue.message)
				})
			} else {
				toast.error('An unexpected error occurred')
			}
		}
	}

	if (isLoading) {
		return <div>Updating profile...</div>
	}

	if (isError) {
		toast.error(message)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FormControl fullWidth>
				<Box width="100%" gap={4} display="flex" flexDirection="column">
					<ProfileFormField
						type="username"
						label="username"
						placeholder="username"
						name="username"
						error={errors.username}
						register={register}
						required={true}
					></ProfileFormField>
					<ProfileFormField
						type="email"
						label="email"
						placeholder="email"
						name="email"
						error={errors.email}
						register={register}
						required={true}
					></ProfileFormField>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Updating...' : 'Submit'}
					</Button>
				</Box>
			</FormControl>
		</form>
	)
}
export default UserProfileForm
