
export class Step {

    constructor (data) {
        data = data || {};
        this.length = 7;
        this.velocity = 7;
        this.notes = data.notes || {};
    }

}