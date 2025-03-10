<template>
  <div class="icon-list" @dragstart="handleDragStart">
    <div v-for="(item, index) in iconList" :key="index" class="list" draggable :data-index="index">
      <img :src="item" style="width: 100px; height: 100px" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconList',
  props: {
    iconList: {
      type: Array,
      default: () => ['https://file.evatmaster.com/25010303fede5a26ba49308625674cd11ac2b6.png?v=1'],
    },
  },
  data() {
    return {}
  },
  methods: {
    handleDragStart(e) {
      e.dataTransfer.setData('index', e.target.dataset.index)
    },
  },
}
</script>
<style lang="scss" scoped>
.icon-list {
  opacity: 1;
  height: 65%;
  padding: 8px;
  display: grid;
  position: relative;
  grid-gap: 10px 19px;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 40px);
  transition: opacity 0.5s 0.5s;

  .list {
    width: 80px;
    height: 40px;
    border: 1px solid #ddd;
    cursor: grab;
    text-align: center;
    padding: 2px 5px;
    display: flex;
    align-items: center;
    justify-content: center;

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
