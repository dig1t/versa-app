import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer

export default {
	startMockServer: async () => {
		try {
			mongoServer = await MongoMemoryServer.create()
		} catch(error) {
			console.error(error)
		}
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