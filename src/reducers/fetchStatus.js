// ref: https://medium.com/stashaway-engineering/react-redux-tips-better-way-to-handle-loading-flags-in-your-reducers-afda42a804c6

export const fetchStatus = (state = {}, action) => {
	const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(action.type)
	
	// ignore if action.type doesnt match
	if (!matches) return state
	
	const [, actionType, actionState] = matches
	
	return {
		...state,
		[actionType]: actionState === 'REQUEST' // if true then action is still fetching
	}
}

export const fetchErrors = (state = {}, action) => {
	const matches = /(.*)_(REQUEST|FAILURE)/.exec(action.type)
	
	if (!matches) return state
	
	const [, actionType, actionState] = matches
	
	return {
		...state,
		[actionType]: actionState === 'FAILURE' ? action.payload : ''
	}
}