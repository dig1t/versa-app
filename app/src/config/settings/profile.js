import React, { useEffect, useState } from 'react'
import { Input } from '../../components/UI/index.js'
import { SaveActions } from '../../containers/SettingsPage.js'

const profileKeys = [
	'avatar',
	'bio',
	'name',
	'private',
	'website'
]

const inputs = [
	{
		type: 'textarea',
		name: 'bio',
		label: 'Bio',
		placeholder: 'Write something interesting...',
		validateFor: 'textarea',
		optional: true,
		maxLength: 60
	},
	{
		type: 'text',
		name: 'name',
		label: 'Name',
		validateFor: 'text',
		maxLength: 20
	},
	{
		type: 'text',
		name: 'website',
		label: 'Website',
		validateFor: 'url',
		optional: true,
		maxLength: 64
	}
]

export default ({ data, handleSave }) => {
	const [initialData, setInitialData] = useState({ ...data.profile })
	
	const [formData, setFormData] = useState({})
	
	const [saveReady, setSaveReady] = useState(false)
	const [validInputs, setValidInputs] = useState({})
	
	useEffect(() => {
		let allInputsValid = true
		
		for (let val in validInputs) {
			if (validInputs[val] !== true) {
				allInputsValid = false
				break
			}
		}
		
		setSaveReady(allInputsValid)
	}, [validInputs])
	
	useEffect(() => {
		setFormData(() => profileKeys.reduce((result, key) => {
			return {
				...result,
				[key]: data.profile[key]
			}
		}, {}))
		setValidInputs(() => profileKeys.reduce((result, key) => {
			return {
				...result,
				[key]: false
			}
		}, {}))
	}, [data.profile])
	
	return <div>
		{inputs.map(input => <Input
			{...input}
			key={input.name}
			value={formData[input.name]}
			showStatusColors={false}
			handleValueChange={value => {
				setFormData(prev => ({
					...prev,
					// Update form data as the user is making changes
					[input.name]: value
				}))
			}}
			handleValidity={value => setValidInputs({
				...validInputs,
				[input.name]: value
			})}
		/>)}
		<SaveActions
			ready={saveReady}
			handleSave={handleSave}
			handleCancel={() => {
				//toggleAccordion()
				setInputData({ [config.name]: data[config.name] })
			}}
		/>
	</div>
}