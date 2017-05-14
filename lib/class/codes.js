export let Channels = {};
export let Codes = {
    248: {command: 'clock'},
    250: {command: 'start'},
    251: {command: 'continue'},
    252: {command: 'stop'},
    254: {command: 'active-sensing'},
    255: {command: 'sys-reset'}
};
export let Commands = [
    'note-off',
    'note-on',
    'poly-aftertouch',
    'control-change',
    'program-change',
    'channel-aftertouch',
    'pitchwheel'
];

export let Hex = {
    NOTE_OFF: 0x80,
    NOTE_ON: 0x90,
    NOTE_AFTERTOUCH: 0xA0,
    CONTROLLER: 0xB0,
    PROGRAM_CHANGE: 0xC0,
    CHANNEL_AFTERTOUCH: 0xD0,
    PITCH_BEND: 0xE0,
};

let start = 128;

Commands.forEach((command, i) => {
    for (let channel = 1; channel <= 16; channel++) {
        let code = start + (16 * i) + (channel - 1);
        Codes[code] = {command: command, channel: channel};
        Channels[channel] = Channels[channel] || {};
        Channels[channel][command] = code;
    }
});