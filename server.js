//
// Voxel Builder Server


const http = require('http');
const url = require('url');
const fs = require('fs');


const PORT = 8011;


let filePath = undefined;
const mimeTypes = {
    'html': 'text/html',
    'js': 'text/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpg',
    'svg': 'image/svg+xml',
    'ttf': 'font/ttf',
    'woff2': 'font/woff2'
};


http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    filePath = `${parsedUrl.pathname}`;

    if (parsedUrl.pathname == '/') {
        filePath = 'src/index.html';
    } else if (parsedUrl.pathname.startsWith('/user')) {
        filePath = `.${parsedUrl.pathname}`;
    } else {
        filePath = `src${parsedUrl.pathname}`;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(`GET 404 -- ${parsedUrl.pathname} -> ${filePath}`)
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }

        console.log(`GET 200 OK ${parsedUrl.pathname} -> ${filePath}`)
        res.writeHead(200, { 'Content-Type': getContentType(filePath) });
        res.write(data);
        return res.end();
    });
    
}).listen(PORT, () => {
    console.log('Voxel Builder')
    console.log(`Server running at http://localhost:${PORT}`);
});


function getContentType(filePath) {
    const extname = String(filePath).split('.').pop().toLowerCase();
    return mimeTypes[extname] || 'application/octet-stream';
}
