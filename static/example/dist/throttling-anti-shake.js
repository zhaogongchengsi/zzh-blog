;(function () {
  const input = document.getElementById('input')

  //  防抖函数 1

  // function debounce (fn, delay, immediate) {
  //   let lock = null;

  //   return function  () {
  //       let args = arguments,
  //           ctx = this
  //           if (lock) {
  //             clearTimeout(lock);
  //           }
  //       if (immediate) {
  //           let exec = !lock
  //           lock = setTimeout(function () {
  //             lock = null
  //           },delay)

  //           if (exec) {
  //             fn.apply(ctx, args);
  //           }
  //       } else {
  //         lock = setTimeout(function () {
  //           fn.apply(ctx, args);
  //         },delay)
  //       }
  //   }
  // }

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

  function throttle(fn, delay) {
    let t = null,
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

  const fn = throttle(function (e) {
    console.log('this', this)
    console.log('args', arguments)
    console.log('evevt', e)
  }, 500)

  input.addEventListener('input', fn)
})()
