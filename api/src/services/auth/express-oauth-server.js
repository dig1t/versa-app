import InvalidArgumentError from 'oauth2-server/lib/errors/invalid-argument-error'
import NodeOAuthServer from 'oauth2-server'
import { bind } from 'bluebird'
import { Request } from 'oauth2-server'
import { Response } from 'oauth2-server'
import UnauthorizedRequestError from 'oauth2-server/lib/errors/unauthorized-request-error'

/**
 * Constructor.
 */

function ExpressOAuthServer(options) {
	options = options || {}

	if (!options.model) {
		throw new InvalidArgumentError('Missing parameter: `model`')
	}

	this.useErrorHandler = options.useErrorHandler ? true : false
	delete options.useErrorHandler

	this.continueMiddleware = options.continueMiddleware ? true : false
	delete options.continueMiddleware

	this.provider = new NodeOAuthServer(options)
}

/**
 * Authentication Middleware.
 *
 * Returns a middleware that will validate a token.
 *
 * (See: https://tools.ietf.org/html/rfc6749#section-7)
 */

ExpressOAuthServer.prototype.authenticate = function(options) {
	var that = this

	return function(req, res, next) {
		var request = new Request(req)
		var response = new Response(res)
		return bind(that)
			.then(function() {
				return this.provider.authenticate(request, response, options)
			})
			.finally(function(token) {
				res.locals.oauth = { token: token }
				next()
			})
			.catch(function(e) {
				return handleError.call(this, e, req, res, null, next)
			})
	}
}

/**
 * Authorization Middleware.
 *
 * Returns a middleware that will authorize a client to request tokens.
 *
 * (See: https://tools.ietf.org/html/rfc6749#section-3.1)
 */

ExpressOAuthServer.prototype.authorize = function(options) {
	var that = this

	return function(req, res, next) {
		var request = new Request(req)
		var response = new Response(res)

		return bind(that)
			.then(function() {
				return this.provider.authorize(request, response, options)
			})
			.finally(function(code) {
				res.locals.oauth = { code: code }
				if (this.continueMiddleware) {
					next()
				}
			})
			.then(function() {
				return handleResponse.call(this, req, res, response)
			})
			.catch(function(e) {
				return handleError.call(this, e, req, res, response, next)
			})
	}
}

/**
 * Grant Middleware.
 *
 * Returns middleware that will grant tokens to valid requests.
 *
 * (See: https://tools.ietf.org/html/rfc6749#section-3.2)
 */

ExpressOAuthServer.prototype.token = function(options) {
	var that = this

	return function(req, res, next) {
		var request = new Request(req)
		var response = new Response(res)

		return bind(that)
			.then(function() {
				return this.provider.token(request, response, options)
			})
			.finally(function(token) {
				res.locals.oauth = { token: token }
				if (this.continueMiddleware) {
					next()
				}
			})
			.then(function() {
				return handleResponse.call(this, req, res, response)
			})
			.catch(function(e) {
				return handleError.call(this, e, req, res, response, next)
			})
	}
}

/**
 * Handle response.
 */
var handleResponse = function(req, res, response) {

	if (response.status === 302) {
		var location = response.headers.location
		delete response.headers.location
		res.set(response.headers)
		res.redirect(location)
	} else {
		res.set(response.headers)
		res.status(response.status).send(response.body)
	}
}

/**
 * Handle error.
 */

var handleError = function(e, req, res, response, next) {

	if (this.useErrorHandler === true) {
		next(e)
	} else {
		if (response) {
			res.set(response.headers)
		}

		res.status(e.code)

		if (e instanceof UnauthorizedRequestError) {
			return res.send()
		}

		res.send({ error: e.name, error_description: e.message })
	}
}

/**
 * Export constructor.
 */

export default ExpressOAuthServer