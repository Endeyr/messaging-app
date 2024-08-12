import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import UserProfileForm from '../../components/UserProfileForm'
import { getUserData, reset } from '../../features/profile/profileSlice'

const ProfilePage = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { user } = useAppSelector((state) => state.auth)
	const { userData, isLoading, isError, message } = useAppSelector(
		(state) => state.profile
	)
	const [isEditing, setIsEditing] = useState(false)

	useEffect(() => {
		if (!user) {
			navigate('/authentication/login')
		} else {
			if (user.userId) {
				dispatch(getUserData(user.userId))
			}
		}

		return () => {
			dispatch(reset())
		}
	}, [user, navigate, dispatch])

	if (isLoading) {
		return <div>...Loading</div>
	}

	if (isError) {
		return <div>Error: {message}</div>
	}

	return (
		<>
			{userData && (
				<>
					<h2>Profile</h2>
					<p>Username: {userData.username}</p>
					<p>Email: {userData.email}</p>
				</>
			)}
			{isEditing ? (
				<UserProfileForm setIsEditing={setIsEditing} />
			) : (
				<Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
			)}
		</>
	)
}
export default ProfilePage
