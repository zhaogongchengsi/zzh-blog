---
sidebar_position: 2
---

# 大文件分片上传

## LargeFileUpload 类实现

### 准备工作
准备一个页面用来上传功能 例子以图片为例 一个文件选择输入框 一个上传按钮 一个上传图片的预览
当选择文件图片之后 现将本地文件放进 在网页中预览出来 然后 创建一个 ```LargeFileUpload``` 实例
当运行 ```upload``` 方法之后开始上传文件
> ### 前置知识
- [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
- [类文件对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>大文件分片上传</title>
    <link rel="stylesheet" href="./dist/css/big-file.css">
    <scripe src="./dist/big-file-upload.js"></scripe>
  </head>
  <body>
    <div class="container">
      <input class="" type="file" placeholder="请选择文件" id="file-input" />
      <button type="button" id="upload" name="upload">上传</button>
    </div>

    <div class="img-preview"> <h3>预览：</h3><img src="" alt="还未选择图片"> </div>

    <script>
      const ofileInput = document.getElementById('file-input'),
        oUpload = document.getElementById('upload'),
        oimg = document.querySelector(".img-preview img")
        oUpload.addEventListener('click', upload, false);

        let file

        ofileInput.addEventListener("change", function () {
            file = ofileInput.files[0]
            var reader  = new FileReader();
            reader.addEventListener("load", function () {
                oimg.src = reader.result;
            }, false)
            if (file) {
                reader.readAsDataURL(file);
            }
        })

        function upload (e) {
            file = new LargeFileUpload({
                url:"http://localhost:8080", // 需要上传的路径
                size: 128 * 1024,
                file: file // 上传的文件
            })

            // 当运行 upload 方法时 开始上传
            file.upload()
        }
    </script>
  </body>
</html>

```
LargeFileUpload类 准备工作 以及初始化工作 使用es6的class
除了 options 内的 配置项外 在初始化 两个 内部对象 一个为 xhr 
用来发起请求 一个用来存储 文件切片的数组
```js
class LargeFileUpload {
    constructor(options) {
        this.file = options.file
        // 文件大小
        this.fileSize = options.file.size
        // 需要上传的文件大小
        this.url = options.url
        this._xhr = new XMLHttpRequest();
        this._fileList = [];
        this.init(options)
    }
}
```

## 初始化 init 方法实现
初始化方法 计算 需要切分的大小 opt内若设置了切分文件大小则使用opt内的参数，若opt内没有设置 则通过opt内
指定的切分份数 来计算 切分的大小 **指定的size 参数比 numberCopies （默认值为 6 份） 参数优先级高**
```js
init (options) {
    // 文件切成的份数 默认为 6 份
    this.numberCopies = options.numberCopies || 6
    if (!options.size) {
        // 如果没用指定大小 则使用文件大小 / 份数
        this.size = parseInt(this.fileSize / this.numberCopies)
    } else {
        this.size = options.size
    }
    
    this.slice(this.size)

    return this
}

```
## 文件切片的实现
file 基于 [Bolb](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)
可以使用 slice 方法 直接切分文件数据 由于 size 为整数 所以有时候文件大小不能完整的被切分为指定的份数
可能会多一分或者少一分
```js
slice () {
    let current = 0
    while (current < this.fileSize) {
        this._fileList.push({ file: this.file.slice(current, current + size) });
        current += size;
    }
    return this 
}
```
未完待续...