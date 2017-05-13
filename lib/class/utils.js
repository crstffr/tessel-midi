
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

}



