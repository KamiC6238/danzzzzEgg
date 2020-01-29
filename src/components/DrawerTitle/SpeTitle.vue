<template>
  <i :class="'iconfont' + ' ' + iconName">
    <span class="drawer-title">{{drawerTitle}}</span>
  </i>
</template>

<script>
export default {
  name: 'SpeTitle',
  props: ['drawerTitle', 'iconName']
}
</script>

<style scoped>
.drawer-title {
  padding-left: 14px;
  font-size: 22px;
  color: #000000;
  height: 30px;
  line-height: 30px;
  font-weight: bold;
}
.iconfont {
  font-size: 20px!important;
  color: #000000;
}
</style>