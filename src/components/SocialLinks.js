import React from 'react'

const links = [
	{service: 'twitter', url: 'https://twitter.com/dig1t_'},
	{service: 'instagram', url: 'https://instagram.com/dig1t_'}
]

const SocialLinks = () => (
	<ul className="social-media">
		{links.map(link => (
			<li key={link.service}>
				<a className={"fab fa-" + link.service} target="_blank" href={link.url}></a>
			</li>
		))}
	</ul>
)

export default SocialLinks