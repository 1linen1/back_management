import axios from "axios"
import { getToken } from "./auth.js"

const service = axios.create({
  baseURL: 'http://127.0.0.1:8888/api'
})

// 请求拦截器
service.interceptors.request.use(config => {
  config.headers['Authorization'] = getToken()
  return config
})

// 响应拦截器
service.interceptors.response.use(res => {
  if (res.data.code === 200) {
    return Promise.resolve(res.data)
  } else {
    return Promise.reject(res.data)
  }
}, error => {
  return Promise.reject(error)
})

export default service