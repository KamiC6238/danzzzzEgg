export default {
  // 当退出登录的时候，所有数据重置
  reset(state) {
    state.isLog =  false             // 登录状态
    state.points =  []                 // 当前沸点列表
    state.point_id =  ''               // 当前沸点id
    state.articles =  []               // 文章列表
    state.article_id =  ''             // 当前文章id
    state.point_index =  0              // 当前沸点下标
    state.reply_flag =  true            // 对同一沸点多次发评论时 由于point_id不变 因此store无法监听到变化，进而评论后无法重新请求数据
                                // 所以使用reply_flag作为中间变量来不断的在true跟false之间切换来达到变化的效果
    state.reply_article_flag =  true   // 同上                              
    state.focus_num =  0               // 关注者
    state.follow_num =  0               // 被关注者
    state.focusList =  []               // 关注列表
    state.followList =  []              // 被关注列表
    state.likes_total =  0              // 点赞总数(个人信息页)
    state.allTags =  []                 // 所有标签
    state.focusedTags =  []             // 已关注的标签
    state.notifications =  []           // 通知列表
    state.curArticle =  {}              // 当前文章页面
    state.curSearchValue =  ''          // 当前的搜索词
  },
  setLogStatus(state, status) {
    state.isLog = status
  },
  // 保存沸点id
  setPointId(state, pointId) {
    state.point_id = ''
    state.point_id = pointId
  },
  // 保存沸点所在沸点列表的下标
  setPointIndex(state, index) {
    state.point_index = 0
    state.point_index = index
  },
  // 保存沸点列表
  setPoints(state, points) {
    state.points = points
  },
  setArticles(state, articles) {
    state.articles = articles
  },
  // 通过修改reply_flag，触发store的变化，请求评论后的最新数据
  setReplyFlag(state) {
    state.reply_flag = !state.reply_flag
  },
  // 设置文章id
  setArticleId(state, id) {
    state.article_id = id
  },
  setReplyArticleFlag(state) {
    state.reply_article_flag = !state.reply_article_flag
  },
  // 设置关注数量
  setFocusNum(state, num) {
    state.focus_num = num
  },
  // 关注数量减1
  downFocusNum(state) {
    if(state.focus_num > 0) {
      state.focus_num -= 1
    }
  },
  // 关注数量加1
  upFocusNum(state) {
    state.focus_num += 1
  },
  // 设置被关注数量
  setFollowNums(state, num) {
    state.follow_num = num
  },
  // 关注数量减1
  downFollowNums(state) {
    if(state.follow_num > 0) {
      state.follow_num -= 1
    }
  },
  // 关注数量加1
  upFollowNums(state) {
    state.follow_num += 1
  },
  // 设置关注列表
  setFocusList(state, list) {
    state.focusList = list
  },
  // 设置被关注列表
  setFollowList(state, list) {
    state.followList = list
  },
  // 将关注者push进关注列表
  addNewFocuser(state, user) {
    state.focusList.push(user)
  },
  // 将关注者从关注列表移除
  removeFocuser(state, index) {
    state.focusList.splice(index, 1)
  },
  // 减少文章点赞数
  downArticleLikes(state, index) {
    if(state.articles[index].support > 0) {
      state.articles[index].support -= 1
    }
  },
  // 增加文章点赞数
  upArticleLikes(state, index) {
    state.articles[index].support += 1
  },
  // 设置点赞总数
  setLikesTotal(state, num) {
    state.likes_total = num
  },
  // 减少点赞总数
  downLikesTotal(state) {
    state.likes_total -= 1
  },
  // 增加点赞总数
  upLikesTotal(state) {
    state.likes_total += 1
  },
  // 设置所有标签数组
  setAllTags(state, tags) {
    state.allTags = tags
  },
  // 设置已关注的标签数组
  setFocusedTags(state, tags) {
    state.focusedTags = tags
  },
  // 取消标签关注
  cancelFocusedTags(state, index) {
    state.focusedTags[index].isFocus = false
  },
  cancelAllTags(state, index) {
    state.allTags[index].isFocus = false
  },
  coverFocusedTags(state, index) {
    state.focusedTags[index].isFocus = true
  },
  coverAllTags(state, index) {
    state.allTags[index].isFocus = true
  },
  // 新增关注标签
  appendFocusedTags(state, tag) {
    state.focusedTags.push(tag)
  },
  setNotificationList(state, list) {
    state.notifications = list
  },
  // 将某条通知消息设置为已读状态
  setIsRead(state, index) {
    state.notifications[index].is_read = 1
  },
  setCurArticle(state, article) {
    state.curArticle = article
  },
  cancelCurArticle(state) {
    state.curArticle = {}
  },
  setCurSearchValue(state, value) {
    state.curSearchValue = value
  }
}