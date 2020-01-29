import request from '@/utils/request'

export function getArticles(query = null) {
  return request({
    url: '/apis/articles',
    method: 'get',
    params: query
  })
}