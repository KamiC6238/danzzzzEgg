<template>
  <div style="display: flex">
    <div class="article-box">
      <div class="input-box">
        <input v-model="titleValue" type="text" class="title-input" placeholder="请输入文章标题">
        <div class="btn-box" @click="publish">
          <div class="modal-color">
            <div class="flex">
                <a class="btn" href="/#/editor/draft/new">发布</a>
              </div>
            </div>
          </div>
      </div>
      <mavon-editor
        v-model="md_content"
        :toolbars="toolbars"
        @save="save"
        @change="toHtml"
        @imgAdd="uploadImage"
        ref="md"
      ></mavon-editor>
    </div>
    <div class="toolbars">
      <div class="select-cover-image">
        <label for="cover-image" class="title">上传文章封面</label>
        <input
          type="file"
          name="file"
          class="upload-cover-image"
          id="cover-image"
          @change="changeCoverImage"
          ref="coverImage"
        />
      </div>
      <div class="tags">
        <div
          :class="[{'btn':true}, {'is-select': item.selected}]"
          v-for="(item, index) in tags"
          :key="index"
          @click="selectTag(item.tagName, index)">
          {{item.tagName}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { upload } from '@/apis/UserInfo.js'
import { addArticles } from '@/apis/articles/articles'
import { getSingleArticle } from '@/apis/articles/articles'
import { createNotification } from '@/apis/notification/index'
import { tags } from '@/utils/tags'
export default {
  name: 'writeArticle',
  watch: {
    selectedTagList: {
      deep: true,
      handler() {
        console.log(this.selectedTagList)
      }
    }
  },
  data() {
    return {
      tags,
      selectedTag: 0,            // 已选择的标签数量
      selectedTagList: [],       // 存放已选标签的数组
      coverImage: null,            // 封面图片
      md_content: '',
      titleValue: '',
      html_content: '',
      md_content: '',
      imageList: [],
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        preview: true, // 预览
      },
      articleInfos: {},
    }
  },
  methods: {
    // 选择标签
    selectTag(tagName, index) {
      if(this.tags[index].selected) {
        this.tags[index].selected = false
        this.selectedTag -= 1
        let tagIndex = this.selectedTagList.indexOf(tagName)
        this.selectedTagList.splice(tagIndex, 1)
      } else if(this.selectedTag > 1) {
        this.$message({
          type: 'warning',
          message: '最多只能选择两个标签'
        })
      } else {
        this.selectedTag += 1
        this.selectedTagList.push(tagName)
        this.tags[index].selected = true
      }
    },
    getPostData() {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      let postData = {
        article_title: this.titleValue,
        username: userInfo.username,
        uid: userInfo.uid,
        avatar: userInfo.avatar,
        md_content: this.md_content,
        html_content: this.html_content,
        type: this.$route.query.type || '',
        has_article_id: this.$route.query.article_id || '',
        tags: this.selectedTagList.join(','),
        create_time: Date.parse(new Date())
      }
      return postData
    },
    // 发布文章
    publish() {
      if(this.selectedTagList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先选择标签'
        })
        return
      }
      let postData = this.getPostData()
      addArticles(postData).then(res => {
        if(res && res.data.status) {
          this.$message({
            type: 'success',
            message: '发布成功, 即将跳转到文章页面'
          })
          this.uploadCoverImage(res.data.article_id)
          this.isInsertNotification(res.data.article_id)
        }
      })
    },
    // 先上传文章, 再利用返回的文章id将相册封面插进数据库
    uploadCoverImage(article_id) {
      if(!this.coverImage) {
        this.toArticlePage(article_id)
        return
      }
      let formData = new FormData()
      formData.append('article_id', article_id)
      formData.append('file', this.coverImage)
      upload(formData).then(res => {
        if(res && res.data.status) {
          this.toArticlePage(article_id)
        }
      })
    },
    // 如果有人关注该用户, 那么发布的文章应该要通知关注的用户
    isInsertNotification(article_id) {
      createNotification({
        uid: JSON.parse(localStorage.getItem('userInfo')).uid,   // 发布文章的用户id
        article_id,                                              // 文章id
        tags: this.selectedTagList.join(','),                    // 文章标签
      }).then(res => {
        if(res && res.data.status) {

        }
      })
    },
    toArticlePage(article_id) {
      setTimeout(() => {
        this.$router.push({
          name: 'showArticle',
          params: { article_id }
        })
      }, 1000)
    },
    // 保存已经选择的相册封面
    changeCoverImage() {
      this.coverImage = this.$refs.coverImage.files[0]
    },
    save() {
      console.log('保存文章')
    },
    uploadImage(filename = null, image) {
      let formData = new FormData()
      let uid = JSON.parse(localStorage.getItem('userInfo')).uid
      formData.append('uid', uid)
      formData.append('file', image)
      upload(formData).then(res => {
        console.log(res, 'upload image')
        if(res && res.data.status) {
          this.$refs.md.$img2Url(filename, res.data.imageUrl)   // 图片上传之后将后端返回的图片地址替换掉当前地址
          this.imageList.push(res.data.imageUrl)                // 将图片放到数组中, 因为可能有多张图片
        }
      })
    },
    /**
     * @content markdown代码
     * @render  通过渲染markdown代码后得到的html代码
     */
    toHtml(content, render) {
      this.md_content = content
      this.html_content = render
    },
    calculateHeight() {
      let navHeight = document.querySelector('.navbar').offsetHeight
      let boxNode = document.querySelector('.article-box')
      boxNode.style.height = document.body.clientHeight - navHeight - 20 + 'px'
    },
    resize() {
      window.resize = () => {
        this.calculateHeight()
      }
    },
    resetTags() {
      this.tags.forEach((item, index) => {
        this.tags[index].selected = false
      })
    },
    setTags(tags) {
      let tagsList = tags.split(',')
      tagsList.forEach(tag => {
        this.tags.forEach((item, index) => {
          if(item.tagName === tag) {
            this.tags[index].selected = true
            this.selectedTagList.push(this.tags[index].tagName)
            this.selectedTag += 1
          }
        })
      })
    }
  },
  mounted() {
    this.calculateHeight()
    this.resize()
    // 如果路由带有type这个参数并且为edit， 说明是编辑文章
    if(this.$route.query.type === 'edit') {
      getSingleArticle({
        article_id: this.$route.query.article_id
      }).then(res => {
        if(res && res.data.status) {
          let data = res.data.data
          this.md_content = data.md_content
          this.titleValue = data.article_title
          this.setTags(data.tags)
        }
      })
    }
  },
  created() {
    this.resetTags()
  }
}
</script>

<style lang="scss">
.v-note-wrapper {
  height: 87%;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 12px 0px;
  z-index: 0!important;
}
.article-box {
  .hide {
    display: none!important;
  }
  .input-box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 25px;
    background: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 12px 0px;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
    height: 60px;
    .title-input {
      display: inline-block;
      width: 100%;
      height: 60px;
      line-height: 60px;
      border: none;
      outline: none;
      font-size: 20px;
      font-weight: bold;
      border-top-right-radius: 14px;
    }
  }
}

</style>

<style lang="scss" scoped>
@import '../.././styles/variables.scss';
.article-box {
  height: 100%;
}
.toolbars {
  .select-cover-image {
    margin-left: 20px;
    margin-bottom: 10px;
    padding: 10px;
    text-align: center;
    color: #4851e3;
    background: rgba(0,0,0,0.01);
    border-radius: 4px;
    box-shadow: 0 6px 8px 0 rgba(86,98,255,0.15);
    cursor: pointer;
    transition: 0.3s;
    .title {
      cursor: pointer;
    }
  }
  .select-cover-image:hover {
    background: #4851e3;
    color: #fff;
    transition: 0.3s;
  }
  .upload-cover-image {
    display: none;
  }
}
.btn-box {
  display: inline-block;
  background: $pupple;
  border-radius: 24px;
  box-shadow: 0 6px 8px 0 rgba(86,98,255,0.15);
  height: 29px;
  width: 60px;
  margin-right: 18px;
  cursor: pointer;
  .modal-color {
    transition: 0.5s;
    border-radius: 24px;
    height: 24px;
  }
  .modal-color:hover {
    background: rgba(0,0,0,0.10);
    transition: 0.5s;
  }
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 29px;
  line-height: 29px;
  .btn {
    height: 29px;
    color: white;
    font-size: 14px;
    text-decoration: none;
  }
}
.tags {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  width: 200px;
  height: 300px;
  background: rgba(0,0,0,0.01);
  border-radius: 4px;
  margin-left: 20px;
  box-shadow: 0 6px 8px 0 rgba(86,98,255,0.15);
  .btn {
    font-size: 13px;
    padding: 10px;
    height: 10px;
    line-height: 10px;
    backgroud: #fff;
    border-radius: 8px;
    border: 1px solid #4851e3;
    color: #4851e3;
    margin: 5px;
    box-shadow: 0 6px 8px 0 rgba(86,98,255,0.15);
    transition: 0.3s;
    cursor: pointer;
  }
  .btn:hover {
    color: #fff;
    background: #4851e3;
    transition: 0.3s;
  }
  .is-select {
    color: #fff;
    background: #4851e3;
  }
}
</style>