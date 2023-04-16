import validateText from './validateText.js'
import { mongoValidate, mongoSanitize, mongoSession } from './mongoHelpers.js'

const version = '1.0.0'

const Util = function() {
	this.version = version
}

const util = new Util()

util.validateText = validateText

export {
	validateText,
	mongoValidate,
	mongoSanitize,
	mongoSession
}

export default util