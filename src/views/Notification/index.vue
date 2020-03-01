<template>
  <div class="notifications">
    <ul class="notifications-list">
      <li class="list-item" v-for="(item, index) in notifications" :key="index">
        <div class="user">
          <div class="userinfo">
            <div class="left">
              <el-avatar v-if="item.is_tags" :src="getImage(item.tags)"></el-avatar>
              <el-avatar
                v-else
                @click.native="toPersonPage(item.uid)"
                size="medium"
                :src="item.avatar.indexOf('null') > -1 ? defaultUrl : item.avatar"
                class="avatar"
              ></el-avatar>
            </div>
            <div class="right">
              <p class="username" @click="toPersonPage(item.uid)">{{item.username}}</p>
              <div v-if="item.is_tags" class="tag">
                <span class="tag-name">{{item.tags | tagFilter(tags)}}</span>
                <div class="desc">
                  <span class="time">{{item.create_time}}</span>
                </div>
              </div>
              <div class="desc" v-else>
                <span class="post">{{item.post + ' '}}</span>
                <span class="grep">@</span>
                <span class="company">{{' ' + item.company}}</span>
                <span class="dot"> · </span>
                <span class="time">{{item.create_time}}</span>
              </div>
            </div>
          </div>
          <div class="button">
            <button :class="[{'btn': true}, {'is-read': item.is_read}]" v-if="item.is_read">已读</button>
            <button :class="[{'btn': true}, {'is-not-read': !item.is_read}]" v-if="!item.is_read">未读</button>
          </div>
        </div>
        <div class="reply-child">
          <span>{{item | childTextFilter}}</span>
        </div>
        <div class="link">
          <i v-if="item.is_publish || item.is_tags" class="el-icon-document"></i>
          <i v-if="item.is_article_like || item.is_point_like" class="iconfont icon-dianzan1"></i>
          <i
            v-if="item.is_article_reply ||
                  item.is_article_child_reply ||
                  item.is_point_reply ||
                  item.is_point_child_reply"
            class="el-icon-chat-dot-round"></i>
          <i v-if="item.is_focus" class="el-icon-s-custom"></i>
          <span class="link-desc">
            <span>{{ item | textFilter }}</span>
            <a
              v-if="item.is_article_reply"
              :href="'/#/post/' + item.article_id"
              @click="isRead(item, index)">
              {{item.article_reply_content}}
            </a>
            <a
              v-if="item.is_article_like"
              :href="'/#/post/' + item.article_id"
              @click="isRead(item, index)">
              {{item.article_title}}
            </a>
            <a
              v-if="item.is_point_like || item.is_point_reply"
              href="###"
              class="point"
              @click="isRead(item, index)">
              {{item.point_reply_content}}
            </a>

            <a
              v-if="item.is_point_child_reply"
              href="###"
              @click="isRead(item, index)">
              {{item.point_be_reply_content}}
            </a>

            <a
              v-if="item.is_article_child_reply"
              :href="'/#/post/' + item.article_id"
              @click="isRead(item, index)">
              {{item.article_be_reply_content}}
            </a>
            <a
              v-if="item.is_publish || item.is_tags"
              :href="'/#/post/' + item.article_id"
              @click="isRead(item, index)">
              {{item.article_title}}
            </a>
            <a
              v-if="item.is_focus"
              :href="'/#/user/' + item.uid"
              @click="isRead(item, index)">
              {{item.username}}
            </a>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import getDateDiff from '@/utils/getTime'
import { isRead } from '@/apis/notification/index'
import { tags } from '@/utils/tags'
export default {
  name: 'notifications',
  watch: {
    '$store.state.notifications': {
      deep: true,
      handler() {
        this.notifications = this.$store.state.notifications
      }
    }
  },
  filters: {
    tagFilter(name, tags) {
      for(let i = 0; i < tags.length; i++) {
        if(tags[i].imageName === name) {
          return tags[i].tagName
        }
      }
    },
    textFilter(item) {
      if(item.is_tags) {
        return '你关注的标签有新的文章发布：'
      }
      if(item.is_article_like) {
        return '赞了你的文章：'
      }
      if(item.is_article_reply) {
        return '评论了你的文章：'
      }
      if(item.is_point_like) {
        return '赞了你的沸点：'
      }
      if(item.is_point_reply) {
        return '评论了你的沸点：'
      }
      if(item.is_point_child_reply) {
        return '回复了你在沸点里的评论：'
      }
      if(item.is_article_child_reply) {
        return '回复了你在文章里的评论：'
      }
      if(item.is_focus) {
        return '一个新的关注者：'
      }
      if(item.is_publish) {
        return '发布了文章：'
      }
    },
    childTextFilter(item) {
      if(item.article_be_reply_content) {
        return item.article_reply_content
      }
      if(item.point_be_reply_content) {
        return item.point_reply_content
      }
    }
  },
  data() {
    return {
      tags,
      notifications: [],
      defaultUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    }
  },
  methods: {
    getImage(name) {
      return require('../../.././public/images/' + name + '.png')
    },
    toPersonPage(uid) {
      this.$router.push({
        name: 'personPage',
        params: { uid }
      })
    },
    // 点击文章, 表明该文章已读, 请求后端接口, 将该通知的is_read字段改为1
    isRead(item, index) {
      isRead({
        uid: JSON.parse(localStorage.getItem('userInfo')).uid,
        other_uid: item.is_tags ? null : item.uid,
        article_id: item.article_id,
        is_tags: item.is_tags ? true : false
      }).then(res => {
        if(res && res.data.status) {
          if(!item.is_read) {
            this.$store.commit('setIsRead', index)
          }
        }
      })
    },
  },
  created() {
    this.notifications = this.$store.state.notifications
    this.notifications.forEach((item, index) => {
      if(item.is_point_child_reply || item.is_point_reply || item.is_point_like) {
        this.notifications[index].is_read = true
        this.isRead(item, index)
      }
    })
  },
}
</script>

<style lang="scss">
.notifications-list {
  .el-avatar > img {
    width: 45px;
    height: 45px;
  }
}
</style>

<style lang="scss" scoped>
.notifications-list {
  .list-item {
    padding: 24px;
    width: 700px;
    margin-bottom: 10px;
    background: #fff;
    .user {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .userinfo {
        display: flex;
        .left,
        .avatar {
          width: 45px;
          height: 45px;
          cursor: pointer;
        }
        .right {
          padding: 0 12px;
          .tag {
            // display: flex;
            // align-items: center;
            height: 100%;
            font-weight: bold;
            .time {
              font-weight: normal;
            }
          }
          .username {
            font-weight: bold;
            cursor: pointer;
          }
          .desc {
            margin-top: 10px;
            color: #909090;
            font-size: 14px;
            a {
              color: #000;
            }
          }
        }
      }
    }
    .reply-child {
      margin: 5px 0 8px 57px;
    }
    .link {
      display: flex;
      align-items: center;
      margin-top: 10px;
      margin-left: 57px;
      padding: 12px 0;
      background: #edeff8;
      .icon-dianzan1,
      .el-icon-s-custom,
      .el-icon-document,
      .el-icon-chat-dot-round {
        color: #4851e3;
        padding: 0 12px;
        font-size: 17px;
      }
      .el-icon-document {
        font-size: 20px;
      }
      .el-icon-s-custom {
        font-size: 20px;
      }
      .icon-dianzan1 {
        font-size: 16px;
      }
      .link-desc {
        color: #909090;
      }
      a {
        color: #000;
        .point {
          pointer-events: none;
        }
      }
      a:hover {
        color: #4851e3;
      }
    }
  }
}

.btn {
  outline: none;
  width: 60px;
  height: 30px;
  border-radius: 4px;
  pointer-events: none;
}
.is-not-read {
  color: #fff;
  border: 1px solid #F56C6C;
  background: #F56C6C;
}
.is-read {
  color: #fff;
  border: 1px solid #6cbd45;
  background: #6cbd45;
}
</style>