import {
	getContent,
	getPost,
	createPost,
	deletePost,
	createComment,
	deleteComment,
	getComments,
	createLike,
	removeLike
} from '../services/contentService.js'

export default {
	getContentData: async (req) => {
		try {
			const content = await getContent(req.params.contentId, req._oauth?.user?.userId)
			
			if (!content) throw new Error('Content not found')
			
			req.apiResult(200, content)
		} catch(error) {
			req.apiResult(500, {
				message: error
			})
		}
	},
	
	postCommentData: async (req) => {
		try {
			const post = await createComment({
				userId: req._oauth.user.userId,
				contentId: req.params.contentId,
				body: req.fields.body
			})
			
			req.apiResult(200, post)
		} catch(error) {
			req.apiResult(500, {
				message: error
			})
		}
	},
	
	deleteCommentData: async (req) => {
		try {
			const res = await deleteComment({
				userId: req._oauth.user.userId,
				contentId: req.params.contentId
			})
			
			req.apiResult(200, res)
		} catch(error) {
			req.apiResult(500, {
				message: error
			})
		}
	},
	
	postLike: async (req) => {
		try {
			const like = await createLike({
				userId: req._oauth.user.userId,
				contentId: req.params.contentId
			})
			
			req.apiResult(200, like)
		} catch(error) {
			req.apiResult(500, {
				message: error
			})
		}
	},
	
	deleteLike: async (req) => {
		try {
			const res = await removeLike({
				userId: req._oauth.user.userId,
				contentId: req.params.contentId
			})
			
			req.apiResult(200, res)
		} catch(error) {
			req.apiResult(500, {
				message: error
			})
		}
	},
	
	getCommentsData: async (req) => {
		try {
			const comments = await getComments(req.params.contentId, req._oauth?.user?.userId)
			
			if (!comments) throw new Error('Comments not found')
			
			req.apiResult(200, comments)
		} catch(error) {
			req.apiResult(500, {
				message: error
			})
		}
	},
	
	postNewPost: async (req) => {
		try {
			const post = await createPost(req._oauth.user.userId, req.fields)
			
			req.apiResult(200, post)
		} catch(error) {
			req.apiResult(500, {
				message: error
			})
		}
	},
	
	deletePost: async (req) => {
		try {
			const res = await deletePost({
				userId: req._oauth.user.userId,
				postId: req.params.postId
			})
			
			req.apiResult(200, res)
		} catch(error) {
			req.apiResult(500, {
				message: error
			})
		}
	},
	
	getPostData: async (req) => {
		try {
			const post = await getPost(req.params.postId, req._oauth.user.userId)
			
			if (!post) throw new Error('Post not found')
			
			req.apiResult(200, post)
		} catch(error) {
			req.apiResult(500, {
				message: error
			})
		}
	}
}