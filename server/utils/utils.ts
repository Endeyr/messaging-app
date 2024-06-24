import { SessionType } from '../types/types'

export function getUniqueUsersOnlineByUsername(
	activeUserSessions: SessionType[]
) {
	return [
		...new Set(activeUserSessions.map((userSession) => userSession.username)),
	]
}
