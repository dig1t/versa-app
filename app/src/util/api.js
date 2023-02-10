import axios from 'axios'

import config from '../constants/config.js'

const BASE_URL = `http://${config.apiDomain}/v1`

export const apiCall = config => new Promise(async (resolve, reject) => {
	const method = config.method || 'get'
	
	axios(
		{
			method,
			url: config.url,
			[method === 'get' ? 'params' : 'data']: (
				config._data || { data: config.data }
			),
			headers: {
				'Content-Type' : 'application/json; charset=UTF-8',
				'Accept': 'Token'
			},
			withCredentials: true
			// ,tokens, etc
		}
	)
		.then(response => {
			response.data.success ? resolve(response.data.data) : reject(response.data.message)
		})
		.catch(error => {
			console.error(config.url, error.response && error.response.data)
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