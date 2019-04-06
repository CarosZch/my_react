// 简单工厂模式 一个dom就是一个unit(单元)

// 单元<爹>
class Unit {
  constructor(element) {
    // 当前的组件/对象
    this._currentElement = element;
  }
}

// 文本单元<子>， 继承了单元<爹>
class ReactTextUnit extends Unit {
  // 创建实例
  getMarkup(rootId) {
    this._rootId = rootId
    return `<span data-rid="${ this._rootId }">${ this._currentElement }</span>`
  }
}

// 原生单元<子>， 继承了单元<爹>
class ReactNativeUnit extends Unit {
  // 创建实例
  getMarkup(rootId) {
    this._rootId = rootId
    return recursionCreate(this._currentElement, rootId)
  }
}

/**
 * 创建element 返回element.outerHTML
 * @param {Object} { type, props } createElement对象
 * @param {*} rootId 
 */
function recursionCreate({ type, props }, rootId) {
  // 创建DOM
  const DOM = document.createElement(type)
  // 给予ID
  DOM.setAttribute('data-rid', rootId)
  for (const key in props) {
    if (key === 'children') {
      // 为子单元
      let children = props.children || []
      children.forEach((e, i) => {
        if (typeof e === 'string' || typeof e === 'number') {
          // 为非单元
          DOM.innerHTML += createReactUnit(e).getMarkup(rootId + '.' + i)
        } else {
          // 为单元，递归插入
          DOM.innerHTML += recursionCreate(e, rootId + '.' + i)
        }
      })
    } else if (/^on[A-Z]/.test(key)) {
      // 为事件, 做事件委托
      delegate(rootId, key, props[key])
    } else if (typeof props[key] === 'string') {
      // 为属性，添加
      DOM.setAttribute(key, props[key])
    } else {
      // 为样式style，修改后添加（react不允许style传字符串）
      DOM.setAttribute(key, objToStyle(props[key]))
    }
  }
  // 返回单元的字符串
  return DOM.outerHTML
}

/**
 * 对象样式转行内样式
 * @param {Object} obj 对象 
 */

function objToStyle(obj, str='') {
  for (const key in obj) {
    str += `${
      // 驼峰转带"-"的样式
      key.replace(/[A-Z]/g, function (word) {
        return "-" + word.toLowerCase()
      })
    }:${
      obj[key]
    };`
  }
  return str
}

/**
 * 事件委托
 * @param { String } dataReactId react的id属性
 * @param { String } event 事件名称 如onClick
 * @param { Function } fn 事件回调函数
 */
function delegate(dataReactId, event, fn) {
  // onClick => addEventListener('click', fn())
  document.addEventListener(event.replace(/^on/, '').toLowerCase(), function(event) {
    // 当点击对象的data-rid是所选对象的子单元，执行fn
    const tar = event.target.getAttribute('data-rid')
    // 忽略html、body等不相干标签
    tar && tar.indexOf(dataReactId) === 0 && fn()
  })
}

class ReactCompositeUnit extends Unit {
  getMarkup(rootId) {
    this._rootId = rootId;
    let { type:Component, props } = this._currentElement;
    // 创建组件的实例
    let componentInstance = this._componentInstance = new Component(props);
    // 生命周期
    componentInstance.componentWillMount && componentInstance.componentWillMount();
    // 得到返回的虚拟DOM（React）
    let rennderedElement = componentInstance.render();
    // 渲染出单元实例
    let rennderedUnitInstance = createReactUnit(rennderedElement)
    process.nextTick(() => {
      componentInstance.componentDidMount && componentInstance.componentDidMount();
    })
    return rennderedUnitInstance.getMarkup(rootId)
  }
}

/**
 * 创建 React的虚拟DOM
 * 根据参数不同 返回不同类型的实例 一般来说都是同一个父类的子类
 * @param {*} element 虚拟DOM写法对象
 */
function createReactUnit (element) {
  // 数字、字符串
  if (typeof element === 'number' || typeof element === 'string') {
    return new ReactTextUnit(element);
  };
  // 虚拟DOM
  if (typeof element === 'object' && typeof element.type === 'string') {
    return new ReactNativeUnit(element);
  };
  // 自定义组件
  if (typeof element === 'object' && typeof element.type === 'function') {
    return new ReactCompositeUnit(element);
  }
}

export default createReactUnit