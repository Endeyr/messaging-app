import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getUserData, reset } from '../../features/profile/profileSlice'

const ProfilePage = () => {
	// TODO add user profile details + allow user to edit them
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { user } = useAppSelector((state) => state.auth)
	const { userData, isLoading, isError, message } = useAppSelector(
		(state) => state.profile
	)

	useEffect(() => {
		if (!user) {
			navigate('/authentication/login')
		} else {
			dispatch(getUserData(user._id))
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
					<h2>User Info</h2>
					<p>Username: {userData.username}</p>
					<p>Email: {userData.email}</p>
				</>
			)}
		</>
	)
}
export default ProfilePage
