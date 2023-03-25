import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'

import config from '../config.js'

const db = mongoose.connection

mongoose.set('strictQuery', false)
mongoose.Promise = global.Promise

db.on('error', console.error.bind(console, 'MongoDB Error:'))

export default {
	instance: db,
	getStore: () => MongoStore.create({
		client: mongoose.connection.getClient()
	}),
	connect: () => mongoose.connect(
		config.appDB,
		{ useNewUrlParser: true }
	)
}