<template>
  <div class="focuser">
    <ul class="focus-list">
      <li class="focus-item" v-for="(item, index) in focuserList" :key="index">
        <div class="left">
          <div class="left-image">
            <el-avatar
              :src="item.avatar.indexOf('null') > -1 ? defaultUrl : item.avatar"
              size="medium"
              class="avatar"
              @click="toPersonPage(item.uid)"
            ></el-avatar>
          </div>
          <div class="profile">
            <p class="username" @click="toPersonPage(item.uid)">{{item.username}}</p>
            <p class="desc">
              <span class="post">{{item.post}}</span>
              <span>@</span>
              <span class="company">{{item.company}}</span>
            </p>
          </div>
        </div>
        <div class="right" @click="focusUser(item.uid, index)" v-if="isRealUser">
          <button
            :class="[{'btn': true}, {'is-focus': item.isFocus}]"
            v-if="item.isFocus">
          已关注</button>
          <button class="btn" v-if="!item.isFocus">关注</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { focusUser } from '@/apis/focus/index'
export default {
  name: 'focus',
  props: {
    focuserList: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  watch: {
    '$route.params.uid': {
      handler() {
        let realUserId = JSON.parse(localStorage.getItem('userInfo')).uid
        let otherUserId = this.$route.params.uid
        if(realUserId === otherUserId) {
          this.isRealUser = true
        } else {
          this.isRealUser = false
        }
      }
    }
  },
  data() {
    return {
      isRealUser: true,
      defaultUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",    // 没有设置头像时的默认展示头像
    }
  },
  methods: {
    toPersonPage(uid) {
      this.$router.push({
        name: 'personPage',
        params: { uid }
      })
    },
    // 关注或者取消关注
    focusUser(uid) {
      let focusId = uid
      let userId = this.$route.params.uid
      focusUser({
        uid: userId,
        focus_id: focusId
      }).then(res => {
        if(res && res.data.status) {
          this.changeFocusStatus(focusId)
        }
      })
    },
    // 改变关注按钮的状态(关注或者已关注)
    changeFocusStatus(focus_id) {
      let count = 1
      for(let i = 0; i < this.focuserList.length;i++) {
        if(this.focuserList[i].uid === focus_id) {
          if(this.focuserList[i].isFocus) {
            this.focuserList[i].isFocus = false
            if(count <= 1) {
              this.$store.commit('downFocusNum')  // 每次取关或者关注，数量只需要加减一次就够了
            }
            count += 1
          } else {
            this.focuserList[i].isFocus = true
            if(count <= 1) {
              this.$store.commit('upFocusNum')
            }
            count += 1
          }
        }
      }
    }
  },
  created() {
    console.log(this.focuserList, 'focuserList')
    let realUserId = JSON.parse(localStorage.getItem('userInfo')).uid
    let curUserId = this.$route.params.uid
    if(realUserId !== curUserId) {
      this.isRealUser = false
    } else {
      this.isRealUser = true
    }
  }
}
</script>

<style lang="scss">
.focus-item {
  .el-avatar > img {
    width: 45px;
    height: 45px;
  }
}
</style>

<style lang="scss" scoped>
.focus-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 28px;
  height: 96px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  &:last-child {
    border-bottom: none;
  }
  .left {
    display: flex;
    align-items: center;
    .left-image .avatar {
      width: 45px;
      height: 45px;
      margin-right: 20px;
      cursor: pointer;
    }
    .profile .desc {
      margin-top: 8px;
      color: #909090;
      font-size: 14px;
    }
    .profile .username {
      font-weight: bold;
      cursor: pointer;
    }
  }
  .right {
    .btn {
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
    .btn:hover {
      color: #fff;
      background: #6cbd45;
    }
    .is-focus {
      color: #fff;
      background: #6cbd45;
    }
  }
}
</style>