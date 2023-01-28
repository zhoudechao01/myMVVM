import defineReactive from "./defineReactive"
import Dep from "./dep"
import observe from "./observe"
import protoArgument from "./protoArgument"

/**
 * 为普通对象或者数组设置响应式的入口
 */
export default class Observer{
  value:any
  dep:any
  constructor(value:any){
    this.value = value
    this.dep = new Dep()
    Object.defineProperty(value, '__ob__', {
      value:this,
      // 防止递归的时候处理__ob__，从而进行无限递归
      // 在页面显示的时候，不想显示__ob__属性
      enumerable:false,
      writable:true,
      configurable:true
    })

      // 对对象中的属性挂载dep

  if (Array.isArray(value)) {
    // 数组响应式
    protoArgument(value)
    // 遍历数组的每个元素，为每个元素设置响应式
    // 其实这里是为了处理元素为对象的情况，以达到 this.arr[idx].xx 是响应式的目的
    // arr = [1,2,{a: 'a value}]
    // this.arr[2].a = 'new value'
    this.observeArray(value)
  } else {
    // 对象响应式
    for (let key in value) {
      // 遍历对象的每个属性，为这些属性设置 getter、setter 拦截
      defineReactive(value, key, value[key])
    }
  }
  }

  // debugger
  observeArray = function(arr: any[]){
    for (let item of arr) {
      observe(item)
    }
  }
}
