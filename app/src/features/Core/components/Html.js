import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

export default ({ children }) => {
	// const [SEO, setSEO] = useState({
	// 	lang: 'en',
	// 	title: 'Versa',
	// 	description: 'social media network' 
	// })
	const SEO = {
		lang: 'en',
		title: 'Versa',
		description: 'social media network'
	}
	
	return <HelmetProvider>
		<Helmet>
			<meta charSet="utf-8" />
			<meta name="monsterile-web-app-capable" content="yes" />
			<meta name="viewport" content="width=device-width, minimum-scale=1.0" />
			<meta name="theme-color" content="#9e15cc" />
			<link rel="manifest" href="/manifest.json" />
			
			<title>{SEO.title}</title>
			<link rel="icon" type="image/png" href="/assets/i/icon@16x16.png" sizes="16x16" />
			<link rel="icon" type="image/png" href="/assets/i/icon@32x32.png" sizes="32x32" />
			
			<link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="true" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
			
			<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400;1,700;1,900&display=swap" />
			
			<meta property="title" content={ SEO.title } />
			<meta property="description" content={ SEO.description } />
			
			<meta property="og:title" content={ SEO.title } />
			<meta property="og:description" content={ SEO.description } />
			
			<meta property="twitter:title" content={ SEO.title } />
			<meta property="twitter:description" content={ SEO.description } />
			<meta property="twitter:card" content="summary" />
		</Helmet>
		
		{children}
	</HelmetProvider>
}