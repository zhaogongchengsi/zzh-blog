;(function () {
  function deepClone(origit_obj, hashMap = new WeakMap()) {
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

  let test3obj = {}

  let testObj = {
    name: 'test',
    age: 30,
    testArr: [{ name: 'test2', age: 31 }, 1213, 4235, 'sadasd', [123123, { age: 56 }]],
    test2Obj: {
      name: '123',
      age: 1231,
      obj: {
        obj: [{ name: 'test' }],
      },
      ar: [{ name: 'tes123t' }, 123, 'sadasd'],
    },
    func: function () {
      console.log('1213')
    },
  }
  testObj.partest = test3obj
  test3obj.partest2 = testObj
  let o = deepClone(testObj)
  o.name = '更改后的值' // 更改第一层的值
  o.testArr[0].name = '更改数组内的值'
  o.test2Obj.name = '更改对象内的值'
  o.test2Obj.obj.obj[0].append = '新增后的值'
  console.log('原值', testObj)
  console.log('克隆后', o)
})()
