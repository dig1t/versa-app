import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useAuthenticated } from '../../../context/Auth.js'
import { getProfile } from '../store/actions/profileActions.js'

const useProfile = (fetchingUserId) => {
	const dispatch = useDispatch()
	const { loggedIn, userId } = useAuthenticated()
	
	const profileList = useSelector((state) => state.profiles.profileList)
	
	const [fetching, setFetching] = useState(false)
	const [profile, setProfile] = useState(null)
	
	useEffect(() => {
		if (profile) return
		
		const profileFetch = profileList[fetchingUserId || userId]
		
		if (profileFetch) {
			setProfile(profileFetch)
		} else if (typeof fetchingUserId === 'string' && !fetching) {
			setFetching(true)
			dispatch(getProfile(fetchingUserId))
		}
	}, [fetchingUserId, loggedIn, profileList, fetching])
	
	return profile
}

export default useProfile