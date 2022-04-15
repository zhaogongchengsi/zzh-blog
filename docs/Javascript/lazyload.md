---
sidebar_position: 5
title: '图片懒加载'
---

# 图片懒加载

实现: 渲染时 将图片路径在 图片的 `data-src="src"` 上面, 然后绑定
滚动条滚动事件,然后判断图片是否出现在可视区域内,只要出现在可视区域内
就将 data-src 上面的路径换成 src 的真实路径

## 使用方式

1. el: 为需要渲染图片的父节点
2. srcs: 图片路径的列表

```js
const imgArr = [
  "https://th.wallhaven.cc/lg/x8/x8ye3z.jpg",
  "https://th.wallhaven.cc/lg/6o/6ozkzl.jpg",
  "https://th.wallhaven.cc/lg/wq/wqve97.jpg",
  "https://th.wallhaven.cc/lg/v9/v9v3r5.jpg",
  ... // 假装这里还有好多图片路径
]

new Lazyload({
    el: "#app",
    srcs: imgArr.concat(imgArr),
})
```

## Lazyload 实现

```js
export default class Lazyload {
    el?: HTMLElement;
    srcs?: string[];
    offset?: number;
    private ImgEleArr: HTMLElement[];
    constructor(options: LazyloadOptions) {
        if (options.el) {
            this.el = document.querySelector(options.el || "body")!;
        }
        this.srcs = options.srcs || [];
        this.offset = options.offset || 0;
        this.ImgEleArr = []
        this.init(options);
    }

    init(options: LazyloadOptions) {
        this.bindEvents(options);
        this.runder();
        this.monitor();
    }
}
```

## 探测图片是否出现在可视区内

```js
    monitor () {
        // 获取可视区域
        const clientHeight = document.documentElement.clientHeight;
        const offset = this.offset;
        const ImgEleArr = this.ImgEleArr;
        ImgEleArr.forEach(el => {

            if (el.getBoundingClientRect().top <= clientHeight + offset) {
                el.src = el.dataset.src;
            }

        }, this);

    }
```

## 图片渲染在视图上面

渲染 src 时,将 src 路径放在`data-src`中,等待着以后渲染在真实路径上

```js
    runder () {
        (this.srcs!).forEach(src => {
            const el = document.createElement('div');
            el.classList.add('box');
            const img = document.createElement('img');
            img.classList.add('box-img');
            // 渲染data-src
            img.setAttribute('data-src', src);
            // 图片暂时不渲染
            img.src = "";
            // 将图片的 img dom 保存起来
            this.ImgEleArr.push(img);
            el.appendChild(img);
            this.el!.appendChild(el);
        }, this);
    }
```

## 绑定滚动事件

```js

    bindEvents(options: LazyloadOptions) {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll () {
        // 这里面可能要干点别的 所有暂时这样写
        this.monitor()
    }
```

[完整示例](https://github.com/zhaogongchengsi/zzh-example/tree/master/lazyload)
