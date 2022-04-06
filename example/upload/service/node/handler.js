const multiparty = require("multiparty");
const path = require("path");
const fse = require("fs-extra");

// 文件存储目录
const UPLOAD_DIR = path.join(__dirname, "./upload")
const extractExt = (filename) =>
  filename.slice(filename.lastIndexOf("."), filename.length); // 提取后缀名

function upload (req, res) {

    // 文件保存
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error(err);
          res.status = 500;
          res.end("process file chunk failed");
          return;
        }
        const [file] = files.file;
        const [hash] = fields.hash;
        const [id] = fields.id;
        const [fileName] = fields.fileName;
        const filePath = path.resolve(
          UPLOAD_DIR,
          `${hash}${extractExt(fileName)}`
        );
        const chunkDir = path.resolve(UPLOAD_DIR, hash);
  
        // 文件存在直接返回
            if (fse.existsSync(filePath)) {
            res.end("file exist");
            return;
            }
    
            // 切片目录不存在，创建切片目录
            if (!fse.existsSync(chunkDir)) {
            await fse.mkdirs(chunkDir);
            }
            // fs-extra 专用方法，类似 fs.rename 并且跨平台
            // fs-extra 的 rename 方法 windows 平台会有权限问题
            // https://github.com/meteor/meteor/issues/7852#issuecomment-255767835
            try {
              await fse.move(file.path, path.resolve(chunkDir, hash + "-" + id));
            } catch (e) {
              console.error(e);
              res.end("received file chunk failed");
            }
            
            
        });
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