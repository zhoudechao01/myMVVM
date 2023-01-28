import compileNode from "./compileNode"

export default function mount(vm: any){
  let el = document.querySelector(vm.$options.el)
  compileNode(Array.from(el.childNodes), vm)
}