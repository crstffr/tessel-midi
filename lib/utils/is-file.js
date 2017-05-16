import fs from 'fs';

export function isFile(path) {
    if (!fs.existsSync(path)) { return false; }
    return fs.statSync(path).isFile();
}