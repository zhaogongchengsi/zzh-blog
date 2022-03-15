;(function () {
  let _window = window,
    _document = document

  const selectorStr = '[ \\. | \\# | \\[ ]'

  const _regsymbolStart = new RegExp(`^${selectorStr}`) // 匹配是否已正确的 css 选择器开头 非捕获
  const _regSymcap = new RegExp(`^(${selectorStr})`) // 捕获所有的css 选择器 开头的字符串
  _window.querySelector = function (selector) {
    // 判断是否是合法的css 选择符 若不是则报错
    if (!isSelector(selector)) {
      throw new TypeError(`selector: ${selector.toString()} not a string`)
    }
    return querySelector(selector, false)
  }
  _window.querySelectorAll = function (selector) {
    if (!isSelector(selector)) {
      throw new TypeError(`selector: ${selector.toString()} not a string`)
    }
    return querySelector(selector, true)
  }

  function isSelector(selector) {
    if (typeof selector !== 'string' || !_regsymbolStart.test(selector)) {
      return false
    }
    return true
  }

  // 内部的选择器方法
  function querySelector(selector, isAll /* 是否选择全部 */) {
    let selectoToken = selector.split('\\s')
    let selectoGather = []
    // 遍历所有的 选择器字符串
    selectoToken.forEach(function (token) {
      console.log(token.match(_regSymcap))
    })
  }
})()
