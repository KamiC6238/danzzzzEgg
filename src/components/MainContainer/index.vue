<template>
  <div class="main-container">
    <ul class="articles-list">
      <li class="article" v-for="(item, index) in articles" :key="index">
        <p class="describe">{{item.describe}}</p>
        <p class="title">{{item.title}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MainContainer',
  props: {
    articles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  position: relative;
  background: #edeff8;
  height: 89.1%;
  padding: 20px 20px 0 20px;
  .articles-list {
    position: absolute;
    width: 46%;
    height: 97%;
    list-style: none;
    padding-left: 17%;
    overflow: auto;
    .article {
      padding: 18px 24px;
      background: #ffffff;
      border-bottom: 1px solid hsla(0,0%,59.2%,.1);
      .describe {
        color: #b2bac2;
        font-size: 13px;
      }
      .title {
        color: #2e3135;
        font-size: 19px;
        padding: 10px 0px;
      }
    }
  }
}
</style>