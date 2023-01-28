import generate from "./generate"
import parse from "./parse"

/**
  *
  * 真正的vue中使用了二次提交的 设计结构
  * 1. 在页面中的 DOM  和 虚拟DOM 是 一一对应的关系
  * 2. AST + 数据  ->  VNode  [只要数据有变化, 就会生成 新的VNode]
  * 3. 再将 新的VNode  和  旧的VNode 进行比较, 不同的更新, 相同的忽略
  *
  * 即 createRenderFn 返回一个生成虚拟DOM的render函数, 缓存AST, 作用:减少解析模板的次数
  * 这个render 函数利用 AST 和 数据结合, 生成虚拟DOM
  * 然后update就是进行比较新旧的VNode, 去执行渲染
  *
  * 解析模版字符串，得到 AST 语法树
  * 将 AST 语法树生成渲染函数
  * @param { String } template 模版字符串
  * @returns 渲染函数
*/
export default function compileToFunction(template:string) {
  // 解析模版，生成 ast
  const ast = parse(template)
  // 将 ast 生成渲染函数
  const render = generate(ast)
  return render
}
