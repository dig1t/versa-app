const shareUrl = async (shareData) => {
	if (typeof shareData !== 'object') {
		throw new Error('useShare - shareData must be an object')
	} else if (!shareData.text) {
		throw new Error('useShare - shareData must include a text property')
	} else if (!shareData.url) {
		throw new Error('useShare - shareData must include a url property')
	}
	
	// eslint-disable-next-line no-undef
	await navigator.share({
		title: shareData.title || 'Share Post',
		text: shareData.text,
		url: shareData.url
	})
}

export const useShare = () => {
	return shareUrl
}