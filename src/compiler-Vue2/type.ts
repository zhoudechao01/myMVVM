import Vue from "../myMVVM";

// AST对象类型
export class AST{
  type: number | undefined | null;
  tag: string | undefined | null;
  rawAttr: any | undefined | null
  children: any[] | undefined | null;
  attr:any | undefined | null
  expression: string | undefined | null
  text: string | undefined | null
  // 如果时插槽对象回存在slotName
  slotName: string | undefined | null
  scopeSlot:any | undefined | null
}

// 虚拟Node类型
export class VNode{
  key: number | undefined | null
  // 标签
  tag: any | undefined | null
  // 属性 Map 对象
  attr: any | undefined | null
  // 父节点
  parent:any | undefined | null
  // 子节点组成的 Vnode 数组
  children: VNode[] | undefined | null
  // 文本节点的 Ast 对象
  text:AST | undefined | null
  // Vnode 的真实节点
  elm:any| undefined | null
  // Vue 实例
  context: any | undefined | null
}