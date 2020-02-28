<template>
  <div class="markdown-main">
<!--     <div class="likes-replys">
      <div class="likes">
        <i class="iconfont icon-dianzan1"></i>
      </div>
    </div> -->
    <div class="markdown-box">
      <div class="except-reply">
        <div class="markdown-body markdown-container">
          <div class="markdown-header">
            <div class="left" @click="toPersonPage(userInfo.uid)">
              <el-avatar size="medium" :src="imageUrl === '' ? circleUrl : imageUrl" class="avatar"></el-avatar>
            </div>
            <div class="right">
              <p class="username" @click="toPersonPage(userInfo.uid)">{{userInfo.username}}</p>
              <p>
                <span class="time">{{userInfo.create_time}}</span>
                <span class="read-nums">阅读 {{userInfo.read_nums || 0}} · 
                  <a href="javascript:void(0);" class="edit" @click="edit">编辑</a>
                </span>
              </p>
            </div>
            <div class="tags">
              <div style="margin-bottom: 7px;">Tags</div>
              <div class="tag-list">
                <span v-for="(tag, index) in userInfo.tags" :key="index" class="tag">
                  {{tag}}
                </span>
              </div>
            </div>
          </div>
          <div
            :style="[{'backgroundImage': 'url(' + userInfo.cover_image + ')'}]"
            :class="[{'markdown-cover': true}]"
            v-if="userInfo.cover_image"
          >
          </div>
          <div class="markdown-title">
            <p>{{userInfo.article_title}}</p>
          </div>
          <div class="markdown-content"></div>
          <div class="reply" style="width: 700px;">
            <reply
              :articleId="articleId"
              :articleComments="comments"
            ></reply>
          </div>
        </div>
        <div class="markdown-user-info">
          <div class="about">
            <span>关于作者</span>
          </div>
          <div class="info">
            <div class="left" @click="toPersonPage(userInfo.uid)">
              <el-avatar size="medium" :src="imageUrl === '' ? circleUrl : imageUrl" class="avatar"></el-avatar>
            </div>
            <div class="right">
              <p class="username" @click="toPersonPage(userInfo.uid)">{{userInfo.username}}</p>
              <p class="desc">{{userInfo.post}} @ {{userInfo.company}}</p>
            </div>
          </div>
          <div class="footer">
            <p class="likes">
              <i class="iconfont icon-dianzan1"></i>
              <span>获得点赞 {{userInfo.support || 0}}</span>
            </p>
            <p class="read_nums">
              <i class="el-icon-view"></i>
              <span>文章被阅读 0</span>
            </p>
          </div>
        </div>
      </div>
    </div>    
  </div>

</template>

<script>
import getDateDiff from '@/utils/getTime'
import { getSingleArticle } from '@/apis/articles/articles'
import { getUserInfo } from '@/apis/UserInfo'
import { getAllReply } from '@/apis/reply/reply'
import { setIsReply, formatTime} from '@/utils/formatComments'
import Reply from '@/views/Reply/index'
// import getUserAvatar from '@/utils/getUserAvatar'
export default {
  name: 'show',
  components: {
    Reply
  },
  watch: {
    '$store.state.reply_article_flag': {
      handler() {
        this.getReply()
      }
    }
  },
  data() {
    return {
      userInfo: {},
      comments: [],
      imageUrl: '',
      articleId: '',
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    }
  },
  methods: {
    toPersonPage(uid) {
      this.$router.push({
        name: 'personPage',
        params: { uid }
      })
    },
    edit() {
      this.$router.push({
        path: '/editor/draft/new',
        query: {
          type: 'edit',
          article_id: this.userInfo.article_id
        }
      })
    },
    getReply() {
      let article_id = this.$route.params.article_id
      getAllReply({
        article_id
      }).then(res => {
        if(res && res.data.status) {
          let comments = res.data.comments
          setIsReply(comments)
          formatTime(comments)
          this.comments = comments
        }
      })
    },
    getSingleArticle() {
      let article_id = this.$route.params.article_id
      getSingleArticle({ article_id }).then(res => {
        if(res && res.data.status) {
          let node = document.querySelector('.markdown-content')
          let userInfo = res.data.data
          userInfo.tags = userInfo.tags.split(',')
          userInfo.create_time = getDateDiff(parseInt(userInfo.create_time))
          this.userInfo = userInfo
          this.imageUrl = this.userInfo.avatar
          node.innerHTML = this.userInfo.html_content
          this.$store.commit('setCurArticle', this.userInfo)
        }
      })
    }
  },
  created() {
    this.getSingleArticle()
    this.getReply()
    this.articleId = this.$route.params.article_id
    this.$store.commit('setArticleId', this.$route.params.article_id)
  }
}
</script>

<style lang="scss">
.markdown-main {
  display: flex;
  position: relative;
  .likes-replys {
    position: fixed;
    left: 150px;
    top: 200px;
    .likes {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 6px 0 rgba(0,0,0,.15);
      cursor: pointer;
      .icon-dianzan1 {
        color: #4851e3;
        transition: 0.3s;
      }
    }
    .likes:hover .icon-dianzan1 {
      transform: scale(1.1);
      transition: 0.3s;
    }
  }
}
.markdown-box {
  padding-bottom: 50px;
  .except-reply {
    display: flex;
    background: #edeff8;
    padding-bottom: 50px;
  }
  .el-avatar > img {
    width: 40px;
    height: 40px;
  }
  .tags {
    flex: 1;
    text-align: right;
    color: #4851e3;
    .tag {
      display: inline-block;
      color: #fff;
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
  .markdown-user-info {
    width: 200px;
    height: 180px;
    margin-left: 20px;
    background: #ffffff;
    border-radius: 4px;
    .about {
      height: 15px;
      line-height: 15px;
      padding: 15px;
      border-bottom: 1px solid #e6e6e6;
      font-size: 14px;
    }
    .info {
      display: flex;
      padding: 15px 15px 0 15px;
      .left {
        cursor: pointer;
        .avatar {
          width: 40px;
          height: 40px;
        }
        margin-right: 8px;
      }
      .right {
        .username {
          font-weight: bold;
          padding-bottom: 10px;
          cursor: pointer;
        }
      }
    }
    .footer {
      padding: 15px;
      .likes {
        margin-bottom: 10px;
      }
      i {
        margin-right: 8px;
        color: #4851e3;
        border-radius: 50%;
      }
    }
  }
}
.markdown-container {
  background: #ffffff;
  padding: 30px;
  width: 700px;
  border-radius: 4px;
  .markdown-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .left {
      cursor: pointer;
      margin-right: 12px;
      .avatar {
        width: 40px;
        height: 40px;
      }
    }
    .right {
      color: #909090;
      .username {
        color: #000;
        font-weight: bold;
        cursor: pointer;
      }
      .time {
        margin-right: 8px;
      }
      .edit {
        text-decoration: none;
        color: #4851e3;
      }
      p {
        margin-bottom: 0;
      }
    }
  }

  .markdown-cover {
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
    margin-bottom: 20px;
    height: 367px;
  }

  .markdown-title {
    font-size: 30px;
    font-weight: bold;
  }

  blockquote {
    background: #f8f8f8;
    height: 40px;
    line-height: 40px;
    border-left: 4px solid #cbcbcb;
  }

  code {
    background-color: #fff5f5;
    color: #ff502c;
  }

  .hljs {
    code {
      color: black;
    }
  }
}
</style>