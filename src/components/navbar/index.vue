<template>
  <div class="navbar">
    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
      <div class="navbar-left">
        <el-menu-item index="1" @click="backHomePage">首页</el-menu-item>
        <el-menu-item index="2" @click="toPoint">沸点</el-menu-item>
      </div>
      <div class="navbar-right">
        <el-menu-item>
          <spe-input @searchArticle="searchArticle"></spe-input>
        </el-menu-item>
        <el-menu-item style="padding-left:0px;">
          <div class="btn-box" @click="writeArticle">
            <div class="modal-color">
              <div class="flex">
                  <a class="btn" href="###">写文章</a>
                </div>
              </div>
            </div>
        </el-menu-item>
        <el-menu-item style="padding-left:0px;">
          <el-badge is-dot :hidden="isHideDot">
            <i :class="[
              {'el-icon-s-promotion': true},
              {'is-not-hide': !isHideDot}
            ]"
            @click="toNotification"></i>
          </el-badge>
        </el-menu-item>
        <el-menu-item style="padding-left:0px;">
          <div class="avatar" @click.stop="showUserMenu">
            <div
              :style="[{'backgroundImage': 'url(' + imageUrl + ')'}]"
              :class="[{'cover': true}]"
              v-if="imageUrl"
            ></div>
            <img v-else :src="defaultUrl" alt="">
          </div>
        </el-menu-item>
      </div>
    </el-menu>
    <el-card class="box-card hide-card" v-if="isLogged">
      <div class="text item" @click="toWritePage">
        <p>写文章</p>
      </div>
      <div class="text item" @click="toPersonPage">
        <p>个人主页</p>
      </div>
      <div class="text item" @click="tagsManage">
        <p>标签管理</p>
      </div>
      <div class="text item" @click="logout">
        <p>登出</p>
      </div>
    </el-card>
    <el-card class="box-card hide-card" v-else>  
      <div class="text item" @click="toLoginPage">
        <p>登录</p>
      </div>
    </el-card>

  </div>
</template>

<script>
import SpeInput from '@/components/Input/SpeInput'
import SpeButton from '@/components/Button/SpeButton'
import getUserAvatar from '@/utils/getUserAvatar'
import { getNotification } from '@/apis/notification/index'
import getDateDiff from '@/utils/getTime'
import { search } from '@/apis/articles/articles'
export default {
  name: 'navbar',
  components: {
    SpeInput,
    SpeButton
  },
  watch: {
    '$store.state.notifications': {
      deep: true,
      handler() {
        let notifications = this.$store.state.notifications
        this.isShowDot(notifications)
      }
    }
  },
  data() {
    return {
      isLogged: true,   // 判断用户是否已登录
      activeIndex: '1',
      inputValue: '',
      imageUrl: '',
      defaultUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      userMenuList: [
        '写文章',
        '个人主页'
      ],
      isHideDot: true,        // 是否展示红色的通知
    }
  },
  methods:{
    searchArticle(value) {
      // search({ value })
      this.$axios({
        url: '/apis/article/search',
        method: 'get',
        params: { value }
      }).then(res => {
        if(res && res.data.status) {
          this.$router.push('/index')      // 搜索的时候跳转到首页
          res.data.articles.forEach((article, index) => {
            res.data.articles[index].create_time = getDateDiff(parseInt(article.create_time))
          })
          // 设置当前关键字，是为了能够在home组件内通过关键字进行replace操作
          this.$store.commit('setCurSearchValue', value)
          // 设置搜索后的文章, home组件监听store变化，替换搜索后的文章列表
          this.$store.commit('setArticles', res.data.articles)
        }
      })
    },
    toLoginPage() {
      this.$router.push('/auth/login')
    },
    // 获取通知
    getNotification() {
      getNotification({
        uid: JSON.parse(localStorage.getItem('userInfo')).uid
      }).then(res => {
        if(res && res.data.status) {
          this.formatTime(res.data.notifications)
          this.isShowDot(res.data.notifications)
          this.$store.commit('setNotificationList', res.data.notifications)
        }
      })
    },
    isShowDot(notifications) {
      // 如果有未读消息, 那么出现红点
      let res = true
      if(notifications.length) {
        notifications.forEach(item => {
          if(!item.is_read) {
            res = false
          }
        })
        this.isHideDot = res
      }
    },
    formatTime(notifications) {
      notifications.forEach((item, index) => {
        notifications[index].create_time = getDateDiff(parseInt(item.create_time))
      })
    },
    toNotification() {
      if(!JSON.parse(localStorage.getItem('userInfo'))) {
        this.$message({
          type: 'warning',
          message: '请先登录'
        })
      } else {
        this.$router.push({ name: 'notifications' })
      }
    },
    handleSelect(key, keyPath) {
      
    },
    handleClick() {
      console.log('????sadasd')
      
    },
    // 发布文章
    publish() {
      console.log('发布')
    },
    // 返回首页
    backHomePage() {
      this.$router.push('/index')
    },
    writeArticle() {
      if(!JSON.parse(localStorage.getItem('userInfo'))) {
        this.$message({
          type: 'warning',
          message: '请先登录'
        })
      } else {
        this.$router.push('/editor/draft/new')
      }
    },
    toWritePage() {
      this.writeArticle()
    },
    tagsManage() {
      this.$router.push({
        name: 'tagsManage',
        params: {
          uid: JSON.parse(localStorage.getItem('userInfo')).uid
        }
      })
    },
    toPoint() {
      let uid
      let userInfo = localStorage.getItem('userInfo')
      if(userInfo) {
        uid = JSON.parse(userInfo).uid
      }
      this.$router.push({
        name: 'point',
        params: {
          uid: uid ? uid : 'tourist'
        }
      })
    },
    // 展示菜单信息
    showUserMenu() {
      let node = document.querySelector('.box-card')
      if(node && node.classList.contains('hide-card')) {
        node.classList.remove('hide-card')
        node.classList.add('show-card')
      }
    },
    // 跳转的时候如果采用的是name与params就是命名路由, 这种形式的路由会把参数隐藏起来，只保留值
    // 如果是path与query, 会把参数和值都显示出来
    toPersonPage() {
      let { uid } = JSON.parse(localStorage.getItem('userInfo'))
      this.$router.push({
        name: 'personPage',
        params: { uid }
      })
    },
    logout() {
      localStorage.removeItem('userInfo')
      this.imageUrl = this.defaultUrl
      this.isLogged = false
      this.$router.push('/index')
      this.$store.commit('reset')
      // this.$store.commit('setLogStatus', false)
    },
    checkImageUrl() {
      if(this.imageUrl.indexOf('null') > -1) {
        this.imageUrl = ''
      }
    },
    getAvatar() {
      getUserAvatar().then(res => {
        this.imageUrl = res
        this.checkImageUrl()
      })
    }
  },
  created() {
    if(!JSON.parse(localStorage.getItem('userInfo'))) {
      this.isLogged = false
      this.isHideDot = true
    } else {
      this.isLogged = true
      this.getAvatar()
      this.getNotification()
    }
  }
}
</script>

<style lang="scss">
.navbar {
  position: fixed;
  z-index: 999;
  .el-input {
    top: -4px;
  }
  .el-menu-item {
    font-size: 16px;
    background: #ffffff!important;
    height: 70px!important;
    line-height: 70px!important;
  }
  .el-menu.el-menu--horizontal {
    display:flex;
    position: absolute;
    justify-content: space-between;
    width: 100%;
    height: 70px;
  }
  .el-menu--horizontal>.el-menu-item {
    color: #71777c!important;
    border: none!important;
  }
  .el-menu-item.is-active {
    color: #4851E3!important;
  }
  .el-dropdown {
    height: 57px;
    line-height: 51px;
  }
  .el-button {
    padding: 10px;
  }
  .el-card__body {
    padding: 0px!important;
  }
}
</style>

<style lang="scss">
.navbar-right {
  .el-badge {
    position: relative;
    vertical-align: middle;
    display: inline-block;
    width: 20px;
    height: 20px;
  }
}
</style>

<style lang="scss" scoped>
@import '../.././styles/variables.scss';
.navbar {
  position: fixed;
  height: 70px;
  width: 100%;
  .navbar-left {
    display:flex;
    justify-content: flex-start;
  }
  .navbar-right {
    display:flex;
    justify-content: flex-end;
    .avatar {
      display: flex;
      height: 100%;
      align-items: center;
    }
    .cover {
      background-size: cover;
      background-position: 50%;
      background-repeat: no-repeat;
      border-radius: 50%;
      width: 30px;
      height: 30px;
    }
    .avatar img {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      border-radius: 50%;
      background: #ccc;
    }
    .el-icon-s-promotion {
      position: absolute;
      transition: 0.3s;
      font-size: 24px;
    }
    .el-icon-s-promotion:hover {
      color: #4851e3;
      transition: 0.3s;
    }
  }
  .text {
    font-size: 14px;
    color: #71777c;
  }

  .item {
    padding: 10px 15px 10px 15px;
    margin: 10px 0;
    cursor: pointer;
  }
  .item:hover {
    background: #edeff8;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    position: fixed;
    width: 130px;
    top: 10%;
    right: 22.5%;
    z-index: 1600;
  }

  .hide-card {
    opacity: 0;
    transition: 0.3s;
    pointer-events: none;
  }
  .show-card {
    opacity: 1;
    transition: 0.3s;
  }
}


.btn-box {
  display: inline-block;
  background: $pupple;
  border-radius: 24px;
  box-shadow: 0 6px 8px 0 rgba(86,98,255,0.15);
  height: 29px;
  width: 60px;
  cursor: pointer;
  .modal-color {
    transition: 0.5s;
    border-radius: 24px;
    height: 24px;
  }
  .modal-color:hover {
    background: rgba(0,0,0,0.10);
    transition: 0.5s;
  }
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 29px;
  line-height: 29px;
  .btn {
    height: 29px;
    color: white;
    font-size: 14px;
    text-decoration: none;
  }
}

.is-not-hide {
  color: #4851e3;
}
</style>