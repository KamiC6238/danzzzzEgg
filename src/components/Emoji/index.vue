<template>
  <div class="emoji">
    <ul class="emoji-list">
      <li class="emoji-item" v-for="(item, index) in emojis" @click="selectEmoji(index)">
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'emoji',
  data() {
    return {
      emojis: ["😃", "😘", "😂", "😳", "😍", "👏", "👍", "👎", "😁", "😉", "😠", "😞", "😥", "😭", "😝", "😡", "❤", "💔", "😣", "😔", "😄", "😷", "😚", "😓", "😊", "😢", "😜", "😨", "😰", "😲", "😏", "😱", "😪", "😖", "😌", "😒", "👻", "🎅", "👧", "👦", "👩", "👨", "🐶", "🐱", "👊", "✊", "✌", "💪", "👆", "👇", "👉", "👈", "👌", "💩"]
    }
  },
  methods: {
    selectEmoji(index) {
      this.$emit('selectedEmoji', this.emojis[index])
    }
  }
}
</script>

<style lang="scss" scoped>
.emoji {
  position: absolute;
  top: 157px;
  left: 145px;
}

.emoji-list {
  display: flex;
  flex-wrap: wrap;
  width: 225px;
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 5px 18px 0 rgba(0,0,0,.16);
  .emoji-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    margin: 4px;
    cursor: pointer;
  }
  .emoji-item:hover {
    transform: scale(1.2);
  }
}
</style>