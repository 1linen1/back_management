import axios from "./request.js"

// 分页获取所有举报信息
export function qryAllWarning(data) {
  return axios({
    url: '/warning/qryAllWarning',
    method: 'POST',
    data
  })
}

// 处理举报信息
export function handleWarningMethod(data) {
  return axios({
    url: '/warning/handleWarning',
    method: 'POST',
    data
  })
}

// 更新状态
export function updateWarning(data) {
  return axios({
    url: '/warning/updateWarning',
    method: 'POST',
    data
  })
}

// 处理积分
export function handleAppeal(data) {
  return axios({
    url: '/warning/handleAppeal',
    method: 'POST',
    data
  })
}