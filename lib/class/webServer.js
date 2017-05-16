import fs from 'fs';
import ip from 'ip';
import path from 'path';
import http from 'http';
import root from 'app-root-path';
import {text} from '../utils/text';
import {isFile} from '../utils/is-file';

class WebServerClass {

    constructor (eventServerPath) {
        this.port = 9200;
        this.ip = ip.address();
        this.path = `http://${this.ip}:${this.port}`;
    }

    start(eventServerPath) {

        this.wws = http.createServer((req, res) => {
            let www = root + '/public/';
            if (req.method === 'GET') {
                if (req.url === '/') {
                    res.writeHead(200, {'content-type': 'text/html'});
                    res.end(text(www + 'index.html', [this.ip, eventServerPath]));
                } else {
                    let file = path.join(www, req.url);
                    if (isFile(file)) {
                        res.writeHead(200);
                        res.end(text(file));
                    } else {
                        res.writeHead(404);
                        res.end();
                    }
                }
            }
        }).listen(this.port);

        console.log(`WebServer now running at ${this.path}`);

    }
}

export let WebServer = new WebServerClass();
