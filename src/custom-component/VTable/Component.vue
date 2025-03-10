<template>
  <!-- <div>
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
  </div> -->
  <table class="v-table">
    <tbody>
      <template v-for="(item, index) in propValue.data">
        <tr
          :key="index"
          :class="{
            stripe: propValue.stripe && index % 2,
            bold: propValue.thBold && index === 0,
          }"
        >
          <td v-for="(e, i) in item" :key="i" @dblclick="handleClick(index, i)">
            <template v-if="canEditIndex === index + ',' + i">
              <el-input v-model="propValue.data[index][i]" v-focus style="border: none" @blur="onBlur"></el-input>
            </template>
            <span v-else>{{ e }}</span>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import request from '@/utils/request'
import OnEvent from '../common/OnEvent'

export default {
  directives: {
    focus: {
      // 指令的定义
      inserted(el) {
        // 聚焦元素
        el.querySelector('input').focus()
      },
    },
  },
  extends: OnEvent,
  props: {
    propValue: {
      type: Object,
      default: () => {},
    },
    request: {
      type: Object,
      default: () => {},
    },
    element: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      canEditIndex: '',
      cancelRequest: null,
      dragState: {}, // 记录子表的列宽移动的一些数值
      dragging: false, // 子表是否在重置列宽
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address:
            '上海市普陀区金沙江路 1518 弄,上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    }
  },
  created() {
    if (this.request) {
      this.cancelRequest = request(this.request, this.propValue, 'data')
    }
  },
  beforeDestroy() {
    this.request && this.cancelRequest()
  },
  methods: {
    handleClick(row, col) {
      this.canEditIndex = `${row},${col}`
      this.$nextTick(() => {
        if (this.$refs.editInput) {
          const input = Array.isArray(this.$refs.editInput) ? this.$refs.editInput[0] : this.$refs.editInput
          input.$el.querySelector('input').focus()
        }
      })
    },
    onBlur() {
      this.canEditIndex = ''
    },
    handleMouseMove(event) {
      let target = event.target
      console.log('🚀 ~ handleMouseMove ~ target:', target)
      // while (target && target.tagName !== 'TH') {
      //   target = target.parentNode
      // }
      if (!this.dragging) {
        let rect = target.getBoundingClientRect()
        const bodyStyle = document.body.style
        if (rect.width > 12 && rect.right - event.pageX < 8) {
          // 拖拽的鼠标样式
          bodyStyle.cursor = 'col-resize'
        } else if (!this.dragging) {
          bodyStyle.cursor = ''
        }
      }
    },
    handleMouseOut() {
      document.body.style.cursor = ''
    },
    handleMouseDown(event) {
      // 开始拖拽
      this.dragging = true
      // 当前拖拽的列所在的表格
      let tableEl = event.target
      // 当前所在列（单元格）
      let thEL = event.target
      while (tableEl && tableEl.tagName !== 'TABLE') {
        tableEl = tableEl.parentNode
      }
      // 获取列宽拖拽的显示线（拖拽线）
      let resizeProxy = tableEl.querySelector('.el-table__column-resize-proxy')
      while (thEL && thEL.tagName !== 'TH') {
        thEL = thEL.parentNode
      }
      const columnRect = thEL.getBoundingClientRect()
      thEL.classList.add('noclick')
      this.dragState = {
        startMouseLeft: event.clientX, // 鼠标开始的地方
        columnWidth: columnRect.width, // th开始拖拽的宽度
      }
      resizeProxy.style.top = `${tableEl.getBoundingClientRect().top}px`
      resizeProxy.style.height = `${tableEl.getBoundingClientRect().height}px`
      resizeProxy.style.left = `${this.dragState.startMouseLeft}px`
      resizeProxy.classList.remove('dn')
      document.onselectstart = function () {
        return false
      }
      document.ondragstart = function () {
        return false
      }

      const handleMouseMove = (event) => {
        // 拖拽中，拖拽线与鼠标的位置同步
        resizeProxy.style.left = `${event.clientX}px`
      }

      const handleMouseUp = () => {
        if (this.dragging) {
          // 拖拽完毕
          const { startMouseLeft, columnWidth } = this.dragState
          const finalLeft = parseInt(resizeProxy.style.left, 10)
          const columnWidthDiff = finalLeft - startMouseLeft
          const finalColumnWidth = columnWidthDiff + columnWidth
          const columnMinWidth = parseInt(thEL.style.minWidth, 10)
          thEL.style.width = `${finalColumnWidth}px`
          // 当单元格宽度改变时 表格宽度也进行改变: 1）有最小宽度时宽度改变了 2）无最小宽度时
          if ((columnMinWidth && finalColumnWidth >= columnMinWidth) || !columnMinWidth) {
            tableEl.style.width = `${columnWidthDiff + tableEl.clientWidth}px`
          }
          document.body.style.cursor = ''
          this.dragging = false
          this.dragState = {}
          resizeProxy.classList.add('dn')
        }

        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.onselectstart = null
        document.ondragstart = null
        setTimeout(function () {
          thEL.classList.remove('noclick')
        }, 0)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  border: none !important;
}
.v-table {
  // border-collapse: collapse;
  // table-layout: fixed;
  word-break: break-all;
  word-wrap: break-word;

  td {
    border: 1px solid #ebeef5;
    height: 40px;
    width: 60px;
    padding: 10px;
  }

  .bold {
    font-weight: bold;
  }

  .stripe {
    background-color: #fafafa;
  }
}
</style>
