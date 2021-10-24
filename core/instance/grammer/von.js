import { getObjVal } from "../../util/handleObjVal.js";

export function checkVOn(vm, vnode) {
  if(vnode.nodeType !== 1) {
    return;
  }
  const attrNames = vnode.elem.getAttributeNames();
  for (let i = 0; i < attrNames.length; i++) {
    if(attrNames[i].indexOf('v-on:') === 0 || attrNames[i].indexOf('@') === 0) {
      von(vm, vnode, attrNames[i], vnode.elem.getAttribute(attrNames[i]));
    }
  }
}

function von(vm, vnode, name, value) {
  const isEasy = /^@[a-zA-Z0-9_$]+/.test(name); //是否为v-on指令的缩写@
  const attrName = isEasy ? name.substring(1, name.length) : name.split(':')[1]; 
  const func = getObjVal(vm._methods, value);
  vnode.elem.addEventListener(attrName, executeFunc(vm, func));
}

/** 将事件回调函数中的this指向改变为当前Vue实例，即：vm（待传入） */
function executeFunc(vm, func) {
  return function (e) {
    func.call(vm, e);
  }
}
