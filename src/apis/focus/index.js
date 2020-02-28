import request from '@/utils/request'

// 关注
export function focusUser(data) {
  return request({
    url: '/apis/user/focus',
    method: 'post',
    data
  })
}

// 获取关注者
export function getFocus(params) {
  return request({
    url: '/apis/user/focusAndFollowers',
    method: 'get',
    params
  })
}

// 获取被关注者
export function getFollowers(data) {
  return request({
    url: '/apis/user/focus',
    method: 'post',
    data
  })
}

// 确定一个用户是否关注了另一个用户
export function isUserFocus(data) {
  return request({
    url: '/apis/user/focus/isUserFocus',
    method: 'post',
    data
  })
}

// 关注标签
export function focusTag(data) {
  return request({
    url: '/apis/user/focus/focusTag',
    method: 'post',
    data
  })
}

// 获取所有标签
export function getAllTags(params) {
  return request({
    url: '/apis/user/focus/allTags',
    method: 'get',
    params
  })
}