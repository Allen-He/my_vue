
function render() {
  console.log('数据更新了！');
}

// 定义数组变异方法
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
const uniqueArr = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
uniqueArr.forEach(method => {
  arrayMethods[method] = function (...args) {
    arrayProto[method].apply(this, args);
    // TODO: 待调用render函数
    render();
  }
})

function defineReactive(vm, data, key, val) {
  observer(vm, val);
  Object.defineProperty(data, key, {
    get() {
      return val;
    },
    set(newVal) {
      if(newVal === val) {
        return;
      }
      val = newVal;
      // TODO: 待调用render函数
      render();
    }
  });
}

function observer(vm, data) {
  if(Array.isArray(data)) {
    data.__proto__ = arrayMethods; //若data为数组，改变其隐式原型（增加数组变异方法）
    return;
  } 
  if(typeof data === 'object') {
    for (const key in data) {
      defineReactive(vm, data, key, data[key]);
    }
  }
}

function proxyObserver(vm, data) {
  // 将data响应式化
  observer(vm, data);

  // 将data中的各属性对应的响应式数据，直接挂载到当前实例vm的同名属性上
  for (const prop in data) {
    if (Object.hasOwnProperty.call(data, prop)) {
      vm[prop] = data[prop];
    }
  }

  vm.$set = function (data, key, value) {
    if(Array.isArray(data)) {
        data.splice(key, 1, value);
        return value;
    }
    defineReactive(data, key, value);
    // TODO: 待调用render函数
    render();
    return value;
  }

  vm.$delete = function (data, key) {
    if(Array.isArray(data)) {
        data.splice(key, 1);
    }
    delete data[key];
    // TODO: 待调用render函数
    render();
  }
}

export default proxyObserver;
