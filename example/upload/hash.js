self.importScripts("./spark-md5.min.js"); // 导入脚本

// 生成文件 hash
self.onmessage = (e) => {
  const { fileChunkList } = e.data;
  const spark = new self.SparkMD5.ArrayBuffer();
  let percentage = 0;
  let count = 0;
  const loadNext = (index) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileChunkList[index].file);
    reader.onload = (e) => {
      count++;
      spark.append(e.target.result); //把文件合并到spark中
      // 文件合并完毕后 计算文件 hash 并返回给主线程
      if (count === fileChunkList.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end(),
        });
        self.close();
      } else {
          // 返回进度百分比
        percentage += 100 / fileChunkList.length;
        self.postMessage({
          percentage,
          res: "test"
        });
        loadNext(count);
      }
    };
  };
  loadNext(0);
};
