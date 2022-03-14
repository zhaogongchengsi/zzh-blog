(function () {

  const input = document.getElementById('input');

  //  防抖函数 1 

  function debounce (fn, delay, immediate) {
    let lock = null;
 
    return function  () {
        let args = arguments,
            ctx = this
        clearTimeout(lock);
        if (immediate) {
            fn.apply(ctx, args);
            immediate = true;
        } else {
          lock = setTimeout(function () {
            fn.apply(ctx, args);
          },delay)
        }

    }
  }
  // fn 是谁？
  const fn = debounce(function (e) {
    console.log("this", this)
    console.log("args", arguments)
    console.log("evevt", e) 
  }, 500)

  input.addEventListener("input", fn)

})()