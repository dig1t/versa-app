import { Router } from 'express'
import mongoose from 'mongoose'

import useFields from '../util/useFields.js'
import { mongoValidate, mongoSanitize } from '../util/index.js'

import Follower from '../models/Follower.js'

const deserializeFollow = follow => ({
	followId: follow._id.toHexString(),
	userId: follow.userId.toHexString(),
	followerUserId: follow.followerUserId.toHexString(),
	requested: follow.requested,
	created: follow.created
})

const getFollower = async followId => {
	const connection = await Follower.findOne({ _id: mongoSanitize(followId) })
	
	if (!connection) throw new Error('Connection does not exist')
	
	return deserializeFollow(connection)
}

const getConnection = async (userId, requesterUserId) => {
	if (typeof requesterUserId === 'undefined') return false
	
	if (userId === requesterUserId) return true
	
	try {
		const follows = await Follower.findOne({
			userId: mongoSanitize(userId),
			followerUserId: mongoSanitize(requesterUserId)
		})
		
		if (!follows) return false
		
		const followsBack = await Follower.findOne({
			userId: mongoSanitize(requesterUserId),
			followerUserId: mongoSanitize(userId)
		})
		
		return typeof followsBack !== 'undefined'
	} catch(e) {
		console.log(e)
		
		return false
	}
}

const getFollowers = async userId => {
	const connection = await Follower.find({ userId: mongoSanitize(userId) })
	
	if (!connection) throw new Error('Connection does not exist')
	
	return deserializeProfile(connection)
}

const isConnection = async (userId, requesterUserId) => {
	if (typeof requesterUserId === 'undefined') return false
	
	if (userId === requesterUserId) return true
	
	try {
		const follows = await Follower.findOne({
			userId: mongoSanitize(requesterUserId),
			followerUserId: mongoSanitize(userId)
		})
		
		if (!follows) return false
		
		const followsBack = await Follower.findOne({
			userId: mongoSanitize(userId),
			followerUserId: mongoSanitize(requesterUserId)
		})
		
		return typeof followsBack !== 'undefined'
	} catch(e) {
		console.log(e)
		
		return false
	}
}

const getFollowCount = async userId => {
	return 0
}

const createConnection = async (userId, requesterUserId) => {
	if (!userId) throw new Error('Missing userId')
	if (!requesterUserId) throw new Error('Missing requester userId')
	
	if (!mongoValidate(userId, 'id') || !mongoValidate(requesterUserId, 'id')) {
		throw `Invalid userId`
	}
	
	const followId = new mongoose.Types.ObjectId()
	const connection = new Follower({
		followId,
		userId: userId,
		followerUserId: requesterUserId
	})
	
	try {
		await connection.save()
		
		return deserializeFollow(connection)
	} catch(e) {
		throw new Error('Could not create connection')
	}
}

const deleteConnection = async (userId, requesterUserId) => {
	const connection = await getConnection(userId, requesterUserId)
	
	if (!connection) throw new Error('Could not find connection')
	
	try {
		await Follower.deleteOne({ _id: connection._id })
		
		return { deleted: true }
	} catch(e) {
		throw new Error('Could not delete connection')
	}
}

export {
	getFollower,
	getFollowers,
	getFollowCount,
	isConnection,
	createConnection,
	deleteConnection
}

export default () => {
	const router = new Router()
	
	router.get(
		'/connection',
		useFields(),
		async req => {
			try {
				
				
				req.apiResult(200, connection)
			} catch(err) {
				req.apiResult(500, {
					message: err
				})
			}
		}
	)
	
	router.get(
		'/connection/list'
	)
	
	router.get(
		'/connection/new',
		useFields({ fields: ['userId'] }),
		async req => {
			try {
				const posts = await getProfilePosts(req.fields.userId)
				
				req.apiResult(200, posts)
			} catch(err) {
				req.apiResult(500, {
					message: err
				})
			}
		}
	)
	
	return router
}