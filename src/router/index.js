import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Index from '@/views/auth/index'
import Home from '@/views/home/index'
export default new Router({
  routes: [{
    path: '/',
    redirect: '/index'
  }, {
    path: '/index',
    component: Home
  }, {
    path: '/auth/login',
    component: Index
  }]
})