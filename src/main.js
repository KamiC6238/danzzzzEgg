import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import store from './store/store'
import globalCss from '@/styles/index.scss'  // 全局样式

import mavonEditor from 'mavon-editor'       // 引入编辑器
import 'mavon-editor/dist/css/index.css'     // 编辑器样式

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})

// Vue.directive('highlight', el => {
//   let blocks = el.querySelectorAll('pre')
//   console.log(blocks)
//   blocks.forEach(block => {
//     hljs.highlightBlock(block)
//   })
// })

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
