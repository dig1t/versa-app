import cluster from 'node:cluster'
import { availableParallelism } from 'node:os'

const USE_CLUSTERS = false

const useClusters = (callback) => {
	if (cluster.isPrimary || !USE_CLUSTERS) {
		return callback()
	}
	
	console.log(`primary ${process.pid} is running`)
	
	const availableCPUs = availableParallelism()
	
	for (let i = 0; i < availableCPUs; i++) {
		cluster.fork()
	}
	
	cluster.on('exit', (worker, code) => {
		console.log(`worker ${worker.process.pid} died with code ${code}`)
	})
}

export default useClusters