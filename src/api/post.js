import axios from "./request.js"

// 分页获取所有帖子信息
export function getAllPost(data) {
  return axios({
    url: '/post/getAllPost',
    method: 'POST',
    data
  })
}

// 更新帖子状态
export function updatePost(data) {
  return axios({
    url: '/post/updatePost',
    method: 'POST',
    data
  })
}

// 获取帖子信息
export function getPostById(postId) {
  return axios({
    url: '/post/getPostById/' + postId,
    method: 'GET'
  })
}

// 查询帖子有效积分
export function qryValidScores(postId) {
  return axios({
    url: '/post/qryValidScores/' + postId,
    method: 'GET'
  })
}

