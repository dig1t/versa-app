import React from 'react'

const LoadingIcon = () => <svg version="1.1" x="0" y="0" viewBox="0 0 64 64">
	<path d="M16,32c0-8.82,7.18-16,16-16s16,7.18,16,16h4c0-11.05-8.95-20-20-20S12,20.95,12,32h4Z">
		<animateTransform
			attributeName="transform"
			attributeType="XML"
			type="rotate"
			dur="1s"
			from="0 32 32"
			to="360 32 32"
			repeatCount="indefinite"
		/>
	</path>
</svg>

export default () => <div className="loading-indicator center-wrap">
	<LoadingIcon />
</div>
