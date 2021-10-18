
/** 根据template找vnode（Map） */
const template2Vnode = new Map();
/** 根据vnode找template（Map） */
const vnode2Template = new Map();

/** 进行预备渲染（建立"模板<——>节点"索引，即：双向映射表） */
export function prepareRender(vm, vnode) {
  if(vnode == null) return;
  if(vnode.nodeType === 3) { //当前vnode为文本节点
    analyseTemplateString(vnode);
  }else if(vnode.nodeType === 1) { //当前vnode为元素节点
    for (let i = 0; i < vnode.children.length; i++) {
      prepareRender(vm, vnode.children[i]);
    }
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
