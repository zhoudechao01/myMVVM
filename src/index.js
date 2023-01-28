import Vue from './myMVVM'
const ins = new Vue({
  el: '#app',
  data() {
    return {
      // 原始值和对象的响应式原理
      name: '张三',
      gender: {
        female: 'beautify girl'
      },
      // 数组的响应式原理
      arr: [{name: '吃饭'},{name: '睡觉'},{name: '打代码'}],
      // 响应式更新
      counter: 0,
      // v-bind
      title: "看我，看我",
      // v-model
      inputVal: 'hello',
      isChecked: true,
      selectValue: 2,
    }
  },
  // methods + 事件 + 数据响应式更新 原理
  methods: {
    handleAdd() {
      this.counter++
    },
    handleMinus() {
      this.counter--
    }
  },
  // computed + 异步更新队列 的原理
  computed: {
    doubleCounter() {
      console.log('evalute doubleCounter')
      return this.counter * 2
    }
  },
  // 组件
  components: {
    // 子组件
    'comp': {
      template: `
        <div>
          <p>{{ compCounter }}</p>
          <p>{{ doubleCompCounter }}</p>
          <button v-on:click="handleCompAdd"> comp add </button>
          <button v-on:click="handleCompMinus"> comp minus </button>
        </div>`,
      data() {
        return {
          compCounter: 0
        }
      },
      methods: {
        handleCompAdd() {
          this.compCounter++
        },
        handleCompMinus() {
          this.compCounter--
        }
      },
      computed: {
        doubleCompCounter() {
          console.log('evalute doubleCompCounter')
          return this.compCounter * 2
        }
      }
    },
    // 插槽
    'scope-slot': {
      template: `
        <div>
          <slot name="default" v-bind:slotKey="slotKey">{{ slotKey }}</slot>
        </div>
      `,
      data() {
        return {
          slotKey: '我是插槽里面的内容'
        }
      }
    }
  }
})
// 数据响应式拦截
setTimeout(() => {
  console.log('********** 属性值为原始值时的 getter、setter ************')
  console.log(ins.name)
  ins.name = '李四'
  console.log(ins.name)
}, 1000)

setTimeout(() => {
  console.log('********** 属性的新值为对象的情况 ************')
  ins.name = {
    student: '张三'
  }
  console.log(ins.name.student)
}, 2000)

setTimeout(() => {
  console.log('********** 验证对深层属性的 getter、setter 拦截 ************')
  ins.gender.female = 'cute girl'
  console.log(ins.gender.female)
}, 3000)

setTimeout(() => {
  console.log('********** 将值为对象的属性更新为原始值 ************')
  console.log(ins.gender)
  ins.gender = 'girl'
  console.log(ins.gender)
}, 4000)

setTimeout(() => {
  console.log('********** 数组操作方法的拦截 ************')
  console.log(ins.arr)
  ins.arr.push({name: '逛街'})
  console.log(ins.arr)
}, 5000)