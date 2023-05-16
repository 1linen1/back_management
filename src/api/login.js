import axios from "./request.js"

export function login(data) {
  return axios({
    url: '/user/login',
    method: 'POST',
    data
  })
}