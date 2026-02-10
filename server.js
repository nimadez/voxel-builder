#!/usr/bin/env node

// Aug 2024
// Voxel Builder Server


const http = require('http');
const url = require('url');
const fs = require('fs');


const PORT = 8011;


http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let filePath = `src${parsedUrl.pathname}`;

    if (parsedUrl.pathname == '/')
        filePath = 'src/index.html';

    if (parsedUrl.pathname.endsWith('js.map'))
        return res.end();

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(`GET ${filePath} 404 NOT FOUND`)
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }

        console.log(`GET ${filePath} 200 OK`)
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
    const mimeTypes = {
        'txt': 'text/plain',
        'html': 'text/html',
        'xml': 'application/xml',
        'js': 'text/javascript',
        'py': 'text/x-python',
        'css': 'text/css',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpg',
        'jpeg': 'image/jpeg',
        'svg': 'image/svg+xml',
        'gif': 'image/gif',
        'ico': 'image/x-icon',
        'ttf': 'font/ttf',
        'woff': 'font/woff',
        'woff2': 'font/woff2'
    };
    return mimeTypes[extname] || 'application/octet-stream';
}
