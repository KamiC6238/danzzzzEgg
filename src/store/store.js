import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  points: [],                 // 当前沸点列表
  point_id: '',               // 当前沸点id
  articles: [],               // 文章列表
  article_id: '',             // 当前文章id
  point_index: 0,              // 当前沸点下标
  reply_flag: true,            // 对同一沸点多次发评论时, 由于point_id不变, 因此store无法监听到变化，进而评论后无法重新请求数据
                              // 所以使用reply_flag作为中间变量来不断的在true跟false之间切换来达到变化的效果
  reply_article_flag: true,   // 同上                              
  focus_num: 0,               // 关注者
  follow_num: 0,               // 被关注者
  focusList: [],               // 关注列表
  followList: [],              // 被关注列表
  likes_total: 0,              // 点赞总数(个人信息页)
  allTags: [],                 // 所有标签
  focusedTags: [],             // 已关注的标签
  notifications: [],           // 通知列表
  curArticle: {},              // 当前文章页面
}

export default new Vuex.Store({
  state,
  mutations
})