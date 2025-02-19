import config from '../config.js'

export default {
	maxTokenAge: 24 * 60 * 60 * 365 * 1000, // 1 year

	manifest: {
		name: config.appName,
		short_name: config.appName,
		description: config.appDescription,
		start_url: '/',
		display: 'standalone',
		orientation: 'portrait',
		theme_color: config.brandColor,
		background_color: '#ffffff',
		share_target: {
			action: '/share',
			method: 'GET',
			enctype: 'application/x-www-form-urlencoded',
			params: {
				title: 'title',
				text: 'text',
				url: 'url'
			}
		}
	}
}
