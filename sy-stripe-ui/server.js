const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Handle favicon.ico requests
    if (req.url === '/favicon.ico') {
        res.writeHead(204, { 'Content-Type': 'image/x-icon' });
        res.end();
        return;
    }

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    // Für SPA-Routen ohne Dateierweiterung, lade index.html
    if (!path.extname(filePath) && filePath !== './index.html') {
        fs.readFile('./index.html', (error, content) => {
            if (error) {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf-8');
            }
        });
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Datei nicht gefunden, lade index.html für SPA-Routing
                fs.readFile('./index.html', (error, content) => {
                    if (error) {
                        res.writeHead(500);
                        res.end(`Server Error: ${error.code}`);
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`🚀 Server läuft auf http://localhost:${port}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`⏹️  Zum Beenden: Ctrl+C`);
});
