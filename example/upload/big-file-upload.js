class LargeFileUpload {
    constructor(options) {
        if (!options.file) {
            // 若 file 参数不存在 则 直接报错 file 为必填参数
            throw new Error(`The file parameter is required `)
        }
        this.file = options.file;
        // 文件大小
        this.fileSize = options.file.size
        this.fileName = options.file.name
        // 需要上传的文件大小
        this.url = options.url
        this._fileList = [];
        this.whetherShard = options.whetherShard || false;
        this.init(options)
    }


    // 上传方法 传入一个 fn 用来自定义上传
    async upload (fn) {
        const qus = await this.createUploadQueue()
        Promise.all(qus).then(function (res) {
            console.log(1,res)
        })
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
    hash (){
        return new Promise((resolve, reject) => {
            const worker = new Worker('hash.js');
            worker.postMessage({ fileChunkList: this._fileList });
            worker.onmessage = (e) => {
                const { hash, percentage } = e.data
                if (hash) {
                    resolve(hash)
                }
            }
        })
    }

    // ajax
    ajax ({data, method = "Post", headers,progress=() => {}}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, this.url, true);
            xhr.addEventListener('progress', progress);
            if (headers) {
                for (let key in headers) {
                    xhr.setRequestHeader(key, headers[key])
                }
            }
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve({
                        status: xhr.status,
                        response: xhr.response,
                        isOK: true
                    })
                } else {
                    resolve({
                        status: xhr.status,
                        response: xhr.response,
                        isOK: false
                    })
                }
            }
            xhr.send(data);
        })
    }

    async createUploadQueue () {
        const hash = await this.hash()
        return this._fileList.map(({file}, index) => {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('file', file)
                formData.append('size', this.size)
                formData.append('hash', hash)
                formData.append('id', index)
                formData.append('fileName', this.fileName)
                formData.append('fileSize', this.fileSize)
                return this.ajax({
                    data: formData,
                    method: "Post",
                    progress: (e) => {
                        // console.log(e)
                    }
                })
            })
        }, this)
    }
}