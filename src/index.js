import React from './react'

/*
 * jsx语法
  <div id="box" style="border:1px solid #cccccc;height:100px;width:100px;">
    <input value="我是输入内容" style="float:left;"/>
    <button style="float:left;margin-left:15px;">
      我是
      <b>按钮</b>
    </button>
  </div>
*/

// jsx  ->  object （ https://babeljs.io/repl/ ）

let element = React.createElement(
  'div',
  { id: 'box', style: { border: '1px solid #cccccc', height: '100px', width: '300px' }},
  React.createElement(
    'input',
    { id: 'ipt', style: { float: 'left' }, value: '我是输入内容'}
  ),
  React.createElement(
    'button',
    { id: 'btn', style: { float: 'left', marginLeft: '15px' }, onMousedown: function() { alert('点击了！') }},
    '我是',
    React.createElement('b', {}, '按钮')
  )
);

/**
 * 自定义组件
 */
class customComponents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 1
    };
  }
  componentWillMount() {
    console.log('组件将要挂载');
  }
  componentDidMount() {
    console.log('组件已经挂载');
  }
  handelClick = () => {
    this.setState({
      num: this.state.num++
    });
  }
  render() {
    const p = React.createElement('p', {}, this.state.num);
    const btn = React.createElement('button', {
      onClick: this.handelClick
    }, '+');
    return React.createElement('div', {}, p, btn);
  }
}
element = React.createElement(customComponents, {name: '自定义组件'})

React.render(element, document.getElementById('root'));
