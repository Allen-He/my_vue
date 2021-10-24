import { getObjVal, getEnvObj } from "../../util/handleObjVal.js";
import { generateCode, isTrue } from "../../util/runCode.js";

export function checkVBind(vm, vnode) {
  if(vnode.nodeType !== 1) {
    return;
  }
  const attrNames = vnode.elem.getAttributeNames();
  for (let i = 0; i < attrNames.length; i++) {
    if(attrNames[i].indexOf('v-bind:') === 0 || attrNames[i].indexOf(':') === 0) {
      vbind(vm, vnode, attrNames[i], vnode.elem.getAttribute(attrNames[i]));
    }
  }
}

function vbind(vm, vnode, name, value) {
  const attrName = name.split(':')[1];
  let attrVal = null;

  if(/^{[\w\W]+}$/.test(value)) { //value是对象字符串的形式
    const expressionStr = value.substring(1, value.length - 1).trim();
    const expressionArr = expressionStr.split(',');
    attrVal = analyseExpressionArr(vm, vnode, expressionArr);
    vnode.elem.setAttribute(attrName, attrVal);
  }else {
    attrVal = getObjVal(vm._data, value);
    vnode.elem.setAttribute(attrName, attrVal);
  }
}

/** 分析表达式数组 */
function analyseExpressionArr(vm, vnode, expressionArr) {
  const envObj = getEnvObj(vm, vnode);
  let envCode = generateCode(envObj);
  let attrVal = '';
  
  for (let i = 0; i < expressionArr.length; i++) {
    const tempArr = expressionArr[i].split(':');
    if(tempArr.length === 1) { // { weight }
      attrVal += (tempArr[0].trim() + ' ');
    }else if(tempArr.length === 2) { // { red: info.num < 100 }
      const resVal = tempArr[0].trim();
      const expression = tempArr[1].trim();
      if(isTrue(expression, envCode)) {
        attrVal += (resVal + ' ');
      }
    }else {
      throw new Error('v-bind所对应的表达式的格式有误');
    }
  }
  return attrVal;
}
