<template>
  <div class="home">
    <main-container :articles="articles"></main-container>
  </div>
</template>

<script>
import MainContainer from '@/components/MainContainer/index'
import { getArticles } from '@/apis/articles/articles'
import { getUserInfo } from '@/apis/UserInfo'
import getDateDiff from '@/utils/getTime'
export default {
  name: 'home',
  components: {
    MainContainer,
  },
  watch: {
    '$store.state.isLog': {
      // 登录状态改变的时候重新请求数据
      handler() {
        this.getArticleList()
      }
    },
    '$store.state.articles': {
      handler() {
        this.articles = this.$store.state.articles
        let value = this.$store.state.curSearchValue
        if(value) {
          this.articles.forEach((item, index) => {
            this.articles[index].article_title = item.article_title.replace(value, `<em style="color:#e8001c;">${value}</em>`)
          })
        }
        this.$store.commit('setCurSearchValue', '')
      }
    }
  },
  data() {
    return {
      articles: []
    }
  },
  methods: {
    changeIsMarkdown(res) {
      this.isMarkdown = res
    },
    getArticleList() {
      let info = localStorage.getItem('userInfo')
      this.$axios({
        url: '/apis/getArticles',
        method: 'get',
        params: {
          uid: '',
          other_uid: info ? JSON.parse(info).uid : '',
          is_log: info ? true : false
        }
      }).then(res => {
        if(res && res.data.status) {
          let data = res.data.data
          data.forEach((article, index) => {
            data[index].tags = article.tags.split(',').join('/')
            data[index].create_time = getDateDiff(parseInt(article.create_time))
          })
          this.articles = data
          this.$store.commit('setArticles', this.articles)
        }
      })
    },
  },
  created() {
    this.getArticleList()
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>