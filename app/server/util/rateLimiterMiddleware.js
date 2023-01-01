import Bottleneck from 'bottleneck'

const rateLimiter = new Bottleneck({
	maxConcurrent: 40,
	minTime: 1000
})

export const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter.submit(next)
}