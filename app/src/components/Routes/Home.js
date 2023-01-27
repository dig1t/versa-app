import React from 'react'

import Layout from '../Layout'
import PostEditor from '../../containers/PostEditor'
import StoriesList from '../../containers/StoriesList'
import Feed from '../../containers/Feed'
import { CatPills } from '../UI'

const feedCategories = [
	{
		label: 'All',
		category: 'all'
	},
	{
		label: 'Videos',
		category: 'videos'
	}
]

const Home = () => <Layout page="home">
	<div className="wrap grid-g">
		<div className="col-12 col-desktop-8">
			<div className="main">
				<StoriesList />
				<PostEditor />
				
				<div className="feed">
					<CatPills
						pills={feedCategories}
						default="all"
						handleSelection={type => {
							console.log('selected pill of type:', type)
						}}
					/>
					<div className="box">
						<Feed />
					</div>
				</div>
			</div>
		</div>
		<div className="col-12 col-desktop-4">
			<aside className="box">
				
			</aside>
		</div>
	</div>
</Layout>

export default Home