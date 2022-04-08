---
title: js 常用函数合集
---

# JavaScript 常用函数合集

## 函数节流

```js
function throttle(fn, delay) {
  let t = null
  begin = new Date().getTime()
  return function () {
    let args = arguments,
      ctx = this,
      cur = new Date().getTime()
    clearTimeout(t)

    if (cur - begin >= delay) {
      fn.apply(ctx, args)
      begin = cur
    } else {
      t = setTimeout(function () {
        fn.apply(ctx, args)
      }, delay)
    }
  }
}
```

## 函数防抖

```js
function debounce(fn, delay, immediate) {
  let lock = null
  const deb = function () {
    let args = arguments,
      ctx = this
    clearTimeout(lock)
    if (immediate) {
      fn.apply(ctx, args)
      immediate = false
    } else {
      lock = setTimeout(function () {
        fn.apply(ctx, args)
      }, delay)
    }
  }

  deb.remove = function () {
    clearTimeout(lock)
    lock = null
  }

  return deb
}
```

## 深克隆

```js
  JSON.parse(JSON.stringify(...)) // 克隆不了函数

  function deepClone(origit_obj, hashMap = new WeakMap() /* 建立映射表 防止递归引用 导致的爆栈 */) {
    if (origit_obj === undefined || typeof origit_obj !== 'object') {
      return origit_obj
    }

    if (origit_obj instanceof Date) {
      return new Date(origit_obj)
    }

    if (origit_obj instanceof RegExp) {
      return new RegExp(origit_obj)
    }

    let oldobj = hashMap.get(origit_obj)
    if (oldobj) {
      return oldobj
    }
    let newobj = new origit_obj.constructor()
    hashMap.set(origit_obj, newobj)
    for (var key in origit_obj) {
      if (origit_obj.hasOwnProperty(key)) {
        newobj[key] = deepClone(origit_obj[key], hashMap)
      }
    }
    return newobj
  }
```

## 回到顶部函数

```js
// 示例
onTop.addEventListener(
  'click',
  function () {
    window.requestAnimationFrame(scrollToTop)
  },
  false
)

function scrollToTop() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop > 0) {
    window.requestAnimationFrame(scrollToTop)
    window.scrollTo(0, scrollTop - 200)
  } else {
    window.cancelAnimationFrame(scrollToTop)
  }
}
```

## 动态改变根元素字体大小

```js
var docEl = doc.documentElement
var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'

function recalc() {
  var designWidth = 75 // 100px = 10rem   10px ：1rem
  var clientWidth = docEl.clientWidth
  // 当超出限制 比如电脑打开手机的页面 则定死一个宽度
  if (clientWidth > 750) {
    clientWidth = 750
  }

  docEl.style.fontSize = clientWidth / designWidth + 'px'
}

if (!doc.addEventListener) return
recalc()
win.addEventListener(resizeEvt, recalc, false)
doc.addEventListener('DOMContentLoaded', recalc, false)
```

## 浏览器版本检测

```js
(function () {
      // 检测ie
      const userAgent = navigator.userAgent
      const isIE = /msie\s|trident.*rv:([\w.]+)/i.test(userAgent);
      // 检测edge
      const isEdge = /edge\/([\w.]+)/.test(userAgent);
      // 检测firefox
      const isFirefox = /firefox\/([\w.]+)/.test(userAgent);
      // 检测chrome
      const isChrome = /chrome\/([\w.]+)/.test(userAgent) && !isEdge;
      // 检测opera
      const isOpera = /opera\/([\w.]+)/.test(userAgent);
      // 检测safari
      const isSafari = /version\/([\w.]+).*safari/.test(userAgent) && !isEdge;
      // 检测是否为移动端
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      // 检测是否为移动端
      const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

      if (isIE) {
        const isUpDate = confirm("当前浏览器版本过低!! 点击确认升级浏览器")
        if (isUpDate) {
          window.open('https://www.google.cn/intl/zh-CN/chrome/')
        }
      }
 })()
```
