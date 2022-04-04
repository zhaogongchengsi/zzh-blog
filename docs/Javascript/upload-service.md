---
sidebar_position: 3
---

# 大文件分片接收

**大文件上传后端篇**

## Node.js版

### 创建服务器

```js
// service.js
const http = require("http");
const server = http.createServer();
const port = process.env.PORT || 8080;
const { upload, verifyFile, merge } = require("./handler")

server.on("request", async (req, res) => {
    // 防止跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }
  if (req.url === "/verify") {
    await verifyFile(req,res)
    return;
  }

  if (req.url === "/merge") {
    await merge(req,res)
    return;
  }

  if (req.url === "/") {
    await upload(req,res)
  }
});

server.listen(port, () => console.log(`server is running at ${port}`));
```

### upload 方法实现

```js
function upload (req, res) {
    // 文件保存
    const form = new multiparty.Form({
        uploadDir: UPLOAD_DIR,
        maxFields: 1000
    });
    
    form.parse(req);
    form.on("file", (name, file) => {
        console.log(file)
    })
    res.end("upload success")
}
```
未完待续...