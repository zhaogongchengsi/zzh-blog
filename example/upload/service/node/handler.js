const multiparty = require("multiparty");
const path = require("path");
const fse = require("fs-extra");

// 文件存储目录
const UPLOAD_DIR = path.join(__dirname, "./upload")


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

function verifyFile (req, res) {
    res.end("verify success")
}

function merge (req, res) {
    res.end("merge success")
}

module.exports = {
    upload,
    verifyFile,
    merge
}