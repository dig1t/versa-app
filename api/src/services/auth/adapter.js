import mongoose from 'mongoose'

let DatabaseInstance

const grantable = new Set([
	'access_token',
	'authorization_code',
	'refresh_token',
	'device_code',
	'backchannel_authentication_request',
])

class CollectionSet extends Set {
	addCollection(name) {
		const collectionExists = this.has(name)
		
		// Add to the set
		super.add(name)
		
		if (!collectionExists) {
			const indexes = []
			
			if (grantable.has(name)) indexes.push([{
				key: { 'payload.grantId': 1 },
			}])
			
			if (name === 'device_code') indexes.push([{
				key: { 'payload.userCode': 1 },
				unique: true,
			}])
			
			if (name === 'session') indexes.push([{
				key: { 'payload.uid': 1 },
				unique: true,
			}])
			
			if (indexes.length > 0) {
				DatabaseInstance.collection(name).createIndexes([
					...indexes,
					{
						key: { expiresAt: 1 },
						expireAfterSeconds: 0,
					}
				])
					.then(() => console.log(`created indexes for collection: ${name}`))
					.catch(console.error)
			}
		}
	}
}

const collections = new CollectionSet()

class MongoAdapter {
	constructor(name) {
		this.name = name
		
		DatabaseInstance = mongoose.connection.useDb('oauth', { useCache: true })
		
		// NOTE: you should never be creating indexes at runtime in production, the following is in
		// place just for demonstration purposes of the indexes required
		if (process.env.NODE_ENV === 'development') collections.addCollection(this.name)
	}
	
	// NOTE: the payload for Session model may contain client_id as keys, make sure you do not use
	// dots (".") in your client_id value charset.
	async upsert(_id, payload, expiresIn) {
		let expiresAt
		
		if (expiresIn) {
			expiresAt = new Date(Date.now() + (expiresIn * 1000))
		}
		
		await this.getCollection().updateOne(
			{ _id },
			{ $set: { payload, ...(expiresAt ? { expiresAt } : undefined) } },
			{ upsert: true },
		)
	}
	
	async find(_id) {
		const result = await this.getCollection().find(
			{ _id },
			{ payload: 1 },
		).limit(1).next()
		
		if (!result) return undefined
		return result.payload
	}
	
	async findByUserCode(userCode) {
		const result = await this.getCollection().find(
			{ 'payload.userCode': userCode },
			{ payload: 1 },
		).limit(1).next()

		if (!result) return undefined
		return result.payload
	}
	
	async findByUid(uid) {
		const result = await this.getCollection().find(
			{ 'payload.uid': uid },
			{ payload: 1 },
		).limit(1).next()
		
		if (!result) return undefined
		return result.payload
	}
	
	async destroy(_id) {
		await this.getCollection().deleteOne({ _id })
	}
	
	async revokeByGrantId(grantId) {
		await this.getCollection().deleteMany({ 'payload.grantId': grantId })
	}
	
	async consume(_id) {
		await this.getCollection().findOneAndUpdate(
			{ _id },
			{ $set: { 'payload.consumed': Math.floor(Date.now() / 1000) } },
		)
	}
	
	getCollection(name) {
		return this.constructor.getCollection(name || this.name)
	}
	
	static getCollection(name) {
		return DatabaseInstance.collection(name)
	}
}

export default MongoAdapter