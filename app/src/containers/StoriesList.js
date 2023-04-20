import React from 'react'

import Avatar from './Avatar.js'
import { defaultAssets } from '../constants/assets.js'

const storiesData = [ // TODO: REPLACE PSUEDO DATA
	{
		userId: 'b1c7a98f3a7f59b9d145de5c',
		relationshipLevel: 2,
		avatar: defaultAssets.avatar
	},
	{
		userId: 'b1c7a98f3a7f59b9d145de5c',
		relationshipLevel: 1,
		avatar: defaultAssets.avatar
	},
	{
		userId: 'b1c7a98f3a7f59b9d145de5c',
		relationshipLevel: 1,
		avatar: defaultAssets.avatar
	},
	{
		userId: 'b1c7a98f3a7f59b9d145de5c',
		relationshipLevel: 1,
		avatar: defaultAssets.avatar
	},
	{
		userId: 'b1c7a98f3a7f59b9d145de5c',
		relationshipLevel: 1,
		avatar: defaultAssets.avatar
	}
]

const StoriesList = () => {
	return <div className="box stories">
		<ul>
			{storiesData.map((story) => {
				return <li className="story" key={Math.random().toString()}>
					<Avatar avatar={story.avatar} />
				</li>
			})}
		</ul>
	</div>
}

export default StoriesList