import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../server/server.js'

chai.use(chaiHttp)
chai.should()

describe('express request', function() {
	it('loads the landing page', function() {
		chai.request(app)
			.get('/')
			.end((error, res) => {
				res.should.have.status(200)
			})
	})
})