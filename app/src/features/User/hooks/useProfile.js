import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useAuthenticated } from '../../Auth/context/Auth.js'
import { getProfile, getProfileConnection } from '../store/actions/profileActions.js'

const useProfile = (query) => {
	const dispatch = useDispatch()
	const { loggedIn, userId } = useAuthenticated()

	const profileList = useSelector((state) => state.profiles.profileList)

	const [fetching, setFetching] = useState(false)
	const [profile, setProfile] = useState(null)

	const fetchingUserId = typeof query === 'string' ? query : undefined

	useEffect(() => {
		if (profile) return

		const profileFetch = profileList[fetchingUserId || userId]

		if (profileFetch) {
			setProfile(profileFetch)

			// Retrieve all profile data if only a summarized profile was fetched
			if (!profileFetch.connection && profileFetch.userId !== userId && loggedIn) dispatch(
				getProfileConnection(profileFetch.userId)
			)
		} else if (typeof fetchingUserId === 'string' && !fetching) {
			setFetching(true)
			dispatch(getProfile(fetchingUserId))
		}
	}, [fetchingUserId, loggedIn, profileList, fetching])

	return profile
}

export default useProfile
