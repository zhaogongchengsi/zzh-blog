const http = require("http");
const server = http.createServer();
const port = process.env.PORT || 8080;
const { upload, verifyFile, merge } = require("./handler")

server.on("request", async (req, res) => {
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

server.listen(port, () => console.log(`server is running at http://localhost:${port}`));