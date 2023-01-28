import Vue from './myMVVM'

describe("测试单向绑定插值语法", function () {
  test("测试1",function () {
    let testNode = document.createElement("div");
    testNode.setAttribute("id", "app")
    let subNode=document.createElement("span")
    subNode.textContent="{{name}}";
    testNode.appendChild(subNode)
      let testMvvm = new Vue({
          el: '#app',
          node: testNode,
          data() {
            return {
              name: '张三',
            }
          },
      });
    // _vnode为当前实例的node节点
    expect(testMvvm._vnode.children[0].elm.innerHTML).toBe('张三')
  })
})

describe("数据响应式更新", function () {
  test("测试1:文本表达式响应式更新",function () {
    let testNode = document.createElement("div");
    testNode.setAttribute("id", "app")
    let subNode=document.createElement("span")
    subNode.textContent="{{name}}";
    testNode.appendChild(subNode)
    let testMvvm = new Vue({
          el: '#app',
          node: testNode,
          data() {
            return {
              name: 'Reese',
              age: 20,
              sex: 'male',
            }
          },
      });
    testMvvm._data.name = '张三'
    // _vnode为当前实例的node节点
    setTimeout(() => {
      expect(testMvvm._vnode.children[0].elm.innerHTML).toBe('张三')
    },3000)
  })
  test("测试2:数组响应式更新",function () {
    let testNode = document.createElement("div");
    testNode.setAttribute("id", "app")
    let subNode=document.createElement("span")
    subNode.textContent="{{arr}}";
    testNode.appendChild(subNode)
    let testMvvm = new Vue({
          el: '#app',
          node: testNode,
          data() {
            return {
              arr: [1,2,3]
            }
          },
      });
    testMvvm._data.arr.push(4)
    // _vnode为当前实例的node节点
    setTimeout(() => {
      expect(testMvvm._vnode.children[0].elm.innerHTML).toBe('[1,2,3,4]')
    },3000)
  })
})

describe("测试元素节点上属性绑定", function () {
  test("测试v-bind属性",function () {
    let testNode = document.createElement("div");
    testNode.setAttribute("id", "app")
    let subNode=document.createElement("span")
    subNode.setAttribute("v-bind:title","title")
    testNode.appendChild(subNode)
    let testMvvm = new Vue({
        el: '#app',
        node: testNode,
        data() {
          return {
            title: '我是title'
          }
        },
    });
    testMvvm._data.title = '我是更新之后的title'
    // _vnode为当前实例的node节点
    setTimeout(() => {
      expect(testMvvm._vnode.children[0].elm.attributes[0].nodeValue).toBe('我是更新之后的title')
    },3000)
  })
  test("测试input(type:text)v-model属性",function () {
    let testNode=document.createElement("div");
    testNode.setAttribute("id", "app");

    let inputBox=document.createElement('input')
    inputBox.setAttribute('v-model','inputVal')
    inputBox.setAttribute('type','text')
    testNode.appendChild(inputBox)

    let testMvvm = new Vue({
        el: '#app',
        node: testNode,
        data() {
          return {
            inputVal: '输入框的初始值'
          }
        },
    });
    inputBox.value='输入框更新的值'
    setTimeout(() => {
      expect(testMvvm._vnode.children[0].elm.attributes[0].nodeValue).toBe('输入框更新的值')
    },3000)
  })
  test("测试input(type:text)v-model属性",function () {
    let testNode=document.createElement("div");
    testNode.setAttribute("id", "app");

    let inputBox=document.createElement('input')
    inputBox.setAttribute('v-model','isChecked')
    inputBox.setAttribute('type','checkbox')
    testNode.appendChild(inputBox)

    let testMvvm = new Vue({
        el: '#app',
        node: testNode,
        data() {
          return {
            isChecked: true
          }
        },
    });
    inputBox.checked = false
    setTimeout(() => {
      expect(testMvvm._vnode.children[0].elm.attributes[0].nodeValue).toBe(false)
    },3000)
  })
  test("测试v-on:click事件",function () {
    let testNode=document.createElement("div");
    testNode.setAttribute("id", "app");
    let subNode=document.createElement("span")
    subNode.textContent="{{counter}}";
    testNode.appendChild(subNode)
    let buttonVode = document.createElement('button')
    buttonVode.setAttribute('v-on:click','handleAdd')
    testNode.appendChild(buttonVode)
    let testMvvm = new Vue({
        el: '#app',
        node: testNode,
        data() {
          return {
            counter: 0
          }
        },
        methods: {
          handleAdd() {
            this.counter++
          },
        },
    });
    buttonVode.dispatchEvent(new Event('onclick'))
    setTimeout(() => {
      expect(testMvvm._vnode.children[0].elm.innerHTML).toBe(1)
    },3000)
  })
  test("测试计算属性",function () {
    let testNode=document.createElement("div");
    testNode.setAttribute("id", "app");
    let subNode01=document.createElement("span")
    subNode01.textContent="{{counter}}";
    testNode.appendChild(subNode01)
    let subNode02=document.createElement("span")
    subNode02.textContent="{{doubleCounter}}"
    testNode.appendChild(subNode02)
    let buttonVode = document.createElement('button')
    buttonVode.setAttribute('v-on:click','handleAdd')
    testNode.appendChild(buttonVode)
    let testMvvm = new Vue({
        el: '#app',
        node: testNode,
        data() {
          return {
            counter: 0
          }
        },
        methods: {
          handleAdd() {
            this.counter++
          },
        },
        computed: {
          doubleCounter() {
            return this.counter * 2
          }
        },
    });
    buttonVode.dispatchEvent(new Event('onclick'))
    buttonVode.dispatchEvent(new Event('onclick'))
    setTimeout(() => {
      expect(testMvvm._vnode.children[1].elm.innerHTML).toBe(4)
    },3000)
  })
})

describe("测试组件和插槽", function () {
  test("测试1: 组件绑定以及更新",function () {
    let testNode = document.createElement("div");
    testNode.setAttribute("id", "app")
    let subNode=document.createElement("comp")
    testNode.appendChild(subNode)
      let testMvvm = new Vue({
          el: '#app',
          node: testNode,
          data(){
            return {
            }
          },
          components: {
            // 子组件
            'comp': {
              template: `
                <div>
                  <p>{{ compCounter }}</p>
                  <p>{{ doubleCompCounter }}</p>
                </div>`,
              data() {
                return {
                  compCounter: 1
                }
              },
              computed: {
                doubleCompCounter() {
                  return this.compCounter * 2
                }
              }
            },
          }
      });
      
    // _vnode为当前实例的node节点
    // testMvvm._vnode.children[0]: comp节点
    // testMvvm._vnode.children[0].parent
    // <div id="app">
    //   <div>
    //     <p>1</p>
    //     <p>2</p>
    //   </div>
    // </div>
    expect(testMvvm._vnode.children[0].parent.children[0].children[1].innerHTML).toBe('2')
  })
  test("测试1: 测试插槽的绑定",function () {
    let testNode = document.createElement("div");
    testNode.setAttribute("id", "app")
    let subNode=document.createElement("scope-slot")
    testNode.appendChild(subNode)
      let testMvvm = new Vue({
          el: '#app',
          node: testNode,
          data(){
            return {
            }
          },
          components: {
            // 子组件
            'scope-slot': {
              template: `
                <div>
                  <slot name="default" v-bind:slotKey="slotKey">{{ slotKey }}</slot>
                </div>
              `,
              data() {
                return {
                  slotKey: 'scope slot content'
                }
              }
            }
          }
      });
      
    // _vnode为当前实例的node节点
    // testMvvm._vnode.children[0]: comp节点
    // testMvvm._vnode.children[0].parent
    // <div id="app">
    //   <div>
    //     <p>1</p>
    //     <p>2</p>
    //   </div>
    // </div>
    expect(testMvvm._vnode.children[0].parent.children[0].innerHTML).toBe('scope slot content')
  })
})

