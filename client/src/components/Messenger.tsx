import { useState } from 'react'
import { useAppDispatch } from '../app/hooks'
import { createText } from '../features/message/messageSlice'

const Messenger = () => {
	const [text, setText] = useState('')
	const dispatch = useAppDispatch()

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		dispatch(createText({ text }))
		setText('')
	}

	return (
		<section>
			<form onSubmit={onSubmit}>
				<label htmlFor="text">Message</label>
				<input
					id="text"
					type="text"
					name="text"
					value={text}
					onChange={(e) => {
						setText(e.target.value)
					}}
				/>
				<button type="submit">Send</button>
			</form>
		</section>
	)
}
export default Messenger
