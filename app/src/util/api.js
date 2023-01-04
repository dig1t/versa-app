import axios from 'axios'

const BASE_URL = 'http://localhost:81/v1'

export const apiCall = config => new Promise(async (resolve, reject) => {
	const method = config.method || 'get'
	
	axios(
		{
			method,
			url: config.url,
			[method === 'get' ? 'params' : 'body']: (
				config._data || { data: config.data }
			),
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8',
				      'Accept': 'Token'
			}
			// ,tokens, etc
		}
	)
		.then(response => {
			response.data.success ? resolve(response.data.data) : reject(response.data.message)
		})
		.catch(error => {
			console.error(error.response && error.response.data)
			reject('Server error, try again later')
		})
})

export const apiGet = (route, data) => apiCall({
	url: BASE_URL + route,
	data
})

export const apiPost = (route, data) => apiCall({
	method: 'post',
	url: BASE_URL + route,
	data
})