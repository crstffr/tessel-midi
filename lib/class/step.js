
export class Step {

    constructor (data) {

        data = data || {};

        this.note = data.note || '';
        this.code = data.code || '';
        this.velocity = data.velocity || '';

    }

}