/**
 * 虚拟DOM对象
 */
class Element {
  constructor(type, props) {
    this.type = type;
    this.props = props;
    this.key = props.key // dom-diff 对比
  }
}

/**
 * 创建DOM
 * @param { String } type 标签名称
 * @param { String | Object | Function } props 属性、样式、事件
 * @param { ...any } children 子DOM
 */
const createElement = function(type, props = {}, ...children) {
  props = props || {};
  // 子DOM 作为 children属性赋予父DOM
  props.children = children;
  // 新的虚拟DOM
  return new Element(type, props);
}

export default createElement