import axios from "./request.js"

// 获取评论信息
export function getCommentById(commentId) {
  return axios({
    url: '/comment/getCommentById/' + commentId,
    method: 'GET',
  })
}

// 查询帖子评论
export function qryPostCommentPage(data) {
  return axios({
    url: '/comment/qryPostCommentPage',
    method: 'POST',
    data
  })
}