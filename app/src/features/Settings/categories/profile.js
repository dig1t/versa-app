import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../../../components/UI.js'
import { SaveActions } from '../components/SettingsPage.js'
import ProfileCard from '../../User/components/ProfileCard.js'

const profileKeys = [
	//'avatar',
	'bio',
	'name',
	//'private',
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
		name: 'name',
		label: 'Name',
		validateFor: 'text',
		minLength: 1,
		maxLength: 20
	},
	{
		name: 'website',
		label: 'Website',
		validateFor: 'url',
		optional: true,
		minLength: 1,
		maxLength: 64
	}
]

const ProfileSettingPage = ({ data, handleSave, config }) => {
	const [inputData, setFormData] = useState({})
	const inputRefs = useRef({})
	
	const [saveReady, setSaveReady] = useState(false)
	const [validInputs, setValidInputs] = useState({})
	
	const setRefValues = (values) => {
		for (const inputName in inputRefs.current) {
			if (values[inputName] && inputRefs.current[inputName]) {
				inputRefs.current[inputName].setValue(values[inputName])
			}
		}
	}
	
	useEffect(() => {
		setRefValues(data.profile)
	}, [data])
	
	useEffect(() => {
		let allInputsValid = true
		
		for (let val in validInputs) {
			if (validInputs[val] !== true) {
				allInputsValid = false
				break
			}
		}
		
		let inputsChanged = false
		
		for (const inputName in inputRefs.current) {
			if (inputsChanged) break
			
			inputsChanged = inputData[inputName] !== data.profile[inputName]
		}
		
		setSaveReady(allInputsValid && inputsChanged)
	}, [validInputs, inputData, data])
	
	return <div className="profile-settings">
		<ProfileCard profile={{
			...data.profile,
			...inputData
		}} />
		{inputs.map((input) => <Input
			{...input}
			key={input.name}
			ref={(ref) => {
				inputRefs.current[input.name] = ref
			}}
			showStatusColors={false}
			handleValueChange={(value) => setFormData((prevState) => ({
				...prevState,
				// Update form data as the user is making changes
				[input.name]: value
			}))}
			handleValidity={(value) => setValidInputs((prevState) => ({
				...prevState,
				[input.name]: value
			}))}
		/>)}
		<SaveActions
			ready={saveReady}
			handleSave={() => {
				let inputDataDraft = {}
				
				for (const inputName in inputData) {
					if (inputData[inputName] === data.profile[inputName]) continue
					
					inputDataDraft['profile_' + inputName] = inputData[inputName]
				}
				
				handleSave({
					inputData: inputDataDraft,
					settingConfig: config
				})
			}}
			handleCancel={() => setRefValues(data.profile)}
		/>
	</div>
}

export default ProfileSettingPage