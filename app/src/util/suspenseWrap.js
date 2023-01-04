export const suspenseWrap = promise => {  
	let status = 'pending'
	let result
	
	let suspender = promise.then(
		res => {
			status = 'success'
			result = res
		},
		error => {
			status = 'error'
			result = error
		}
	)
	
	return {
		read: () => {
			if (status === 'pending') {
				throw suspender
			} else if (status === 'error') {
				throw result
			} else if (status === 'success') {
				return result
			}
		}
	}
}
