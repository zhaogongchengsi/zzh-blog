# JavaScript 常用函数合集

## 函数节流

```js
  function throttle(fn, delay) {
    let t = null
        begin = new Date().getTime();
    return function () {
      let args = arguments,
        ctx = this,
        cur = new Date().getTime()
        clearTimeout(t);

      if (cur - begin >= delay) {
        fn.apply(ctx, args);
        begin = cur;
      } else {
        t = setTimeout(function () {
          fn.apply(ctx, args);
        }, delay);
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
// 还没还没来得及写 先用这个凑合
 JSON.parse(JSON.stringify(...))
```

## 时间格式化

```js
// 还没还没来得及写
```
