import { getObjVal } from "../util/handleObjVal.js";

/** 根据template找vnode（Map） */
const template2Vnode = new Map();
/** 根据vnode找template（Map） */
const vnode2Template = new Map();

/** 进行预备渲染（建立"模板<——>节点"索引，即：双向映射表） */
export function prepareRender(vm, vnode) {
  if(vnode == null) return;
  if(vnode.nodeType === 3) { //当前vnode为文本节点
    analyseTemplateString(vnode);
  }
  if(vnode.nodeType === 0) { // 当前vnode是v-for指令对应的虚拟节点，需要在“双向映射表”中存相应的映射关系
    const temp = `{{ ${vnode.data} }}`;
    setTemplate2Vnode(temp, vnode);
    setVnode2Template(temp, vnode);
  }
  analyseAttrs(vm, vnode);
  // 当前vnode若不是文本节点，继续向下遍历
  for (let i = 0; i < vnode.children.length; i++) {
    prepareRender(vm, vnode.children[i]);
  }
}

/** 分析模板字符串，创建"模板<——>节点"关系映射 */
function analyseTemplateString(vnode) {
  const templateStringList = vnode.text.match(/{{ [a-zA-Z0-9_$.]+ }}/g);
  for (let i = 0; templateStringList && i < templateStringList.length; i++) {
    setTemplate2Vnode(templateStringList[i], vnode);
    setVnode2Template(templateStringList[i], vnode);
  }
}

function setTemplate2Vnode(template, vnode) {
  const templateName = getTemplateName(template);
  const hasTemplate = template2Vnode.has(templateName);
  if(hasTemplate) {
    template2Vnode.get(templateName).push(vnode);
  }else {
    template2Vnode.set(templateName, [vnode]);
  }
}

function setVnode2Template(template, vnode) {
  const templateName = getTemplateName(template);
  const hasVnode = vnode2Template.has(vnode);
  if(hasVnode) {
    vnode2Template.get(vnode).push(templateName);
  }else {
    vnode2Template.set(vnode, [templateName]);
  }
}

function getTemplateName(template) {
  return template.substring(3, template.length - 3);
}

export function getTemplate2Vnode() {
  return template2Vnode;
}
export function getVnode2Template() {
  return vnode2Template;
}


export default function render() {  
  const vm = this; //暂存Vue实例（★调用该render方法时，必须先绑定this指向★）
  renderNode(this, vm._vnode);
}

function renderNode(vm, vnode) {
  if(vnode.nodeType === 3) { //若当前vnode为文本节点，对模板数据进行渲染
    const templateArr = vnode2Template.get(vnode);
    if(templateArr) { //如果当前文本节点的文本中存在对应的template数据
      let resText = vnode.text //获取vnode.text的值用于后续处理，但其本身不做更改
      for (let i = 0; i < templateArr.length; i++) {
        const realVal = getTemplateValue([vm._data, vnode.env], templateArr[i]);
        resText = resText.replace(`{{ ${templateArr[i]} }}`, realVal);
      }
      vnode.elem.nodeValue = resText; //将DOM元素的nodeValue更新为resText（即：渲染数据）
    }
  }else if(vnode.nodeType === 1 && vnode.tag === 'INPUT') { //如果当前为input元素，渲染其value值
    const templateArr = vnode2Template.get(vnode);
    if(templateArr) {
      for (let i = 0; i < templateArr.length; i++) {
        const realVal = getTemplateValue([vm._data, vnode.env], templateArr[i]);
        if(realVal) { //若该值不为空，则初始化input的value值
          vnode.elem.value = realVal;
        }
      }
    }
  }else { // 若为元素节点，遍历渲染其子节点
    for (let i = 0; i < vnode.children.length; i++) {
      renderNode(vm, vnode.children[i]);
    }
  }
}

/** 根据templateName在vm._data和当前vnode的env对象属性中寻找对应数据值 */
function getTemplateValue(envsArr, templateName) {
  for (let i = 0; i < envsArr.length; i++) {
    let resVal = getObjVal(envsArr[i], templateName);
    if(resVal !== undefined) {
      return resVal;
    }
  }
  return;
}

/** 数据更新后，通知被更新数据的namespace对应的虚拟节点进行渲染 */
export function renderData(vm, dataStr) {
  const vnodeArr = template2Vnode.get(dataStr);
  if(vnodeArr) {
    for (let i = 0; i < vnodeArr.length; i++) {
      renderNode(vm, vnodeArr[i]);
    }
  }
}

function analyseAttrs(vm, vnode) {
  if(vnode.nodeType === 1 && vnode.tag === 'INPUT') {
    let attrNames = vnode.elem.getAttributeNames();
    if(attrNames.includes('v-model')) {
      const template = `{{ ${vnode.elem.getAttribute('v-model')} }}`;
      setTemplate2Vnode(template, vnode);
      setVnode2Template(template, vnode);
    }
  }
}
