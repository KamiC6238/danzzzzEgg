import request from '@/utils/request'

export function publishPin(data, files) {
  return request({
    url: '/apis/user/publish/pin',
    method: 'post',
    data,
    files
  })
}

export function getAllPin(params) {
  return request({
    url: '/apis/user/getAllPins',
    method: 'get',
    params
  })
}

export function getSinglePoint(params) {
  return request({
    url: '/apis/user/pin/getSinglePoint',
    method: 'get',
    params
  })
}