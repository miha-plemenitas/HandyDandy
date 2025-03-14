const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url === "/podatkovni-model/") {
    fs.readFile(
      path.join(__dirname, "../Description/podatkovni-model.html"),
      (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Napaka pri branju HTML datoteke.");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      }
    );
  } else if (req.url === "/REST/") {
    fs.readFile(
      path.join(__dirname, "../Description/rest.txt"),
      (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Napaka pri branju tekstovne datoteke.");
        } else {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(data);
        }
      }
    );
  } else if (req.url === "/HandyDandy.png") {
    const imgPath = path.join(__dirname, "../Description/HandyDandy.png");
    fs.readFile(imgPath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Slika ni najdena.");
      } else {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Stran ne obstaja.");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server teče na http://localhost:${PORT}`);
});
