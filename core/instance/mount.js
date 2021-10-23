import VNode from "../vdom/vnode.js";
import { mergeAttr } from '../util/handleObjVal.js'
import { vfor } from './grammer/vfor.js';
import { vmodel } from "./grammer/vmodel.js";
import { getTemplate2Vnode, getVnode2Template, prepareRender } from "./render.js";

/**
 * 在Vue.prototype上定义$mount方法（可用于后续手动挂载）
 * @param {class} Vue
 */
export function initMount(vm) {
  vm.__proto__.$mount = function (el) {
    let rootDom = document.getElementById(el.substring(1));
    mount(this, rootDom);
  }
}


function mount(vm, elem) {
  // 进行挂载虚拟节点树
  vm._vnode = constructVNode(vm, elem, null);
  // 进行预备渲染（建立"模板<——>节点"索引，即：双向映射表）
  prepareRender(vm, vm._vnode);
  // console.log(getTemplate2Vnode());
  // console.log(getVnode2Template());
}

function constructVNode(vm, elem, parent) { //“深度优先搜索”原理
  let vnode = analyseAttrs(vm, elem, parent);
  if(!vnode) {
    const tag = elem.nodeName;
    const children = [];
    const text = getNodeText(elem);
    const data = null;
    const nodeType = elem.nodeType;
    const key = null;
    vnode = new VNode(tag, elem, children, text, data, parent, nodeType, key);
    if(elem.nodeType === 1 && elem.getAttribute('env')) {
      vnode.env = mergeAttr(vnode.env, JSON.parse(elem.getAttribute("env")));
    }else {
      vnode.env = mergeAttr(vnode.env, parent ? parent.env : {});
    }
  }

  // 若当前vnode的nodeType为0，即该节点为v-for指令对应的虚拟节点，那么它的vnodeChildNodes应置为其父元素对应的childNodes
  const vnodeChildNodes = vnode.nodeType === 0 ? vnode.parent.elem.childNodes : elem.childNodes;
  const len = vnodeChildNodes.length;
  for (let i = 0; i < len; i++) {
    const childNode = constructVNode(vm, vnodeChildNodes[i], vnode);
    if(childNode instanceof VNode) { // ● 若childNode为单个虚拟节点时
      vnode.children.push(childNode);
    }else { // ● 若childNode为虚拟节点数组
      vnode.children.push(...childNode);
    }
  }
  return vnode;
}

/** 若该节点为“文本节点”时返回其文本，否则返回空串 */
function getNodeText(elem) {
  return elem.nodeType === 3 ? elem.nodeValue : '';
}

/** 分析标签元素的属性（若该元素上存在v-for指令，则返回对应的虚拟节点） */
function analyseAttrs(vm, elem, parent) {
  let vnode = null;
  if(elem.nodeType === 1) {
    let attrNames = elem.getAttributeNames();
    if(attrNames.includes('v-for')) {
      vnode = vfor(vm, elem, elem.getAttribute('v-for'), parent);
    }
    if(attrNames.includes('v-model')) {
      vmodel(vm, elem, elem.getAttribute('v-model'));
    }
  }
  return vnode;
}

export default mount;
