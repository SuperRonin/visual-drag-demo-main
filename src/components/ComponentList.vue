<template>
  <div class="component-list" @dragstart="handleDragStart">
    <div v-for="(item, index) in componentList" :key="index" class="list" draggable :data-index="index">
      <img v-if="item.defaultIcon" :src="item.defaultIcon" class="default-icon" alt="" />
      <span v-else-if="item.icon.substr(0, 2) === 'el'" :class="item.icon"></span>
      <span v-else class="iconfont" :class="'icon-' + item.icon"></span>
    </div>
  </div>
</template>

<script>
import componentList from '@/custom-component/component-list'

export default {
  data() {
    return {
      componentList,
    }
  },
  methods: {
    handleDragStart(e) {
      e.dataTransfer.setData('index', e.target.dataset.index)
    },
  },
}
</script>

<style lang="scss" scoped>
.component-list {
  opacity: 1;
  height: 65%;
  padding: 8px;
  display: grid;
  position: relative;
  grid-gap: 10px 19px;
  grid-template-columns: repeat(auto-fill, 80px);
  // grid-template-rows: repeat(auto-fill, 40px);
  grid-template-rows: repeat(auto-fill, 80px);
  transition: opacity 0.5s 0.5s;

  .list {
    width: 80px;
    // height: 40px;
    height: 80px;
    border: 1px solid #ddd;
    cursor: grab;
    text-align: center;
    padding: 2px 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    .default-icon {
      width: 60px;
      height: 60px;
      pointer-events: none;
    }
    &:active {
      cursor: grabbing;
    }

    .iconfont {
      margin-right: 4px;
      font-size: 20px;
    }

    .icon-wenben,
    .icon-biaoge {
      font-size: 18px;
    }

    .icon-tupian {
      font-size: 16px;
    }
  }
}
</style>
