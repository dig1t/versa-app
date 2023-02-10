import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import express from 'express'

import { apiMiddleware } from '../src/util/index.js'

const server = express()

server.use(express.json())
server.use(apiMiddleware())

server.get('/ping', (req, res) => {
	if (!res.getFields([ 'userId' ], true)) return
	
	req.apiResult(200, req.fields)
})

chai.use(chaiHttp)

describe('api middleware', () => {
	it('finds required fields', async () => {
		const MOCK_USERID = 'fd9256899cf76129713f1e70'
		
		const request = await chai.request(server)
			.get('/ping')
			.send({
				data: {
					userId: MOCK_USERID
				}
			})
		
		assert.equal(request.status, 200)
		assert.equal(request.body.success, true)
		assert.equal(request.body.data.userId, MOCK_USERID)
	})
})