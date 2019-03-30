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
    return `<span data-react-id="${ this._rootId }">${ this._currentElement }</span>`
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
 * @param {Object} { type, prop } createElement对象
 * @param {*} rootId 
 * @param {Number} i 
 */
function recursionCreate({ type, prop }, rootId, i) {
  i = 0
  // 创建DOM
  const DOM = document.createElement(type)
  // 给予ID
  DOM.setAttribute('data-react-id', rootId)
  for (const key in prop) {
    // children不是属性
    if (key === 'children') continue;
    if (/^on[A-Z]/.test(key)) {
      // 为事件, 做事件委托
      delegate(rootId, key, prop[key])
    } else if (typeof prop[key] === 'string') {
      // 为属性
      DOM.setAttribute(key, prop[key])
    } else {
      // 为样式style
      DOM.setAttribute(key, objToStyle(prop[key]))
    }
  }
  // 递归插入子单元
  prop.children && prop.children[0] && prop.children.forEach(e => {
    if (typeof e === 'string') {
      // console.log(createReactUnit(e).getMarkup(rootId + '.' + i))
      DOM.innerHTML += createReactUnit(e).getMarkup(rootId + '.' + i)
    } else {
      DOM.innerHTML += recursionCreate(e, rootId + '.' + i, i)
    }
    i++
  })
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
 * 事件代理
 * @param { String } dataReactId react的id属性
 * @param { String } event 事件名称 如onClick
 * @param { Function } fn 事件回调函数
 */
function delegate(dataReactId, event, fn) {
  // onClick => addEventListener('click', fn())
  document.addEventListener(event.replace(/^on/, '').toLowerCase(), function(event) {
    // 当点击对象的data-react-id是所选对象的子单元，执行fn
    console.log(1)
    const tar = event.target.getAttribute('data-react-id')
    // 忽略html、body等不相干标签
    tar && tar.indexOf(dataReactId) === 0 && fn()
  })
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
}

export default createReactUnit