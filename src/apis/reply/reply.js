import request from '@/utils/request'

// 回复沸点
export function replyPoint(data) {
  return request({
    url: '/apis/reply/replyPoint',
    method: 'post',
    data
  })
}

// 回复文章
export function replyArticle(data) {
  return request({
    url: '/apis/reply/replyArticle',
    method: 'post',
    data
  })
}

export function getAllReply(params) {
  return request({
    url: '/apis/reply/getAllReply',
    method: 'get',
    params
  })
}

// 回复评论
export function replyComment(data) {
  return request({
    url: '/apis/reply/replyComment',
    method: 'post',
    data
  })
}