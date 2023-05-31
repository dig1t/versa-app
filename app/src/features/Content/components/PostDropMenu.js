import React from 'react'
import { useDispatch } from 'react-redux'

import DropMenu from '../../../components/DropMenu.js'
import useClipboard from '../../Core/hooks/useClipboard.js'
import { useShare } from '../../Core/hooks/useShare.js'
import { deleteFeedPost } from '../store/actions/feedActions.js'
import { useAuthenticated } from '../../Auth/context/Auth.js'
import { deleteContent } from '../store/actions/contentActions.js'

const PostDropMenu = ({ contentProfile, content, postId, contentId }) => {
	const { userId } = useAuthenticated()
	const dispatch = useDispatch()
	const shareUrl = useShare()
	const { clipboardCopy } = useClipboard()
	
	// eslint-disable-next-line no-undef
	const postUrl = `${window.location.origin}/@${contentProfile.username}/${content.contentId}`
	const postType = postId !== undefined ? 'Post' : 'Content'
	
	return (<DropMenu.ItemMenu>
		<DropMenu.Item onClick={() => {
			clipboardCopy(postUrl)
			
			// TODO: show toast "Copied link to clipboard"
		}}>Copy Link</DropMenu.Item>
		<DropMenu.Item onClick={async () => {
			try {
				// eslint-disable-next-line no-undef
				await shareUrl({
					title: `${postType} by ${contentProfile.displayName}`,
					text: content.text,
					url: postUrl
				})
				
				// TODO: show toast "Post shared"
			} catch (err) {
				console.error(err)
				// TODO: show toast "Failed to share post"
			}
		}}>Share</DropMenu.Item>
		<DropMenu.Item onClick={() => {
			// TODO: Show report modal, then when finished show toast "Post reported"
		}}>Report</DropMenu.Item>
		{content.userId === userId && (<>
			<DropMenu.Divider />
			{/*<DropMenu.Item caution onClick={() => console.log('clicked')}>
				{content.private ? `Unprivate ${postType}` : `Private ${postType}`}
			</DropMenu.Item>*/}
			<DropMenu.Item caution onClick={() => {
				if (postId !== undefined) {
					dispatch(deleteFeedPost(postId))
				} else if (contentId !== undefined) {
					dispatch(deleteContent(contentId))
				}
			}}>
				{`Delete ${postType}`}
			</DropMenu.Item>
		</>)}
	</DropMenu.ItemMenu>)
}

export default PostDropMenu