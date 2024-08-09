import type { MessageType } from '../message/messageTypes'

export enum ChatEvent {
	SendMessage = 'send_message',
	RequestAllMessages = 'request_all_messages',
	SendAllMessages = 'send_all_messages',
	ReceiveMessage = 'receive_message',
}

export type ChatStateType = {
	messages: MessageType[]
	isEstablishingConnection: boolean
	isConnected: boolean
}
