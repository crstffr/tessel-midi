
import LaunchpadMini from 'launchpad-mini';

export let Launchpad = new LaunchpadMini();

Launchpad.setMaxListeners(1000);

Launchpad.isTcontrolPad = (k) => {
    return k[1] === 8;
};

Launchpad.isRcontrolPad = (k) => {
    return k[0] === 8;
};

Launchpad.isGridPad = (k) => {
    return k[0] < 8 && k[1] < 8;
};
