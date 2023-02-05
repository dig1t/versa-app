import { Router } from 'express'

import config from '../../../../config'

import oauth2Adapter from './oauth2Adapter'
import oauth2Config from '../../constants/oauth2Config'

//console.log(mongoose.connection.readyState)

const router = Router()

const getProvider = async () => {
	const Provider = await import('oidc-provider')
	const issuer = `${config.apiDomain}:${config.apiPort}`
	
	return new Provider.default(issuer, {
		adapter: oauth2Adapter,
		...oauth2Config
	})
}

const inject = async app => {
	const provider = await getProvider()
	
	
	
	app.use(provider.callback())
}

export default {
	getRouter: router,
	inject
}