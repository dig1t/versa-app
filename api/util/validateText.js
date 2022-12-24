const regexMap = new Map([
  ['number', /^[0-9]+$/],
  ['text', /^.+$/],
  ['textarea', /^.+$/gm],
  ['name', /^.+$/], // replace in future?
  ['email', /.+\@.+\..+/],
  ['password', /^[a-zA-Z0-9 ~`!@#$%^&*()_+\-=[\]\\{}|;\':",.\/<>?]+$/],
  ['phone', /^\+?(?:\d ?)\d{6,14}$/],
	['us-phone', /^\+?[01]?[- ]?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/]
])

export default (text, validateFor) => {
  const exp = regexMap.get(validateFor)
  
  return exp ? exp.test(text) : text
}