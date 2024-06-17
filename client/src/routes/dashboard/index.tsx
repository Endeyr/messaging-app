import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import Messenger from '../../components/Messenger'
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

	return (
		<>
			<section>
				<h1>{user && user.username}</h1>
				<p>Messages Dashboard</p>
			</section>
			<Messenger />
		</>
	)
}
export default DashboardPage
