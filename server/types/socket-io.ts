// Sending and broadcasting events, .emit and .to
export type ServerToClientEventsType = {
	noArgs: () => void
	basicEmit: (a: number, b: string, c: Buffer) => void
	withAck: (d: string, callback: (e: number) => void) => void
}
// Receiving events, .on
export type ClientToServerEventsType = {
	hello: () => void
}
// Inter-server communication, .serverSideEmit
export type InterServerEventsType = {
	ping: () => void
}
// Socket.data attribute, (socket.data)
export type SocketDataType = {
	name: string
	age: string
}
