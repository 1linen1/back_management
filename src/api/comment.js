import axios from "./request.js"

// 获取评论信息
export function getCommentById(commentId) {
  return axios({
    url: '/comment/getCommentById/' + commentId,
    method: 'GET',
  })
}