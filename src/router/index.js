import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Index from '@/views/auth/index'                   // 登录注册页面
import Home from '@/views/home/index'                    // 主页(所有文章列表)
import PersonPage from '@/views/auth/PersonPage'         // 我的主页
import EditPersonal from '@/views/auth/EditPersonal'     // 编辑个人信息
import WriteArticle from '@/views/article/write'         // 写文章
import ShowArticle from '@/views/article/show'           // 文章展示
import Point from '@/views/Point/index'                  // 沸点
import TagsManage from '@/views/Tags/index'              // 标签管理
import Notification from '@/views/Notification/index'    // 信息通知
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
  }, {
    path: '/auth/register',
    component: Index
  }, {
    path: '/user/:uid',
    name: 'personPage',
    component: PersonPage
  }, {
    path: '/user/settings/profile',
    component: EditPersonal
  }, {
    path: '/editor/draft/new',
    name: 'writeArticle',
    component: WriteArticle
  }, {
    path: '/post/:article_id',
    name: 'showArticle',
    component: ShowArticle
  }, {
    path: '/pins/topic/:uid',
    name: 'point',
    component: Point
  }, {
    path: '/subscribe/subscribed/:uid',
    name: 'tagsManage',
    component: TagsManage
  }, {
    path: '/notification',
    name: 'notifications',
    component: Notification
  }]
})