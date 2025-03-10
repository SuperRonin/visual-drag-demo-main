import Vue from 'vue'
import Vuex from 'vuex'
import animation from './animation'
import compose from './compose'
import contextmenu from './contextmenu'
import copy from './copy'
import event from './event'
import layer from './layer'
import snapshot from './snapshot'
import lock from './lock'
import align from './align'

Vue.use(Vuex)

const data = {
  state: {
    ...animation.state,
    ...compose.state,
    ...contextmenu.state,
    ...copy.state,
    ...event.state,
    ...layer.state,
    ...snapshot.state,
    ...lock.state,
    lastScale: 100, // 记录快照上次的缩放比例，用于判断是否需要更新快照
    editMode: 'edit', // 编辑器模式 edit preview
    canvasStyleData: {
      // 页面全局数据
      width: 1200,
      height: 740,
      scale: 100,
      color: '#000',
      opacity: 1,
      background: '#fff',
      fontSize: 14,
    },
    isInEdiotr: false, // 是否在编辑器中，用于判断复制、粘贴组件时是否生效，如果在编辑器外，则无视这些操作
    componentData: [
      {
        animations: [],
        events: {},
        groupStyle: {},
        isLock: false,
        collapseName: 'style',
        linkage: {
          duration: 0,
          data: [
            {
              id: '',
              label: '',
              event: '',
              style: [
                {
                  key: '',
                  value: '',
                },
              ],
            },
          ],
        },
        component: 'Picture',
        label: '图片',
        icon: 'tupian',
        defaultIcon: 'https://file.evatmaster.com/241227c2b028bdac27496ea683277e600e222e.png?v=1',
        propValue: {
          url: 'https://file.evatmaster.com/241227c2b028bdac27496ea683277e600e222e.png?v=1',
          flip: {
            horizontal: false,
            vertical: false,
          },
        },
        style: {
          rotate: 0,
          opacity: 1,
          width: 300,
          height: 200,
          borderRadius: '',
          top: 248,
          left: 150,
        },
        id: 'qrwHUjp_OCp3J-BX-mBa3',
      },
      {
        animations: [],
        events: {},
        groupStyle: {},
        isLock: false,
        collapseName: 'style',
        linkage: {
          duration: 0,
          data: [
            {
              id: '',
              label: '',
              event: '',
              style: [
                {
                  key: '',
                  value: '',
                },
              ],
            },
          ],
        },
        component: 'VTable',
        label: '表格',
        icon: 'biaoge',
        propValue: {
          data: [
            ['表头1', '表头2', '表头3'],
            ['内容1', '内容2', '内容3'],
          ],
          stripe: true,
          thBold: true,
        },
        request: {
          method: 'GET',
          data: [],
          url: '',
          series: false,
          time: 1000,
          paramType: '',
          requestCount: 0,
        },
        style: {
          rotate: 0,
          opacity: 1,
          width: 600,
          height: 200,
          fontSize: 14,
          fontWeight: 400,
          textAlign: 'center',
          color: '',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          top: 18,
          left: 84,
        },
        id: 'imv6wGj7kLZRdjFPMH4yH',
      },
    ], // 画布组件数据
    curComponent: null,
    curComponentIndex: null,
    // 点击画布时是否点中组件，主要用于取消选中组件用。
    // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
    isClickComponent: false,
    rightList: true,
    isDarkMode: false,
  },
  mutations: {
    ...animation.mutations,
    ...compose.mutations,
    ...contextmenu.mutations,
    ...copy.mutations,
    ...event.mutations,
    ...layer.mutations,
    ...snapshot.mutations,
    ...lock.mutations,
    ...align.mutations,
    aceSetCanvasData(state, value) {
      state.canvasStyleData = value
    },
    setLastScale(state, value) {
      state.lastScale = value
    },
    // 通过json设置组件
    aceSetcurComponent(state, value) {
      for (let i = 0; i < state.componentData.length; i++) {
        if (state.componentData[i].id === value.id) {
          state.componentData.splice(i, 1)
        }
      }
      state.componentData.push(value)
      state.curComponent = value
    },

    setClickComponentStatus(state, status) {
      state.isClickComponent = status
    },

    isShowRightList(state) {
      state.rightList = !state.rightList
    },

    toggleDarkMode(state, sateus) {
      state.isDarkMode = sateus
      state.canvasStyleData.background = sateus ? '#817f7f' : '#fff'
      localStorage.setItem('isDarkMode', JSON.stringify(state.isDarkMode))
    },

    setEditMode(state, mode) {
      state.editMode = mode
    },

    setInEditorStatus(state, status) {
      state.isInEdiotr = status
    },

    setCanvasStyle(state, style) {
      state.canvasStyleData = style
    },

    setCurComponent(state, { component, index }) {
      state.curComponent = component
      state.curComponentIndex = index
    },

    setShapeStyle({ curComponent }, { top, left, width, height, rotate, padding }) {
      if (top !== undefined) curComponent.style.top = Math.round(top)
      if (left !== undefined) curComponent.style.left = Math.round(left)
      if (width) curComponent.style.width = Math.round(width)
      if (padding) curComponent.style.padding = Math.round(padding)
      if (height) curComponent.style.height = Math.round(height)
      if (rotate) curComponent.style.rotate = Math.round(rotate)
    },

    setShapeSingleStyle({ curComponent }, { key, value }) {
      curComponent.style[key] = value
    },

    setComponentData(state, componentData = []) {
      Vue.set(state, 'componentData', componentData)
    },

    addComponent(state, { component, index }) {
      if (index !== undefined) {
        state.componentData.splice(index, 0, component)
      } else {
        state.componentData.push(component)
      }
    },

    deleteComponent(state, index) {
      if (index === undefined) {
        index = state.curComponentIndex
      }

      if (index == state.curComponentIndex) {
        state.curComponentIndex = null
        state.curComponent = null
      }

      if (/\d/.test(index)) {
        state.componentData.splice(index, 1)
      }
    },
  },
}

export default new Vuex.Store(data)
