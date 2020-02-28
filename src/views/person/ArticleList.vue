<template>
  <div class="article-list">
    <div class="sub-title">
      <p>专栏</p>
    </div>
    <ul class="list">
      <li class="list-item" v-for="(item, index) in articleList" :key="index">
        <div class="article-header">
          <el-avatar size="small" :src="item.avatar === null ? circleUrl : item.avatar" class="avatar"></el-avatar>
          <span class="username">{{item.username}} · </span>
          <span class="create_time">&nbsp;{{item.create_time}}</span>
          <div class="tags">
            <div class="tag-list">
              <span v-for="(tag, index) in item.tags" :key="index" class="tag">
                {{tag}}
              </span>
            </div>
          </div>
        </div>
        <div
          :style="[{'backgroundImage': 'url(' + item.cover_image + ')'}]"
          :class="[{'article-cover': true}]"
          v-if="item.cover_image"
        >
        </div>
        <div class="article-title">
          <a :href="'/#/post/' + item.article_id" class="title" @click="showArticle(index)">{{item.article_title}}</a>
        </div>
<!--         <div class="article-content" v-html="item.html_content">
          <p style="width: 100%" v-html="item.html_content">{{item.html_content}}</p>
        </div> -->
        <div class="article-footer">
          <div class="likes" @click="likes(item, index)">
            <i class="iconfont icon-dianzan" v-if="!item.isLike"></i>
            <i class="iconfont icon-dianzan1" v-if="item.isLike"></i>
            <span class="num">{{item.support || 0}}</span>
          </div>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">...</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="editArticle(index)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="deleteArticle(index)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </li>
    </ul>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>删除文章会扣除相应的点赞数量, 确定要删除吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delArticle, getArticles, likeArticle } from '@/apis/articles/articles'
export default {
  name: 'articleList',
  props: {
    articleList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      curIndex: null,
      dialogVisible: false,
      imageUrl: '',
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    }
  },
  methods: {
    likes(item, index) {
      let uid = JSON.parse(localStorage.getItem('userInfo')).uid
      likeArticle({
        uid,                               // 点赞的用户
        other_uid: item.uid,               // 被点赞的文章所属的用户
        article_id: item.article_id,
        article_title: item.article_title, // 被点赞的文章的标题
        type: 'is_article_like',           // 通知信息的类型
        create_time: Date.parse(new Date())
      }).then(res => {
        if(res && res.data.status) {
          let isLike = this.articleList[index].isLike
          if(isLike) {
            this.articleList[index].isLike = false
            this.$store.commit('downArticleLikes', index)
            this.$store.commit('downLikesTotal')           // 点赞总数减1
          } else {
            this.articleList[index].isLike = true
            this.$store.commit('upArticleLikes', index)
            this.$store.commit('upLikesTotal')           // 点赞总数加1
          } 
        }
      })
    },
    editArticle(index) {
      this.$router.push({
        path: '/editor/draft/new',
        query: {
          type: 'edit',
          article_id: this.articleList[index].article_id
        }
      })
    },
    deleteArticle(index) {
      this.curIndex = index
      this.dialogVisible = true
    },
    sure() {
      this.dialogVisible = false
      delArticle({
        article_id: this.articleList[this.curIndex].article_id
      }).then(res => {
        if(res && res.status) {
          this.curIndex = null
          this.$emit('del')
        }
      })
    },
    showArticle(index) {
      this.$router.push({
        name: 'showArticle',
        params: {
          article_id: this.articleList[index].article_id
        }
      })
    },
  },
}
</script>

<style lang="scss">
.article-list {
  .el-avatar > img {
    width: 28px;
    height: 28px;
  }
}
.el-dropdown-link {
  font-size: 26px;
  color: #4851e3;
  cursor: pointer;
}
.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
  color: #4851e3!important;
  background: #edeff8!important;
}
</style>

<style lang="scss" scoped>
.article-list {
  .sub-title {
    height: 51px;
    line-height: 51px;
    padding-left: 20px;
    background: #ffffff;
    font-weight: bold;
    border-bottom: 1px solid #e6e6e6;
  }
  .list {
    .list-item {
      position: relative;
      padding: 30px;
      background: #ffffff;
      border-bottom: 1px solid #e6e6e6;
      .article-header {
        display: flex;
        align-items: center;
        .username,
        .create_time {
          color: #909090;
          font-size: 14px;
        }
        .avatar {
          margin-right: 12px;
        }
        .tags {
          flex: 1;
          text-align: right;
          color: #4851e3;
          .tag {
            display: inline-block;
            color: #fff;
            height: 20px;
            line-height: 20px;
            background: #4851e3;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 14px;
            margin-right: 5px;
            &:last-child {
              margin-right:0;
            }
          }
        }
      }
      .article-cover {
        background-size: cover;
        background-position: 50%;
        background-repeat: no-repeat;
        margin-top: 20px;
        margin-bottom: 20px;
        height: 216px;
        border-radius: 8px;
      }
      .article-title {
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0 10px 0;
        .title {
          text-decoration: none;
        }
        .title:visited {
          color: #909090;
        }
      }
      .article-content {
        color: #909090;
        p {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .article-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 18px;
        .likes {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 4px;
          width: 40px;
          height: 27px;
          border: 1px solid #4851e3;;
          padding: 0 12px 0 12px;
          cursor: pointer;
          .num {
            color: #4851e3;
          }
          .icon-dianzan,
          .icon-dianzan1 {
            font-size: 17px;
            color: #4851e3;
            transition: 0.3s;
          }
        }
        .likes:hover .icon-dianzan {
          transform: scale(1.2) rotate(15deg);
          transition: 0.3s;
        }
      }
    }
  }
}
</style>