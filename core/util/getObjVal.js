/** 根据'xx.xx.xx'格式的字符串获取对应obj的属性值 */
export default function getObjVal(obj, keyStr) {
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
