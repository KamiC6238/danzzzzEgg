import request from '@/utils/request'


export function createNotification(data) {
  return request({
    url: '/apis/notification',
    method: 'post',
    data
  })
}

export function getNotification(params) {
  return request({
    url: '/apis/notification/getNotification',
    method: 'get',
    params
  })
}

export function isRead(data) {
  return request({
    url: '/apis/notification/isRead',
    method: 'post',
    data
  })
}