import axios from 'axios'

import config from '../constants/config.js'

const BASE_URL = `http://${config.apiDomain}/v1`

export const apiCall = options => new Promise(async (resolve, reject) => {
	const method = options.method || 'get'
	
	axios(
		{
			method,
			url: options.url,
			[method === 'get' ? 'params' : 'data']: (
				options._data || { data: options.data }
			),
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded',
				'Accept': 'Token'
			},
			withCredentials: options.withCredentials
		}
	)
		.then(response => {
			response.data.success ? resolve(response.data.data) : reject(response.data.message)
		})
		.catch(error => {
			console.error(options.url, error.response && error.response.data)
			reject('Server error, try again later')
		})
})

export const apiGet = (route, data) => apiCall({
	url: BASE_URL + route,
	withCredentials: true,
	data
})

export const apiPost = (route, data) => apiCall({
	method: 'post',
	url: BASE_URL + route,
	withCredentials: true,
	data
})