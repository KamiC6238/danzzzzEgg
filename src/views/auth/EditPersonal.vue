<template>
  <div class="edit-userinfo">
    <div class="container">
      <div class="main-container">
        <div class="edit">
          <ul class="edit-form">
            <li class="edit-title">
              <span>个人资料</span>
            </li>
            <li class="edit-item">
              <span>头像</span>
              <el-upload
                class="avatar-uploader"
                :action="upload()"
                :data="userInfo"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
                :on-change="uploadChange"
                :on-progress="uploadProgress"
                :before-upload="beforeAvatarUpload">
                <img :src="imageUrl === '' ? defaultUrl : imageUrl" class="avatar">
              </el-upload>
              <div class="des">
                <p>支持 jpg、png 格式大小 5M 以内的图片</p>
              </div>
            </li>
            <li
              class="edit-item"
              v-for="(item, index) in list"
              :key="index"
            >
              <span>{{item.label}}</span>
              <input
                :class="[item.className, 'input']"
                :placeholder="item.placeholder"
                type="text"
                v-model="item.value"
                @focus="focusInput(index)"
              />
              <div class="fix-box">
                <i class="iconfont icon-edit" v-if="item.isFix" @click="fix(index)"></i>
                <span class="fix" @click="fix(index)" v-if="item.isFix">修改</span>
                <span v-else>
                  <span class="save" @click="save(index)">保存</span>
                  <span class="cancel" @click="cancel(index)">取消</span>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadAvatar, editUserInfo, getUserInfo } from '@/apis/UserInfo'
export default {
  name: 'editUserInfo',
  data() {
    return {
      preIndex: null,
      imageUrl: '',
      defaultUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      userInfo: {},
      userForm: {},
      list: [{
        label: '用户名',
        value: '',
        placeholder: '填写你的用户名',
        className: 'user-input',
        isFix: true
      }, {
        label: '职位',
        value: '',
        placeholder: '填写你的职位',
        className: 'post-input',
        isFix: true
      }, {
        label: '公司',
        value: '',
        placeholder: '填写你的公司',
        className: 'company-input',
        isFix: true
      }, {
        label: '个人介绍',
        value: '',
        placeholder: '填写职业技能、擅长的事情、喜欢的事情等',
        className: 'intro-input',
        isFix: true
      }, {
        label: '个人主页',
        value: '',
        placeholder: '填写你的个人主页',
        className: 'page-input',
        isFix: true
      }],
    }
  },
  watch: {
    imageUrl: {
      handler() {
        // this.changeBorder()
      }
    },
    list: {
      deep: true,
      handler() {
        // console.log(this.list, 'list')
      }
    }
  },
  methods: {
    upload(file) {
      return '/apis/uploadAvatar'
    },
    handleAvatarSuccess(res, file, fileList) {
      // 将返回的图片地址赋值给imageUrl, 回显图片
      this.imageUrl = res.imageUrl

      // 上传了新的头像后，要修改localStorage里面的avatar, 不然导航里面的头像不会变
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      userInfo.avatar = this.imageUrl
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      console.log(res, 'res')
    },
    handleAvatarError(res, file) {
      console.log(file, 'error')  
    },
    uploadChange(file, fileList) {

    },
    uploadProgress(err, file) {
      console.log(file, 'uploadProgress')
    },
    async beforeAvatarUpload(file) {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.userInfo.uid = userInfo.uid         // el-upload组件用:data来传送额外的参数, 这里绑定了userInfo作为额外参数

      const isImage = file.type === 'image/png' || file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isImage) {
        this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      this.imageUrl = ''
      return isImage && isLt2M;
    },
    focusInput(index) {
      this.list[index].isFix = false
    },
    fix(index) {
      this.list[index].isFix = false 
    },
    setUserForm() {
      this.userForm = {
        uid: JSON.parse(localStorage.getItem('userInfo')).uid,
        username: this.list[0].value || '',
        post: this.list[1].value || '',
        company: this.list[2].value || '',
        intro: this.list[3].value || '',
        personal_page: this.list[4].value || ''
      }
      console.log(this.userForm, 'userform')
    },
    save(index) {
      this.setUserForm()
      editUserInfo(this.userForm).then(res => {
        console.log(res)
      })
      this.list[index].isFix = true
    },
    cancel(index) {
      this.list[index].isFix = true
    },
    checkImageUrl() {
      if(this.imageUrl.indexOf('null') > -1) {
        this.imageUrl = ''
      }
    }
  },  
  created() {
    getUserInfo({
      uid: JSON.parse(localStorage.getItem('userInfo')).uid
    }).then(res => {
      if(res && res.data.status) {
        let data = res.data.userInfo
        this.imageUrl = data.avatar
        this.checkImageUrl()
        this.list[0].value = data.username
        this.list[1].value = data.post
        this.list[2].value = data.company
        this.list[3].value = data.intro
        this.list[4].value = data.personal_page
      }
    })
  }
}
</script>

<style lang="scss">
.edit-item {
  .avatar-uploader {
    display: flex;
    align-items: center;
    margin-left: 100px;
    margin-right: 20px;
    .el-upload {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
    }
    .el-icon-plus {
      color: #4851e3;
    }
  }
}
</style>

<style lang="scss" scoped>
.edit-userinfo {
  height: 92%;
  .container {
    width: 600px;
    padding: 20px 20px 0 20px;
    background: #edeff8;
    .main-container {
      position: relative;
      height: 100%;
      .edit {
        width: 100%;
        background: #ffffff;
        border-radius: 25px;
        .edit-form {
          padding: 40px;
          .edit-title {
            height: 36px;
            font-size: 20px
          }
          .edit-item {
            display: flex;
            height: 76px;
            line-height: 76px;
            border-top: 1px solid #f1f1f1;
            .des {
              color: #909090;
              font-size: 13px;
            }
            .input {
              width: 280px;
              color: #585859;
            }
            .post-input,
            .user-input,
            .company-input,
            .page-input,
            .intro-input {
              outline: none;
              border: none;
            }
            .user-input {
              margin-left: 83px;
            }
            .post-input,
            .company-input {
              margin-left: 100px;
            }
            .intro-input,
            .page-input {
              margin-left: 66px;
            }
            .fix-box {
              flex: 1;
              display: flex;
              justify-content: flex-end;
              .iconfont {
                color: #4851e3;
                font-size: 16px;
                cursor: pointer;
              }
              .fix {
                margin-left: 8px;
                font-size: 14px;
                color: #4851e3;
                cursor: pointer;
              }
            }
            .save {
              display: inline-block;
              color: #4851e3;
              margin-right: 10px;
            }
            .save,
            .cancel {
              font-size: 14px;
              cursor: pointer;
            }
            .avatar {
              width: 60px;
              height: 60px;
            }
          }
        }
      }
    }
  }
}
.add-border {
  border: 1px dashed #4851e3;
}
.remove-border {
  border: none;
}
</style>