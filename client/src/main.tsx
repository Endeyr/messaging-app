import '@fontsource/roboto'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.tsx'
import { store } from './app/store.ts'
import ErrorPage from './error-page.tsx'
import './index.css'
import ForgotPasswordOrEmailPage from './routes/authorization/Forgot-Password-Or-Email.tsx'
import LoginPage from './routes/authorization/Login.tsx'
import RegisterPage from './routes/authorization/Register.tsx'
import DashboardPage from './routes/dashboard/index.tsx'
import Root from './routes/root.tsx'
import ProfilePage from './routes/user/Profile.tsx'
import theme from './theme.ts'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '',
				element: <App />,
			},
			{
				path: 'authentication/register',
				element: <RegisterPage />,
			},
			{
				path: 'authentication/login',
				element: <LoginPage />,
			},
			{
				path: 'authentication/forgot-password-or-email',
				element: <ForgotPasswordOrEmailPage />,
			},
			{
				path: 'user/profile',
				element: <ProfilePage />,
			},
			{
				path: 'dashboard',
				element: <DashboardPage />,
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<CssBaseline />
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<ToastContainer />
				<RouterProvider router={router} />
			</Provider>
		</ThemeProvider>
	</React.StrictMode>
)
