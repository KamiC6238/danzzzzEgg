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
  data() {
    return {
      articles: []
    }
  },
  methods: {
    changeIsMarkdown(res) {
      this.isMarkdown = res
    },
    getArticleList(uid) {
      getArticles({
        uid,
        other_uid: JSON.parse(localStorage.getItem('userInfo')).uid
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