import Dep from "./dep"
import observe from "./observe"
/**
 * 通过 Object.defineProperty 为 obj.key 设置 getter、setter 拦截
 */
export default function defineReactive(obj:any, key:any, val:any) {
  // 递归调用 observe，处理 val 仍然为对象的情况
  const childOb = observe(val)

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    // 当发现 obj.key 的读取行为时，会被 get 拦截
    get() {
      if(Dep.prototype.target){
        dep.depend()
        // 如果存在子ob，则顺道把子对象的依赖一起收集
        if(childOb) {
          childOb.dep.depend()
        }
      }
      console.log(`getter: key = ${key}`)
      return val
    },
    // 当发生 obj.key = xx 的赋值行为时，会被 set 拦截
    set(newV) {
      console.log(`setter: ${key} = ${newV}`)
      if (newV === val) return
      val = newV
      // 对新值进行响应式处理，这里针对的是新值为非原始值的情况，比如 val 为对象、数组
      observe(val)
      dep.notify()
    }
  })
}
