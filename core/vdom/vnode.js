class VNode {
  /**
   * @param {*} tag 标签名
   * @param {*} elem 对应的真实节点
   * @param {*} children 当前虚拟节点的子节点
   * @param {*} text 当前虚拟节点中的文本
   * @param {*} data VNodeData（暂时保留）
   * @param {*} parent 父级VNode节点
   * @param {*} nodeType 节点类型
   * @param {*} key 
   */
  constructor(tag, elem, children, text, data, parent, nodeType, key) {
    this.tag = tag;
    this.elem = elem;
    this.children = children;
    this.text = text;
    this.data = data;
    this.parent = parent;
    this.nodeType = nodeType;
    this.key = key;
    this.env = {}; //存放当前节点的环境变量
    this.instructions = null; //存放指令
    this.template = []; //存放当前模板涉及到的模板
  }
}

export default VNode;
