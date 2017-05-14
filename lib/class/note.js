
export class Note {
    constructor (data) {

        this.gate = data.gate || 127;
        this.value = data.value || 'C2';
        this.velocity = data.velocity || 127;

    }
}