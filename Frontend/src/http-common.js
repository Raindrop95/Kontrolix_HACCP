import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:8080/api', //http://{hostip}:{PORT}/api  for development use localhost as hostip

  headers: {
    'Content-type': 'application/json'
  }
})
