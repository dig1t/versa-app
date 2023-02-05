import { Router } from 'express'
import NodeOAuthServer from 'oauth2-server'

import config from '../../../../config'

import OAuth from '../../models/OAuth'
import oauth2Config from '../../constants/oauth2Config'

//console.log(mongoose.connection.readyState)

const router = Router()

const inject = async app => {
	const provider = await getProvider()
	
	app.
	
	app.use(provider.callback())
}

class oauth {
	constructor() {
		this.provider = new NodeOAuthServer({
			model: OAuth
		})
	}
	
	async authenticate()
	
	async authorize(req, res) {
		const request = new Request(req)
		const response = new Response(res)
		
		return await this.provider.authorize(
			request, response, options
		)
	}
	
	inject() {
		return async (req, res, next) => {
			
			try {
				res.locals.oauth = {
					authorization_code: await this.authorize(req, res)
				}
				
				next()
			} catch(e) {
				next(e)
			}
		}
	}
}

export default oauth