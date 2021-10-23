import { renderData } from './render.js';


export function constructProxy(vm, data, namespace) {  
  let proxy = {};
  if(Array.isArray(data)) {
    proxy = new Array(data.length);
    for (let i = 0; i < proxy.length; i++) {
      proxy[i] = constructProxy(vm, data[i], namespace);
    }
    proxy = proxyArr(vm, data, namespace); //通过“修改data数组的隐式原型”的方法增加数组变异方法
  }else if(typeof data === 'object') {
    proxy = constructProxyObj(vm, data, namespace);
  }
  return proxy;
}

const arrayProto = Array.prototype; //暂存数组的原型

function proxyArr(vm, arr, namespace) {
  let interObj = {
    dataType: 'Array',
    toString() {
      const arr = this;
      let resStr = '';
      for (let i = 0; i < arr.length; i++) {
        resStr += arr[i] + ','
      }
      resStr = resStr.substring(0, resStr.length - 1);
      return resStr;
    }
  };
  // 定义数组变异方法
  const funcArr = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
  for (let i = 0; i < funcArr.length; i++) {
    defineArrFunc.call(vm, interObj, funcArr[i], namespace, vm);
  }
  // 修改arr的隐式原型
  arr.__proto__ = interObj;
  return arr;
}

function defineArrFunc(obj, func, namespace, vm) {
  Object.defineProperty(obj, func, {
    enumerable: true,
    configurable: true,
    value: function (...args) {
      const arrayProtoFunc = arrayProto[func];
      const res = arrayProtoFunc.apply(this, args);
      renderData(vm, getNamespace(namespace, ''));
      return res;
    }
  })
}

function constructProxyObj(vm, obj, namespace) {
  let proxyObj = {};
  for (const prop in obj) {
    Object.defineProperty(proxyObj, prop, {
      get() {
        return obj[prop];
      },
      set(newVal) {
        if(newVal === obj[prop]) {
          return;
        }
        obj[prop] = newVal;
        renderData(vm, getNamespace(namespace, prop));
      }
    });
    if(namespace === '') { //将data中最外层的属性引用代理到当前vm实例上，data中的嵌套属性不做该处理
      Object.defineProperty(vm, prop, {
        get() {
          return obj[prop];
        },
        set(newVal) {
          if(newVal === obj[prop]) {
            return;
          }
          obj[prop] = newVal;
          renderData(vm, getNamespace(namespace, prop));
        }
      });
    }
    
    if(typeof obj[prop] === 'object') {
      proxyObj[prop] = constructProxy(vm, obj[prop], getNamespace(namespace, prop));
    }
  }
  return proxyObj;
}

/** 获取当前属性的命名空间 */
function getNamespace(curNamespace, curProp) {
  if(curNamespace == null || curNamespace == '') {
    return curProp;
  }else if(curProp == null || curProp == '') {
    return curNamespace;
  }else {
    return curNamespace + '.' + curProp;
  }
}
