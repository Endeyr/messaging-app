import { useState } from 'react'

const Login = () => {
	// client sends http POST request to backend with json of username, and password
	// backend authenticates user and creates a JWT string with a secret
	// backend returns a json with token, user info, authorities
	const [username, setUsername] = useState('')
	return (
		<div>
			<h1>Login</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					// logic to set username to Context or local storage or db
				}}
			>
				<input
					type="text"
					value={username}
					placeholder="username"
					onChange={(e) => setUsername(e.target.value)}
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
	)
}
export default Login
