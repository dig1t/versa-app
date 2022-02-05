import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../server'

chai.use(chaiHttp)
chai.should()

describe('express request', () => {
	it('loads the landing page', () => {
		chai.request(app)
			.get('/')
			.end((err, res) => {
				res.should.have.status(200)
			})
	})
})