# JavaScript 常用函数合集

## 函数节流(简单版)

```js
function throttle(func) {
  let timeout;
  return function () {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.call(this, arguments);
      }, wait);
    }
  };
}
```

## 函数防抖

```js
// 还没还没来得及写
```

## 深克隆

```js
// 还没还没来得及写
```

## 时间格式化

```js
// 还没还没来得及写
```
