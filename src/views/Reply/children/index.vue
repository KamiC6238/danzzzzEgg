<template>
  <div class="reply-box-child">
    <div class="reply">
      <div
        class="reply-container"
        :style="{
          'background': !replyUser.reply_child_id ? '#fafbfc' : '#fff'
        }"
      >
        <div class="reply-main">
          <el-input v-model="inputValue" :placeholder="'回复' + replyUser.username"></el-input>
          <div class="bottom-box">
            <div class="reply-btn" @click="replyComment">
              <button class="btn">评论</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { replyComment } from '@/apis/reply/reply'
export default {
  name: 'child-reply',
  props: {
    replyUser: {
      type: Object,
      default: () => {
        return {}
      }
    },
    articleId: {
      type: String,
      default: () => {
        return ''
      }
    },
    pointId: {
      type: String,
      default: () => {
        return ''
      }
    },
    pointIndex: {
      type: Number,
      default: () => {
        return 0
      }
    }
  },
  data() {
    return {
      inputValue: ''
    }
  },
  methods: {
    check() {
      return this.inputValue ? false : true
    },
    getPostData() {
      let info = localStorage.getItem('userInfo')
      let postData = {
        username: info ? JSON.parse(info).username : '',
        uid: info ? JSON.parse(info).uid : '',
        content: this.inputValue,
        reply_id: this.replyUser.reply_id,
        avatar: info ? JSON.parse(info).avatar : '',
        post: info ? JSON.parse(info).post : '',
        company: info ? JSON.parse(info).company : '',
        create_time: Date.parse(new Date()),
        reply_username: this.replyUser.username,
        point_id: this.pointId,
        article_id: this.$store.state.article_id,
        type: this.$store.state.article_id ? 'is_article_child_reply' : 'is_point_child_reply',
        create_time: Date.parse(new Date())
      }
      return postData
    },
    replyComment() {
      if(this.check()) {
        this.$message({
          type: 'error',
          message: '回复不能为空哦'
        })
        return
      }
      let postData = this.getPostData()
      replyComment(postData).then(res => {
        if(res && res.data.status) {
          this.inputValue = ''
          this.$message({
            type: 'success',
            message: '回复成功'
          })
          if(postData.article_id) {
            this.$store.commit('setReplyArticleFlag') 
          } else {
            this.getPointIndex(res.data.point_id)
            this.$store.commit('setPointId', res.data.point_id)
            this.$store.commit('setReplyFlag')
          }
        } else {
          this.$message({
            type: 'error',
            message: '进行子回复时报错'
          })
        }
      })
    },
    getPointIndex(point_id) {
      let points = this.$store.state.points
      for(let i = 0; i < points.length; i++) {
        if(points[i].point_id === point_id) {
          points[i].replys_num += 1
          this.$store.commit('setPointIndex', i)
          break
        }
      }
    },
  },
  created() {
    console.log(this.replyUser, 'replyUser')
  }
}
</script>

<style lang="scss" scoped>
.reply-box-child {
  margin-top: 12px;
  background: #fff;
  margin-bottom: 10px;
  .reply {
    .reply-container {
      display: flex;
      background: #fff;
      padding: 12px;
      .reply-main {
        flex: 1;
        .bottom-box {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-top: 8px;
          .tools {
            .emoji {
              display: flex;
              cursor: pointer;
              align-items: center;
              color: #4851e3;
              .icon-biaoqing {
                font-size: 20px;
              }
              span {
                font-size: 13px;
              }
            }
          }
          .btn {
            border: 1px solid #4851e3;
            background: #4851e3;
            border-radius: 4px;
            width: 70px;
            height: 30px;
            line-height: 30px;
            outline: none;
            color: #fff;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>