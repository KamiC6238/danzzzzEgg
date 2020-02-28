<template>
  <div class="point-container" @click="cancelEmojiShow">
    <div class="point-tag">
      <ul class="tags">
        <li
          v-for="(item, index) in tags"
          :class="[{'tag-item': true}, {'tag-is-click': item.isClick}]"
          :key="index"
          @click="addBackground(index)"
        >
          <a :href="'#'" class="">{{item.tagName}}</a>
        </li>
        <li class="divider"></li>
        <li class='tag-item'>
          <a href="#">上班摸鱼</a>
        </li>
      </ul>
    </div>
    <div class="point-main">
      <div class="point-input-box">
        <div class="point-input">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="告诉你个小秘密，发沸点时添加话题会被更多小伙伴看见哟~"
            v-model="content">
          </el-input>
          <!-- 当图片数量大于1时, 才显示上传图片的区域, 否则隐藏起来 -->
          <div class="image-box" v-if="imageList.length > 0">
            <div class="image-list">
              <div
                class="image-item"
                v-for="(item, index) in imageList"
                :key="index"
              >
                <span
                  class="delete"
                  @click="deleteImage(index)"
                >
                  <i class="el-icon-delete"></i>
                </span>
                <span class="hover-background"></span>
                <img :src="item.imageUrl"  class="img" />
              </div>
            </div>
            <div class="image-add">
              <label for="innerInput" class="icon-add">+</label>
              <input
                type="file"
                name="file"
                id="innerInput"
                class="inner-input"
                @change="innerUpload"
                ref="inner"
              />
            </div>
          </div>
        </div>
        <div class="tools">
          <div class="tools-box">
            <div class="emoji" @click.stop="showEmoji">
              <i class="iconfont icon-biaoqing"></i>
              <span>表情</span>
            </div>
            <div class="image">
              <i class="el-icon-picture-outline"></i>
              <label for="outerInput">图片</label>
              <input
                type="file"
                name="file"
                id="outerInput"
                class="outer-input"
                ref="outer"
                @change="outerUpload"
               />
            </div>
            <div class="topic">
              <i class="el-icon-paperclip"></i>
              <span>话题</span>
            </div>
          </div>
          <div class="button" @click="publishPoint">
            <button class="btn">发布</button>
          </div>
        </div>
      </div>
      <emoji v-if="emojiShow" @selectedEmoji="pushInContent"></emoji>
      <point-list :points="points"></point-list>
    </div>
    <div class="point-other">
      <div class="profile">
        <div class="left">
          <el-avatar :src="userInfo.avatar.indexOf('null')  > -1 ? defaultUrl : userInfo.avatar" size="large" class="avatar"></el-avatar>
        </div>
        <div class="right">
          <div class="user">
            <p class="username">{{userInfo.username}}</p>
          </div>
          <div class="desc">
            <span class="post">{{userInfo.post}}</span>
            <span>@</span>
            <span class="company">{{userInfo.company}}</span>
          </div>
        </div>
      </div>
      <ul class="stat-list">
        <li class="list-item" @click="toPersonPage">
          <p class="title">沸点</p>
          <p class="nums">{{points_num || 0}}</p>
        </li>
        <li class="list-item" @click="toPersonFocus">
          <p class="title">关注</p>
          <p class="nums">{{focus_num || 0}}</p>
        </li>
        <li class="list-item" @click="toPersonFollowers">
          <p class="title">关注者</p>
          <p class="nums">{{follow_num || 0}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Emoji from '@/components/Emoji/index'
import PointList from './PointList/index'
import { publishPin, getAllPin } from '@/apis/point/point'
import { getFocus, getFollowers } from '@/apis/focus/index'
import getUserAvatar from '@/utils/getUserAvatar'
import getDateDiff from '@/utils/getTime'
export default {
  name: 'point',
  components: {
    PointList,
    Emoji
  },
  watch: {
    imageCache: {
      deep: true,
      handler() {
        console.log(this.imageCache, 'imageCache')
      }
    },
    '$store.state.focus_num': {
      handler() {
        this.focus_num = this.$store.state.focus_num
      }
    },
    '$store.state.follow_num': {
      handler() {
        this.follow_num = this.$store.state.follow_num
      }
    }
  },
  data() {
    return {
      points_num: 0,
      focus_num: 0,
      follow_num: 0,
      emojiShow: false,          // 是否展示表情
      content: '',               // 内容
      userInfo: {}, 
      imageList: [],             // 展示的图片列表 url类型
      imageCache: [],            // 缓存图片 file类型
      preTagIndex: null,         // 上一个被点击的标签
      points: [],                // 传给子组件的沸点列表
      tags: [{
        tagName: '推荐',
        tagValue: '/pins/recommended',
        isClick: false
      }, {
        tagName: '热门',
        tagValue: '/pins/hot',
        isClick: false
      }, {
        tagName: '关注',
        tagValue: '/pins/following',
        isClick: false
      }],
      defaultUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",    // 没有设置头像时的默认展示头像
    }
  },
  methods: {
    toPerson(index = null) {
      this.$router.push({
        name: 'personPage',
        params: {
          uid: JSON.parse(localStorage.getItem('userInfo')).uid,
          activeIndex: index
        }
      })
    },
    // 跳转到个人页面的沸点组件
    toPersonPage() {
      this.toPerson('1')
    },
    // 跳转到个人信息页面的关注组件
    toPersonFocus() {
      this.toPerson('4')
    },
    toPersonFollowers() {
      this.toPerson('5')
    },
    // 组装要发送的数据
    getPostData() {
      let info = localStorage.getItem('userInfo')
      let formData = new FormData()
      let userInfo = {
        content: this.content,
        uid: info ? JSON.parse(info).uid : '',
        avatar: info ? JSON.parse(info).avatar : '',
        username: info ? JSON.parse(info).username : '',
        post: info ? JSON.parse(info).post : '',
        company: info ? JSON.parse(info).company : '',
        topic: '上班摸鱼',
        likes: 0,
        replys_num: 0,
        create_time: Date.parse(new Date()),     // 后端保存时间戳
        imageCache: this.imageCache
      }
      Object.keys(userInfo).forEach(key => {
        if(key === 'imageCache') {
          userInfo[key].forEach((image, index) => {
            formData.append('image' + (index + 1), image)
          })
        } else {
          formData.append(key, userInfo[key])
        }
      })
      return formData      
    },
    // 发布沸点
    publishPoint() {
      let formData = this.getPostData()
      publishPin(formData).then(res => {
        if(res) {
          let status = res.data.status
          this.$message({
            type: status ? 'success' : 'error',
            message: res.data.message
          })
          if(status) {
            this.reset()
            this.getAllPin()
          }
        }
      })
    },
    reset() {
      this.content = ''
      this.imageList = []
      this.imageCache = []
    },
    formatPoint(points) {
      let pointsList = JSON.parse(JSON.stringify(points))
      pointsList.forEach((point, index) => {
        pointsList[index].create_time = getDateDiff(parseInt(point.create_time))
      })
      return pointsList
    },
    getAllPin() {
      let info = localStorage.getItem('userInfo')
      if(info && JSON.parse(info).uid) {
        getAllPin({
          uid: JSON.parse(info).uid,
          other_uid: this.$route.params.uid,
          type: 'all'
        }).then(res => {
          if(res && res.data.status) {
            let points = this.formatPoint(res.data.points)
            this.points = this.isShowFocus(points)               // 是否展示关注按钮, 其他用户才展示, 本身不展示
            this.$store.commit('setPoints', this.points)         // 保存当前沸点状态
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '获取缓存用户信息有误'
        })
      }
    },
    getPointsNum() {
      getAllPin({
        uid: this.$route.params.uid,
        other_uid: JSON.parse(localStorage.getItem('userInfo')).uid,
        type: ''
      }).then(res => {
        if(res && res.data.status) {
          this.points_num = res.data.points.length
        }
      })
    },
    getAllFocus() {
      getFocus({
        uid: this.$route.params.uid
      }).then(res => {
        if(res && res.data.status) {
          let data = res.data.data
          this.focus_num = data.focus.length
          this.follow_num = data.followers.length
          this.$store.commit('setFocusList', data.focus)
          this.$store.commit('setFollowList', data.followers)
          this.$store.commit('setFocusNum', data.focus.length)
          this.$store.commit('setFollowNums', data.followers.length)
        }
      })
    },
    // 点击加号添加图片
    outerUpload() {
      let file = this.$refs.outer.files[0]
      this.commonUpload(file)
    },
    // 点击工具栏中的图片添加图片
    innerUpload() {
      let file = this.$refs.inner.files[0]
      this.commonUpload(file)
    },
    // 添加图片的公共方法
    // 使用临时url来回显图片, 并将相应的file缓存起来, 发布的时候将缓存的图片数组传给后端即可
    commonUpload(file) {
      let imageUrl = window.URL.createObjectURL(file)
      this.imageList.push({
        imageUrl
      })
      this.imageCache.push(file)
    },
    // 删除图片
    deleteImage(index) {
      this.imageList.splice(index, 1)
      this.imageCache.splice(index, 1)
    },
    cancelEmojiShow() {
      this.emojiShow = false
    },
    showEmoji() {
      this.emojiShow = true
    },
    pushInContent(emoji) {
      this.content += emoji
    },
    addBackground(index) {
      if (this.preTagIndex === null) {
        this.preTagIndex = index
        this.tags[index].isClick = true
      } else if (this.preTagIndex !== index) {
        this.tags[this.preTagIndex].isClick = false
        this.preTagIndex = index
        this.tags[index].isClick = true
      }
    },
    isShowFocus(points) {
      let route_uid = this.$route.params.uid
      points.forEach((point, index) => {
        if(point.uid === route_uid) {
          points[index].isShowFocus = false
        } else {
          points[index].isShowFocus = true
        }
      })
      return points
    },
    setUserInfo() {
      let info = localStorage.getItem('userInfo')
      if (info) {
        this.userInfo = JSON.parse(info)
      }
    }
  },
  created() {
    this.getAllFocus()
    this.getAllPin()     // 获取所有沸点
    this.getPointsNum()
    this.setUserInfo()
  },
}
</script>

<style lang="scss">
.point-main {
  .el-textarea {
    display: flex;
    justify-content: center;
  }
  .el-textarea__inner {
    width: 528px;
    height: 91px;
    border: none;
    resize: none;
    background: #f9f9f9;
  }
}
.point-other {
  .el-avatar > img {
    width: 62px;
    height: 62px;
  }
}
</style>

<style lang="scss" scoped>
.point-container {
  display: flex;
  position: relative;
  .point-tag {
    position: fixed;
    width: 112px;
    height: 191px;
    background: #fff;
    margin-right: 15px;
    border-radius: 4px;
    .tags {
      font-size: 14px;
      color: #909090;
      padding: 16px 12px;
      list-style: none;
      point-events: none;
      .tag-item {
        text-align: center;
        line-height: 31px;
        height: 31px;
        margin-top: 10px;
        border-radius: 4px;
        cursor: pointer;
        &:first-child {
          margin-top: 0;
        }
        a {
          color: #909090;
          text-decoration: none;
        }
      }
      .tag-is-click {
        background: #4851e3;
        a {
          color: #fff;
        }
      }
      .divider {
        width: 90px;
        height: 1px;
        margin: 10px 0;
        background: rgba(92,96,102,.1);
        transform: scaleY(0.8);
      }
    }
  }
  .point-main {
    width: 570px;
    margin-left: 127px;
    margin-right: 15px;
    padding-bottom: 100px;
  }
  .point-input-box {
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    margin-bottom: 8px;
    .point-input {
      background: #f9f9f9;
      margin-bottom: 10px;

      .image-box {
        display: flex;
        padding: 10px;

        .image-list {
          display: flex;
          margin-right: 10px;

          .image-item {
            position: relative;
            width: 80px;
            height: 80px;
            border-radius: 4px;
            margin-right: 10px;
            &:last-child {
              margin-right: 0;
            }

            .delete {
              display: none;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              color: #fff;
              background: rgba(0, 0, 0, 0.40);
              border-radius: 50%;
              width: 18px;
              height: 18px;
              z-index: 10;
              cursor: pointer;

              .el-icon-delete {
                font-size: 18px;
              }
            }

            .hover-background {
              display: none;
              position: absolute;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.30);
            }

            .img {
              width: 80px;
              height: 80px;
              border-radius: 4px;
            }
          }
        }

        .image-item:hover {
          .delete,
          .hover-background {
            display: block;
          }
        }

        .image-add {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 80px;
          border: 1px dashed #4851e3;
          border-radius: 4px;

          .icon-add {
            font-size: 30px;
            color: #4851e3;
            cursor: pointer;
          }

          .inner-input {
            display: none;
          }
        }
      }
    }
    .tools {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #4851e3;
      .btn {
        width: 72px;
        height: 32px;
        background: #edeff8;
        border: 1px solid #ccc;
        outline: none;
        border-radius: 4px;
        color: #4851e3;
        cursor: pointer;
      }
      .tools-box {
        display: flex;
        align-items: center;
      }
      .emoji,
      .image,
      .topic {
        margin-right: 25px;
        cursor: pointer;
      }
      .emoji {
        display: flex;
        margin-right: 25px;
        cursor: pointer;
        align-items: center;
        .icon-biaoqing {
          font-size: 24px;
        }
      }
      label {
        cursor: pointer;
      }
      i {
        font-size: 17px;
        margin-right: 5px;
      }
    }
  }
  .point-other {
    width: 248px;
    height: 175px;
    background: #fff;
    border-radius: 4px;
    .profile {
      display: flex;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid rgba(92,96,102,.1);
      .left {
        width: 62px;
        margin-right: 12px;
        .avatar {
          width: 62px;
          height: 62px;
          box-shadow: 0 2px 6px 0 rgba(0,0,0,.15);
        }
      }
      .right {
        .user {
          margin-bottom: 10px;
          font-weight: bold;
        }
        .desc {
          font-size: 14px;
          color: #909090;
        }
      }
    }
    .stat-list {
      display: flex;
      justify-content: center;
      padding: 16px;
      .list-item {
        width: 82px;
        text-align: center;
        border-right: 1px solid rgba(92,96,102,.1);
        cursor: pointer;
        &:last-child {
          border-right: none;
        }
        .title {
          margin-bottom: 6px;
        }
      }
    }
  }
}
.outer-input {
  display: none;
}
</style>