import initMixin from './init.js';
import renderMixin from './render.js';

class Vue {
  constructor(options) {
    this._init(options);
    this._render();
  }
  
  /** 初始化options */
  _init(options) {
    initMixin.call(this, options);
  }
  /** 渲染 */
  _render() {
    renderMixin.call(this);
  }
}

export default Vue;
