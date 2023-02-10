import React from 'react'

import Avatar from './Avatar.js'
import { defaultAssets } from '../constants/assets.js'

const storiesData = [ // TODO: REPLACE PSUEDO DATA
	{
		userId: 't43r5evr44ewtf',
		relationshipLevel: 2,
		avatar: defaultAssets.avatar
	},
	{
		userId: 't43r5evr44ewtf',
		relationshipLevel: 1,
		avatar: defaultAssets.avatar
	},
	{
		userId: 't43r5evr44ewtf',
		relationshipLevel: 1,
		avatar: defaultAssets.avatar
	},
	{
		userId: 't43r5evr44ewtf',
		relationshipLevel: 1,
		avatar: defaultAssets.avatar
	},
	{
		userId: 't43r5evr44ewtf',
		relationshipLevel: 1,
		avatar: defaultAssets.avatar
	}
]

const StoriesList = () => {
	return <div className="box stories">
		<ul>
			{storiesData.map(story => {
				return <li className="story" key={Math.random().toString()}>
					<Avatar img={story.avatar} />
				</li>
			})}
		</ul>
	</div>
}

export default StoriesList