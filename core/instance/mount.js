import VNode from "../vdom/vnode.js";

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
  // 进行预备渲染
}

function constructVNode(vm, elem, parent) {
  const tag = elem.nodeName;
  const children = [];
  const text = getNodeText(elem);
  const data = null;
  const nodeType = elem.nodeType;
  const key = null;
  const vnode = new VNode(tag, elem, children, text, data, parent, nodeType, key);

  const vnodeChildNodes = elem.childNodes;
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

export default mount;
