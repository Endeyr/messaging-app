import '@testing-library/jest-dom'
import { screen, act } from '@testing-library/react'
import { toast } from 'react-toastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from '../../../routes/authorization/Login'
import { createMockStore, mockUser, renderWithProviders } from '../../setupFile'

describe('LoginPage', () => {
	let loadingStore: ReturnType<typeof createMockStore>
	let loadedStore: ReturnType<typeof createMockStore>
	let loggedInStore: ReturnType<typeof createMockStore>
	let errorStore: ReturnType<typeof createMockStore>

	beforeEach(() => {
		loadingStore = createMockStore({
			auth: {
				user: null,
				isLoading: true,
				isError: false,
				isSuccess: false,
				message: '',
			},
		})
		loadedStore = createMockStore({
			auth: {
				user: null,
				isLoading: false,
				isError: false,
				isSuccess: false,
				message: '',
			},
		})
		loggedInStore = createMockStore({
			auth: {
				user: { username: 'testUser' },
				isLoading: false,
				isError: false,
				isSuccess: true,
				message: '',
			},
		})
		errorStore = createMockStore({
			auth: {
				user: null,
				isLoading: false,
				isError: true,
				isSuccess: false,
				message: 'Incorrect email or password',
			},
		})
		vi.spyOn(toast, 'error')
	})

	it('renders login form when user is not logged in', async () => {
		await act(async () => {
			renderWithProviders(<LoginPage />, { store: loadedStore })
		})
		expect(screen.getByText('Login')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('email')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('password')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
	})

	it('displays error message for missing email', async () => {
		await act(async () => {
			renderWithProviders(<LoginPage />, { store: loadedStore })
		})
		await mockUser.type(screen.getByPlaceholderText('password'), 'password123')
		await mockUser.click(screen.getByRole('button', { name: 'Submit' }))
		expect(screen.getByText('Invalid email format')).toBeInTheDocument()
	})

	it('displays error message for missing password', async () => {
		await act(async () => {
			renderWithProviders(<LoginPage />, { store: loadedStore })
		})
		await mockUser.type(screen.getByPlaceholderText('email'), 'user@email')
		await mockUser.click(screen.getByRole('button', { name: 'Submit' }))

		expect(screen.getByText('Password is required')).toBeInTheDocument()
	})

	it('submits the form with valid data', async () => {
		const mockDispatch = vi.fn()
		vi.spyOn(loadedStore, 'dispatch').mockImplementation(mockDispatch)
		await act(async () => {
			renderWithProviders(<LoginPage />, { store: loadedStore })
		})

		await mockUser.type(screen.getByPlaceholderText('email'), 'user@test.com')
		await mockUser.type(screen.getByPlaceholderText('password'), 'password123')
		await mockUser.click(screen.getByRole('button', { name: 'Submit' }))

		await vi.waitFor(() => {
			expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function))
		})
	})

	it('displays loading state', async () => {
		await act(async () => {
			renderWithProviders(<LoginPage />, { store: loadingStore })
		})

		expect(screen.getByText('... Loading')).toBeInTheDocument()
	})

	it('displays user info when already logged in', async () => {
		await act(async () => {
			renderWithProviders(<LoginPage />, { store: loggedInStore })
		})

		expect(screen.getByText('testUser already logged in')).toBeInTheDocument()
		expect(screen.getByText('Home')).toBeInTheDocument()
	})

	it('displays error after incorrect log in', async () => {
		await act(async () => {
			renderWithProviders(<LoginPage />, { store: errorStore })
		})

		await vi.waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('Incorrect email or password')
		})
	})
})
