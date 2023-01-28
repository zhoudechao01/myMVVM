import mount from "./compiler-Vue2/index"
import patch from "./compiler-Vue2/patch"
import renderHelper from "./compiler-Vue2/renderHelper"
import initComputed from "./initComputed"
import initData from "./initData"

/**
 * Vue 构造函数
 * @param {*} options new Vue(options) 时传递的配置对象
 */
export default class Vue {
  $options:any
  __patch__:any
  _vnode:any
  _data: any
  _parentVnode:any
  _warcher:any
  constructor(options:any){
    this._init(options)
  }

  /**
 * 初始化配置对象
 * @param {*} options 
 */
  _init(options: any) {
    // 将 options 配置挂载到 Vue 实例上
    this.$options = options
    // 将patch方法挂载到Vue实例上
    this.__patch__ = patch
    // 初始化 options.data
    // 代理 data 对象上的各个属性到 Vue 实例
    // 给 data 对象上的各个属性设置响应式能力
    initData(this)
    // // 初始化 computed 选项，并将计算属性代理到 Vue 实例上
    // 结合 watcher 实现缓存
    initComputed(this)
    // 安装运行时生成VNode的渲染工具函数
    renderHelper(this)

    if(this.$options.el){
      this.$mount()
    }
  }

  // 负责执行 vm.$options.render 函数
   _render(){
    return this.$options.render.apply(this)
   }
  //  * 由 render 函数生成的 VNode 虚拟DOM
  _update(vnode:any){
    // 获取旧的vnode节点
    const prevVNode = this._vnode
    // 设置新的vnode
    this._vnode = vnode

    if(!prevVNode){ //老的VNode不存在，说明是首次更新，将挂载点和vnode传入
      this.__patch__(document.querySelector(this.$options.el),vnode)
    }
    else{ //老的VNode存在，说明时后续更新
      this.__patch__(prevVNode, vnode)
    }
  }


  $mount(){
    mount(this)
  }
}