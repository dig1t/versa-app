import classNames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'

import { defaultAssets } from '../constants/assets'

const ActivityCircle = () => <svg version="1.1" x="0" y="0" viewBox="0 0 50 50">
	<g>
		<path d="M25,1c13.2,0,24,10.8,24,24S38.2,49,25,49S1,38.2,1,25S11.8,1,25,1 M25,0C11.2,0,0,11.2,0,25s11.2,25,25,25s25-11.2,25-25
		S38.8,0,25,0L25,0z"/>
	</g>
</svg>

const Avatar = props => {
	const { img, status, hasStory, username, clickRedirect } = props
	
	const RenderLink = ({ children }) => {
		return clickRedirect && username ? <Link to={`/@${username}`}>
			{ children }
		</Link> : <>{ children }</>
	}
	
	return <div
		className={classNames(
			'avatar', !hasStory && 'has-story'
		)}
	>
		<div className="push" />
		<div className="avatar-wrap">
			<div className="border">
				<RenderLink>
					<div className="img" style={{
						backgroundImage: `url(${img || defaultAssets.avatar})`
					}} />
					{status && <div className={classNames(
						'activity-status', status
					)} />}
					<ActivityCircle />
				</RenderLink>
			</div>
		</div>
	</div>
}

/*

				<div className="avatar">
					<div className="push" />
					<div className="avatar-wrap">
						<div className="img" style={{
							backgroundImage: `url(${defaultAssets.avatar})`
						}} />
						<div className="activity-status online" />
					</div>
				</div>
*/

export default Avatar