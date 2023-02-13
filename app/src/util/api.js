import axios from 'axios'

import { USER_FETCH_TOKEN_SUCCESS } from '../constants/actionTypes.js'

import config from '../constants/config.js'

class API {
	constructor() {
		this.defaultOptions = {
			withCredentials: true,
			baseUrl: `http://${config.apiDomain}`,
			customErrorHandler: false // Use built-in error handler
		}
		
		this._keys = {}
	}
	
	setOption(option, value) {
		this.defaultOptions[option] = value
	}
	
	setKey(key, value) {
		this._keys[key] = value
	}
	
	call(_options) {
		const options = {
			...this.defaultOptions,
			..._options
		}
		
		const method = options.method || 'get'
		
		return new Promise(async (resolve, reject) => {
			const includeAT = !options.excludeToken && this._keys.accessToken
			
			axios(
				{
					method,
					url: options.url,
					[method === 'get' ? 'params' : 'data']: (
						options._data || { data: options.data }
					),
					headers: {
						'Content-Type' : 'application/x-www-form-urlencoded',
						Accept: 'Token',
						Authorization: includeAT ? `Bearer ${this._keys.accessToken}` : null
					},
					withCredentials: options.withCredentials
				}
			)
				.then(response => {
					if (options.customErrorHandler) {
						return resolve(response)
					}
					
					response.data.success ? resolve(response.data.data) : reject(response.data.message)
				})
				.catch(error => { // HTTP Response not 200
					if (options.customErrorHandler) reject(error)
					
					console.error(options.url, error.response && error.response.data)
					reject('Server error, try again later')
				})
		})
	}
	
	get(route, data, options) {
		return this.call({
			url: this.defaultOptions.baseUrl + route,
			withCredentials: true,
			data,
			...options
		})
	}
	
	post(route, data, options) {
		return this.call({
			method: 'post',
			url: this.defaultOptions.baseUrl + route,
			withCredentials: true,
			data,
			...options
		})
	}
}

const api = new API()

export const apiReduxMiddleware = store => next => action => {
	if (action.type === USER_FETCH_TOKEN_SUCCESS) {
		api.setKey('accessToken', action.payload.access_token)
	}
	
	console.log(action.type, api._keys)
	
	next(action)
}

export default api