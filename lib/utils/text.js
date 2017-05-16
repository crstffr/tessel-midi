import fs from 'fs';
import {strf} from './strf';
import {isFile} from './is-file';

export function text(file, args) {
    if (!isFile(file)) { return ''; }
    return strf(fs.readFileSync(file).toString(), args);
}