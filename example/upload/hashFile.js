self.importScripts("./spark-md5.min.js"); 

self.onmessage = (e) => {
    const { file } = e.data;
    const reader = new FileReader();
    const spark = new self.SparkMD5.ArrayBuffer();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
        spark.append(e.target.result);
        self.postMessage(spark.end());
        self.close();
    };
}

