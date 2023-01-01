import React, { useState } from 'react'

export default ({ children, assets }) => {
	const [SEO, setSEO] = useState({
		lang: 'en',
		title: 'Versa',
		description: 'social media network'
	})
	
	return (
		<html lang={ SEO.lang }>
			<head>
				<title>{ SEO.title }</title>
				
				<meta charSet="utf-8" />
				<meta name="monsterile-web-app-capable" content="yes" />
				<meta name="viewport" content="width=device-width, minimum-scale=1.0" />
				<meta name="theme-color" content="#9e15cc" />
				
				<link rel="manifest" href="/manifest.json" />
				
				<link rel="icon" type="image/png" href="/assets/i/icon@16x16.png" sizes="16x16" />
				<link rel="icon" type="image/png" href="/assets/i/icon@32x32.png" sizes="32x32" />
				<link rel="icon" type="image/png" href="/assets/i/icon@96x96.png" sizes="96x96" />
				
				<link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="true" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
				<link rel="preconnect" href="https://use.fontawesome.com" crossOrigin="true" />
				<link rel="stylesheet" href={ assets.css } />
				<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,600,700,700i,800" />
				<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous" />
				
				{/* SEO data */}
				<meta property="title" content={ SEO.title } />
				<meta property="description" content={ SEO.description } />
				
				<meta property="og:title" content={ SEO.title } />
				<meta property="og:description" content={ SEO.description } />
				
				<meta property="twitter:title" content={ SEO.title } />
				<meta property="twitter:description" content={ SEO.description } />
				<meta property="twitter:card" content="summary" />
				
				<script dangerouslySetInnerHTML={{
					__html: `assetManifest=${JSON.stringify(assets)};`
				}} />
			</head>
			<body>
				{children}
			</body>
		</html>
	)
}