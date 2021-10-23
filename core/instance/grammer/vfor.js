import { getObjVal } from "../../util/handleObjVal.js";
import VNode from "../../vdom/vnode.js";

export function vfor(vm, elem, instructions, parent) {
  const virtualNodeData = getInstructionsArr(instructions)[2];
  const virtualNode = new VNode(elem.nodeName, elem, [], '', virtualNodeData, parent, 0, '');
  virtualNode.instructions = instructions;
  parent.elem.removeChild(elem);
  parent.elem.appendChild(document.createTextNode(''));
  analyseInstructions(vm, elem, instructions, parent);
  return virtualNode;
}

/** 根据 v-for的指令字符串 获取 指令数组 */
function getInstructionsArr(instructions) {
  const instructionsArr = instructions.trim().split(' ');
  if(instructionsArr.length !== 3 || instructionsArr[1] !== 'in' && instructionsArr[1] !== 'of') {
    throw new Error('v-for指令格式不正确，正确格式如下：v-for="(item,index) in books" ，其中in也可用of代替');
  }
  return instructionsArr;
}

/** 分析v-for指令，生成相应的DOM元素并为其绑定env */
function analyseInstructions(vm, elem, instructions, parent) {
  const instructionsArr = getInstructionsArr(instructions);
  const dataSet = getObjVal(vm._data, instructionsArr[2]);
  if(dataSet === undefined) {
    throw new Error(`${instructionsArr[2]}不存在`)
  }
  for (let i = 0; i < dataSet.length; i++) {
    const tempDom = document.createElement(elem.nodeName);
    tempDom.innerHTML = elem.innerHTML;
    const env = analyseCurEnv(instructionsArr[0], dataSet[i], i);
    tempDom.setAttribute('env', JSON.stringify(env));
    parent.elem.appendChild(tempDom);
  }
}

function analyseCurEnv(instruction, curData, index) {
  if(/([a-zA-Z0-9_$]+)/.test(instruction)) {
    instruction = instruction.trim();
    instruction = instruction.substring(1, instruction.length - 1);
  }
  const keysArr = instruction.split(',');
  if(keysArr.length === 0 || keysArr.length > 2) {
    throw new Error('v-for指令格式不正确，正确格式如下：v-for="(item,index) in books" ，其中in也可用of代替');
  }
  let envObj = {};
  if(keysArr.length >= 1) {
    envObj[keysArr[0].trim()] = curData;
  }
  if(keysArr.length == 2) {
    envObj[keysArr[1].trim()] = index;
  }
  return envObj;
}
