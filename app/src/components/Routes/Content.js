import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { formatDistance } from 'date-fns'

import api from '../../util/api.js'
import { binarySearch } from '../../util/index.js'
import Layout from '../Layout.js'
import Loading from '../Loading.js'
import { getContent } from '../../actions/content.js'
import { Icon } from '../UI/index.js'
import Avatar from '../../containers/Avatar.js'
import { VerifiedBadge } from '../../containers/VerifiedBadge.js'
import CommentEditor from '../../containers/CommentEditor.js'

const feedCategories = [
	{
		label: 'Posts',
		category: 'posts'
	},
	{
		label: 'Photos',
		category: 'photos'
	},
	{
		label: 'Videos',
		category: 'videos'
	}
]

const Content = () => {
	const dispatch = useDispatch()
	const { profileList, contentList, invalidContentIds } = useSelector(state => ({
		profileList: state.profiles.profileList,
		contentList: state.content.contentList,
		invalidContentIds: state.content.invalidContentIds
	}))
	
	const { contentId } = useParams()
	const [contentData, setContentData] = useState(null)
	const [comments, setComments] = useState([])
	const [userId, setUserId] = useState(null)
	const [redirect, setRedirect] = useState(null)
	const [fetching, setFetching] = useState(false)
	
	const {
		data: commentData,
		error: commentError,
		loading: commentsLoading
	} = api.get(`/v1/content/${contentId}/comments`, null, { component: true })
	
	useEffect(() => {
		if (commentData === null) return
		
		setComments(commentData)
	}, [commentData])
	
	useEffect(() => {
		const invalidContentId = binarySearch(invalidContentIds, contentId) > -1
		
		if (invalidContentId) return setRedirect('/error?e=no-content')
		
		if (
			(contentData !== null && contentList[contentId] === contentData) || contentId === null
		) return
		
		if (contentList[contentId]) {
			setContentData(contentList[contentId])
			setUserId(contentList[contentId].userId)
		} else if (!fetching) {
			setFetching(true)
			dispatch(getContent(contentId))
		}
	}, [profileList, invalidContentIds])
	
	const profile = contentData !== null ? profileList[userId] : {}
	
	return <Layout page="content">
		{redirect && <Navigate to={redirect} />}
		{contentData === null ? <Loading /> : <div className="wrap grid-g">
			<div className="col-12 col-desktop-8">
				<div className="box">
					<div className="post">
						<div className="container">
							<div className="post-avatar">
								<Avatar avatar={profile.avatar} />
							</div>
							<div className="main">
								<div className="details">
									<span className="name align-center-wrap">
										<Link
											to={`/@${profile.username}`}
											className="unstyled-link"
										>
											{profile.name}
										</Link>
										<VerifiedBadge verificationLevel={profile.verificationLevel} />
									</span>
									<span className="username"><Link
										to={`/@${profile.username}`}
										className="unstyled-link"
									>
										@{profile.username}
									</Link></span>
									<span>&bull;</span>
									<span className="time">{contentData.created && formatDistance(
										new Date(contentData.created),
										new Date(),
										{ addSuffix: true, includeSeconds: true }
									)}</span>
									<div className="options"><Icon name="ellipsis" /></div>
								</div>
								<div className="content">
									{contentData.body && <div className="text">{contentData.body}</div>}
									{contentData.media && <ContentMedia {...contentData.media} />}
								</div>
								<div className="actions">
									<div className="action likes align-center-wrap">
										<Icon name="heart" />
										<span>{contentData.likes || 0}</span>
									</div>
									<div className="action comments align-center-wrap">
										<Icon name="comment" />
										<span>{contentData.comments || 0}</span>
									</div>
									<div className="action likes align-center-wrap">
										<Icon name="repost" />
										<span>{contentData.reposts || 0}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<CommentEditor
						contentId={contentId}
						handleSuccess={comment => {
							setComments(comments.unshift(comment))
						}}
					/>
					<div className="comments">
						{commentsLoading && <Loading />}
						{comments.map(comment => {
							return <div className="comment">
								<div className="time">{comment.created}</div>
								<div className="body">{comment.body}</div>
							</div>
						})}
					</div>
				</div>
			</div>
		</div>}
	</Layout>
}

export default Content