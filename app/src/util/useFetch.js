import { useEffect, useState } from 'react';

export default useAPI = promise => {
	const [data, setData] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	
	useEffect(() => {
		(
			async () => {
				try {
					setLoading(true)
					
					const _data = await promise()
					
					setData(_data)
				} catch(error) {
					setError(error)
				} finally {
					setLoading(false)
				}
			}
		)()
	}, [url])
	
	return { data, error, loading }
}