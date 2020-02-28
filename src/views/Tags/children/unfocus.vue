<template>
  <div class="tags-box">
    <div class="tag" v-for="(item, index) in tags" :key="index">
      <div class="tag-box">
        <div class="img-box">
          <img :src="getImage(item.imageName)" alt="" class="img">
        </div>
        <p class="tag-name">{{item.tagName}}</p>
        <div class="btn-box">
          <button
            @click="focusTag(item.tagName, index)"
            :class="[{'focus-btn': true}, {'is-focus': item.isFocus}]"
            v-if="item.isFocus">
          已关注</button>
          <button class="focus-btn" @click="focusTag(item.tagName, index)" v-if="!item.isFocus">关注</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { focusTag } from '@/apis/focus/index' 
export default {
  name: 'unfocus',
  props: {
    tags: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    getImage(name) {
      return require('../../../.././public/images/' + name + '.png')
    },
    focusTag(tag_name, index) {
      let uid = this.$route.params.uid
      focusTag({
        uid,
        tag_name
      }).then(res => {
        if(res && res.data.status) {
          if(this.tags[index].isFocus) {
            this.$store.commit('cancelAllTags', index)
          } else {
            this.$store.commit('coverAllTags', index)
            this.$store.commit('appendFocusedTags', this.tags[index])
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background: #fff;
  width: 1000px;
  .tag {
    display: flex;
    justify-content: center;
    width: 223px;
    padding: 18px 0;
    border: 1px solid #e6e6e6;
    background: #fff;
    margin: 10px;
    .tag-box {
      .img-box {
        margin: 12px 0;
        text-align: center;
        .img {
          height: 32px;
        }
      }
      .tag-name {
        text-align: center;
      }
      .btn-box {
        margin: 12px 0;
        text-align: center;
      }
      .focus-btn {
        outline: none;
        width: 90px;
        height: 30px;
        border: 1px solid #6cbd45;
        color: #6cbd45;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        transition: 0.3s;
      }
      .focus-btn:hover {
        color: #fff;
        background: #6cbd45;
      }
      .is-focus {
        color: #fff;
        background: #6cbd45;
      } 
    }
  }
}
</style>