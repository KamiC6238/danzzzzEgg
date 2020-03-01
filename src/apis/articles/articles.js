import request from '@/utils/request'

export function getArticles(params = null) {
  return request({
    url: '/apis/getArticles',
    method: 'get',
    params
  })
}

export function getSingleArticle(params) {
  return request({
    url: '/apis/getSingleArticle',
    method: 'get',
    params
  })
}

export function addArticles(data) {
  return request({
    url: '/apis/addArticles',
    method: 'post',
    data
  })
}

export function delArticle(params) {
  return request({
    url: '/apis/deleteArticle',
    method: 'get',
    params
  })
}

export function likeArticle(data) {
  return request({
    url: '/apis/article/likeArticle',
    method: 'post',
    data
  })
}

export function search(params) {
  return request({
    url: '/apis/article/search',
    method: 'get',
    params
  })
}