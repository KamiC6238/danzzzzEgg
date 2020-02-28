import axios from 'axios'
import Vue from 'vue'
import router from '@/router/index'
import { Message } from 'element-ui'

const _this = Vue.prototype
Vue.prototype.message = Message

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 30000, // request timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

service.interceptors.request.use((request) => { // 请求拦截器
  let token = JSON.parse(localStorage.getItem('userInfo')).token
  if (token) {
    // request.headers['Authorization'] = `Bearer ${token}`
  }
  return request
}, err => {
  return Promise.reject(error)
})

service.interceptors.response.use((response) => { // 响应拦截器
  
  return response
}, err => {

  // if (err.response.status === 401) { // 返回401说明token失效了, 需要重新登录
  //   localStorage.removeItem('token')
  //   localStorage.removeItem('uid')
  //   // _this.$message({
  //   //   message: '登录已失效, 请重新登录',
  //   //   type: 'warning'
  //   // })
  //   router.push('/index')
  // }
})

export default service