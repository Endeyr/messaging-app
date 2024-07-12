/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': ['ts-jest', {}],
	},
	preset: 'ts-jest',
	// globalSetup: './tests/globalSetup.ts',
	// globalTeardown: './tests/globalTeardown.ts',
	setupFilesAfterEnv: ['./tests/setupFile.ts'],
	openHandlesTimeout: 2000,
}
