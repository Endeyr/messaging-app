import { configureStore, type EnhancedStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import type { RootState } from '../app/store'
import authReducer from '../features/auth/authSlice'

// Mock react-router dom
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom')
	return {
		...actual,
		useNavigate: () => vi.fn(),
	}
})

// Mock react-toastify
vi.mock('react-toastify', () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn(),
	},
}))

// Mock socket service
vi.mock('../features/socket/socketService', () => ({
	socket: {
		connect: vi.fn(),
		disconnect: vi.fn(),
	},
}))

// Mock store
export const createMockStore = (initialState = {}) => {
	return configureStore({
		reducer: {
			auth: authReducer,
		},
		preloadedState: initialState,
	})
}

// Helper functions
export const renderWithProviders = (
	ui: ReactElement,
	{
		preloadedState = {},
		store = createMockStore(preloadedState),
		...renderOptions
	}: {
		preloadedState?: Partial<RootState> | undefined
		store?: EnhancedStore
	} & Omit<RenderOptions, 'wrapper'> = {}
): { store: EnhancedStore } & ReturnType<typeof render> => {
	const Wrapper = ({ children }: { children: ReactNode }) => {
		return (
			<Provider store={store}>
				<BrowserRouter>{children}</BrowserRouter>
			</Provider>
		)
	}
	return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
