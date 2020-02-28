<!--
  评论回复的递归组件 
 -->

<template>
  <div class="list">
    <div
      class="comment-box" v-for="(reply, index) in comments"
      :style="{
        'marginLeft': reply.reply_child_id ? '16px' : '0'
      }">
      <div class="left">
        <el-avatar :src="reply.avatar ? reply.avatar : defaultUrl" size="small" class="avatar"></el-avatar>
      </div>
      <div class="right">
        <div class="user-info">
          <span class="replyer">{{reply.username}}</span>
          <!-- <span>(作者)</span> -->
          <span class="replyer-post">{{reply.post}}</span>
          <span> @ </span>
          <span class="replyer-company">{{reply.company}}</span>
        </div>
        <div class="comment">
          <span v-if="reply.reply_child_id">回复 </span>
          <span v-if="reply.reply_child_id" class="reply-username">{{reply.reply_username}}</span>
          <span v-if="reply.reply_child_id">: </span>
          {{reply.content}}
        </div>
        <div class="reply-bottom">
          <div class="time">{{reply.create_time}}</div>
          <div class="reply" @click.stop="handleReply(comments, index)">
            <i class="el-icon-chat-round"></i>
            <span>回复</span>
          </div>
        </div>
        <reply-child
          v-if="reply.isReply"
          :replyUser="reply"
          :pointId="pointId"
          :pointIndex="pointIndex"
        ></reply-child>
        <comments
          v-if="reply.comments"
          :comments="reply.comments"
        ></comments>
      </div>
    </div>
  </div>
</template>

<script>
import ReplyChild from '@/views/Reply/children/index'
import getDateDiff from '@/utils/getTime'
export default {
  name: 'comments',
  components: {
    ReplyChild
  },
  props: {
    comments: {
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
    pointIndex: {
      type: Number,
      default: () => {
        return 0
      }
    }
  },
  data() {
    return {
      defaultUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    }
  },
  methods: {
    handleReply(comments, index) {
      comments[index].isReply = !comments[index].isReply
    }
  },
}
</script>

<style lang="scss" scoped>
.list {
  background: #fafbfc;
  margin-top: 10px;
}
.comment-box {
  display: flex;
  padding-top: 12px;
  margin-left: 16px;
  margin-right: 16px;
  border-bottom: 1px solid #e6e6e6;
  &:last-child {
    border-bottom: none;
  }
  .left {
    margin-right: 12px;
    .avatar {
      width: 32px;
      height: 32px;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    margin-bottom: 15px;
    .user-info {
      .replyer-post {
        color: #909090;
      }
    }
    .comment {
      font-size: 14px;
      margin-top: 8px;
      line-height: 25px;
      .reply-username {
        color: #4851e3;
      }
    }
    .reply-bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      color: #909090;
      .reply {
        cursor: pointer;
      }
      .el-icon-chat-round {
        margin-right: 4px;
      }
    }
  }
}
</style>