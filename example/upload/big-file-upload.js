class LargeFileUpload {
    constructor(options) {
        if (!options.file) {
            // 若 file 参数不存在 则 直接报错 file 为必填参数
            throw new Error(`The file parameter is required `)
        }
        this.file = options.file;
        // 文件大小
        this.fileSize = options.file.size
        // 需要上传的文件大小
        this.url = options.url
        this._xhr = new XMLHttpRequest();
        this._fileList = [];
        this.whetherShard = options.whetherShard || false;
        this.init(options)
    }


    // 上传方法 传入一个 fn 用来自定义上传
    async upload (fn) {
        console.log('uploading...');
        const formData = new FormData();
        formData.append('file', this.file);
        let res = await this.ajax(formData)
        console.log(res)
    }

    // 初始化
    init (options) {
        // 文件切成的份数 默认为 6 份
        this.numberCopies = options.numberCopies || 6
        if (!options.size) {
            // 如果没用指定大小 则使用文件大小 / 份数
            this.size = parseInt(this.fileSize / this.numberCopies)
        } else {
            this.size = options.size
        }
        if (this.whetherShard) {
            this.slice(this.size)
        }
        return this
    }

    // 将文件进行切片 chunk 
    slice (size) {
        let current = 0
        while (current < this.fileSize) {
            this._fileList.push({ file: this.file.slice(current, current + size) });
            current += size;
        }
        return this 
    }

    // 文件hash
    hash (file){
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = function (e) {
                let hash = CryptoJS.SHA256(e.target.result);
                resolve(hash.toString(CryptoJS.enc.Hex))
            }
            reader.readAsArrayBuffer(file)
        })
    }

    // ajax
    ajax (data, method = "Post", headers) {
        return new Promise((resolve, reject) => {
            this._xhr.open(method, this.url, true);
            this._xhr.onreadystatechange = () => {
                if (this._xhr.readyState === 4) {
                    if (this._xhr.status === 200) {
                        resolve(this._xhr.response)
                    } else {
                        reject(this._xhr.status)
                    }
                }
            }
            if (headers) {
                for (let key in headers) {
                    this._xhr.setRequestHeader(key, headers[key])
                }
            }
            this._xhr.send(data)
        })
    }
}