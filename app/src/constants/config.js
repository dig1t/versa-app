/* eslint-disable no-undef */

export default {
	domain: `typeof window !== 'undefined' ? window?.location?.hostname : 'localhost':8080`,
	apiDomain: `${typeof window !== 'undefined' ? window?.location?.hostname : 'localhost'}:8888`
}