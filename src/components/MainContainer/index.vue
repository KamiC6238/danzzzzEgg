<template>
  <div class="main-container">
    <ul class="articles-list">
      <li class="article" v-for="(item, index) in articles" :key="index">
        <div class="left">
          <div class="header">
            <span class="type-zhuanlan">专栏</span>
            <span class="username"> · {{item.username}} · </span>
            <span class="time">{{item.create_time}} · </span>
            <span class="tags">{{item.tags}}</span>
          </div>
          <div class="content" @click="toArticle(item.article_id)">
            <span v-html="item.article_title"></span>
          </div>
          <div class="likes" @click="likesArticle(item, index)">
            <i class="iconfont icon-dianzan" v-if="!item.isLike"></i>
            <i class="iconfont icon-dianzan1" v-if="item.isLike"></i>
            <span class="num">{{item.support || 0}}</span>
          </div>
        </div>
        <div class="right">
          <div
            :style="[{'backgroundImage': 'url(' + item.cover_image + ')'}]"
            :class="[{'cover': true}]"
            v-if="item.cover_image"
          >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { likeArticle } from '@/apis/articles/articles'
export default {
  name: 'MainContainer',
  props: {
    articles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    toArticle(article_id) {
      this.$router.push({
        name: 'showArticle',
        params: { article_id }
      })
    },
    likesArticle(item, index) {
      // let uid = JSON.parse(localStorage.getItem('userInfo')).uid
      let info = localStorage.getItem('userInfo')
      if(!info) {
        this.$message({
          type: 'warning',
          message: '请先登录'
        })
        return
      }
      likeArticle({
        uid: info ? JSON.parse(info).uid : '',                               // 点赞的用户
        other_uid: item.uid,               // 被点赞的文章所属的用户
        article_id: item.article_id,
        article_title: item.article_title, // 被点赞的文章的标题
        type: 'is_article_like',           // 通知信息的类型
        create_time: Date.parse(new Date())
      }).then(res => {
        if(res && res.data.status) {
          let isLike = this.articles[index].isLike
          if(isLike) {
            this.articles[index].isLike = false
            this.$store.commit('downArticleLikes', index)
          } else {
            this.articles[index].isLike = true
            this.$store.commit('upArticleLikes', index)
          }
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  background: #edeff8;
  .articles-list {
    list-style: none;
    overflow: auto;
    .article {
      display: flex;
      width: 700px;
      padding: 18px 24px;
      background: #ffffff;
      border-bottom: 1px solid hsla(0,0%,59.2%,.1);
      .header {
        font-size: 14px;
        .type-zhuanlan {
          color: #b71ed7;
        }
        .username,
        .time,
        .tags {
          color: #909090;
        }
      }
      .content {
        color: #2e3135;
        font-size: 19px;
        padding: 20px 0px;
        cursor: pointer;
        transition: 0.3s;
      }
      .content:hover {
        color: #4851e3;
        transition: 0.3s;
      }
      .likes {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 4px;
        width: 30px;
        height: 20px;
        border: 1px solid #4851e3;;
        padding: 0 5px 0 5px;
        cursor: pointer;
        .num {
          color: #4851e3;
        }
        .icon-dianzan,
        .icon-dianzan1 {
          font-size: 14px;
          color: #4851e3;
          transition: 0.3s;
        }
      }
      .likes:hover .icon-dianzan {
        transform: scale(1.2) rotate(15deg);
        transition: 0.3s;
      }
      .right {
        width: 94px;
        height: 94px;
        flex: 1;
        display: flex;
        justify-content: flex-end;
        .cover {
          background-size: cover;
          background-position: 50%;
          background-repeat: no-repeat;
          border-radius: 4px;
          width: 94px;
          height: 94px;
        }
      }
    }
  }
}
</style>