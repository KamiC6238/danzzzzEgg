<template>
  <div class="home">
    <nav-bar></nav-bar>
    <main-container :articles="articles"></main-container>
  </div>
</template>

<script>
import NavBar from '@/components/navbar/index'
import MainContainer from '@/components/MainContainer/index'
export default {
  name: 'home',
  components: {
    NavBar,
    MainContainer
  },
  data() {
    return {
      articles: [{
        describe: 'danzzzz · 5小时前 · CSS',
        title: '[译]给破碎图片添加样式'
      }, {
        describe: 'danzzzz · 5小时前 · CSS',
        title: '[译]给破碎图片添加样式'
      }, {
        describe: 'danzzzz · 5小时前 · CSS',
        title: '[译]给破碎图片添加样式'
      }, {
        describe: 'danzzzz · 5小时前 · CSS',
        title: '[译]给破碎图片添加样式'
      }, {
        describe: 'danzzzz · 5小时前 · CSS',
        title: '[译]给破碎图片添加样式'
      }, {
        describe: 'danzzzz · 5小时前 · CSS',
        title: '[译]给破碎图片添加样式'
      }, {
        describe: 'danzzzz · 5小时前 · CSS',
        title: '[译]给破碎图片添加样式'
      }, {
        describe: 'danzzzz · 5小时前 · CSS',
        title: '[译]给破碎图片添加样式'
      }]
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>