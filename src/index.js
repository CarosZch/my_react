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

React.render(element, document.getElementById('root'));
