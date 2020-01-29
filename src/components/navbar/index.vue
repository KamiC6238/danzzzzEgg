<template>
  <div class="navbar">
    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
      <div class="navbar-left">
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">动态</el-menu-item>
      </div>
      <div class="navbar-right">
        <el-menu-item>
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            width="200px"
            v-model="inputValue">
          </el-input>
        </el-menu-item>
        <el-menu-item style="padding-left:0px;">
          <el-dropdown split-button type="primary" @click="handleClick" trigger="click">
            写文章
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>发布动态</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'navbar',
  data() {
    return {
      activeIndex: '1',
      inputValue: '',
    }
  },
  methods:{
    handleSelect(key, keyPath) {
      
    },
    handleClick() {

    }
  },
  mounted() {

  }
}
</script>

<style lang="scss">
.navbar {
  .el-input {
    top: -4px;
  }
  .el-menu-item {
    background: #ffffff!important;
  }
  .el-menu.el-menu--horizontal {
    display:flex;
    position: absolute;
    justify-content: space-between;
    width: 100%;
  }
  .el-menu--horizontal>.el-menu-item {
    color: #71777c!important;
    border: none!important;
  }
  .el-menu-item.is-active {
    color: #4851E3!important;
  }
  .el-dropdown {
    height: 57px;
    line-height: 51px;
  }
  .el-button {
    padding: 10px;
  }
}
</style>

<style lang="scss" scoped>
.navbar {
  position: relative;
  height: 57px;
  width: 100%;
  .navbar-left {
    display:flex;
    justify-content: flex-start;
  }
  .navbar-right {
    display:flex;
    justify-content: flex-end;
  }
}
</style>