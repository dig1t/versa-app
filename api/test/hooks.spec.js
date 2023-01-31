import db from '../containers/db'
import mockDatabase from './util/mockDatabase'

export const mochaHooks = {
	beforeAll: async () => {
		await mockDatabase.startMockServer()
		await db.connect(mockDatabase.getUri())
	},
	
	afterAll: async () => {
		await db.disconnect()
		await mockDatabase.stop()
	},
	
	afterEach: async () => await mockDatabase.dropCollections(db.instance)
}