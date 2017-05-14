
import {Codes} from './codes';

export class Utils {

    static getPagePadIndex(index) {
        return {
            page: Math.floor(index / 64),
            pad: index % 64
        }
    }

    static getStepIndex(pad, page) {
        page = (typeof page === 'number') ? page : 0;
        return (page * 63) + pad + page;
    }

    static sleep(milliseconds) {
        return new Promise(resolve => setTimeout(() => resolve(), milliseconds));
    }

    static sequentialAsync(asyncOperations) {
        const asyncOp = asyncOperations.shift();
        return asyncOp ? asyncOp().then(() => Utils.sequentialAsync(asyncOperations)) : Promise.resolve();
    }

    static parseMidiMessage(msg) {
        let obj = Object.assign({}, Codes[msg[0]]);
        switch(obj.command) {
            case 'note-on':
                obj.note = msg[1];
                obj.velocity = msg[2];
                break;
            case 'note-off':
                obj.note = msg[1];
                break;
            case 'poly-aftertouch':
                obj.note = msg[1];
                obj.pressure = msg[2];
                break;
            case 'channel-aftertouch':
                obj.pressure = msg[1];
                break;
            case 'control-change':
                obj.code1 = msg[1];
                obj.code2 = msg[2];
                break;
            case 'program-change':
                obj.program = msg[1];
                break;
            case 'pitchwheel':
                obj.lsb = msg[1];
                obj.msb = msg[2];
                break;
        }
        return obj;
    }

}



