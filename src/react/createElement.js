/**
 * 虚拟DOM对象
 */
class Element {
  constructor(type, prop) {
    this.type = type;
    this.prop = prop;
  }
}

/**
 * 创建DOM
 * @param { String } type 标签名称
 * @param { String | Object | Function } prop 属性、样式、事件
 * @param { ...any } children 子DOM
 */
const createElement = function(type, prop = {}, ...children) {
  prop = prop || {};
  // 子DOM 作为 children属性赋予父DOM
  prop.children = children;
  // 新的虚拟DOM
  return new Element(type, prop);
}

export default createElement