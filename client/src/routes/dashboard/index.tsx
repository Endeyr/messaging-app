import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
// @desc All of users friends, messages, ect?
// @private Must be logged in
const DashboardPage = () => {
	const navigate = useNavigate()
	const { user } = useAppSelector((state) => state.auth)
	useEffect(() => {
		if (!user) {
			navigate('/authentication/login')
		}
	}, [user, navigate])

	return <div>DashboardPage, {user && user.username}</div>
}
export default DashboardPage
