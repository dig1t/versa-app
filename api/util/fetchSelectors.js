// return the action state, if undefined then assume fetching has not begun
export const createLoadingSelector = actions => state => actions.some(element => state.fetchStatus[element])

export const createErrorMessageSelector = actions => state => actions.map(action => state.fetchErrors[action]).filter(Boolean)[0]