<template>
  <div class="login-container">
    <div class="login-form">
      <div class="input-username">
        <p class="username">用户名</p>
        <i class="iconfont icon-hebingxingzhuang"></i>
        <input
          v-focus
          class="input-user"
          type="text"
          placeholder="请输入用户名"
          v-model="loginForm.username"
          @blur="cancelUserColor"
          @focus="setUserColor"
          ref="userinput" />
        <span class="user-span"></span>
      </div>
      <div class="input-password">
        <p class="password">密码</p>
        <i class="iconfont icon-mima"></i>
        <input
        class="input-pass"
        type="password"
        placeholder="请输入密码"
        @keyup.enter="handleLogin"
        @blur="cancelPassColor"
        @focus="setPassColor"
        v-model="loginForm.password"
        ref="passinput" />
        <span class="pass-span"></span>
      </div>
      <div class="input-password" v-show="isRegister">
        <p class="check-pass">确认密码</p>
        <i class="iconfont icon-mima"></i>
        <input
        class="input-pass"
        type="password"
        placeholder="请再次输入密码"
        @keyup.enter="handleLogin"
        @blur="cancelPassColor"
        @focus="setPassColor"
        v-model="loginForm.checkPass"
        ref="passinput" />
        <span class="pass-span"></span>
      </div>
      <div class="alert">
        <el-alert
          v-show="prompt"
          type="error"
          show-icon>
          <i slot="title" style="font-style:normal;">
            <span>{{message | findPass}}</span>
            <a v-show="message.indexOf('找回密码') > -1" href="#" style="color:#4851E3;">找回密码</a>
          </i>
        </el-alert>
      </div>
    </div>
    <div class="btn">
      <div class="btn-box" @click.stop="handleLogin">
        <div class="modal-color">
          <div class="flex">
            <a class="btn" href="/#/auth/login" v-if="!isRegister">
              登录
            </a>
            <a class="btn" href="#" v-else-if="isRegister">
              注册
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="register" style="left:49%" v-if="isRegister === false" @click.stop="changeRegister">
      <p>注册</p>
    </div>
    <div class="back-to-login" v-if="isRegister === true" @click.stop="backToLogin">
      <p>返回登录</p>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/apis/auth/index'
export default {
  name: 'login',
  directives: {
    focus: {
      inserted: function (el) {
        let userNode = document.querySelector('.username')
        userNode.style.color = '#4851E3'
        el.focus()
      }
    }
  },
  filters: {
    findPass(msg) {
      if(msg.indexOf('找回密码') > -1) {
        return '用户名或密码错误, 请重新输入或'
      }
      return msg
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    'loginForm.password': {
      handler() {
        if(this.loginForm.password !== '') {
          console.log('watch')
        }
      }
    }
  },
  data() {
    return {
      isRegister: false,
      prompt: false,
      loginForm: {
        username: '',
        password: '',
        checkPass: ''
      },
      message: '',
      message1: '用户名或密码错误, 请重新输入或者找回密码',
      message2: '密码不能为空, 请输入密码',
      message3: '用户名不能空, 请输入用户名',
      message4: '用户名和密码不能为空, 请重新输入'
    }
  },
  methods: {
    getNode() {
      let userNode = document.querySelector('.username')
      let passNode = document.querySelector('.password')
      let checkPassNode = document.querySelector('.checkPass')
      return {
        userNode,
        passNode,
        checkPassNode
      }
    },
    cancelUserColor() {
      this.getNode().userNode.style.color = '#515A6E'
    },
    cancelPassColor() {
      this.getNode().passNode.style.color = '#515A6E'
    },
    cancelCheckPassColor() {
      this.getNode().checkPassNode.style.color = '#515A6E'
    },
    changeUserFont() {
      this.setUserColor()
    },
    changePassFont() {
      this.setPassColor()
    },
    changeCheckPassFont() {
      this.setPasCheckPasssColor()
    },
    setUserColor() {
      this.getNode().userNode.style.color = '#4851E3'
      this.getNode().passNode.style.color = '#515A6E'
    },
    setPassColor() {
      this.getNode().userNode.style.color = '#515A6E'
      this.getNode().passNode.style.color = '#4851E3'
    },
    setPasCheckPasssColor() {
      this.getNode().userNode.style.color = '#515A6E'
      this.getNode().passNode.style.color = '#515A6E'
      this.getNode().checkPassNode.style.color = '#4851E3'
    },
    // 根据输入框的状态修改错误提示语
    check() {
      let res = false
      if(!this.loginForm.username && !this.loginForm.password) {
        this.message = this.message4
        this.$refs.userinput.focus()
        this.setUserColor()
        this.prompt = true
        res = true
      } else if(!this.loginForm.username) {
        this.message = this.message3
        this.$refs.userinput.focus()
        this.setUserColor()
        this.prompt = true
        res = true
      } else if(this.loginForm.password === '') {
        this.message = this.message2
        this.$refs.passinput.focus()
        this.setPassColor()
        this.prompt = true
        res = true
      }
      return res
    },
    changeRegister() {
      this.isRegister = true
      this.loginForm.username = ''
      this.loginForm.password = ''
    },
    backToLogin() {
      this.isRegister = false
    },
    handleLogin() {
      // 如果isRegister为true, 此时点击按钮应该走handleRegister
      if(this.isRegister) {
        this.handleRegister()
        return
      }
      this.$axios({
        url: '/apis/auth/login',
        method: 'post',
        data: {
          username: this.loginForm.username,
          password: this.loginForm.password
        }
      }).then(res => {
        if(res && res.data.status) {
          let result = res.data.userInfo
          localStorage.setItem('userInfo', JSON.stringify(result))
          this.$router.push('/index') // 登录成功后跳转到首页
          this.$store.commit('setLogStatus', true)  // 保存登录状态
        } else if(res && !res.data.status) {
          this.$message({
            message: '用户名或密码有误, 请重新输入',
            type: 'error'
          })
        }
      })
    },
    handleRegister() {
      if(this.checkTwoPass()) {
        return
      }
      // register({
      //   username: this.loginForm.username,
      //   password: this.loginForm.password
      // }).
      this.$axios({
        url: '/apis/auth/register',
        method: 'post',
        data: {
          username: this.loginForm.username,
          password: this.loginForm.password
        }
      }).then(res => {
        if(res && res.data.status) {
          this.isRegister = false
        } else if(res && !res.data.status) {
          this.$message.error({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    checkTwoPass() {
      if(this.loginForm.password !== this.loginForm.checkPass) {
        this.$message({
          message: '两次输入的密码不一致, 请重新输入',
          type: 'error'
        })
        return true
      }
      return false
    }
  },
  created() {
    if(this.$route.path === '/auth/register') {
      this.isRegister = true
    }
  }
}
</script>

<style lang="scss">
.login-container {
  .el-alert.is-light .el-alert__closebtn {
    display: none!important;
  }
}
</style>

<style lang="scss" scoped>
@import '../.././styles/variables';
html, body {
  position: relative;
  width: 100%;
  height: 100%;
}
.login-container {
  width: 100%;
  height: 689px;
  background: url("../../assets/img/login.png") no-repeat;
  background-size: cover;
  background-position: 50%;
  min-width: 1100px;
  .login-form {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    padding-left: 38px;
    .username,
    .password,
    .check-pass {
      padding-bottom: 14px;
      color: #666666;
    }
    .iconfont {
      font-size: 21px;
      padding-right: 14px;
      color: #000000;
    }
    // 去除chrome自动填充的背景色
    input {
      border: none;
      background: transparent;
      width: 300px;
      border: 1px solid;
      border-radius: 0px;
      border-color: transparent;
      -webkit-appearance: none;
      font-size: 20px;
      // padding: 12px 5px 12px 15px;
      padding-bottom: 17px;
      outline:none;
      color: #000000;
      &:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
        background-color:transparent;
        transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
      }
    }
    input[type=password] {
      letter-spacing: 10px;
    }
    input::-webkit-input-placeholder {
      letter-spacing: 0px;
      font-size: 14px;
      color: #B8B8B8;
      // padding-left: 10px;
    }
    .input-username {
      position: relative;
      width: 100%;
      height: 100%;
      margin-bottom: 35px;
      .user-span {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 300px;
        height: 1px;
        background: #666;
      }
      .user-span:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, #4851E3 0%, #638aef 100%);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.5s ease-in-out;
      }
      .input-user:focus ~ .user-span:before {
        transform: scaleX(1);
        height: 2px;
        transform-origin: left;
        transition: transform 0.5s ease-in-out;
      }
    }
    .input-password {
      position: relative;
      width: 100%;
      height: 100%;
      margin-bottom: 35px;
      .pass-span {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 300px;
        height: 1px;
        background: #666;
      }
      .pass-span:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, #4851E3 0%, #638aef 100%);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.5s ease-in-out;
      }
      .input-pass:focus ~ .pass-span:before {
        transform: scaleX(1);
        height: 2px;
        transform-origin: left;
        transition: transform 0.5s ease-in-out;
      }
    }
  }
  .el-alert--error.is-light {
    background-color: transparent;
    color: #ed4014!important;
    padding-left: 38px;
  }
  .el-alert {
    position: absolute;
    left: 0;
    bottom: -39px;
    padding: 0;
  }
  .btn {
    position: absolute;
    left: 50%;
    bottom: 22%;
    transform: translate(-50%, -50%);
    text-align: center;
    .btn-box {
      display: inline-block;
      width: 100px;
      height: 40px;
      border-radius: 30px;
      background: $pupple;
      box-shadow: 0 6px 8px 0 rgba(86,98,255,0.15);
      cursor: pointer;
      .modal-color {
        border-radius: 30px;
        width: 100px;
        height: 40px;
        transition: 0.5s;
      }
      .modal-color:hover {
        background: rgba(0,0,0,0.10);
        transition: 0.5s;
      }
    }
    .flex {
      position: relative;
      height: 40px;
      .btn {
        position: absolute;
        left: 50%;
        top: 50%;
        height: 40px;
        line-height: 40px;
        color: white;
        font-size: 14px;
        text-decoration: none;
      }
    }
  }
  .register,
  .back-to-login {
    position: absolute;
    left: 48%;
    bottom: 17%;
    color: #666;
    cursor: pointer;
  }
}

@media screen and (max-height: 800px) {
  .login-container {
    .login-form {
      input,
      .input-username .user-span,
      .input-password .pass-span {
        width: 353px;
      }
    }
    .btn {
      bottom: 20%;
      .btn-box,
      .btn-box .modal-color {
        width: 150px;
        height: 40px;
      }
      .flex {
        height: 38px;
        .btn {
          height: 38px;
          line-height: 38px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>