import createReactUnit from './createReactUnit'
import createElement from './createElement'

const React = {
  // 下一个根结点索引
  nextRootIndex: 0,
  // 创建虚拟组件
  createElement,
  // 渲染函数
  render
}

/**
 * 渲染函数
 * @param {Element} element 文本、虚拟DOM、DOM组件
 * @param {Element} container 放置容器
 */
function render (element, container) {
  // 判断element，返回正确的实例
  let unitInstance = createReactUnit(element);
  // getMarkup 通过实例 获取实例对应的HTML片段
  let markup = unitInstance.getMarkup(React.nextRootIndex);
  // 放到容器中去
  container.innerHTML = markup
}

export default React
