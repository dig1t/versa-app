import db from '../src/util/db.js'
import mockDatabase from './util/mockDatabase.js'

export const mochaHooks = {
	beforeAll: async () => {
		await mockDatabase.startMockServer()
		await db.connect(mockDatabase.getUri())
	},
	
	afterAll: async () => {
		await mockDatabase.dropCollections(db.instance)
		await db.disconnect()
		await mockDatabase.stop()
	}
}