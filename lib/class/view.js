
export class View {

    constructor () {

        this.state = 'ready';
        this.active = false;

        this.controls = {
            top: {},
            grid: {},
            right: {}
        };

    }

    activate() {
        this.active = true;
        Object.values(this.controls).forEach((control) => {
            control.activate();
        });
    }

    deactivate() {
        this.active = false;
        Object.values(this.controls).forEach((control) => {
            control.deactivate();
        });
    }

}