import initMixin from './init.js'

class Vue {
  constructor(options) {
    console.log(options);
    this._init(options);
  }
  
  /** 初始化options */
  _init(options) {
    initMixin(options);
  }
}

export default Vue;
