import axios from "./request.js"

// 分页获取所有用户信息
export function getAllUserPage(data) {
  return axios({
    url: '/user/getAllUserPage',
    method: 'POST',
    data
  })
}

// 删除用户
export function updateUser(data) {
  return axios({
    url: '/user/updateUser',
    method: 'POST',
    data
  })
}