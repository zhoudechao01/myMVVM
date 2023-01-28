import Watcher from "./watcher"

/**
 * 初始化 computed 配置项
 * 为每一项实例化一个 Watcher，并将其 computed 属性代理到 Vue 实例上
 * 结合 watcher.dirty 和 watcher.evalute 实现 computed 缓存
 * @param {*} vm Vue 实例
 */
export default function initComputed(vm:any) {
  // 获取 computed 配置项
  const computed = vm.$options.computed
  // 记录 watcher
  const watcher = vm._watcher = Object.create(null)
  // 遍历 computed 对象
  for (let key in computed) {
    // 实例化 Watcher，回调函数默认懒执行
    watcher[key] = new Watcher(computed[key], { lazy: true }, vm)
    // 将 computed 的属性 key 代理到 Vue 实例上
    defineComputed(vm, key)
  }
}

/**
 * 将计算属性代理到 Vue 实例上，并结合watcher实现computed属性的缓存
 * @param {*} vm Vue 实例
 * @param {*} key computed 的计算属性
 */
function defineComputed(vm:any, key:string) {
  // 属性描述符
  const descriptor = {
    // 当render函数读取到计算属性时，执行这个get函数
    get: function () {
      const watcher = vm._watcher[key]
      if (watcher.dirty) { // 说明当前 computed 回调函数在本次渲染周期内没有被执行过
        // 执行 evalute，通知 watcher 执行 computed 回调函数，得到回调函数返回值
        watcher.evalute()
      }
      return watcher.value
    },
  }
  // 将计算属性代理到 Vue 实例上，就可以通过vm.xxx的方式访问了
  Object.defineProperty(vm, key, descriptor)
}

