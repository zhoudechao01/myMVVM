import Vue from "../myMVVM"
import { isReserveTag } from "../utils"
import { VNode } from "./type"

/**
 * 负责组件的首次渲染和后续更新
 * @param {VNode} oldVnode 老的 VNode,首次渲染olVNode是document.querySelector(this.$options.el)
 * 结构不一样，暂时不做类型声明
 * @param {VNode} vnode 新的 VNode
 */
export default function patch(oldVnode:any, vnode:VNode) {
  if (oldVnode && !vnode) {
    // 老节点存在，新节点不存在，则销毁组件
    return
  }
  if (!oldVnode) { // oldVnode 不存在，说明是子组件首次渲染
    createElm(vnode, null, null)
  } else {
    // nodeType是节点上的原始属性
    if (oldVnode.nodeType) { // 真实节点，则表示首次渲染根组件
      // 父节点
      const parent = oldVnode.parentNode
      // 参考节点是第一个script标签，确定将body放到script节点的前面
      const referNode = oldVnode.nextSibling
      // 创建元素，将vnode变成真实节点，并添加到父元素节点内
      createElm(vnode, parent, referNode)
      // 移除老的vnode, 其实就是模板节点
      parent.removeChild(oldVnode)
    } else {
      // 后续的更新
      patchVnode(oldVnode, vnode)
    }
  }
}

/**
 * 负责组件的首次渲染和后续更新
 * @param {*} vnode vnode
 * @param {*} parent vonde的父节点
 * @param {*} referNode 参考节点
 */
function createElm(vnode:VNode, parent:any, referNode:any){
  // 在 vnode 上记录自己的父节点是谁
  vnode.parent = parent;
  // 创建自定义组件， 如果是非组件， 就继续后面的流程
  if (createComponent(vnode)) return;

  // 走到这里说明当前节点是一个原生标签， 走DOM API 创建这些标签， 然后添加到父节点内
  const { tag, attr, children, text } = vnode;

  if (text) {
    // 说明是文本节点
    // 创建文本节点， 并插入到父节点内
    vnode.elm = createTextNode(vnode);
  } else {
    // 首选的元素节点
    // 创建元素
    vnode.elm = document.createElement(tag);
    // 对元素设置属性
    setAttributes(attr, vnode);
    // 循环递归创建当前节点的所有子节点
    if(children){
      for (let i = 0, len = children.length; i < len; i++) {
        createElm(children[i], vnode.elm, null);
      }
    }
  }
  // 节点创建完毕，将创建的节点插入到父节点内
  if(parent){
    const elm = vnode.elm
    if(referNode){
      // 如果存在参考节点，放到参考节点之前
      parent.insertBefore(elm, referNode)
    }else{
      // 没有参考节点，就直接放
      parent.appendChild(elm)
    }
  }
}

/**
 * 创建一个自定义组件
 * @param vnode
 */
function createComponent(vnode: VNode):any{
  if (vnode.tag && !isReserveTag(vnode.tag)) {
    // 获取组件的基本信息
    const {tag, context: {$options: { components }}} = vnode;
    const compOptions = components[tag];
    // 直接通过 new Vue ， 源码中是 extend方法
    const compIns = new Vue(compOptions);
    // 把父组件的 vnode 放到子组件的实例上,处理插槽时会用到
    compIns._parentVnode = vnode;
    // 由于component上面没有el,不会挂载，需要手动挂载
    compIns.$mount();
    // 记录字组件 vnode 的父节点信息
    // compIns._vnode.parent = vnode.parent;
    // 将子组件添加到父节点内
    if(vnode.parent)
    {
      vnode.parent.appendChild(compIns._vnode.elm);
    }
  }
}

// 创建文本节点
function createTextNode(textVnode: VNode){
  let { text } = textVnode,textNode = null;
  if ( text && text.expression) {
    // 说明当前文本节点含有表达式
    // 这个表达式时一个响应式数据
    const value = textVnode.context[text.expression];
    textNode = document.createTextNode(
      // 如果是对象做序列化
      typeof value === "object" ? JSON.stringify(value) : value
    );
  } else {
    // 纯文本节点
    if(text && text.text)
    textNode = document.createTextNode(text.text);
  }
  return textNode;
}


/**
 * 给节点设置属性
 */
function setAttributes(attr:any, vnode:VNode) {
  // 遍历属性对象， 普通属性， 直接设置， 如果是指令， 特殊处理
  for (const name in attr) {
    if (name === "vModel") {
      setVModel(attr[name].tag, attr[name].value, vnode);
    } else if (name === "vBind") {
      setVBind(vnode);
    } else if (name === "vOn") {
      setVOn(vnode);
    } else {
      // 普通指令
      vnode.elm.setAttribute(name, attr[name]);
    }
  }
}

/**
 * v-model 原理
 * @param tag
 * @param value
 * @param vnode
 */
function setVModel(tag:string, value:any, vnode:VNode) {
  const { context: vm, elm } = vnode;
  if (tag === "select") {
    // 下拉框
    // 当前select标签还在创建，异步，设置时间延后
    Promise.resolve().then(() => {
      elm.value = vm[value];
    });
    elm.addEventListener("change", function () {
      vm[value] = elm.value;
    });
  } else if (tag === "input" && vnode.elm.type === "text") {
    // 文本输入框
    elm.value = vm[value]; // 设置初始值， 数据变化触发监听事件，改变
    elm.addEventListener("input", function () {
      vm[value] = elm.value;
    });
  } else if (tag === "input" && vnode.elm.type === "checkbox") {
    elm.checked = vm[value];
    elm.addEventListener("change", function () {
      vm[value] = elm.checked;
    });
  }
}
function setVBind(vnode:VNode) {
  const {
    attr: { vBind },
    elm,
    context: vm,
  } = vnode;
  for (const attrName in vBind) {
    elm.setAttribute(attrName, vm[vBind[attrName]]);
    elm.removeAttribute(`v-bind:${attrName}`);
  }
}

function setVOn(vnode:VNode) {
  const {
    attr: { vOn },
    elm,
    context: vm,
  } = vnode;
  for (const eventName in vOn) {
    elm.addEventListener(eventName, function (...args:any[]) {
      vm.$options.methods[vOn[eventName]].apply(vm, args);
    });
  }
}

/**
 * 对比新老节点，找出其中的不同，然后更新老节点
 * @param {*} oldVnode 老节点的 vnode
 * @param {*} vnode 新节点的 vnode
 */
function patchVnode(oldVnode: VNode, vnode:VNode) {
  // 如果新老节点相同，则直接结束
  if (oldVnode === vnode) return

  // 将老 vnode 上的真实节点同步到新的 vnode 上，否则，后续更新的时候会出现 vnode.elm 为空的现象
  vnode.elm = oldVnode.elm

  // 走到这里说明新老节点不一样，则获取它们的孩子节点，比较孩子节点
  const ch = vnode.children
  const oldCh = oldVnode.children

  if (!vnode.text) { // 新节点不存在文本节点
    if (ch && oldCh) { // 说明新老节点都有孩子
      // diff
      updateChildren(ch, oldCh)
    } else if (ch) { // 老节点没孩子，新节点有孩子
      // 增加孩子节点
    } else { // 新节点没孩子，老节点有孩子
      // 删除这些孩子节点
    }
  } else { // 新节点存在文本节点
    if (vnode.text.expression) { // 说明存在表达式
      // 获取表达式的新值
      const value = JSON.stringify(vnode.context[vnode.text.expression])
      // 旧值
      try {
        const oldValue = oldVnode.elm.textContent
        if (value !== oldValue) { // 新老值不一样，则更新
          oldVnode.elm.textContent = value
        }
      } catch {
        // 防止更新时遇到插槽，导致报错
        // 目前不处理插槽数据的响应式更新
      }
    }
  }
}

/**
 * diff，比对孩子节点，找出不同点，然后将不同点更新到老节点上
 * @param {*} ch 新 vnode 的所有孩子节点
 * @param {*} oldCh 老 vnode 的所有孩子节点
 */
function updateChildren(ch:VNode[], oldCh:VNode[]) {
  if(ch && oldCh){
    
  }
  // 四个游标
  // 新孩子节点的开始索引，叫 新开始
  let newStartIdx = 0
  // 新结束
  let newEndIdx = ch.length - 1
  // 老开始
  let oldStartIdx = 0
  // 老结束
  let oldEndIdx = oldCh.length - 1
  // 循环遍历新老节点，找出节点中不一样的地方，然后更新
  while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) { // 根为 web 中的 DOM 操作特点，做了四种假设，降低时间复杂度
    // 新开始节点
    const newStartNode = ch[newStartIdx]
    // 新结束节点
    const newEndNode = ch[newEndIdx]
    // 老开始节点
    const oldStartNode = oldCh[oldStartIdx]
    // 老结束节点
    const oldEndNode = oldCh[oldEndIdx]
    if (sameVNode(newStartNode, oldStartNode)) { // 假设新开始和老开始是同一个节点
      // 对比这两个节点，找出不同然后更新
      patchVnode(oldStartNode, newStartNode)
      // 移动游标
      oldStartIdx++
      newStartIdx++
    } else if (sameVNode(newStartNode, oldEndNode)) { // 假设新开始和老结束是同一个节点
      patchVnode(oldEndNode, newStartNode)
      // 将老结束移动到新开始的位置
      oldEndNode.elm.parentNode.insertBefore(oldEndNode.elm, oldCh[newStartIdx].elm)
      // 移动游标
      newStartIdx++
      oldEndIdx--
    } else if (sameVNode(newEndNode, oldStartNode)) { // 假设新结束和老开始是同一个节点
      patchVnode(oldStartNode, newEndNode)
      // 将老开始移动到新结束的位置
      oldStartNode.elm.parentNode.insertBefore(oldStartNode.elm, oldCh[newEndIdx].elm.nextSibling)
      // 移动游标
      newEndIdx--
      oldStartIdx++
    } else if (sameVNode(newEndNode, oldEndNode)) { // 假设新结束和老结束是同一个节点
      patchVnode(oldEndNode, newEndNode)
      // 移动游标
      newEndIdx--
      oldEndIdx--
    } else {
      // 上面几种假设都没命中，则老老实的遍历，找到那个相同元素
    }
  }
  // 跳出循环，说明有一个节点首先遍历结束了
  if (newStartIdx < newEndIdx) { // 说明老节点先遍历结束，则将剩余的新节点添加到 DOM 中

  }
  if (oldStartIdx < oldEndIdx) { // 说明新节点先遍历结束，则将剩余的这些老节点从 DOM 中删掉

  }
}

/**
 * 判断两个节点是否相同
 * 这里的判读比较简单，只做了 key 和 标签的比较
 */
function sameVNode(n1:VNode, n2:VNode) {
  return n1.key == n2.key && n1.tag === n2.tag
}





