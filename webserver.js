const http = require('http');
var config = require('jsonconfig');
const fs = require('fs');
const path1 = require('path');
const path = './config.json';
let student = { 
    BIND_ADDR: 'localhost',
    BIND_PORT: 80 
};
try {
  if (!fs.existsSync(path)) {
    fs.writeFile(path, '', function (err) {
    if (err) throw err;
        console.log('File is created successfully.');
    }); 
    let data = JSON.stringify(student);
    fs.writeFileSync(path, data);
  }
} catch(err) {
  console.error(err)
}
const server = http.createServer(function (request, response) {
    var filePath = 'public_html/' + request.url;
    if (filePath == 'public_html//') {
        filePath = 'public_html/index.html';
    }

    var extname = path1.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

config.load(['config.json']);
server.listen(config.BIND_PORT, config.BIND_ADDR);
console.log('Web Server ready!');
