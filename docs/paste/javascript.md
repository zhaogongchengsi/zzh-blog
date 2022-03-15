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
