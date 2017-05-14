
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
        Object.keys(this.controls).forEach((key) => {
            this.controls[key].activate();
        });
    }

    deactivate() {
        this.active = false;
        Object.keys(this.controls).forEach((key) => {
            this.controls[key].deactivate();
        });
    }

}