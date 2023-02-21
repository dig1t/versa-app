const domain = typeof window !== 'undefined' ? window?.location?.host : 'localhost'

export default {
	domain: typeof window !== 'undefined' ? window?.location?.host : 'localhost',
	apiDomain: `${typeof window !== 'undefined' ? window?.location?.host : 'localhost'}:81`
}