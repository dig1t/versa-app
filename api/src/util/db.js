/* eslint-disable no-undef */
import mongoose from 'mongoose'

import config from '../../config.js'

const db = mongoose.connection.useDb(config.appDatabaseName)

mongoose.set('strictQuery', false)
mongoose.Promise = global.Promise

db.on('error', console.error.bind(console, 'MongoDB Error:'))

export default {
	instance: db,
	connect: (uri) => mongoose.connect(uri || config.appDatabaseURI, {
		useNewUrlParser: true,
		dbName: config.appDatabaseName
	}),
	disconnect: () => db.close()
}