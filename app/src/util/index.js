import validateText from './validateText.js'
import { binarySearch, binarySearchArrayChild } from './binarySearch.js'

const version = '1.0.1'

const Util = function() {
	this.version = version
}

const util = new Util()

util.validateText = validateText
util.binarySearch = binarySearch
util.binarySearchArrayChild = binarySearchArrayChild

export {
	validateText,
	binarySearch,
	binarySearchArrayChild
}

export default util