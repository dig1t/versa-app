import { assert } from 'chai'
import { times } from '../../src/util'

describe('times utility', () => {
	it('repeats a function x times', () => {
		let numbers = times(4, i => numbers.push(i))
		
		assert.sameMembers(numbers, [0, 1, 2, 3], 'same numbers')
	})
})