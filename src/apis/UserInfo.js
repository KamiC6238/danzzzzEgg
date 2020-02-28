import request from '@/utils/request'

export function getUserInfo(data) {
  return request({
    url: '/apis/getUserInfo',
    method: 'get',
    params: data
  })
}

export function uploadAvatar(data) {
  return request({
    url: '/apis/uploadAvatar',
    method: 'post',
    data
  })
}

// 新增或编辑文章用的图片上传, 或者文章封面
export function upload(data) {
  return request({
    url: '/apis/upload',
    method: 'post',
    data
  })
}

export function editUserInfo(data) {
  return request({
    url: '/apis/editUserInfo',
    method: 'post',
    data
  })
}