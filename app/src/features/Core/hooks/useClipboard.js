/* eslint-disable no-undef */

const copyText = (text) => {
	return navigator.clipboard.writeText(text)
		.then(() => true)
		.catch(() => {
			throw new Error('Failed to write to clipboard')
		})
}

const clipboardCopy = (text) => {
	const hasClipboardApi = navigator.clipboard !== undefined
	
	if (!hasClipboardApi) {
		return false
	}
	
	return new Promise((resolve, reject) => {
		navigator.permissions.query({ name: 'clipboard-write' })
			.then((result) => {
				// Prompt for clipboard permissions if not already granted
				if (result.state === 'granted' || result.state === 'prompt') {
					// Copy the text to the clipboard
					copyText(text)
					resolve(true)
				} else {
					reject('Clipboard permissions denied')
				}
			})
			.catch((error) => reject(error))
	})
}

const clipboardPaste = () => {
	const hasClipboardApi = navigator.clipboard !== undefined
	
	if (!hasClipboardApi) {
		return false
	}
	
	return new Promise((resolve, reject) => {
		navigator.permissions.query({ name: 'clipboard-read' })
			.then((result) => {
				// Prompt for clipboard permissions if not already granted
				if (result.state === 'granted' || result.state === 'prompt') {
					// Get text from the clipboard
					navigator.clipboard.readText()
						.then((text) => resolve(text))
						.catch(() => reject('Failed to read clipboard'))
				} else {
					reject('Clipboard permissions denied')
				}
			})
			.catch((error) => reject(error))
	})
}

export default () => {
	return {
		clipboardCopy,
		clipboardPaste
	}
}