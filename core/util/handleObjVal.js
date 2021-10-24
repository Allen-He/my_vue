/** 根据'xx.xx.xx'格式的字符串 获取 对应obj的属性值 */
export function getObjVal(obj, keyStr) {
  if(!obj) return obj;
  const keyArr = keyStr.split('.');
  let curVal = obj;
  for (let i = 0; i < keyArr.length; i++) {
    if(curVal[keyArr[i]] !== undefined) {
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
    if(curAttr[keyArr[i]] === undefined) {
      curAttr = curAttr[keyArr[i]];
    } else {
      return;
    }
  }
  if(curAttr[keyArr[keyArr.length - 1]] !== undefined) {
    curAttr[keyArr[keyArr.length - 1]] = val;
  }
}

/** 混合两个属性对象 */
export function mergeAttr(obj1, obj2) {
  if(obj1 == null && obj2 != null) {
    return deepClone(obj2);
  }else if(obj1 != null && obj2 == null) {
    return deepClone(obj1);
  }
  let resObj = {};
  let keysObj1 = Object.getOwnPropertyNames(obj1);
  for (let i = 0; i < keysObj1.length; i++) {
    resObj[keysObj1[i]] = obj1[keysObj1[i]];
  }
  let keysObj2 = Object.getOwnPropertyNames(obj2);
  for (let i = 0; i < keysObj2.length; i++) {
    resObj[keysObj2[i]] = obj2[keysObj2[i]];
  }
  return resObj;
}


/** 深度克隆 */
function deepClone(obj) {
  if(obj instanceof Array) {
    return cloneArray(obj);
  }else if(obj instanceof Object) {
    return cloneObject(obj);
  }else {
    return obj;
  }
}

function cloneObject(obj) {
  let resObj = {};
  const keysArr = Object.getOwnPropertyNames(obj);
  for (let i = 0; i < keysArr.length; i++) {
    resObj[keysArr[i]] = deepClone(obj[keysArr[i]]);
  }
  return resObj;
}

function cloneArray(arr) {
  let resArr = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    resArr[i] = deepClone(arr[i])
  }
  return resArr;
}

/** 混合当前vnode的执行环境（能够访问到的数据变量范围） */
export function getEnvObj(vm, vnode) {
  let result = mergeAttr(vm._data, vnode.env);
  result = mergeAttr(result, vm._computed);
  return result;
}
