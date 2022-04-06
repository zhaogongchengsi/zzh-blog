

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

function hashFile (file) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('hashFile.js');
        worker.postMessage({ file: file });
        worker.onmessage = (e) => {
            resolve(e.data)
        }
    })
}