---
sidebar_position: 2
title: "函数节流和防抖"
---

# 实现函数防抖和截流

##### [直接看最终版防抖函数](#最终版防抖函数)

##### [直接看最终版节流函数](#函数节流)

问题：当同一个事件短时间内被执行多次，但是只需要最后一次执行的结果（例如：input 的输入事件，滚动条滚动事件，Ajax 请求），怎么样实现函数会在事件最后一次触发后执行，这种时候就需要防抖函数

![问题](/exampleImg/js/debounce.png)

## 函数防抖

### 第一版防抖函数

```js
function debounce(fn, delay) {
  let lock = null
  return function name() {
    clearTimeout(lock)
    lock = setTimeout(function () {
      fn()
    }, delay)
  }
}
```

实现原理:
一个`debounce`函数接受两个参数第一个为要执行的函数，第二个为执行的时间间隔在多少秒内触发不执行，
返回一个函数，将需要执行的函数, 包裹在 setTimeout 内将要执行的函数延时到指定的时间后执行，但是当事
件在短时间内（还未超过第二个参数设定的时间）第二次触发后，因为`clearTimeout(lock);` 当第二
次执行后 会清除上一次定时器的 id，那么上一次定时的函数还未执行 就被清除自然不会执行，但是还会再次赋值
一个新的定时器，将需要执行的函数接着往后延迟，等到事件不会在触发后，会有最后一次定时器没有被清除，所以
指定的函数会在最后执行

> 使用:

```js
const input = document.getElementById('input') // 输入框
//  防抖函数 1
function debounce(fn, delay) {
  let lock = null
  return function () {
    clearTimeout(lock)
    lock = setTimeout(function () {
      fn()
    }, delay)
  }
}
const fn = debounce(function () {
  console.log('正在被输入')
}, 500)
input.addEventListener('input', fn)
```

![防抖函数的使用](/exampleImg/js/de2.png)

#### 如果需要执行的函数需要指定参数，而且需要执行期上下文不变怎么办？

### 第二版防抖函数

```js
function debounce(fn, delay) {
  let lock = null
  return function () {
    let args = arguments,
      ctx = this
    clearTimeout(lock)
    lock = setTimeout(function () {
      fn.apply(ctx, args)
    }, delay)
  }
}
```

实现原理:
获取执行期的 `this` 和 `arguments` 在执行的时候通过 `apply` 改变执行期的 this 和实参

> 使用:

```js
const fn = debounce(function (e) {
  console.log('this', this)
  console.log('args', arguments)
  console.log('evevt', e)
}, 500)
input.addEventListener('input', fn)
```

![防抖函数的使用](/exampleImg/js/de3.png)

### 最终版防抖函数

参数:

1. 需要执行的函数
2. 时间间隔
3. 第一次是否执行

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

最终版的防抖函数 新增了一个方法 用以删除函数防抖，使其立即执行

## 函数节流

当同一个事件或者操作在 n 秒之内 只执行一次事件处理函数

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

实现原理：**_当前时间 - 上一个执行的时间 = x 秒_** 若 x >= delay 说明已经超过规定时间则需要立即执行处理函数
否则说明还在规定时间内 则需要将处理函数延迟到规定的时间之后在执行
