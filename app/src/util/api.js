// @version 1.0.0

import { useEffect, useState } from 'react';
import axios from 'axios'

import { USER_FETCH_TOKEN_SUCCESS } from '../features/User/store/reducers/selfReducers.js'

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
		const includeAT = !options.excludeToken && this._keys.accessToken

		const promiseFactory = async (resolve, reject) => {
			try {
				const response = await axios({
					method,
					url: options.url,
					[method === 'get' ? 'params' : 'data']: options.data,
					headers: {
						Accept: '*/*',
						Authorization: includeAT ? `Bearer ${this._keys.accessToken}` : null,
						'Content-Type' : 'application/x-www-form-urlencoded',
						...options.headers
					},
					withCredentials: options.withCredentials,
					signal: options.signal,
					onUploadProgress: options.onUploadProgress,
					...options.options
				})

				let responseData = response?.data

				if (!responseData) {
					console.log(response)
					return reject('Server error, try again later')
				}

				if (typeof responseData === 'string') {
					const jsonArrayString = `[${responseData.replace(/}\s*{/g, '},{')}]`;

					// Parse the JSON array string to an array of objects
					const jsonArray = JSON.parse(jsonArrayString)

					// Get the last object in the array
					responseData = jsonArray[jsonArray.length - 1]
				}

				if (options.customErrorHandler) return resolve(responseData)

				responseData.success ? resolve(responseData.data) : reject(responseData.message)
			} catch(error) { // Axios throws an error if the HTTP Response not 200
				if (error?.code === 'ERR_CANCELED') reject('Request canceled')

				if (options.customErrorHandler) reject(error)

				console.error(options.url, error.response && error.response.data)
				reject(error.response ? error.response.data : 'Server error, try again later')
			}
		}

		return options.useHook === true ? this.createHook(
			promiseFactory
		) : new Promise(promiseFactory)
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

	put(route, data, options) {
		return this.call({
			method: 'put',
			url: this.defaultOptions.baseUrl + route,
			withCredentials: true,
			data,
			...options
		})
	}

	delete(route, data, options) {
		return this.call({
			method: 'delete',
			url: this.defaultOptions.baseUrl + route,
			withCredentials: true,
			data,
			...options
		})
	}

	createHook(promiseFactory) {
		const [data, setData] = useState(null)
		const [error, setError] = useState(null)
		const [loading, setLoading] = useState(false)

		useEffect(() => {
			(
				async () => {
					try {
						setLoading(true)

						const _data = await new Promise(promiseFactory)

						setData(_data)
					} catch(error) {
						setError(error)
					} finally {
						setLoading(false)
					}
				}
			)()
		}, [])

		return { data, error, loading }
	}
}

const api = new API()

export const apiReduxMiddleware = () => (next) => (action) => {
	if (action.type === USER_FETCH_TOKEN_SUCCESS) {
		api.setKey('accessToken', action.payload.access_token)
	}

	next(action)
}

export default api
