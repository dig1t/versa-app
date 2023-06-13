import { Router } from 'express'

import serverConfig from '../constants/serverConfig.js'

const assets = {
	bundle: '/assets/client/bundle.js',
	styles: '/assets/client/styles.css'
}

const router = Router()

router.get(
	'/manifest.json',
	(_, res) => res.json(serverConfig.manifest)
)

router.get(
	'/robots.txt',
	(_, res) => res.send('Disallow: *')
)

// React will handle all other routes
router.get(
	/^\/(?!auth).*/,
	async (req, res) => {
		res.write(
`<!DOCTYPE html>
<head>
<link href="${assets.styles}" rel="stylesheet">
</head>
<body>
	<div id="root"></div>
	<script>assetManifest=${JSON.stringify(assets)};</script>
	<script src="${assets.bundle}"></script>
</body>`)
		res.end()
	}
)

export default router