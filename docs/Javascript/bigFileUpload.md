---
sidebar_position: 3
---

# 文件上传可能会用到的函数

## 文件切片的实现
file 基于 [Bolb](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)
可以使用 slice 方法 直接切分文件数据 由于 size 为整数 所以有时候文件大小不能完整的被切分为指定的份数
可能会多一分或者少一分
```js
function fileSlice (file, num) {
    const fileList = []
    const size = parseInt(file.size / num)
    let current = 0
    while (current < file.size) {
        fileList.push(file.slice(current, current + size))
        current += size
    }
    return fileList
}
```


## 计算文件的hash值
需要分片上传的文件可能都比较大，所以在计算hash值的时候可能非常耗费时间，由于js为单线程，所以另起一个线程
用于计算 文件hash值 通过 [Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers) 通过postMessage计算hash值，将文件切片传给子线程 等待文件计算
好hash值之后 Promise 转变为 成功状态
```js
   function hashFile (file) {
        return new Promise((resolve, reject) => {
            const worker = new Worker('hashFile.js');
            worker.postMessage({ file: file });
            worker.onmessage = (e) => {
                resolve(e.data)
            }
        })
    }
```

[spark-md5](https://github.com/satazor/js-spark-md5#readme)
```js
// hashFile.js
self.importScripts("./spark-md5.min.js"); 
self.onmessage = (e) => {
    const { file } = e.data;
    const reader = new FileReader();
    const spark = new self.SparkMD5.ArrayBuffer();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
        // 文件加载完成后
        spark.append(e.target.result);
        self.postMessage(spark.end());
        self.close();
    };
}

```