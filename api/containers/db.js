
import mongoose from 'mongoose'

import config from '../../config'

const db = mongoose.connection

mongoose.set('strictQuery', false)
mongoose.Promise = global.Promise

db.on('error', console.error.bind(console, 'MongoDB Error:'))

export default {
	instance: db,
	connect: () => mongoose.connect(config.appDB, { useNewUrlParser: true })
}