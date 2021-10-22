/** 根据'xx.xx.xx'格式的字符串 获取 对应obj的属性值 */
export function getObjVal(obj, keyStr) {
  if(!obj) return obj;
  const keyArr = keyStr.split('.');
  let curVal = obj;
  for (let i = 0; i < keyArr.length; i++) {
    if(curVal[keyArr[i]]) {
      curVal = curVal[keyArr[i]];
    }else {
      return undefined;
    }
  }
  return curVal;
}

/** 根据'xx.xx.xx'格式的字符串 设置 对应obj的属性值 */
export function setObjVal(obj, keyStr, val) {
  if(!obj) return obj;
  const keyArr = keyStr.split('.');
  let curAttr = obj;
  for (let i = 0; i < keyArr.length - 1; i++) {
    if(curAttr[keyArr[i]]) {
      curAttr = curAttr[keyArr[i]];
    } else {
      return;
    }
  }
  if(curAttr[keyArr[keyArr.length - 1]] !== undefined) {
    curAttr[keyArr[keyArr.length - 1]] = val;
  }
}
