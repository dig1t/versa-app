import mongoose from 'mongoose'

import config from '../../config.js'

const db = mongoose.connection

mongoose.set('strictQuery', false)
mongoose.Promise = global.Promise

db.on('error', console.error.bind(console, 'MongoDB Error:'))

export default {
	instance: db,
	connect: uri => mongoose.connect(uri || config.appDB, { useNewUrlParser: true }),
	disconnect: () => db.close()
}