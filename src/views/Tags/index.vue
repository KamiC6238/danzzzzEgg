<!-- 标签管理页面 -->

<template>
  <div class="tags-manage">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">已关注标签</el-menu-item>
      <el-menu-item index="2">所有标签</el-menu-item>
    </el-menu>
    <div class="tags-container">
      <focused v-show="activeIndex === '1'" :tags="focusedTags"></focused>
      <un-focus v-show="activeIndex === '2'" :tags="allTags"></un-focus>
    </div>
  </div>
</template>

<script>
import Focused from './children/focused'
import UnFocus from './children/unfocus'
import { tags } from '@/utils/tags'
import { getAllTags } from '@/apis/focus/index'
export default {
  name: 'tagsPage',
  components: {
    Focused,
    UnFocus
  },
  data() {
    return {
      tags,
      focusedTags: [],       // 已关注的标签
      allTags: [],           // 所有标签, 包含已关注的
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key
    },
    setTags() {
      getAllTags({
        uid: this.$route.params.uid
      }).then(res => {
        if(res && res.data.status) {
          let data = res.data.tags
          this.tags = this.formatTags(data)
        }
      })
    },
    formatTags(data) {
      for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < this.tags.length; j++) {
          if(this.tags[j].tagName === data[i].tag_name) {
            this.tags[j].isFocus = true
            this.focusedTags.push(this.tags[j])
          }
        }
      }
      this.allTags = this.tags
      this.$store.commit('setAllTags', this.allTags)
      this.$store.commit('setFocusedTags', this.focusedTags)
    }
  },
  created() {
    this.setTags()
  }
}
</script>

<style lang="scss" scoped>
.tags-manage {
  width: 1200px;
  background: #fff;
  margin-bottom: 20px;
  .tags-container {
    display: flex;
    justify-content: center;
    padding: 20px;
    width: 1151px;
  }
}
</style>