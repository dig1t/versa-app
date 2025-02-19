import React from 'react'

import Layout from '../../Core/components/Layout.js'
import PostEditor from '../../Content/components/PostEditor.js'
import StoriesList from '../../Content/components/StoriesList.js'
import Feed from '../../Content/components/Feed.js'
import { CatPills } from '../../../components/UI.js'

const feedCategories = [
	{
		label: 'All',
		name: 'all'
	},
	{
		label: 'Videos',
		name: 'videos'
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
						defaultCategory="all"
						handleSelection={(category) => {
							console.log('selected pill of type:', category.name)
						}}
					/>
					<div className="box">
						<Feed type='home' />
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
