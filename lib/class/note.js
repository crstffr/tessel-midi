import tonal from 'tonal';


export class Note {
    constructor (midi) {
        this.midi = midi;
        this.value = tonal.note.fromMidi(midi);
    }
}