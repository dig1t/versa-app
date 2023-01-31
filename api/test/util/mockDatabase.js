import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer

export default {
	startMockServer: async () => {
		mongoServer = await MongoMemoryServer.create()
	},
	
	getUri: () => mongoServer.getUri(),
	
	stop: async () => {
		await mongoServer.stop()
	},
	
	dropCollections: async connection => {
		const collections = await connection.db.collections()
		
		for (let collection of collections) {
			await collection.deleteMany()
		}
	}
}