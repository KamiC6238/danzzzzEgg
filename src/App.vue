<template>
  <div id="app" @click="hideUserMenu">
    <nav-bar v-if="showNavBar"></nav-bar>
    <div class="outside">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/navbar/index'
export default {
  name: 'app',
  components: {
    NavBar
  },
  data() {
    return {
      showNavBar: true
    }
  },
  watch: {
    // 登录和注册页面不显示导航栏
    '$route': {
      deep: true,
      handler() {
        this.check()
        if(this.$route.path.indexOf('post') === -1) {
          this.$store.commit('setArticleId', '')
          this.$store.commit('cancelCurArticle')
        }
      }
    },
  },
  methods: {
    check() {
      let node
      if(document.querySelector('.outside')) {
        node = document.querySelector('.outside')
      } else {
        node = document.querySelector('.outside1')
      }
      if(this.$route.path.indexOf('auth') > -1) {
        node.classList.remove('outside')
        node.classList.add('outside1')
        this.showNavBar = false
      } else {
        node.classList.remove('outside1')
        node.classList.add('outside')
        this.showNavBar = true
      }
    },
    hideUserMenu() {
      let node = document.querySelector('.box-card')
      let nodes = document.querySelector('.action-detail')
      if(node && node.classList.contains('show-card')) {             // @/components/navbar/index.vue
        node.classList.remove('show-card')
        node.classList.add('hide-card')
      }
      if(nodes) {
        nodes = Array.from(nodes)
        nodes.forEach(node => {
          if(node.classList.contains('hide-action')) {
            node.classList.remove('hide-action')
            node.classList.add('show-action')
          } else if (node.classList.contains('show-action')) {
            node.classList.remove('show-action')
            node.classList.add('hide-action')
          }
        })
      }
    }
  },
  mounted() {
    this.check()
  },
  created() {
    if(this.$route.path.indexOf('auth') > -1) {
      this.showNavBar = false
    } else {
      this.showNavBar = true
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html, body {
  height: 100%;
}
#app {
  position: relative;
  height: 100%;
  background: #edeff8;
}
.outside {
  display: flex;
  justify-content: center;
  position: relative;
  background: #edeff8;
  padding: 20px 20px 0 20px;
  top: 70px;
}
.outside1 {
  position: relative;
  background: #edeff8;
}
</style>