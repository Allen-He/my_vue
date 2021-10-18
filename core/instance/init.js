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

  // 初始化method

  // 初始化created钩子函数

  // 挂载虚拟DOM到根节点el上
  if(options && options.el) {
    let rootDom = document.getElementById(options.el.substring(1));
    mount(vm, rootDom);
  }
  initMount(vm);
}

export default init;
