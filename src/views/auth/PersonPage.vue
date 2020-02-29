<template>
  <div class="personal">
    <div class="container">
      <div class="main-container">
        <div class="introduction">
          <div class="left">
            <img :src="imageUrl === '' ? defaultUrl : imageUrl" alt="">
          </div>
          <div class="middle">
            <div class="username">
              {{userInfo.username}}
            </div>
            <div class="job">
              <span class="position">
                <i class="iconfont icon-tianmaopaidui"></i>
                <span class="post">
                  {{userInfo.post === '' ? '你的职位是什么?' : userInfo.post}}
                </span>
                <span class="split">|</span>
              </span>
              <span class="company">
                {{userInfo.company === '' ? '你曾经历过哪些公司?' : userInfo.company}}
              </span>
            </div>
          </div>
          <div class="right">
            <div v-if="!isRealUser" @click="focusUser">
              <button
                :class="[{'focus-btn': true}, {'is-focus': isUserFocus}]"
                v-if="isUserFocus">
              已关注</button>
              <button class="focus-btn" v-if="!isUserFocus">关注</button>
            </div>
            <button class="btn" @click="editUserInfo" v-if="isRealUser">编辑个人资料</button>
          </div>
        </div>
        <div class="list-block">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">沸点 · {{points.length}}</el-menu-item>
            <el-menu-item index="2">文章 · {{articles.length}}</el-menu-item>
            <el-menu-item index="3">赞 · 0</el-menu-item>
            <el-menu-item index="4">关注 · {{focus_num || 0}}</el-menu-item>
            <el-menu-item index="5">关注者 · {{follow_num || 0}}</el-menu-item>
          </el-menu>
          <point-list v-show="activeIndex === '1'" :points="points"></point-list>
          <arti-list v-show="activeIndex === '2'" :articleList="articles" @del="getArticleList"></arti-list>
          <focus-list v-show="activeIndex === '4'" :focuserList="focuserList"></focus-list>
          <follow-list v-show="activeIndex === '5'" :followerList="followerList"></follow-list>
        </div>
      </div>
      <div class="infos">
        <div class="achievement">
          <p>个人成就</p>
        </div>
        <div class="achieves">
          <p class="achieve-item">
            <i class="iconfont icon-dianzan1"></i>
            <span>获得点赞 {{likes_total}}</span>
          </p>
          <p class="achieve-item">
            <i class="el-icon-view"></i>
            <span>文章被阅读 0</span>
          </p>
        </div>
        <div class="footer">
          <div class="attention">
            <p>关注了</p>
            <p class="atten-nums">{{focus_num}}</p>
          </div>
          <div class="grep"></div>
          <div class="fans">
            <p>关注者</p>
            <p class="fans-nums">{{follow_num}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/apis/UserInfo'
import { getArticles } from '@/apis/articles/articles'
import { getAllPin } from '@/apis/point/point'
import { getFocus, getFollowers, isUserFocus } from '@/apis/focus/index'
import { focusUser } from '@/apis/focus/index'
import getDateDiff from '@/utils/getTime'
import PointList from '@/views/person/PointList'
import ArtiList from '@/views/person/ArticleList'
import FollowList from '@/views/person/FollowList'
import FocusList from '@/views/person/FocusList'
export default {
  name: 'personPage',
  components: {
    ArtiList,
    PointList,
    FollowList,
    FocusList
  },
  watch: {
    // 监听vuex中变量, 发生变化的时候重新复制, 达到数据的实时变化效果
    '$store.state.focus_num': {
      handler() {
        this.focus_num = this.$store.state.focus_num
      }
    },
    '$store.state.follow_num': {
      handler() {
        this.follow_num = this.$store.state.follow_num
      }
    },
    '$store.state.likes_total': {
      handler() {
        this.likes_total = this.$store.state.likes_total
      }
    },
    '$route.params.uid': {
      handler() {
        if(this.$route.path.indexOf('user'))
        this.likes_total = 0     // uid变了说明用户也变了, 此时点赞总量从新计算
        this.reset()
      }
    }
  },
  data() {
    return {
      isRealUser: true,
      isUserFocus: false,
      focus_num: 0,
      follow_num: 0,
      likes_total: 0,
      activeIndex: '1',
      userInfo: {},
      imageUrl: '',
      uid: '',
      articles: [],      // 传给子组件的文章列表
      points: [],         // 传给子组件的沸点列表
      focuserList: [],    // 传给子组件的关注列表
      followerList: [],   // 传给子组件的被关注列表
      defaultUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    }
  },
  methods: {
    editUserInfo() {
      this.$router.push('/user/settings/profile')
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key
    },
    getUserInfo(uid) {
      if(uid) {
        // getUserInfo({
        //   uid
        // })
        this.$axios({
          url: '/apis/getUserInfo',
          method: 'get',
          params: { uid }
        }).then(res => {
          if(res && res.data.status) {
            this.userInfo = res.data.userInfo
            this.imageUrl = this.userInfo.avatar
            this.checkImageUrl()
          }
        })
      }
    },
    checkImageUrl() {
      if(this.imageUrl.indexOf('null') > -1) {
        this.imageUrl = ''
      }
    },
    getFocusAndFollowers() {
      // getFocus({
      //   uid: this.$route.params.uid
      // })
      this.$axios({
        url: '/apis/user/focusAndFollowers',
        method: 'get',
        params: { uid: this.$route.params.uid }
      }).then(res => {
        if(res && res.data.status) {
          let data = res.data.data
          this.focuserList = data.focus
          this.followerList = data.followers
          this.focus_num = data.focus.length
          this.follow_num = data.followers.length
          this.$store.commit('setFocusNum', data.focus.length)
          this.$store.commit('setFollowNums', data.followers.length)
        }
      })
    },
    // 在个人页面获取文章列表的时候，可能是别人在看另外一个人的主页
    // 所以这个时候需要两个uid，根据两个uid来判断当前浏览页面的用户是否点赞了某篇文章
    getArticleList(uid) {
      // getArticles({
      //   uid,
      //   other_uid: JSON.parse(localStorage.getItem('userInfo')).uid
      // })
      let info = localStorage.getItem('userInfo')
      this.$axios({
        url: '/apis/getArticles',
        method: 'get',
        params: {
          uid,
          other_uid: info ? JSON.parse(info).uid : '',
          is_log: info ? true : false
        }
      }).then(res => {
        if(res && res.data.status) {
          let data = res.data.data
          this.getArticleLikes(data)    // 获取所有文章的点赞数一共有多少
          data.forEach((article, index) => {
            data[index].create_time = getDateDiff(parseInt(article.create_time))
            data[index].tags = article.tags.split(',')
          })
          this.articles = data
          this.$store.commit('setArticles', this.articles)
        }
      })
    },
    formatPoint(points) {
      let pointsList = JSON.parse(JSON.stringify(points))
      pointsList.forEach((point, index) => {
        pointsList[index].create_time = getDateDiff(parseInt(point.create_time))
      })
      return pointsList
    },
    // 获取沸点
    getAllPin(uid) {
      // getAllPin({
      //   uid,
      //   other_uid: JSON.parse(localStorage.getItem('userInfo')).uid,
      //   type: ''
      // })
      let info = localStorage.getItem('userInfo')
      this.$axios({
        url: '/apis/user/getAllPins',
        method: 'get',
        params: {
          uid,
          other_uid: info ? JSON.parse(info).uid : '',
          isLog: info ? true : false
        }
      }).then(res => {
        if(res && res.data.status) {
          this.getPointLikes(res.data.points)                  // 获取所有沸点的点赞数一共有多少
          this.points = this.formatPoint(res.data.points)      
          this.$store.commit('setPoints', this.points)         // 保存当前沸点状态
        }
      })
    },
    getArticleLikes(articles) {
      articles.forEach(article => {
        this.likes_total += article.support
      })
      this.$store.commit('setLikesTotal', this.likes_total)
    },
    getPointLikes(points) {
      points.forEach(point => {
        this.likes_total += point.likes
      })
      this.$store.commit('setLikesTotal', this.likes_total)
    },
    focusUser() {
      focusUser({
        uid: JSON.parse(localStorage.getItem('userInfo')).uid,
        focus_id: this.$route.params.uid
      }).then(res => {
        if(res && res.data.status) {
          if(this.isUserFocus) {
            this.isUserFocus = false
            this.$store.commit('downFollowNums')
          } else {
            this.isUserFocus = true
            this.$store.commit('upFollowNums')
          }
        }
      })
    },
    /**
     *  @uid      当前页面用户的id
     *  @uid_1    浏览该页面的用户的id
     *  
     *  判断该用户是否被关注
     */
    userIsFocus(uid, uid_1) {
      isUserFocus({
        uid,
        uid_1
      }).then(res => {
        if(res && res.data.status) {
          this.isUserFocus = res.data.isFocus
        }
      })
    },
    // 进入个人信息页面的时候, 要判断浏览页面的用户和被浏览的用户是否是同一个人
    reset() {
      let uid = this.$route.params.uid                                // 被浏览的用户的uid
      let info = localStorage.getItem('userInfo')
      let uid_1 = info ? JSON.parse(info).uid : ''   // 浏览页面的用户的uid
      if(uid_1 !== uid) {                                            
        this.isRealUser = false
        this.userIsFocus(uid, uid_1)        // 不是同一个人，就判断浏览页面的用户是否关注了被浏览的用户
      } else {
        this.isRealUser = true
      }
      this.getFocusAndFollowers()                   // 获取关注者和被关注者的数量
      this.getUserInfo(uid)
      this.getArticleList(uid)
      this.getAllPin(uid)
    }
  },
  created() {
    this.reset()
    this.activeIndex = this.$route.params.activeIndex || '1'
  }
}
</script>

<style lang="scss">
.personal {
  .el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: 2px solid #4851e3;
    color: #4851e3;
  }
  .el-menu--horizontal>.el-menu-item {
    color: rgb(114, 119, 123);
  }
  .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    color: #4851e3;
  }
}
</style>

<style lang="scss" scoped>
.personal {
  height: 92%;
}
.container {
  display: flex;
  background: #edeff8;
  padding-bottom: 20px;
  .main-container {
    position: relative;
    .introduction {
      display: flex;
      justify-between: space-between;
      width: 644px;
      height: 91px;
      background: #ffffff;
      padding: 32px;
      .left {
        margin-right: 32px;
        img {
          display: inline-block;
          width: 90px;
          height: 90px;
          border-radius: 50%;
        }
      }
      .middle {
        .username {
          margin: 0;
          padding: 0;
          font-size: 26px;
          font-weight: 600;
          line-height: 1.2;
          color: #000;
        }
        .job {
          margin-top: 40px;
          .position .post {
            font-size:14px;
            margin-left: 10px;
            color: rgb(114, 119, 123);
          }
          .split {
            display: inline-block;
            margin: 0px 10px;
            color: rgb(114, 119, 123);
            transform: scale(0.7);
          }
          .company {
            font-size:14px;
            color: rgb(114, 119, 123);
          }
          .iconfont {
            color: rgb(114, 119, 123);
          }
        }
      }
      .right {
        position: relative;
        flex: 1;
        .btn {
          position: absolute;
          right: 0;
          bottom: 0;
          outline: none;
          background: #ffffff;
          border: 1px solid #4851E3;
          color: #4851E3;
          padding: 10px 20px;
          border-radius: 14px;
          cursor: pointer;
        }
        .focus-btn {
          position: absolute;
          right: 0;
          bottom: 0;
          outline: none;
          width: 90px;
          height: 30px;
          border: 1px solid #6cbd45;
          color: #6cbd45;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: 0.3s;
        }
        .focus-btn:hover {
          color: #fff;
          background: #6cbd45;
        }
        .is-focus {
          color: #fff;
          background: #6cbd45;
        }
      }
    }
    .list-block {
      width: 708px;
      margin-top: 20px;
    }
  }
  .infos {
    background: #fff;
    margin-left: 15px;
    height: 205px;
    .achievement {
      width: 170px;
      height: 30px;
      line-height: 30px;
      padding: 15px;
      font-weight: bold;
      border-bottom: 1px solid #e6e6e6;
    }
    .achieves {
      padding: 15px;
      border-bottom: 1px solid #e6e6e6;
      .achieve-item {
        margin-bottom: 15px;
      }
      .achieve-item {
        &:last-child {
          margin-bottom: 0px;
        }
      }
      i {
        margin-right: 8px;
        color: #4851e3;
        border-radius: 50%;
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      padding: 10px 30px 10px 30px;
      .grep {
        width: 1px;
        background: #e6e6e6;
        transform: translateY(-6px) scale(0.8);
      }
      .atten-nums,
      .fans-nums {
        padding: 10px;
        text-align: center;
        font-weight: bold;
      }
    }
  }
}
</style>