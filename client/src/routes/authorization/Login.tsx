import { useState } from 'react'

const Login = () => {
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
