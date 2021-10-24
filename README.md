# my_vue
Referring to Vue, try to develop a small MVVM framework to understand its principle better.

## 技术栈（ES6）
ES Module、定义属性描述符（存取器属性）、虚拟DOM

## 使用方法
使用方法和Vue类似，详见test目录下的两个示例。主要功能如下：
1. 应在script标签上添加属性`type=module`，并通过 ES Module 的形式引入构造函数Vue
2. 通过new的方式创建一个Vue实例，需要传入options对象。该options支持：el、data、methods、created等选项（支持通过`vm.$mount`手动挂载）
3. 支持data数据响应式（使用`Object.defineProperty`创建的代理）
4. 支持`v-model`、`v-for`、`v-bind`、`v-on`指令（后面两个指令支持“简写”）
5. 支持生命周期中的created钩子函数

```html
<div id="app"></div>

<script type="module">
  import Vue from './core/index.js';

  const vm = new Vue({
    el: '#app', //仅支持id选择器
    data: {
    },
    methods: {
    },
    created() {
    }
  });
</script>
```

## 实现原理
> 详见源码（core/index.js）
