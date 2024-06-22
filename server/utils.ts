import { SessionType } from './types'

export function getUniqueUsersOnlineByUsername(
	activeUserSessions: SessionType[]
) {
	return [
		...new Set(activeUserSessions.map((userSession) => userSession.username)),
	]
}
