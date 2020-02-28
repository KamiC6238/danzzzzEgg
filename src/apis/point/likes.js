import request from '@/utils/request'

export function likePoint(data) {
  return request({
    url: '/apis/user/pin/like',
    method: 'post',
    data
  })
}