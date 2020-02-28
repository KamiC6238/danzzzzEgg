<template>
  <div class="btn-box" :style="{'width':btnInfo.width, 'height':btnInfo.height, 'borderRadius':btnInfo.borderRadius}">
    <div class="modal-color" :style="{'lineHeight': btnInfo.height, 'width':btnInfo.width, 'height':btnInfo.height, 'borderRadius':btnInfo.borderRadius}">
      <div class="flex">
          <a class="btn" href="###" :style="{'lineHeight': btnInfo.height,'fontWeight': fontWeight, 'fontSize': fontSize}">
            <i v-show="btnInfo.needAdd" class="iconfont icon-tianjia"></i>
            <i v-show="btnInfo.import" class="iconfont icon-pldr"></i>
            {{btnInfo.buttonName}}
          </a>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'spe-button',
  props: {
    btnInfo: {
      type: Object,
      default: {}
    },
    iconName: {
      type: String,
      default: ''
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    fontWeight: {
      type: String,
      default: 'normal'
    },
  },
  data() {
    return {
      
    }
  },
  created() {
    
  }
}
</script>

<style lang="scss" scoped>
@import '../.././styles/variables.scss';
.icon-pldr,
.icon-tianjia {
  color: white;
  font-size: 13px;
  padding-right: 7px;
}
.btn-box {
  display: inline-block;
  background: $pupple;
  border-radius: 24px;
  box-shadow: 0 6px 8px 0 rgba(86,98,255,0.15);
  cursor: pointer;
  .modal-color {
    transition: 0.5s;
    border-radius: 24px;
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
  .btn {
    color: white;
    font-size: 16px;
    text-decoration: none;
  }
}
</style>