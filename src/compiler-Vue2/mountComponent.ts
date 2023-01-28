import Watcher from "../watcher"

/**
 * @param {*} vm Vue 实例
 */
export default function mountComponent(vm: any) {
  // 负责初始渲染和后续更新组件的的函数
  const updateComponent = () => {
    vm._update(vm._render())
  }
  // 实例化一个渲染 Watcher，当响应式数据更新时，这个更新函数会被执行
  new Watcher(updateComponent, {lazy: false})
}


