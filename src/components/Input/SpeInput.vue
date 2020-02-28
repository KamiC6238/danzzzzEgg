<template>
<div class="input-box">
  <input v-model="value" class="input-content" type="text" @keyup.enter="search" placeholder="搜索" />
    <div class="icon-box">
      <div class="middle">
        <div class="input-modal" @click="search"></div>
        <a href="#" class="icon-content" @click="search">
          <i class="iconfont icon-sousuo"></i>
        </a>
      </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'spe-input',
  props: ['placeholder','modelVal'],
  data() {
    return {
      value: '',
    }
  },
  watch:{
    modelVal(val){
      if(val.indexOf('clear') == 0){
        this.value = ""
      }
    }
  },
  methods: {
    search() {
      this.$emit('search', this.value)
    },
    setBorder() {
      let node = document.querySelector('.input-box')
      node.style.border = '1px solid #4851E3'
      node.style.transition = '0.3s'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../.././styles/variables.scss';
.icon-sousuo {
  font-size: 14.4px;
  color: white;
}
input[type=text]::-webkit-input-placeholder {
  color: #B8B8B8;
}
input::-webkit-input-placeholder {
  font-size: 14px;
}

.input-box {
  display: inline-block;
  position: relative;
  background: white;
  width: 200px;
  height: 48px;
  border-radius: 24px;
  padding-left: 20px;
  box-shadow: 0 0 1px 0 rgba(51,51,51,0.08), 0 3px 6px 0 rgba(51,51,51,0.05);
  box-sizing: content-box;
  border: 1px solid #4851E3;
  transition: 0.3s;
}

.input-content {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  outline: none;
  border-radius: 24px;
  width: 150px;
  padding-left: 2px;
  font-size: 14px;
  font-weight: 600;
}

input::-webkit-input-placeholder {
  font-weight:normal;
}

.icon-box {
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 49px;
  height: 49px;
  border-radius: 24px;
  transition: 0.5s;
}

.middle {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 24px;
}

.input-modal {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  transition: 0.5s;
  cursor: pointer;
}

.input-modal:hover {
  background: rgba(0,0,0,0.10);
  transition: 0.5s;
}

.input-modal {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  transition: 0.5s;
  cursor: pointer;
}

.input-modal:hover {
  background: rgba(0,0,0,0.10);
  transition: 0.5s;
}

.icon-content {
  display: flex;
  width: 38px;
  height: 38px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: $pupple;
}

.icon-content:hover {
  background: rgba(0,0,0,0.10);
  transition: 0.5s;
}
</style>