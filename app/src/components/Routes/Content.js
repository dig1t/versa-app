import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { format, formatDistanceToNowStrict } from 'date-fns'

import api from '../../util/api.js'
import { binarySearch } from '../../util/index.js'
import Layout from '../Layout.js'
import Loading from '../Loading.js'
import { addContentStat, getContent } from '../../actions/content.js'
import Avatar from '../../features/User/components/Avatar.js'
import { VerifiedBadge } from '../../features/User/components/VerifiedBadge.js'
import CommentEditor from '../../containers/CommentEditor.js'
import ContentActions from '../../containers/ContentActions.js'
import { useAuthenticated } from '../../context/Auth.js'
import ContentMedia from '../../containers/ContentMedia.js'
import LinkInjector from '../../containers/LinkInjector.js'
import Comment from '../../containers/Comment.js'
import { Icon, Tooltip } from '../UI/index.js'

const Content = () => {
	const dispatch = useDispatch()
	const { profileList, contentList, invalidContentIds } = useSelector((state) => ({
		profileList: state.profiles.profileList,
		contentList: state.content.contentList,
		invalidContentIds: state.content.invalidContentIds
	}))
	
	const { loggedIn } = useAuthenticated()
	const { contentId } = useParams()
	const [contentData, setContentData] = useState(null)
	const [comments, setComments] = useState([])
	const [userId, setUserId] = useState(null)
	const [redirect, setRedirect] = useState(null)
	const [fetching, setFetching] = useState(false)
	const [canComment, setCanComment] = useState(false)
	
	const {
		data: commentData,
		error: commentError,
		loading: commentsLoading
	} = api.get(`/v1/content/${contentId}/comments`, null, { useHook: true })
	
	useEffect(
		() => setCanComment(
			loggedIn === true && contentData !== null && !contentData.disabledComments
		),
		[loggedIn, contentData]
	)
	
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
	}, [contentList, invalidContentIds])
	
	const profile = contentData !== null ? profileList[userId] : {}
	const { timeAgoCreated, dateCreated } = useMemo(() => {
		if (contentData === null) return {}
		
		const dateInstance = new Date(contentData.created)
		
		return {
			timeAgoCreated: formatDistanceToNowStrict(
				dateInstance,
				{ addSuffix: true, includeSeconds: true }
			),
			dateCreated: format(
				dateInstance,
				'PPpp'
			)
		}
	}, [contentData])
	
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
									<span className="time">
										<Tooltip text={dateCreated}>{timeAgoCreated}</Tooltip>
									</span>
									<div className="options"><Icon name="ellipsis" /></div>
								</div>
								<div className="content">
									<div className="text">
										<LinkInjector text={contentData?.body} />
									</div>
									{contentData.media && <ContentMedia {...contentData.media} />}
								</div>
								<ContentActions data={contentData} noRedirect={true} />
							</div>
						</div>
					</div>
					{canComment && <CommentEditor
						contentId={contentId}
						handleSuccess={(comment) => {
							dispatch(addContentStat(comment.contentId, 'comments', 1))
							setComments((state) => [comment, ...state])
						}}
					/>}
					<div className="comments">
						{commentsLoading && <Loading />}
						{commentError && <div>{commentError}</div>}
						{comments.map((comment) => <Comment key={comment.commentId} data={comment} />)}
					</div>
				</div>
			</div>
		</div>}
	</Layout>
}

export default Content