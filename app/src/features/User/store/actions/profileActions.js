import {
	PROFILE_FETCH_REQUEST,
	PROFILE_FETCH_SUCCESS,
	PROFILE_FETCH_FAILURE,
	PROFILE_FOLLOW_UPDATE,
	PROFILE_CONNECTION_REQUEST,
	PROFILE_CONNECTION_SUCCESS
} from '../reducers/profileReducers.js'

import api from '../../../../util/api.js'

export const addProfile = (data) => (dispatch) => dispatch({
	type: PROFILE_FETCH_SUCCESS,
	payload: data
})

export const getProfile = (userId) => (dispatch, getState) => {
	const { profiles } = getState()

	//if (profiles.requestingUserIds[userId]) return // TODO: IMPLEMENT

	if (profiles.profileList[userId]) return

	dispatch({ type: PROFILE_FETCH_REQUEST })

	api.get(`/v1/profile/${userId}`)
		.then((data) => dispatch({
			type: PROFILE_FETCH_SUCCESS,
			payload: data
		}))
		.catch((error) => dispatch({
			type: PROFILE_FETCH_FAILURE,
			payload: error
		}))
}

export const getProfileFromUsername = (username) => (dispatch, getState) => {
	const { profiles } = getState()

	//if (profiles.requestingUsernames[username]) return // TODO: IMPLEMENT

	if (profiles.idsByUsername[username]) return

	dispatch({ type: PROFILE_FETCH_REQUEST })

	api.get(`/v1/profile/username/${username}`)
		.then((data) => dispatch({
			type: PROFILE_FETCH_SUCCESS,
			payload: data
		}))
		.catch(() => dispatch({
			type: PROFILE_FETCH_FAILURE,
			payload: username
		}))
}

export const getProfileConnection = (userId) => (dispatch, getState) => {
	const { user, profiles } = getState()

	if (user.authenticated !== true) return

	const profile = profiles.profileList[userId]

	if (!profile) return dispatch(getProfile(userId))

	if (profile.fetchingConnection)	return

	if (!profile.connection) {
		dispatch({
			type: PROFILE_CONNECTION_REQUEST,
			payload: { userId }
		})
	}

	api.get('/v1/follow/connection', { userId })
		.then((data) => dispatch({
			type: PROFILE_CONNECTION_SUCCESS,
			payload: data
		}))
		.catch((error) => {
			// TODO: log to telemetry service
			console.error(error)
		})
}

export const followProfile = (userId, newFollow) => (dispatch) => {
	api.post(
		`/v1/follow/${newFollow ? 'new' : 'unfollow'}`,
		{ userId }
	)
		.then((data) => dispatch({
			type: PROFILE_FOLLOW_UPDATE,
			payload: {
				following: data.following,
				userId
			}
		}))
		.catch((error) => {
			console.log('FOLLOW ERR', error)
		})
}
