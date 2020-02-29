<template>
  <div class="reply-box">
    <div class="reply">
      <div class="reply-container">
        <div class="left">
          <el-avatar :src="imageUrl === '' ? defaultUrl : imageUrl" size="small" class="avatar"></el-avatar>
        </div>
        <div class="right">
          <el-input v-model="inputValue" placeholder="输入评论..."></el-input>
          <div class="bottom-box">
            <div class="reply-btn" @click="mainReply">
              <button class="btn">评论</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-list">
      <comments
        :comments="pointId ? comments : articleComments"
        :articleId="articleId"
        :pointId="pointId"
        :pointIndex="pointIndex"
      ></comments>
    </div>
    </div>
</template>

<script>
import getUserAvatar from '@/utils/getUserAvatar'
import ReplyChild from './children/index'
import { replyPoint, replyArticle } from '@/apis/reply/reply'
import Comments from '@/components/Comments/index'
export default {
  name: 'reply',
  components: {
    ReplyChild,
    Comments
  },
  props: {
    articleId: {
      type: String,
      default: () => {
        return ''
      }
    },
    articleComments: {
      type: Array,
      default: () => {
        return []
      }
    },
    pointId: {
      type: String,
      default: () => {
        return ''
      }
    },
    comments: {
      type: Array,
      default: () => {
        return []
      }
    },
    pointIndex: {
      type: Number,
      default: () => {
        return 0
      }
    },
  },
  data() {
    return {
      defaultUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      inputValue: '',
      imageUrl: '', // 主头像
      isReply: false
    }
  },
  methods: {
    handleReply(index) {
      this.comments[index].isReply = !this.comments[index].isReply
    },
    getPostData() {
      let info = localStorage.getItem('userInfo')
      let postData = {
        uid: info ? JSON.parse(info).uid : '',
        other_articleAuthor_uid: this.$store.state.curArticle.uid || '',
        username: info ? JSON.parse(info).username : '',
        content: this.inputValue,
        avatar: info ? JSON.parse(info).avatar : '',
        post: info ? JSON.parse(info).post : '',
        company: info ? JSON.parse(info).company : '',
        point_id: this.pointId || '',
        article_id: this.articleId || '',
        article_title: this.$store.state.curArticle.article_title || '',
        create_time: Date.parse(new Date())
      }
      return postData
    },
    check() {
      return this.inputValue == '' ? true : false
    },
    // 最外层的评论框
    mainReply() {
      if(this.check()) {
        this.$message({
          type: 'error',
          message: '评论不能为空'
        })
        return
      }
      let postData = this.getPostData()
      this.reply(postData)
    },
    reply(postData) {
      if(this.pointId) {
        this.replyPoint(postData)
      } else if(this.articleId) {
        this.replyArticle(postData)
      }
    },
    replyPoint(postData) {
      postData.type = 'is_point_reply'
      replyPoint(postData).then(res => {
        if(res) {
          this.$message({
            type: res.data.status ? 'success' : 'error',
            message: res.data.message
          })
          this.inputValue = ''
          this.getPointIndex(res.data.point_id)
          this.$store.commit('setPointId', res.data.point_id)
          this.$store.commit('setReplyFlag')
        }
      })
    },
    replyArticle(postData) {
      postData.type = 'is_article_reply'
      replyArticle(postData).then(res => {
        if(res && res.data.status) {
          this.$store.commit('setReplyArticleFlag')
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
    getAvatar() {
      getUserAvatar().then(res => {
        this.imageUrl = res
      })
    }
  },
  created() {
    console.log(this.comments, 'reply')
    this.getAvatar()
  }
}
</script>

<style lang="scss">
.reply-box {
  .el-avatar > img {
    width: 32px;
    height: 32px;
  }
}
</style>

<style lang="scss" scoped>
.reply-box {
  border-top: 1px solid #e6e6e6;
  padding: 12px 16px;
  background: #fff;
  .reply {
    .reply-container {
      display: flex;
      background: #fafbfc;
      padding: 12px;
      .left {
        margin-right: 12px;
        .avatar {
          width: 32px;
          height: 32px;
        }
      }
      .right {
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
.comment-list {
  margin-left: 56px;
}
.comment-list > .list {
  background: #fff;
}

</style>