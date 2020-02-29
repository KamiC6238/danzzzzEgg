<template>
  <div class="pin-list-view">
    <ul class="pin-list">
      <li class="item shadow" v-for="(pin, index) in points" :key="index">
        <div class="pin">
          <div class="pin-header-row">
            <div class="header-box">
              <div class="left">
                <el-avatar :src="pin.avatar.indexOf('null') > -1 ? defaultUrl : pin.avatar" size="large" class="avatar"></el-avatar>
              </div>
              <div class="right">
                <p class="username">{{pin.username}}</p>
                <p class="post">
                  <span v-if="pin.post !== 'null' && pin.post !== ''">{{pin.post + ' · '}}</span>
                  <span v-if="pin.company !== 'null' && pin.company !== ''">{{pin.company + ' · '}}</span>
                  <span class="time">{{pin.create_time}}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="pin-content-row">
            {{pin.content}}
          </div>
          <div
            v-if="pin.image_cache.length !== 0"
            :class="[
              { 'pin-image-row': true },
              { 'large-size': pin.image_cache.length === 1 },
              { 'small-size': pin.image_cache.length > 1 }
            ]">
           <viewer class="viewer">
            <div
              v-for="(imageUrl, index) in pin.image_cache"
              :class="[{'image':true}, { 'large-image': pin.image_cache.length === 1 }, {'small-image': pin.image_cache.length > 1}]"
              :key="index"
            > 
            <img :src="imageUrl"></img>
            </div>
           </viewer> 
          </div>
          <div class="pin-topic-row">
            <a href="#" class="topic-title">{{pin.topic}}</a>
          </div>
          <div class="pin-action-row">
            <div class="action-likes" @click="like(pin.point_id, index)">
              <i class="iconfont icon-dianzan1" v-if="pin.isLike"></i>
              <i class="iconfont icon-dianzan" v-if="!pin.isLike"></i>
              <span class="like-nums">{{pin.likes ? pin.likes : '赞'}}</span>
            </div>
            <div class="grep"></div>
            <div class="action-reply" @click="showComments(pin.point_id, index)">
              <i class="el-icon-chat-round"></i>
              <span class="reply-nums">{{pin.replys_num ? pin.replys_num : 0}}</span> 
            </div>
          </div>
        </div>
        <reply
          v-if="pin.isShowComments"
          :pointId="pin.point_id"
          :comments="pin.comments"
          :pointIndex="index"
        ></reply>
      </li>
    </ul>
  </div>
</template>

<script>
import Reply from '@/views/Reply/index'
import { getAllReply } from '@/apis/reply/reply'
import { likePoint } from '@/apis/point/likes'
import getDateDiff from '@/utils/getTime'
export default {
  name: 'pointList',
  components: {
    Reply
  },
  props: {
    points: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    '$store.state.reply_flag': {
      handler() {
        let point_id = this.$store.state.point_id
        let index = this.$store.state.point_index
        this.getReply(point_id, index)             // 评论后重新请求数据
      }
    }
  },
  data() {
    return {
      // hideFocus: true,
      defaultUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    }
  },
  methods: {
    getReply(point_id, index) {
      // getAllReply({
      //   point_id
      // })
      this.$axios({
        url: '/apis/reply/getAllReply',
        method: 'get',
        params: { point_id }
      }).then(res => {
        if(res && res.data.status) {
          let comments = JSON.parse(JSON.stringify(res.data.comments))
          this.setIsReply(comments)
          this.formatTime(comments)
          this.points[index].comments = comments
        }
      })
    },
    showComments(point_id, index) {
      this.points[index].isShowComments = !this.points[index].isShowComments
      if(this.points[index].isShowComments) {
        this.getReply(point_id, index)
      } else {
        this.points[index].comments = []
      }
    },
    like(point_id, index) {
      let info = localStorage.getItem('userInfo')
      if(info && JSON.parse(info).uid) {
        likePoint({
          uid: JSON.parse(info).uid,
          point_id
        }).then(res => {
          if(res && res.data.status) {
            this.changeLikesNum(point_id)
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '获取缓存用户信息有误'
        })
      }
    },
    changeLikesNum(point_id) {
      let points = this.$store.state.points
      for(let i = 0; i < points.length;i++) {
        if(points[i].point_id === point_id) {
          if(points[i].isLike) {
            points[i].likes -= 1
            points[i].isLike = false
            this.$store.commit('downLikesTotal')           // 点赞总数减1
          } else {
            points[i].likes += 1
            points[i].isLike = true
            this.$store.commit('upLikesTotal')           // 点赞总数加1
          }
        }
      }
    },
    // 通过递归给每条评论和回复设置一个isReply字段，用来展开和关闭评论框
    setIsReply(comments) {
      if(comments) {
        comments.forEach((comment, index) => {
          comments[index].isReply = false
          if(comment.comments) {
            this.setIsReply(comment.comments)
          }
        })
      }
    },
    // 通过递归转换每条评论跟回复的时间格式
    formatTime(comments) {
      if(comments) {
        comments.forEach((comment, index) => {
          comments[index].create_time = getDateDiff(parseInt(comment.create_time))
          if(comment.comments) {
            this.formatTime(comment.comments)
          }
        })
      }
    },
  },
  // created() {
  //   let { uid } = this.$route.params
  //   console.log(this.$route, '$route')
  //   console.log(uid, 'uid')
  //   console.log(uid === JSON.parse(localStorage.getItem('userInfo')).uid)
  //   if(uid === JSON.parse(localStorage.getItem('userInfo')).uid) {
  //     this.hideFocus = true
  //   }
  // }
}
</script>

<style lang="scss">
.pin-list-view {
  .header-box {
    .el-avatar > img {
      width: 45px;
      height: 45px;
    }
  }
}
</style>

<style lang="scss" scoped>
.pin-list-view {
  border-radius: 4px;
  .item {
    background: #fff;
    margin-bottom: 8px;
  }
  .pin-list {
    list-style: none;
    .pin {
      .pin-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px 0 20px;
        .header-box {
          display: flex;
          align-items: center;
          .left {
            width: 45px;
            margin-right: 12px;
            .avatar {
              width: 45px;
              height: 45px;
            }
          }
          .right {
            .username {
              font-weight: bold;
              margin-bottom: 6px;
            }
            .post {
              font-size: 14px;
              color: #909090;
            }
          }
        }
        .focus {
          .btn {
            outline: none;
            width: 55px;
            height: 26px;
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
            transition: 0.3s;
          }
        }
      }
      .pin-content-row {
        line-height: 25px;
        margin: 10px 14px 5px 76px;
      }
      .pin-image-row {
        margin: 15px 14px 0 76px;
        .viewer {
          display: flex;
          flex-wrap: wrap;
          .large-image {
            width: 42%;
            height: 30%;
          }
          .small-image {
            width: 110px;
            height: 110px;
            margin-right: 4px;
            margin-bottom: 4px;
            overflow: hidden;
          }
        }
      }
      .pin-topic-row {
        margin: 15px 14px 0 76px;
        .topic-title {
          display: inline-block;
          text-decoration: none;
          width: 56px;
          height: 24;
          line-height: 24px;
          color: #4851e3;
          border: 1px solid #4851e3;
          border-radius: 15px;
          font-size: 13px;
          padding: 0 12px;
        }
      }
      .pin-action-row {
        display: flex;
        margin: 15px 0 0 0;
        border-top: 1px solid #ebebeb;
        align-items: center;
        .action-likes,
        .action-reply {
          flex: 1;
          height: 34px;
          line-height: 34px;
          text-align: center;
          color: #909090;
          cursor: pointer;
        }
        .icon-dianzan {
          font-size: 17px;
        }
        .icon-dianzan1 {
          color: #4851e3;
          font-size: 14px;
        }
        .grep {
          width: 1px;
          height: 23px;
          background: #ebebeb;
        }
        .like-nums,
        .reply-nums {
          font-size: 14px;
          margin-left: 4px;
        }
      }
    }
  }
}
.large-size {
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
.small-size {
  img {
    width: 142%;
    height: 130%;
    margin-right: 4px;
    margin-bottom: 4px;
    cursor: pointer;
  }
}
</style>