import { useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { OutletContextType } from '../types/Context'

const Home = () => {
	const { notificationMessage, username, isLoggedIn } =
		useOutletContext<OutletContextType>()
	const navigate = useNavigate()
	// TODO keep user logged in on refresh / changing page
	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/authentication/login')
		}
	}, [navigate, isLoggedIn])
	return (
		<>
			<p>{username + ' ' + notificationMessage}</p>
			<div>Welcome Home</div>
		</>
	)
}
export default Home
