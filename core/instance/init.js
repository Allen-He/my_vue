import mount, { initMount } from "./mount.js";
import { constructProxy } from "./proxy.js";

/** 初始化options的工具函数（★调用该init方法时，必须先绑定this指向★） */
let uid = 0;

function init(options) {
  const vm = this; //暂存当前Vue实例
  vm._uid = uid++; //唯一标识当前Vue实例
  vm._isVue = true; //表明当前该实例是否为Vue实例

  // 初始化data
  if(options && options.data) {
    vm._data = constructProxy(vm, options.data, "");
  }

  // 初始化computed
  if (options && options.computed) {
    vm._computed = options.computed;
    for (let temp in options.computed) {
        vm[temp] = options.computed[temp];
    }
  }
  // 初始化methods
  if(options && options.methods) {
    vm._methods = options.methods;
    for (const prop in options.methods) {
      vm[prop] = options.methods[prop];
    }
  }
  // 初始化created钩子函数
  if(options && options.created) {
    vm._created = options.created;
  }
  // 挂载虚拟DOM到根节点el上
  if(options && options.el) {
    vm._created && vm._created(); //触发生命周期中的created钩子函数
    let rootDom = document.getElementById(options.el.substring(1));
    mount(vm, rootDom);
  }
  initMount(vm);
}

export default init;
