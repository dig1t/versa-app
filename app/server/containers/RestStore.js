import axios from 'axios'
import { Store } from 'express-session'

class RestStore extends Store {
  constructor(endpoint = '127.0.0.1') {
    super()
    
    this.endpoint = endpoint
  }
  
  get(sessionId, callback) {
    axios.get(`${this.endpoint}/${sessionId}`)
      .then(({ data }) => callback(null, data))
      .catch((error) => {
        if (typeof error.response !== 'undefined' && error.response.status === 404) {
            return callback(null, null)
        }
        
        callback(error)
      })
  }
  
  set(sessionId, data, callback) {
    axios.post(`${this.endpoint}/${sessionId}`, data)
      .then(() => callback())
      .catch(callback)
  }
  
  destroy(sessionId, callback) {
    axios.delete(`${this.endpoint}/${sessionId}`)
      .then(() => callback())
      .catch(callback)
  }
  
  clear(callback) {
    axios.delete(this.endpoint)
      .then(() => callback())
      .catch(callback)
  }
  
  all(callback) {
    axios.get(this.endpoint)
      .then(({ data }) => callback(null, data))
      .catch(callback)
  }
  
  touch(sessionId, data, callback) {
    axios.post(`${this.endpoint}/${sessionId}?ping`, data)
      .then(() => callback())
      .catch(callback)
  }
}

export default RestStore