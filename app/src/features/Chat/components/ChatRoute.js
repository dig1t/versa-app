import React from 'react'

import Layout from '../../Core/components/Layout.js'
import useProfile from '../../User/hooks/useProfile.js'

const ChatRoute = () => {
	const profile = useProfile(true)
	
	return <Layout page="content">
		<div className="wrap grid-g">
			<div className="col-12 col-desktop-8">
				<div className="box">
					
				</div>
			</div>
		</div>
	</Layout>
}

export default ChatRoute